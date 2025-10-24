// routes/smartReply.js
const express = require('express');
const router = express.Router();
const graphService = require('../services/microsoftGraphService');
const { getValidAccessToken } = require('./msauth');
const fetch = require('node-fetch');

/**
 * Middleware to verify user is authenticated
 */
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.adminEmail) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

/**
 * Helper function to fetch external image and convert to base64
 */
async function fetchImageAsBase64(imageUrl) {
  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const buffer = await response.buffer();
    const base64 = buffer.toString('base64');
    
    let contentType = response.headers.get('content-type');
    if (!contentType) {
      if (imageUrl.match(/\.png$/i)) contentType = 'image/png';
      else if (imageUrl.match(/\.jpe?g$/i)) contentType = 'image/jpeg';
      else if (imageUrl.match(/\.gif$/i)) contentType = 'image/gif';
      else contentType = 'image/png';
    }
    
    return {
      base64,
      contentType
    };
  } catch (error) {
    console.error('❌ Error fetching image:', imageUrl, error.message);
    return null;
  }
}

/**
 * Helper function to extract and convert ALL images to attachments
 */
async function extractAndConvertImages(htmlBody) {
  const images = [];
  let modifiedHtml = htmlBody;
  let imageIndex = 0;
  
  // Pattern 1: Find base64 images
  const base64ImageRegex = /<img[^>]+src="data:image\/([^;]+);base64,([^"]+)"[^>]*>/gi;
  let match;
  
  while ((match = base64ImageRegex.exec(htmlBody)) !== null) {
    const fullMatch = match[0];
    const imageType = match[1];
    const base64Data = match[2];
    
    const contentId = `image${imageIndex}@signature`;
    imageIndex++;
    
    const cidImage = fullMatch.replace(/src="data:image\/[^;]+;base64,[^"]+"/i, `src="cid:${contentId}"`);
    modifiedHtml = modifiedHtml.replace(fullMatch, cidImage);
    
    images.push({
      contentId: contentId,
      contentType: `image/${imageType}`,
      contentBytes: base64Data,
      isInline: true
    });
  }
  
  // Pattern 2: Find external URL images
  const urlImageRegex = /<img[^>]+src="(https?:\/\/[^"]+)"[^>]*>/gi;
  const urlMatches = [];
  
  while ((match = urlImageRegex.exec(htmlBody)) !== null) {
    urlMatches.push({
      fullMatch: match[0],
      imageUrl: match[1]
    });
  }
  
  for (const urlMatch of urlMatches) {
    const imageData = await fetchImageAsBase64(urlMatch.imageUrl);
    
    if (imageData) {
      const contentId = `image${imageIndex}@signature`;
      imageIndex++;
      
      const cidImage = urlMatch.fullMatch.replace(/src="https?:\/\/[^"]+"/i, `src="cid:${contentId}"`);
      modifiedHtml = modifiedHtml.replace(urlMatch.fullMatch, cidImage);
      
      images.push({
        contentId: contentId,
        contentType: imageData.contentType,
        contentBytes: imageData.base64,
        isInline: true
      });
    }
  }
  
  return { modifiedHtml, images };
}

/**
 * Process inline images in HTML content
 */
async function processInlineImages(htmlBody, pool, adminEmail) {
  return extractAndConvertImages(htmlBody);
}

/**
 * GET /api/smart-reply/emails
 * Fetch emails from Microsoft 365
 */
router.get('/emails', requireAuth, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const adminEmail = req.session.adminEmail;
    const limit = parseInt(req.query.limit, 10) || 1000;
    const skipToken = req.query.skipToken || null; // NEW: Accept skipToken for pagination

    console.log('📬 Fetching emails for:', adminEmail, `(limit: ${limit}, skipToken: ${skipToken ? 'yes' : 'no'})`);

    let accessToken;
    try {
      accessToken = await getValidAccessToken(pool, adminEmail);
    } catch (error) {
      if (error.message === 'MICROSOFT_NOT_CONNECTED') {
        return res.status(400).json({
          error: 'Please connect your Microsoft account first',
          needsAuth: true
        });
      }
      throw error;
    }

    // NEW: Use pagination-enabled method
    const result = await graphService.fetchEmailsWithPagination(accessToken, limit, skipToken);
    console.log(`✅ Fetched ${result.emails.length} emails (hasMore: ${!!result.skipToken})`);

    // NEW: Return both emails and skipToken for next page
    res.json({ 
      success: true, 
      emails: result.emails, 
      count: result.emails.length,
      skipToken: result.skipToken, // For next page
      hasMore: !!result.skipToken  // Boolean flag
    });
  } catch (error) {
    console.error('❌ Error fetching emails:', error);
    res.status(500).json({
      error: 'Failed to fetch emails',
      details: error.message
    });
  }
});

