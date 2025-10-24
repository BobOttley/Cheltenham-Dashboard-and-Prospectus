// services/microsoftGraphService.js
const msal = require('@azure/msal-node');
const graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

class MicrosoftGraphService {
  constructor() {
    // Validate required environment variables
    this.validateConfig();

    this.msalConfig = {
      auth: {
        clientId: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID || 'common'}`
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
    this.scopes = [
      'User.Read',
      'Mail.Read',
      'Mail.ReadWrite',
      'Mail.Send',
      'offline_access'
    ];

    console.log('✅ Microsoft Graph Service initialized');
    console.log('📧 Redirect URI:', process.env.MICROSOFT_REDIRECT_URI);
  }

  /**
   * Validate required environment variables
   */
  validateConfig() {
    const required = [
      'MICROSOFT_CLIENT_ID',
      'MICROSOFT_CLIENT_SECRET',
      'MICROSOFT_REDIRECT_URI'
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
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
   * Get authorization URL
   */
  async getAuthUrl(state = null) {
    const authCodeUrlParameters = {
      scopes: this.scopes,
      redirectUri: process.env.MICROSOFT_REDIRECT_URI,
      state: state
    };

    return await this.msalClient.getAuthCodeUrl(authCodeUrlParameters);
  }

  /**
   * Acquire token by authorization code
   */
  async acquireTokenByCode(code) {
    const tokenRequest = {
      code: code,
      scopes: this.scopes,
      redirectUri: process.env.MICROSOFT_REDIRECT_URI
    };

    return await this.msalClient.acquireTokenByCode(tokenRequest);
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    const refreshTokenRequest = {
      refreshToken: refreshToken,
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
        // Use internetMessageId as the unique identifier
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

      // Build the request
      let request = client
        .api('/me/mailFolders/inbox/messages')
        .top(limit)
        .select('id,subject,from,toRecipients,receivedDateTime,bodyPreview,body,isRead,internetMessageId,conversationId')
        .orderby('receivedDateTime DESC')
        .expand('singleValueExtendedProperties($filter=id eq \'String 0x1000\')')
        .header('Prefer', 'outlook.body-content-type="text"');

      // Add skipToken if provided (for pagination)
      if (skipToken) {
        // Microsoft Graph uses $skiptoken in the URL
        // We need to manually construct the URL with the skiptoken
        const baseUrl = '/me/mailFolders/inbox/messages';
        const params = new URLSearchParams({
          '$top': limit.toString(),
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

      // Extract the next skipToken from @odata.nextLink if available
      let nextSkipToken = null;
      if (response['@odata.nextLink']) {
        const nextUrl = new URL(response['@odata.nextLink']);
        nextSkipToken = nextUrl.searchParams.get('$skiptoken');
        console.log('📦 More emails available - skipToken provided for next batch');
      } else {
        console.log('✅ All emails fetched - no more pages');
      }

      // Deduplicate by internetMessageId (RFC 822 message ID)
      const seen = new Set();
      const uniqueEmails = [];

      for (const msg of response.value) {
        // Use internetMessageId as the unique identifier
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

      return {
        emails: uniqueEmails,
        skipToken: nextSkipToken
      };
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
        body: {
          contentType: 'HTML',
          content: html
        },
        toRecipients: [
          { emailAddress: { address: emailData.to } }
        ]
      };

      // Add inline attachments if provided
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

      const sendMail = {
        message: message,
        saveToSentItems: true
      };

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
      // 1) Create a reply draft
      const draft = await client
        .api(`/me/messages/${encodeURIComponent(messageId)}/createReply`)
        .post({});

      const draftId = draft?.id;
      if (!draftId) throw new Error('createReply did not return a draft id');

      console.log(`📝 Created draft reply: ${draftId}`);

      // 2) Replace the draft body with our composed HTML
      await client
        .api(`/me/messages/${encodeURIComponent(draftId)}`)
        .patch({
          body: { contentType: 'HTML', content: bodyHtml }
        });

      console.log(`✏️  Updated draft body`);

      // 3) Add inline attachments if provided
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
        
        console.log(`✅ Inline attachments added`);
      }

      // 4) Send the draft
      await client
        .api(`/me/messages/${encodeURIComponent(draftId)}/send`)
        .post({});

      console.log(`✅ Reply sent successfully`);

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

      // Deduplicate by internetMessageId
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

      console.log(`✅ After deduplication: ${uniqueEmails.length} unique sent emails`);

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
            body: {
                contentType: 'HTML',
                content: emailData.body || ''
            },
            toRecipients: emailData.to ? [
                { emailAddress: { address: emailData.to } }
            ] : []
        };

        const draft = await client
            .api('/me/messages')
            .post(message);

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

// Initialize service
let service;
try {
  service = new MicrosoftGraphService();
} catch (error) {
  console.error('❌ Microsoft Graph Service initialization failed:', error.message);
  console.error('⚠️  Smart Reply features will be disabled until configuration is added');

  // Fallback service that returns helpful errors (prevents crashes if misconfigured)
  service = {
    isConfigured: () => false,
    getAuthUrl: async () => {
      throw new Error('Microsoft OAuth is not configured. Please add MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET, and MICROSOFT_REDIRECT_URI to your .env file');
    },
    acquireTokenByCode: async () => {
      throw new Error('Microsoft OAuth is not configured');
    },
    refreshToken: async () => {
      throw new Error('Microsoft OAuth is not configured');
    },
    fetchEmails: async () => {
      throw new Error('Microsoft OAuth is not configured');
    },
    sendEmail: async () => {
      throw new Error('Microsoft OAuth is not configured');
    },
    replyToMessage: async () => {
      throw new Error('Microsoft OAuth is not configured');
    },
    getUserProfile: async () => {
      throw new Error('Microsoft OAuth is not configured');
    }
  };
}

module.exports = service;