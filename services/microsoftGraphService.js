// services/microsoftGraphService.js
const msal = require('@azure/msal-node');
const graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

// Helper: get the first defined env var from a list of keys
const first = (...keys) => keys.map(k => process.env[k]).find(Boolean);

// Resolve env with fallbacks so local ".env" using MS_* still works
function resolveMicrosoftEnv() {
  const env = {
    clientId:     first('MICROSOFT_CLIENT_ID', 'MS_CLIENT_ID'),
    clientSecret: first('MICROSOFT_CLIENT_SECRET', 'MS_CLIENT_SECRET'),
    redirectUri:  first('MICROSOFT_REDIRECT_URI', 'MS_REDIRECT_URI'),
    tenantId:     first('MICROSOFT_TENANT_ID', 'MS_TENANT_ID') || 'common',
    // Optional: allow PUBLIC_BASE_URL as a final fallback for redirect
    publicBaseUrl: process.env.PUBLIC_BASE_URL
  };

  // If redirectUri is still missing but PUBLIC_BASE_URL exists, derive a sensible default
  if (!env.redirectUri && env.publicBaseUrl) {
    env.redirectUri = `${env.publicBaseUrl.replace(/\/+$/, '')}/auth/microsoft/callback`;
  }

  return env;
}

class MicrosoftGraphService {
  constructor() {
    this.env = resolveMicrosoftEnv();
    this.validateConfig(); // throws with helpful details if not set

    this.msalConfig = {
      auth: {
        clientId: this.env.clientId,
        clientSecret: this.env.clientSecret,
        authority: `https://login.microsoftonline.com/${this.env.tenantId}`
        // Note: redirectUri is supplied per-request for auth code URLs / token calls
      },
      system: {
        loggerOptions: {
          loggerCallback(loglevel, message /*, containsPii */) {
            if (process.env.NODE_ENV === 'development') {
              console.log('[MSAL]', message);
            }
          },
          piiLoggingEnabled: false,
          logLevel: msal.LogLevel.Info,
        }
      }
    };

    this.msalClient = new msal.ConfidentialClientApplication(this.msalConfig);

    // Scopes you’re using already (kept the same)
    this.scopes = [
      'User.Read',
      'Mail.Read',
      'Mail.ReadWrite',
      'Mail.Send',
      'offline_access'
    ];

    console.log('✅ Microsoft Graph Service initialised');
    console.log('🔐 Tenant:', this.env.tenantId);
    console.log('📧 Redirect URI:', this.env.redirectUri || '(missing)');
  }

  /**
   * Validate required environment variables
   */
  validateConfig() {
    const missing = [];
    if (!this.env.clientId)     missing.push('MICROSOFT_CLIENT_ID / MS_CLIENT_ID');
    if (!this.env.clientSecret) missing.push('MICROSOFT_CLIENT_SECRET / MS_CLIENT_SECRET');
    if (!this.env.redirectUri)  missing.push('MICROSOFT_REDIRECT_URI / MS_REDIRECT_URI (or PUBLIC_BASE_URL)');

    if (missing.length > 0) {
      // Helpful console to show which variants are present
      console.error('❌ Missing Microsoft envs:', {
        MICROSOFT_CLIENT_ID: !!process.env.MICROSOFT_CLIENT_ID,
        MS_CLIENT_ID:        !!process.env.MS_CLIENT_ID,
        MICROSOFT_CLIENT_SECRET: !!process.env.MICROSOFT_CLIENT_SECRET,
        MS_CLIENT_SECRET:        !!process.env.MS_CLIENT_SECRET,
        MICROSOFT_REDIRECT_URI:  !!process.env.MICROSOFT_REDIRECT_URI,
        MS_REDIRECT_URI:         !!process.env.MS_REDIRECT_URI,
        PUBLIC_BASE_URL:         !!process.env.PUBLIC_BASE_URL
      });
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  /**
   * Get Graph API client
   */
  getGraphClient(accessToken) {
    return graph.Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });
  }