/**
 * POST /api/smart-reply/send-email
 * Send email and auto-link to enquiry
 */
router.post('/send-email', requireAuth, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const adminEmail = req.session.adminEmail;

    const {
      to,
      subject,
      body,
      inReplyTo,
      signature,
      enquiryId
    } = req.body;
    
    console.log('📧 Sending email to:', to);

    let htmlBody = '';
    let textBody = '';
    
    if (typeof body === 'string') {
      htmlBody = body;
      textBody = body;
    } else if (body && typeof body === 'object') {
      htmlBody = body.html || body.text || '';
      textBody = body.text || body.html || '';
    }

    // Get signature from database if not provided
    let userSignature = signature;
    if (!userSignature) {
      try {
        const signatureResult = await pool.query(
          'SELECT email_signature FROM admin_settings WHERE admin_email = $1',
          [adminEmail]
        );
        if (signatureResult.rows.length > 0) {
          userSignature = signatureResult.rows[0].email_signature;
          console.log('📝 Using signature from database');
        }
      } catch (err) {
        console.log('No signature found in database');
      }
    }

    // Append signature
    if (userSignature) {
      let formattedSignature = userSignature.replace(/\n/g, '<br>');
      let signatureHtml = `
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
          ${formattedSignature}
        </div>
      `;
      htmlBody = htmlBody + signatureHtml;
      textBody = textBody + '\n\n' + userSignature.replace(/<[^>]*>/g, '');
    }

    // Extract images and convert to CID attachments
    console.log('🖼️ Extracting images from email body...');
    const { modifiedHtml, images } = await processInlineImages(htmlBody, pool, adminEmail);
    htmlBody = modifiedHtml;
    console.log(`🖼️ Inline images: ${images.length}`);

    // Validation
    if (!htmlBody.trim()) {
      return res.status(400).json({ success: false, error: 'Email body is empty' });
    }
    
    if (!inReplyTo && (!to || !subject)) {
      return res.status(400).json({ error: 'Missing required fields: to, subject' });
    }

    // Get access token
    let accessToken;
    try {
      accessToken = await getValidAccessToken(pool, adminEmail);
    } catch (error) {
      if (error.message === 'MICROSOFT_NOT_CONNECTED') {
        return res.status(400).json({
          error: 'Please connect your Microsoft account first',
          needsAuth: true
        });
      }
      throw error;
    }

    // Send email via Microsoft Graph
    let result;
    if (inReplyTo) {
      result = await graphService.replyToEmail(accessToken, inReplyTo, htmlBody, images);
      console.log(`✅ Reply sent for message ${inReplyTo}`);
    } else {
      result = await graphService.sendEmail(accessToken, to, subject, htmlBody, images);
      console.log(`✅ Email sent to ${to}`);
    }

    // Auto-link: Find enquiry by recipient email if enquiryId not provided
    let linkedEnquiryId = enquiryId;
    
    if (!linkedEnquiryId) {
      try {
        const enquiryResult = await pool.query(
          'SELECT id FROM inquiries WHERE LOWER(email) = LOWER($1) OR LOWER(parent_email) = LOWER($1) LIMIT 1',
          [to]
        );
        
        if (enquiryResult.rows.length > 0) {
          linkedEnquiryId = enquiryResult.rows[0].id;
          console.log(`✅ Auto-linked to enquiry: ${linkedEnquiryId}`);
        }
      } catch (err) {
        console.log('No matching enquiry found for auto-link');
      }
    }

    // Save to sent_emails table
    try {
      await pool.query(
        `INSERT INTO sent_emails (admin_email, recipient, subject, body_html, body_text, signature_used, in_reply_to, message_id, enquiry_id, sent_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
        [adminEmail, to, subject, htmlBody, textBody, userSignature || null, inReplyTo || null, result.messageId || null, linkedEnquiryId || null]
      );
      console.log('✅ Email saved to sent_emails table');
    } catch (saveError) {
      console.error('⚠️ Failed to save to sent_emails:', saveError.message);
    }

    // Save to email_history if linked to enquiry
    if (linkedEnquiryId) {
      try {
        await pool.query(
          `INSERT INTO email_history (enquiry_id, message_id, direction, from_email, from_name, to_email, subject, body_text, body_html, sent_at, is_matched)
           VALUES ($1, $2, 'sent', $3, $3, $4, $5, $6, $7, NOW(), true)`,
          [linkedEnquiryId, result.messageId, adminEmail, to, subject, textBody, htmlBody]
        );
        console.log(`✅ Sent email logged to email_history for enquiry ${linkedEnquiryId}`);
      } catch (historyError) {
        console.error('⚠️ Failed to save to email_history:', historyError.message);
      }
    }

    res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId,
      enquiryId: linkedEnquiryId
    });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({
      error: 'Failed to send email',
      details: error.message
    });
  }
});

/**
 * GET /api/smart-reply/sent-emails
 */
router.get('/sent-emails', requireAuth, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const adminEmail = req.session.adminEmail;
    const limit = parseInt(req.query.limit, 10) || 1000;

    console.log('📤 Fetching sent emails for:', adminEmail);

    let accessToken;
    try {
      accessToken = await getValidAccessToken(pool, adminEmail);
    } catch (error) {
      if (error.message === 'MICROSOFT_NOT_CONNECTED') {
        return res.status(400).json({
          error: 'Please connect your Microsoft account first',
          needsAuth: true
        });
      }
      throw error;
    }

    const sentEmails = await graphService.fetchSentEmails(accessToken, limit);
    console.log(`✅ Fetched ${sentEmails.length} sent emails`);

    res.json({ success: true, emails: sentEmails, count: sentEmails.length });
  } catch (error) {
    console.error('❌ Error fetching sent emails:', error);
    res.status(500).json({
      error: 'Failed to fetch sent emails',
      details: error.message
    });
  }
});

router.get('/drafts', requireAuth, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const adminEmail = req.session.adminEmail;
    const limit = parseInt(req.query.limit, 10) || 1000;

    console.log('📝 Fetching drafts for:', adminEmail);

    let accessToken;
    try {
      accessToken = await getValidAccessToken(pool, adminEmail);
    } catch (error) {
      if (error.message === 'MICROSOFT_NOT_CONNECTED') {
        return res.status(400).json({
          error: 'Please connect your Microsoft account first',
          needsAuth: true
        });
      }
      throw error;
    }

    const drafts = await graphService.fetchDrafts(accessToken, limit);
    console.log(`✅ Fetched ${drafts.length} drafts`);

    res.json({ success: true, emails: drafts, count: drafts.length });
  } catch (error) {
    console.error('❌ Error fetching drafts:', error);
    res.status(500).json({
      error: 'Failed to fetch drafts',
      details: error.message
    });
  }
});

/**
 * POST /api/smart-reply/save-draft
 * Save email as draft in Outlook
 */
router.post('/save-draft', requireAuth, async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const adminEmail = req.session.adminEmail;
        const { to, subject, body } = req.body;

        console.log('💾 Saving draft for:', adminEmail);

        let accessToken;
        try {
            accessToken = await getValidAccessToken(pool, adminEmail);
        } catch (error) {
            if (error.message === 'MICROSOFT_NOT_CONNECTED') {
                return res.status(400).json({
                    error: 'Please connect your Microsoft account first',
                    needsAuth: true
                });
            }
            throw error;
        }

        const result = await graphService.saveDraft(accessToken, {
            to,
            subject,
            body
        });

        console.log('✅ Draft saved');

        res.json({
            success: true,
            message: 'Draft saved successfully',
            draftId: result.draftId
        });

    } catch (error) {
        console.error('❌ Error saving draft:', error);
        res.status(500).json({
            error: 'Failed to save draft',
            details: error.message
        });
    }
});

/**
 * GET /api/smart-reply/settings
 */
router.get('/settings', requireAuth, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const adminEmail = req.session.adminEmail;

    const result = await pool.query(
      'SELECT email_signature, auto_refresh_enabled, refresh_interval FROM admin_settings WHERE admin_email = $1',
      [adminEmail]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, settings: result.rows[0] });
    } else {
      res.json({ success: true, settings: {} });
    }
  } catch (error) {
    console.error('❌ Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

/**
 * POST /api/smart-reply/settings
 */
router.post('/settings', requireAuth, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const adminEmail = req.session.adminEmail;
    const { emailSignature, autoRefreshEnabled, refreshInterval } = req.body;

    await pool.query(
      `INSERT INTO admin_settings (admin_email, email_signature, auto_refresh_enabled, refresh_interval, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (admin_email)
       DO UPDATE SET
         email_signature = EXCLUDED.email_signature,
         auto_refresh_enabled = EXCLUDED.auto_refresh_enabled,
         refresh_interval = EXCLUDED.refresh_interval,
         updated_at = NOW()`,
      [adminEmail, emailSignature, autoRefreshEnabled, refreshInterval]
    );

    res.json({ success: true, message: 'Settings saved' });
  } catch (error) {
    console.error('❌ Error saving settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

/**
 * POST /api/smart-reply/generate-response
 * Generate AI response for email
 */
router.post('/generate-response', requireAuth, async (req, res) => {
  try {
    const { originalEmail, enquiryId, instructions } = req.body;
    const pool = req.app.locals.pool;
    
    console.log('🤖 Generating AI response for email from:', originalEmail?.from);

    // Load AI service
    const aiService = require('../services/aiService');
    
    // Get enquiry data if enquiryId provided
    let enquiryData = null;
    if (enquiryId) {
      try {
        const enquiryResult = await pool.query(
          'SELECT * FROM inquiries WHERE id = $1',
          [enquiryId]
        );
        if (enquiryResult.rows.length > 0) {
          enquiryData = enquiryResult.rows[0];
        }
      } catch (err) {
        console.log('Could not fetch enquiry data:', err.message);
      }
    }

    // Load knowledge base
    const knowledgeBase = await aiService.loadKnowledgeBase();

    // Generate response
    const result = await aiService.generateCompleteEmail({
      originalEmail,
      enquiryData,
      knowledgeBase,
      instructions
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to generate AI reply');
    }

    res.json({
      success: true,
      body: result.body,
      usage: result.usage
    });
  } catch (error) {
    console.error('❌ Error generating AI response:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate AI response'
    });
  }
});

/**
 * POST /api/admin/import-emails
 * Import emails to email_history table
 */
router.post('/admin/import-emails', requireAuth, async (req, res) => {
  try {
    const { emails } = req.body;
    const pool = req.app.locals.pool;

    if (!Array.isArray(emails)) {
      return res.status(400).json({ success: false, error: 'Invalid request' });
    }

    let imported = 0;
    let skipped = 0;

    for (const email of emails) {
      try {
        const { messageId, from, to, subject, bodyText, bodyHtml, receivedAt } = email;

        // Check if already exists or was deleted
        const existingCheck = await pool.query(
          'SELECT id, is_deleted FROM email_history WHERE message_id = $1',
          [messageId]
        );

        if (existingCheck.rows.length > 0) {
          // Skip if already exists AND not deleted
          // If deleted, we still skip (don't re-import)
          skipped++;
          continue;
        }

        // Try to match to enquiry by sender email
        let enquiryId = null;
        // Handle both string and object formats for email addresses
        const fromEmail = typeof from === 'string' 
          ? from 
          : (from?.emailAddress?.address || from?.address || from);
        
        if (fromEmail) {
          const enquiryMatch = await pool.query(
            'SELECT id FROM inquiries WHERE LOWER(email) = LOWER($1) OR LOWER(parent_email) = LOWER($1) LIMIT 1',
            [fromEmail]
          );

          if (enquiryMatch.rows.length > 0) {
            enquiryId = enquiryMatch.rows[0].id;
          }
        }

        // Handle 'to' field similarly
        const toEmail = typeof to === 'string'
          ? to
          : (to?.emailAddress?.address || to?.address || to);

        // Insert into email_history
        await pool.query(
          `INSERT INTO email_history (
            message_id, enquiry_id, direction, from_email, from_name, 
            to_email, subject, body_text, body_html, sent_at, is_matched
          ) VALUES ($1, $2, 'received', $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            messageId,
            enquiryId,
            fromEmail,
            from?.name || fromEmail,
            toEmail,
            subject,
            bodyText || '',
            bodyHtml || '',
            receivedAt || new Date(),
            enquiryId ? true : false
          ]
        );

        imported++;
      } catch (err) {
        console.error('Error importing email:', err.message);
        skipped++;
      }
    }

    res.json({ success: true, imported, skipped });
  } catch (error) {
    console.error('❌ Import error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/email-history
 * Get email history for an enquiry
 */
router.get('/admin/email-history', requireAuth, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const { enquiryId } = req.query;

    if (!enquiryId) {
      return res.status(400).json({ success: false, error: 'Enquiry ID required' });
    }

    const result = await pool.query(
      `SELECT * FROM email_history 
       WHERE enquiry_id = $1 
       AND (is_deleted IS NULL OR is_deleted = false)
       ORDER BY sent_at DESC`,
      [enquiryId]
    );

    res.json({ success: true, emails: result.rows });
  } catch (error) {
    console.error('❌ Error fetching email history:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/unmatched-emails
 * Get emails that haven't been matched to an enquiry
 */
router.get('/admin/unmatched-emails', requireAuth, async (req, res) => {
  try {
    const pool = req.app.locals.pool;

    const result = await pool.query(
      `SELECT * FROM email_history 
       WHERE is_matched = false 
       ORDER BY sent_at DESC 
       LIMIT 100`
    );

    res.json({ success: true, emails: result.rows });
  } catch (error) {
    console.error('❌ Error fetching unmatched emails:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/check-email-match
 * Check if incoming email matches an existing enquiry
 */
router.post('/admin/check-email-match', requireAuth, async (req, res) => {
  try {
    const { messageId, senderEmail } = req.body;
    const pool = req.app.locals.pool;

    console.log('🔍 CHECK-EMAIL-MATCH called with:', { messageId, senderEmail });

    if (!messageId && !senderEmail) {
      console.log('❌ No messageId or senderEmail provided');
      return res.json({ success: true, isMatched: false });
    }

    // STEP 1: Check inquiries table for email match
    console.log('📊 Checking inquiries table for:', senderEmail);
    const inquiryResult = await pool.query(`
      SELECT id 
      FROM inquiries 
      WHERE LOWER(email) = LOWER($1) 
         OR LOWER(parent_email) = LOWER($1)
      ORDER BY created_at DESC
      LIMIT 1
    `, [senderEmail]);

    console.log('📊 Inquiries query result:', inquiryResult.rows);

    if (inquiryResult.rows.length > 0) {
      const enquiryId = inquiryResult.rows[0].id;
      console.log('✅ MATCH FOUND in inquiries:', enquiryId);
      
      // Auto-link to email_history if not already there
      const historyCheck = await pool.query(`
        SELECT id FROM email_history 
        WHERE message_id = $1 OR from_email = $2
        LIMIT 1
      `, [messageId, senderEmail]);
      
      if (historyCheck.rows.length === 0) {
        console.log('📝 Creating email_history record');
        await pool.query(`
          INSERT INTO email_history (
            enquiry_id, message_id, direction, from_email, 
            sent_at, is_matched
          ) VALUES ($1, $2, 'received', $3, NOW(), true)
        `, [enquiryId, messageId, senderEmail]);
      }
      
      return res.json({
        success: true,
        isMatched: true,
        enquiryId: enquiryId
      });
    }

    console.log('ℹ️ No match in inquiries, checking email_history...');

    // STEP 2: Check email_history as fallback
    const historyResult = await pool.query(`
      SELECT enquiry_id 
      FROM email_history 
      WHERE LOWER(from_email) = LOWER($1)
      ORDER BY sent_at DESC
      LIMIT 1
    `, [senderEmail]);

    console.log('📊 Email_history query result:', historyResult.rows);

    if (historyResult.rows.length > 0 && historyResult.rows[0].enquiry_id) {
      console.log('✅ MATCH FOUND in email_history:', historyResult.rows[0].enquiry_id);
      return res.json({
        success: true,
        isMatched: true,
        enquiryId: historyResult.rows[0].enquiry_id
      });
    }

    // No match found
    console.log('❌ NO MATCH FOUND');
    res.json({
      success: true,
      isMatched: false
    });

  } catch (error) {
    console.error('❌ Error checking match:', error);
    res.json({ success: true, isMatched: false });
  }
});

/**
 * POST /api/admin/link-email
 * Manually link an email to an enquiry
 */
router.post('/admin/link-email', requireAuth, async (req, res) => {
  try {
    const { enquiryId, messageId, senderEmail } = req.body;
    const pool = req.app.locals.pool;

    if (!enquiryId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Enquiry ID is required' 
      });
    }

    if (!messageId && !senderEmail) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message ID or sender email is required' 
      });
    }

    // Verify enquiry exists
    const enquiryCheck = await pool.query(
      'SELECT id FROM inquiries WHERE id = $1',
      [enquiryId]
    );

    if (enquiryCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Enquiry not found' 
      });
    }

    // Update email_history
    const emailCheck = await pool.query(
      `SELECT id FROM email_history 
       WHERE message_id = $1 OR from_email = $2
       LIMIT 1`,
      [messageId, senderEmail]
    );

    if (emailCheck.rows.length > 0) {
      await pool.query(
        `UPDATE email_history 
         SET enquiry_id = $1, is_matched = true
         WHERE id = $2`,
        [enquiryId, emailCheck.rows[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO email_history (
          enquiry_id, message_id, direction, from_email, 
          sent_at, is_matched
        ) VALUES ($1, $2, 'received', $3, NOW(), true)`,
        [enquiryId, messageId, senderEmail]
      );
    }

    // Log activity
    try {
      await pool.query(
        `INSERT INTO activity_log (
          enquiry_id, action_type, description, admin_email
        ) VALUES ($1, $2, $3, $4)`,
        [
          enquiryId,
          'email_linked',
          `Email from ${senderEmail} manually linked to enquiry`,
          req.session?.adminEmail || 'admin'
        ]
      );
    } catch (logError) {
      console.log('Activity log not available');
    }

    res.json({ 
      success: true,
      message: 'Email linked successfully',
      enquiryId: enquiryId
    });

  } catch (error) {
    console.error('❌ Error linking email:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to link email'
    });
  }
});

/**
 * POST /api/admin/create-enquiry-from-email
 * Create new enquiry from an email
 */
router.post('/admin/create-enquiry-from-email', requireAuth, async (req, res) => {
  try {
    const { messageId, senderEmail, senderName, subject } = req.body;
    const pool = req.app.locals.pool;

    if (!senderEmail) {
      return res.status(400).json({ 
        success: false, 
        error: 'Sender email is required' 
      });
    }

    // Parse name
    let firstName = 'Unknown';
    let familyName = 'Sender';

    if (senderName && senderName !== senderEmail) {
      const nameParts = senderName.split(' ');
      firstName = nameParts[0] || 'Unknown';
      familyName = nameParts.slice(1).join(' ') || 'Sender';
    } else if (senderEmail) {
      firstName = senderEmail.split('@')[0];
      familyName = '';
    }

    // Generate unique enquiry ID
    const enquiryId = 'INQ-' + Date.now();

    // Create new enquiry with all required columns
    // Create new enquiry with all required columns
await pool.query(
  `INSERT INTO inquiries (
    id, first_name, family_surname, parent_email, parent_name,
    contact_number, age_group, entry_year, form_entry, school, form_data,
    created_at, status, priority, email_sent, country
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), $12, $13, $14, $15)`,
  [
    enquiryId,
    firstName,
    familyName || '',
    senderEmail,
    senderName || senderEmail,
    '',  // contact_number
    '',  // age_group
    new Date().getFullYear().toString(),  // entry_year
    '',  // form_entry
    'cheltenham',  // school
    JSON.stringify({ 
      source: 'email', 
      subject: subject || '',
      boardingPreference: '',  // ✅ ADD THIS
      stage: 'Lower',
      gender: '',
      academicInterests: [],
      activities: [],
      specificSports: [],
      priorities: { academic: 2, sports: 2, pastoral: 2, activities: 2 },
      universityAspirations: '',
      additionalInfo: ''
    }),  // form_data
    'new',  // status
    false,  // priority
    false,  // email_sent
    'Unknown'  // country
  ]
);

    // Link email to new enquiry
    const emailCheck = await pool.query(
      `SELECT id FROM email_history 
       WHERE message_id = $1 OR from_email = $2
       LIMIT 1`,
      [messageId, senderEmail]
    );

    if (emailCheck.rows.length > 0) {
      await pool.query(
        `UPDATE email_history 
         SET enquiry_id = $1, is_matched = true
         WHERE id = $2`,
        [enquiryId, emailCheck.rows[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO email_history (
          enquiry_id, message_id, direction, from_email, 
          from_name, subject, sent_at, is_matched
        ) VALUES ($1, $2, 'received', $3, $4, $5, NOW(), true)`,
        [enquiryId, messageId, senderEmail, senderName, subject]
      );
    }

    // Log activity
    try {
      await pool.query(
        `INSERT INTO activity_log (
          enquiry_id, action_type, description, admin_email
        ) VALUES ($1, $2, $3, $4)`,
        [
          enquiryId,
          'enquiry_created',
          `New enquiry created from email`,
          req.session?.adminEmail || 'admin'
        ]
      );
    } catch (logError) {
      console.log('Activity log not available');
    }

    res.json({ 
      success: true,
      message: 'New enquiry created successfully',
      enquiryId: enquiryId
    });

  } catch (error) {
    console.error('❌ Error creating enquiry:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to create enquiry'
    });
  }
});

/**
 * POST /api/smart-reply/admin/delete-email
 * Mark email as deleted in email_history
 */
router.post('/admin/delete-email', requireAuth, async (req, res) => {
  try {
    const { messageId } = req.body;
    const pool = req.app.locals.pool;

    if (!messageId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message ID is required' 
      });
    }

    // Mark as deleted in email_history
    await pool.query(
      `UPDATE email_history 
       SET is_deleted = true 
       WHERE message_id = $1`,
      [messageId]
    );

    console.log(`🗑️ Marked email as deleted: ${messageId}`);

    res.json({ 
      success: true,
      message: 'Email deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting email:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to delete email'
    });
  }
});

