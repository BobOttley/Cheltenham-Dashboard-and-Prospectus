const Imap = require('imap');
const { simpleParser } = require('mailparser');
const nodemailer = require('nodemailer');
const { ConfidentialClientApplication } = require('@azure/msal-node');

class EmailService {
  constructor() {
    this.connections = new Map();
    this.tokenCache = new Map(); // Cache tokens per user
  }

  /**
   * Get OAuth access token for Microsoft 365
   */
  async getAccessToken(emailCredentials) {
    const cacheKey = emailCredentials.email;
    
    // Check cache first
    const cached = this.tokenCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.token;
    }

    // Create MSAL config
    const msalConfig = {
      auth: {
        clientId: emailCredentials.clientId || process.env.AZURE_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${emailCredentials.tenantId || process.env.AZURE_TENANT_ID}`,
        clientSecret: emailCredentials.clientSecret || process.env.AZURE_CLIENT_SECRET
      }
    };

    const cca = new ConfidentialClientApplication(msalConfig);

    try {
      // Use client credentials flow (for app-only access)
      // OR use username/password flow if you have user credentials
      
      // Option 1: Client Credentials (app-only)
      const tokenRequest = {
        scopes: ['https://outlook.office365.com/.default']
      };
      
      const response = await cca.acquireTokenByClientCredential(tokenRequest);
      
      // Cache the token
      this.tokenCache.set(cacheKey, {
        token: response.accessToken,
        expiresAt: Date.now() + (response.expiresIn * 1000) - 60000 // Refresh 1 min early
      });

      return response.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw new Error('Failed to authenticate with Microsoft 365');
    }
  }

  /**
   * Create IMAP configuration with OAuth for Microsoft 365
   */
  async createImapConfig(emailCredentials) {
    // For Microsoft 365 with OAuth
    if (emailCredentials.useOAuth) {
      const accessToken = await this.getAccessToken(emailCredentials);
      
      return {
        user: emailCredentials.email,
        xoauth2: accessToken,
        host: emailCredentials.imapHost || 'outlook.office365.com',
        port: emailCredentials.imapPort || 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 10000
      };
    }
    
    // Fallback to basic auth (for non-Microsoft accounts)
    return {
      user: emailCredentials.email,
      password: emailCredentials.password,
      host: emailCredentials.imapHost || 'imap.gmail.com',
      port: emailCredentials.imapPort || 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 10000
    };
  }

  /**
   * Create SMTP transporter with OAuth support
   */
  async createSmtpTransporter(emailCredentials) {
    // For Microsoft 365 with OAuth
    if (emailCredentials.useOAuth) {
      const accessToken = await this.getAccessToken(emailCredentials);
      
      return nodemailer.createTransport({
        host: emailCredentials.smtpHost || 'smtp.office365.com',
        port: emailCredentials.smtpPort || 587,
        secure: false,
        auth: {
          type: 'OAuth2',
          user: emailCredentials.email,
          accessToken: accessToken
        }
      });
    }
    
    // Fallback to basic auth
    return nodemailer.createTransport({
      host: emailCredentials.smtpHost || 'smtp.gmail.com',
      port: emailCredentials.smtpPort || 587,
      secure: false,
      auth: {
        user: emailCredentials.email,
        pass: emailCredentials.password
      }
    });
  }

  /**
   * Fetch last N emails from inbox
   */
  async fetchEmails(emailCredentials, limit = 50) {
    return new Promise(async (resolve, reject) => {
      try {
        const imapConfig = await this.createImapConfig(emailCredentials);
        const imap = new Imap(imapConfig);
        const emails = [];
        const emailIds = new Set(); // Track unique emails by messageId

        imap.once('ready', () => {
          imap.openBox('INBOX', true, (err, box) => {
            if (err) {
              imap.end();
              return reject(err);
            }

            const totalMessages = box.messages.total;
            if (totalMessages === 0) {
              imap.end();
              return resolve([]);
            }

            const start = Math.max(1, totalMessages - limit + 1);
            const end = totalMessages;

            const fetch = imap.seq.fetch(`${start}:${end}`, {
              bodies: '',
              struct: true
            });

            fetch.on('message', (msg, seqno) => {
              let buffer = '';

              msg.on('body', (stream, info) => {
                stream.on('data', (chunk) => {
                  buffer += chunk.toString('utf8');
                });
              });

              msg.once('end', async () => {
                try {
                  const parsed = await simpleParser(buffer);
                  
                  // Skip duplicate emails using messageId as unique identifier
                  if (emailIds.has(parsed.messageId)) {
                    return; // Skip this duplicate
                  }
                  
                  emailIds.add(parsed.messageId);
                  
                  emails.push({
                    id: parsed.messageId,
                    from: parsed.from?.text || '',
                    to: parsed.to?.text || '',
                    subject: parsed.subject || '',
                    date: parsed.date || new Date(),
                    text: parsed.text || '',
                    html: parsed.html || '',
                    inReplyTo: parsed.inReplyTo || null,
                    references: parsed.references || []
                  });
                } catch (parseErr) {
                  console.error('Error parsing email:', parseErr);
                }
              });
            });

            fetch.once('error', (err) => {
              imap.end();
              reject(err);
            });

            fetch.once('end', () => {
              imap.end();
            });
          });
        });

        imap.once('error', (err) => {
          reject(err);
        });

        imap.once('end', () => {
          // Sort by date descending and return only the limit
          emails.sort((a, b) => b.date - a.date);
          resolve(emails.slice(0, limit));
        });

        imap.connect();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Send an email reply
   */
  async sendEmail(emailCredentials, emailData) {
    try {
      const transporter = await this.createSmtpTransporter(emailCredentials);

      const mailOptions = {
        from: `"${emailData.fromName || emailCredentials.fromName || ''}" <${emailCredentials.email}>`,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html,
        inReplyTo: emailData.inReplyTo || null,
        references: emailData.references || []
      };

      const info = await transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: info.messageId,
        response: info.response
      };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Test email connection
   */
  async testConnection(emailCredentials) {
    try {
      // Test IMAP
      await this.fetchEmails(emailCredentials, 1);
      
      // Test SMTP
      const transporter = await this.createSmtpTransporter(emailCredentials);
      await transporter.verify();

      return { success: true, message: 'Email connection successful' };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Connection failed' 
      };
    }
  }

  extractEmail(emailString) {
    const match = emailString.match(/<(.+?)>/) || emailString.match(/([^\s]+@[^\s]+)/);
    return match ? match[1] : emailString;
  }

  formatReplySubject(originalSubject) {
    if (!originalSubject.toLowerCase().startsWith('re:')) {
      return `Re: ${originalSubject}`;
    }
    return originalSubject;
  }

  createSignatureHtml(signature) {
    if (!signature) return '';
    
    return `
      <br><br>
      <div style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #e0e0e0;">
        ${signature}
      </div>
    `;
  }

  combineEmailWithSignature(body, signature) {
    const signatureHtml = this.createSignatureHtml(signature);
    
    return {
      text: body.text + (signature ? `\n\n${signature}` : ''),
      html: body.html + signatureHtml
    };
  }
}

module.exports = new EmailService();