  /**
   * Check if Microsoft OAuth is configured
   */
  isConfigured() {
    try {
      this.validateConfig();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get authorisation URL
   */
  async getAuthUrl(state = null) {
    const authCodeUrlParameters = {
      scopes: this.scopes,
      redirectUri: this.env.redirectUri,
      state
    };

    return await this.msalClient.getAuthCodeUrl(authCodeUrlParameters);
  }

  /**
   * Acquire token by authorisation code
   */
  async acquireTokenByCode(code) {
    const tokenRequest = {
      code,
      scopes: this.scopes,
      redirectUri: this.env.redirectUri
    };

    return await this.msalClient.acquireTokenByCode(tokenRequest);
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    const refreshTokenRequest = {
      refreshToken,
      scopes: this.scopes
    };

    return await this.msalClient.acquireTokenByRefreshToken(refreshTokenRequest);
  }

  /**
   * Fetch emails from Microsoft 365
   */
  async fetchEmails(accessToken, limit = 50) {
    try {
      const client = this.getGraphClient(accessToken);

      const messages = await client
        .api('/me/mailFolders/inbox/messages')
        .top(limit)
        .select('id,subject,from,toRecipients,receivedDateTime,bodyPreview,body,isRead,internetMessageId,conversationId')
        .orderby('receivedDateTime DESC')
        .expand('singleValueExtendedProperties($filter=id eq \'String 0x1000\')')
        .header('Prefer', 'outlook.body-content-type="text"')
        .get();

      console.log(`📬 Fetched ${messages.value.length} emails from Graph API`);

      // Deduplicate by internetMessageId (RFC 822 message ID)
      const seen = new Set();
      const uniqueEmails = [];

      for (const msg of messages.value) {
        const uniqueId = msg.internetMessageId || msg.id;
        if (seen.has(uniqueId)) {
          console.log(`⚠️  Skipping duplicate email: ${msg.subject} (ID: ${uniqueId})`);
          continue;
        }
        seen.add(uniqueId);

        uniqueEmails.push({
          id: msg.id,
          messageId: msg.internetMessageId || msg.id,
          conversationId: msg.conversationId,
          from: msg.from?.emailAddress?.address || '',
          fromName: msg.from?.emailAddress?.name || '',
          to: msg.toRecipients?.map(r => r.emailAddress?.address).join(', ') || '',
          subject: msg.subject || '(No Subject)',
          date: new Date(msg.receivedDateTime),
          bodyPreview: msg.bodyPreview || '',
          text: msg.body?.content || '',
          html: msg.body?.content || '',
          isRead: msg.isRead
        });
      }

      console.log(`✅ After deduplication: ${uniqueEmails.length} unique emails`);

      return uniqueEmails;
    } catch (error) {
      console.error('❌ Failed to fetch emails:', error);
      throw new Error('Failed to fetch emails from Microsoft: ' + error.message);
    }
  }

  /**
   * Fetch emails with pagination support (for infinite scroll)
   */
  async fetchEmailsWithPagination(accessToken, limit = 50, skipToken = null) {
    try {
      const client = this.getGraphClient(accessToken);

      let request = client
        .api('/me/mailFolders/inbox/messages')
        .top(limit)
        .select('id,subject,from,toRecipients,receivedDateTime,bodyPreview,body,isRead,internetMessageId,conversationId')
        .orderby('receivedDateTime DESC')
        .expand('singleValueExtendedProperties($filter=id eq \'String 0x1000\')')
        .header('Prefer', 'outlook.body-content-type="text"');

      if (skipToken) {
        const baseUrl = '/me/mailFolders/inbox/messages';
        const params = new URLSearchParams({
          '$top': String(limit),
          '$select': 'id,subject,from,toRecipients,receivedDateTime,bodyPreview,body,isRead,internetMessageId,conversationId',
          '$orderby': 'receivedDateTime DESC',
          '$expand': 'singleValueExtendedProperties($filter=id eq \'String 0x1000\')',
          '$skiptoken': skipToken
        });
        request = client
          .api(`${baseUrl}?${params.toString()}`)
          .header('Prefer', 'outlook.body-content-type="text"');
      }

      const response = await request.get();
      console.log(`📬 Fetched ${response.value.length} emails from Graph API (with pagination)`);

      let nextSkipToken = null;
      if (response['@odata.nextLink']) {
        const nextUrl = new URL(response['@odata.nextLink']);
        nextSkipToken = nextUrl.searchParams.get('$skiptoken');
        console.log('📦 More emails available - skipToken provided for next batch');
      } else {
        console.log('✅ All emails fetched - no more pages');
      }

      const seen = new Set();
      const uniqueEmails = [];

      for (const msg of response.value) {
        const uniqueId = msg.internetMessageId || msg.id;
        if (seen.has(uniqueId)) {
          console.log(`⚠️  Skipping duplicate email: ${msg.subject} (ID: ${uniqueId})`);
          continue;
        }
        seen.add(uniqueId);

        uniqueEmails.push({
          id: msg.id,
          messageId: msg.internetMessageId || msg.id,
          conversationId: msg.conversationId,
          from: msg.from?.emailAddress?.address || '',
          fromName: msg.from?.emailAddress?.name || '',
          to: msg.toRecipients?.map(r => r.emailAddress?.address).join(', ') || '',
          subject: msg.subject || '(No Subject)',
          date: new Date(msg.receivedDateTime),
          bodyPreview: msg.bodyPreview || '',
          text: msg.body?.content || '',
          html: msg.body?.content || '',
          isRead: msg.isRead
        });
      }

      console.log(`✅ After deduplication: ${uniqueEmails.length} unique emails`);

      return { emails: uniqueEmails, skipToken: nextSkipToken };
    } catch (error) {
      console.error('❌ Failed to fetch emails with pagination:', error);
      throw new Error('Failed to fetch emails from Microsoft: ' + error.message);
    }
  }

  /**
   * Send a NEW email with optional inline attachments
   */
  async sendEmail(accessToken, emailData) {
    try {
      const client = this.getGraphClient(accessToken);

      const html = (emailData.html || '').trim();
      if (!emailData.to || !emailData.subject || !html) {
        throw new Error('Missing to/subject/body');
      }

      const message = {
        subject: emailData.subject,
        body: { contentType: 'HTML', content: html },
        toRecipients: [{ emailAddress: { address: emailData.to } }]
      };

      if (emailData.attachments && emailData.attachments.length > 0) {
        message.attachments = emailData.attachments.map(att => ({
          '@odata.type': '#microsoft.graph.fileAttachment',
          name: att.contentId || 'image.png',
          contentType: att.contentType || 'image/png',
          contentBytes: att.contentBytes,
          contentId: att.contentId,
          isInline: att.isInline || true
        }));
      }

      const sendMail = { message, saveToSentItems: true };
      await client.api('/me/sendMail').post(sendMail);

      console.log('✅ Email sent successfully');
      return { success: true, messageId: 'sent-' + Date.now() };
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw new Error('Failed to send email via Microsoft: ' + error.message);
    }
  }

  /**
   * Proper threaded REPLY using Graph reply flow with inline attachments
   */
  async replyToMessage(accessToken, { messageId, bodyHtml, attachments }) {
    if (!messageId) throw new Error('replyToMessage: messageId is required');
    if (!bodyHtml || !bodyHtml.trim()) throw new Error('replyToMessage: bodyHtml is required');

    const client = this.getGraphClient(accessToken);

    try {
      const draft = await client
        .api(`/me/messages/${encodeURIComponent(messageId)}/createReply`)
        .post({});

      const draftId = draft?.id;
      if (!draftId) throw new Error('createReply did not return a draft id');

      console.log(`📝 Created draft reply: ${draftId}`);

      await client
        .api(`/me/messages/${encodeURIComponent(draftId)}`)
        .patch({ body: { contentType: 'HTML', content: bodyHtml } });

      console.log('✏️  Updated draft body');

      if (attachments && attachments.length > 0) {
        console.log(`📎 Adding ${attachments.length} inline attachments`);
        for (const att of attachments) {
          await client
            .api(`/me/messages/${encodeURIComponent(draftId)}/attachments`)
            .post({
              '@odata.type': '#microsoft.graph.fileAttachment',
              name: att.contentId || 'image.png',
              contentType: att.contentType || 'image/png',
              contentBytes: att.contentBytes,
              contentId: att.contentId,
              isInline: att.isInline || true
            });
        }
        console.log('✅ Inline attachments added');
      }

      await client.api(`/me/messages/${encodeURIComponent(draftId)}/send`).post({});
      console.log('✅ Reply sent successfully');

      return { success: true, messageId: draftId };
    } catch (error) {
      console.error('❌ Failed to reply to message:', error);
      throw new Error('Failed to send reply: ' + error.message);
    }
  }

  /**
   * Fetch SENT emails from Microsoft 365 Sent Items folder
   */
  async fetchSentEmails(accessToken, limit = 50) {
    try {
      const client = this.getGraphClient(accessToken);

      const messages = await client
        .api('/me/mailFolders/sentitems/messages')
        .top(limit)
        .select('id,subject,from,toRecipients,sentDateTime,bodyPreview,body,internetMessageId,conversationId')
        .orderby('sentDateTime DESC')
        .header('Prefer', 'outlook.body-content-type="text"')
        .get();

      console.log(`📤 Fetched ${messages.value.length} sent emails from Graph API`);

      const seen = new Set();
      const uniqueEmails = [];

      for (const msg of messages.value) {
        const uniqueId = msg.internetMessageId || msg.id;
        if (seen.has(uniqueId)) {
          console.log(`⚠️  Skipping duplicate sent email: ${msg.subject}`);
          continue;
        }
        seen.add(uniqueId);

        uniqueEmails.push({
          id: msg.id,
          messageId: msg.internetMessageId || msg.id,
          conversationId: msg.conversationId,
          from: msg.from?.emailAddress?.address || '',
          fromName: msg.from?.emailAddress?.name || '',
          to: msg.toRecipients?.map(r => r.emailAddress?.address).join(', ') || '',
          recipient: msg.toRecipients?.[0]?.emailAddress?.address || '',
          subject: msg.subject || '(No Subject)',
          date: new Date(msg.sentDateTime),
          sent_at: new Date(msg.sentDateTime),
          bodyPreview: msg.bodyPreview || '',
          body_text: msg.body?.content || '',
          body_html: msg.body?.content || '',
          text: msg.body?.content || '',
          html: msg.body?.content || ''
        });
      }

      console.log(`✅ After deduplication: ${uniqueEmails.length} unique emails`);

      return uniqueEmails;
    } catch (error) {
      console.error('❌ Failed to fetch sent emails:', error);
      throw new Error('Failed to fetch sent emails from Microsoft: ' + error.message);
    }
  }

  /**
   * Fetch DRAFTS from Microsoft 365 Drafts folder
   */
  async fetchDrafts(accessToken, limit = 50) {
    try {
      const client = this.getGraphClient(accessToken);

      const messages = await client
        .api('/me/mailFolders/drafts/messages')
        .top(limit)
        .select('id,subject,from,toRecipients,createdDateTime,bodyPreview,body,internetMessageId,conversationId')
        .orderby('createdDateTime DESC')
        .header('Prefer', 'outlook.body-content-type="text"')
        .get();

      console.log(`📝 Fetched ${messages.value.length} drafts from Graph API`);

      const drafts = messages.value.map(msg => ({
        id: msg.id,
        messageId: msg.internetMessageId || msg.id,
        conversationId: msg.conversationId,
        from: msg.from?.emailAddress?.address || '',
        fromName: msg.from?.emailAddress?.name || '',
        to: msg.toRecipients?.map(r => r.emailAddress?.address).join(', ') || '',
        recipient: msg.toRecipients?.[0]?.emailAddress?.address || '',
        subject: msg.subject || '(No Subject)',
        date: new Date(msg.createdDateTime),
        created_at: new Date(msg.createdDateTime),
        bodyPreview: msg.bodyPreview || '',
        text: msg.body?.content || '',
        html: msg.body?.content || '',
        body_text: msg.body?.content || '',
        body_html: msg.body?.content || ''
      }));

      console.log(`✅ Fetched ${drafts.length} drafts`);

      return drafts;
    } catch (error) {
      console.error('❌ Failed to fetch drafts:', error);
      throw new Error('Failed to fetch drafts from Microsoft: ' + error.message);
    }
  }

  /**
   * Save email as draft in Outlook
   */
  async saveDraft(accessToken, emailData) {
    try {
      const client = this.getGraphClient(accessToken);

      const message = {
        subject: emailData.subject || '(No Subject)',
        body: { contentType: 'HTML', content: emailData.body || '' },
        toRecipients: emailData.to ? [{ emailAddress: { address: emailData.to } }] : []
      };

      const draft = await client.api('/me/messages').post(message);

      console.log('✅ Draft saved successfully');
      return { success: true, draftId: draft.id };
    } catch (error) {
      console.error('❌ Error saving draft:', error);
      throw new Error('Failed to save draft: ' + error.message);
    }
  }

  /**
   * Get user's profile information
   */
  async getUserProfile(accessToken) {
    try {
      const client = this.getGraphClient(accessToken);

      const user = await client
        .api('/me')
        .select('displayName,mail,userPrincipalName')
        .get();

      console.log('👤 Retrieved user profile:', user.mail || user.userPrincipalName);

      return {
        displayName: user.displayName,
        email: user.mail || user.userPrincipalName
      };
    } catch (error) {
      console.error('❌ Failed to get user profile:', error);
      throw new Error('Failed to get user profile: ' + error.message);
    }
  }
}

// Initialisation with graceful fallback if misconfigured
let service;
try {
  service = new MicrosoftGraphService();
} catch (error) {
  console.error('❌ Microsoft Graph Service initialisation failed:', error.message);
  console.error('⚠️  Smart Reply features will be disabled until configuration is added');

  service = {
    isConfigured: () => false,
    getAuthUrl: async () => { throw new Error('Microsoft OAuth is not configured. Please add MICROSOFT_CLIENT_ID (or MS_CLIENT_ID), MICROSOFT_CLIENT_SECRET (or MS_CLIENT_SECRET), and MICROSOFT_REDIRECT_URI (or MS_REDIRECT_URI) to your environment'); },
    acquireTokenByCode: async () => { throw new Error('Microsoft OAuth is not configured'); },
    refreshToken: async () => { throw new Error('Microsoft OAuth is not configured'); },
    fetchEmails: async () => { throw new Error('Microsoft OAuth is not configured'); },
    fetchEmailsWithPagination: async () => { throw new Error('Microsoft OAuth is not configured'); },
    sendEmail: async () => { throw new Error('Microsoft OAuth is not configured'); },
    replyToMessage: async () => { throw new Error('Microsoft OAuth is not configured'); },
    fetchSentEmails: async () => { throw new Error('Microsoft OAuth is not configured'); },
    fetchDrafts: async () => { throw new Error('Microsoft OAuth is not configured'); },
    saveDraft: async () => { throw new Error('Microsoft OAuth is not configured'); },
    getUserProfile: async () => { throw new Error('Microsoft OAuth is not configured'); }
  };
}

module.exports = service;