/**
 * PATCH /api/smart-reply/admin/enquiries/:id
 * Update enquiry fields
 */
router.patch('/admin/enquiries/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const pool = req.app.locals.pool;

    // Build dynamic UPDATE query
    const allowedFields = [
      'first_name', 'family_surname', 'parent_email', 'contact_number', 
      'country', 'form_entry', 'entry_year', 'boarding_type', 
      'university_aspirations', 'status', 'priority'
    ];

    const setClauses = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        setClauses.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No valid fields to update' 
      });
    }

    values.push(id);
    const query = `
      UPDATE inquiries 
      SET ${setClauses.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Enquiry not found' 
      });
    }

    console.log(`✅ Updated enquiry ${id}:`, Object.keys(updates).join(', '));

    res.json({ 
      success: true,
      enquiry: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error updating enquiry:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to update enquiry'
    });
  }
});

/**
 * GET /api/admin/enquiries/search
 * Search for enquiries
 */
router.get('/admin/enquiries/search', requireAuth, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const query = req.query.q;

    if (!query || query.length < 2) {
      return res.json({ success: true, enquiries: [] });
    }

    const searchPattern = `%${query}%`;
    
    const result = await pool.query(
      `SELECT 
        id, first_name, family_name, email, 
        parent_email, phone, status, created_at
       FROM inquiries
       WHERE 
        LOWER(first_name) LIKE LOWER($1)
        OR LOWER(family_name) LIKE LOWER($1)
        OR LOWER(email) LIKE LOWER($1)
        OR LOWER(parent_email) LIKE LOWER($1)
        OR LOWER(id) LIKE LOWER($1)
       ORDER BY created_at DESC
       LIMIT 20`,
      [searchPattern]
    );

    res.json({ 
      success: true, 
      enquiries: result.rows 
    });

  } catch (error) {
    console.error('❌ Search enquiries error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});


console.log('✅ Smart Reply routes loaded successfully');

module.exports = router;