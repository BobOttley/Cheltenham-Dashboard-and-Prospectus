const express = require('express');
const router = express.Router();

// =====================================================
// EMAIL HISTORY ROUTES
// =====================================================

// Import emails from Gmail/Outlook to email_history table
router.post('/admin/import-emails', async (req, res) => {
    try {
        const { emails } = req.body;
        const pool = req.app.locals.pool;
        
        if (!emails || !Array.isArray(emails)) {
            return res.status(400).json({ success: false, error: 'Invalid emails array' });
        }

        let imported = 0;
        let skipped = 0;

        for (const email of emails) {
            const { messageId, from, to, subject, bodyText, bodyHtml, receivedAt } = email;
            
            // Check if already exists
            const existingCheck = await pool.query(
                'SELECT id FROM email_history WHERE message_id = $1',
                [messageId]
            );

            if (existingCheck.rows.length > 0) {
                skipped++;
                continue;
            }

            // Extract email address from "Name <email@example.com>" format
            const fromEmail = extractEmail(from);
            const toEmail = extractEmail(to);

            // Auto-match by email address
            let enquiryId = null;
            const matchQuery = await pool.query(
                'SELECT id FROM inquiries WHERE LOWER(parent_email) = LOWER($1) ORDER BY created_at DESC LIMIT 1',
                [fromEmail]
            );

            if (matchQuery.rows.length > 0) {
                enquiryId = matchQuery.rows[0].id;
            }

            // Insert into email_history
            await pool.query(`
                INSERT INTO email_history 
                (enquiry_id, message_id, direction, from_email, from_name, to_email, to_name, subject, body_text, body_html, sent_at, is_matched)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            `, [
                enquiryId,
                messageId,
                'received',
                fromEmail,
                extractName(from),
                toEmail,
                extractName(to),
                subject,
                bodyText,
                bodyHtml,
                receivedAt || new Date(),
                enquiryId !== null
            ]);

            imported++;
        }

        res.json({ 
            success: true, 
            imported, 
            skipped,
            message: `Imported ${imported} emails, skipped ${skipped} duplicates`
        });

    } catch (error) {
        console.error('❌ Import emails error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get unmatched emails (NEW badge emails)
router.get('/admin/unmatched-emails', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        
        const result = await pool.query(`
            SELECT 
                id, message_id, from_email, from_name, subject, 
                body_text, sent_at, direction
            FROM email_history 
            WHERE is_matched = FALSE 
            ORDER BY sent_at DESC
            LIMIT 100
        `);

        res.json({ success: true, emails: result.rows });

    } catch (error) {
        console.error('❌ Get unmatched emails error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Manually match email to enquiry
router.post('/admin/match-email', async (req, res) => {
    try {
        const { emailId, enquiryId } = req.body;
        const pool = req.app.locals.pool;

        if (!emailId || !enquiryId) {
            return res.status(400).json({ success: false, error: 'Missing emailId or enquiryId' });
        }

        // Verify enquiry exists
        const enquiryCheck = await pool.query('SELECT id FROM inquiries WHERE id = $1', [enquiryId]);
        if (enquiryCheck.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Enquiry not found' });
        }

        // Update email record
        await pool.query(`
            UPDATE email_history 
            SET enquiry_id = $1, is_matched = TRUE, updated_at = NOW()
            WHERE id = $2
        `, [enquiryId, emailId]);

        res.json({ success: true, message: 'Email matched successfully' });

    } catch (error) {
        console.error('❌ Match email error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create new enquiry from unmatched email
router.post('/admin/create-enquiry-from-email', async (req, res) => {
    try {
        const { emailId } = req.body;
        const pool = req.app.locals.pool;

        if (!emailId) {
            return res.status(400).json({ success: false, error: 'Missing emailId' });
        }

        // Get email details
        const emailResult = await pool.query(
            'SELECT * FROM email_history WHERE id = $1',
            [emailId]
        );

        if (emailResult.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Email not found' });
        }

        const email = emailResult.rows[0];

        // Generate new enquiry ID
        const enquiryId = 'INQ-' + Date.now().toString() + Math.floor(Math.random() * 1000);

        // Create new enquiry
        const nameParts = (email.from_name || 'Unknown').split(' ');
        const firstName = nameParts[0];
        const familyName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : firstName;

        await pool.query(`
            INSERT INTO inquiries 
            (id, first_name, family_name, email, parent_name, status, college, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        `, [
            enquiryId,
            firstName,
            familyName,
            email.from_email,
            email.from_name || email.from_email,
            'new',
            'cheltenham'
        ]);

        // Link email to new enquiry
        await pool.query(`
            UPDATE email_history 
            SET enquiry_id = $1, is_matched = TRUE, updated_at = NOW()
            WHERE id = $2
        `, [enquiryId, emailId]);

        // Log activity
        await pool.query(`
            INSERT INTO activity_log (enquiry_id, activity_type, activity_description, created_by)
            VALUES ($1, $2, $3, $4)
        `, [
            enquiryId,
            'enquiry_created',
            `Enquiry created from email: ${email.subject}`,
            'system'
        ]);

        res.json({ 
            success: true, 
            enquiryId,
            message: 'New enquiry created and email matched'
        });

    } catch (error) {
        console.error('❌ Create enquiry from email error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get email history for specific enquiry
router.get('/admin/email-history/:enquiryId', async (req, res) => {
    try {
        const { enquiryId } = req.params;
        const pool = req.app.locals.pool;

        const result = await pool.query(`
            SELECT 
                id, message_id, direction, from_email, from_name, 
                to_email, to_name, subject, body_text, body_html, 
                sent_at, created_at
            FROM email_history 
            WHERE enquiry_id = $1 
            ORDER BY sent_at DESC
        `, [enquiryId]);

        res.json({ success: true, emails: result.rows });

    } catch (error) {
        console.error('❌ Get email history error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Save sent email to history
router.post('/admin/save-sent-email', async (req, res) => {
    try {
        const { 
            enquiryId, 
            messageId, 
            toEmail, 
            toName, 
            subject, 
            bodyText, 
            bodyHtml 
        } = req.body;
        
        const pool = req.app.locals.pool;
        const adminEmail = req.session?.adminEmail || 'system';

        if (!messageId || !toEmail) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        // Get admin name from email
        const fromName = adminEmail.split('@')[0].replace('.', ' ');

        await pool.query(`
            INSERT INTO email_history 
            (enquiry_id, message_id, direction, from_email, from_name, to_email, to_name, subject, body_text, body_html, sent_at, is_matched)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), TRUE)
        `, [
            enquiryId,
            messageId,
            'sent',
            adminEmail,
            fromName,
            toEmail,
            toName || toEmail,
            subject,
            bodyText,
            bodyHtml
        ]);

        res.json({ success: true, message: 'Email saved to history' });

    } catch (error) {
        console.error('❌ Save sent email error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Helper functions
function extractEmail(emailString) {
    if (!emailString) return '';
    const match = emailString.match(/<(.+?)>/);
    return match ? match[1] : emailString.trim();
}

function extractName(emailString) {
    if (!emailString) return '';
    const match = emailString.match(/^(.+?)\s*</);
    return match ? match[1].trim().replace(/^["']|["']$/g, '') : emailString.split('@')[0];
}

module.exports = router;
