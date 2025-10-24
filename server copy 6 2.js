require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const Handlebars = require('handlebars');
const fs = require('fs');
const app = express();

// Use environment port or fallback to 3000
const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test database connection on startup
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Database connection error:', err);
    } else {
        console.log('✅ Database connected successfully');
    }
});

// ========================================
// AUTHENTICATION SETUP
// ========================================

// Admin users from environment variables
const ADMIN_USERS = [
    {
        email: process.env.ADMIN_USER1_EMAIL,
        password: process.env.ADMIN_USER1_PASSWORD
    },
    {
        email: process.env.ADMIN_USER2_EMAIL,
        password: process.env.ADMIN_USER2_PASSWORD
    },
    {
        email: process.env.ADMIN_USER3_EMAIL,
        password: process.env.ADMIN_USER3_PASSWORD
    }
].filter(user => user.email && user.password);

console.log(`✅ Loaded ${ADMIN_USERS.length} admin user(s) from environment`);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    name: 'cheltenham.sid',
    cookie: {
        secure: false, // Set to true only in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
    }
}));

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.adminEmail) {
        return next();
    }
    res.redirect('/admin/login');
}

// ========================================
// AUTHENTICATION ROUTES
// ========================================

// Serve login page
app.get('/admin/login', (req, res) => {
    if (req.session && req.session.adminEmail) {
        return res.redirect('/admin');
    }
    res.sendFile(path.join(__dirname, 'admin-login.html'));
});

// Login API
app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    
    console.log('Login attempt for:', email);
    
    const user = ADMIN_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
        req.session.adminEmail = email;
        
        // Force session save before responding
        req.session.save((err) => {
            if (err) {
                console.error('❌ Session save error:', err);
                return res.json({ success: false, error: 'Session error' });
            }
            console.log(`✅ Admin login successful: ${email}`);
            console.log(`✅ Session ID: ${req.sessionID}`);
            res.json({ success: true });
        });
    } else {
        console.log(`❌ Failed login attempt: ${email}`);
        res.json({ success: false, error: 'Invalid email or password' });
    }
});

// Logout API
app.post('/api/admin/logout', (req, res) => {
    const email = req.session.adminEmail;
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.json({ success: false });
        }
        console.log(`✅ Admin logged out: ${email}`);
        res.json({ success: true });
    });
});

// Check auth status
app.get('/api/admin/check-auth', (req, res) => {
    res.json({
        authenticated: !!(req.session && req.session.adminEmail),
        email: req.session?.adminEmail || null
    });
});

// ========================================
// PUBLIC ROUTES (NO AUTH REQUIRED)
// ========================================

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve enquiry form BEFORE static middleware
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'enquiry-form.html'));
});

// Static file serving
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/modules', express.static(path.join(__dirname, 'modules')));
app.use('/js/i18n', express.static(path.join(__dirname, 'js/i18n')));

// ========================================
// EMAIL CONFIGURATION FOR GMAIL SMTP
// ========================================
const EMAIL_CONFIG = {
    recipient: process.env.SCHOOL_ADMISSIONS_EMAIL || 'admissions@cheltenhamcollege.org',
    from: process.env.GMAIL_USER,
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
};

// Create Gmail transporter
function createEmailTransporter() {
    return nodemailer.createTransport({
        host: EMAIL_CONFIG.host,
        port: EMAIL_CONFIG.port,
        secure: EMAIL_CONFIG.secure,
        auth: EMAIL_CONFIG.auth
    });
}

function generateParentEmailDraft(enquiryData, prospectusUrl) {
    const {
        childName = 'your child',
        parentName = 'there',
        email: parentEmail = '',
        formData = {}
    } = enquiryData;

    const firstName = childName.split(' ')[0];
    const parentFirstName = parentName.split(' ')[0];
    const parentLastName = parentName.split(' ').slice(-1)[0] || '';
    
    const academicInterests = formData.academicInterests || [];
    const activities = formData.activities || [];
    const specificSports = formData.specificSports || [];
    const boardingPreference = formData.boardingPreference || '';
    const priorities = formData.priorities || {};

    // Personalized opening
    let openingPara = `Thank you so much for getting in touch about ${firstName}. It's lovely to hear from you, and I'm genuinely excited about the possibility of ${firstName} joining us here at Cheltenham College.`;

    // Build the main content paragraphs dynamically
    let contentParagraphs = [];

    // Academic interests paragraph
    if (academicInterests.includes('sciences')) {
        contentParagraphs.push(`From what you've told me about ${firstName}'s passion for the Sciences, I think Cheltenham would be an excellent fit. Our laboratories are equipped to university standard, and the calibre of teaching is exceptional – we consistently see pupils progress to read Medicine, Engineering, and Natural Sciences at Oxford, Cambridge, and other leading universities. I'd love to show you what we can offer ${firstName} in this area.`);
    } else if (academicInterests.includes('mathematics')) {
        contentParagraphs.push(`${firstName}'s enthusiasm for Mathematics is wonderful to hear. We're passionate about nurturing mathematical talent here – setting pupils carefully from day one and offering extension opportunities including UKMT challenges. Many of our mathematicians go on to top universities to read Maths, Engineering, Economics, and Computer Science.`);
    } else if (academicInterests.includes('languages')) {
        contentParagraphs.push(`How exciting that ${firstName} enjoys languages! Our Modern Languages department is outstanding – we offer French, Spanish, German, Russian and Mandarin, and our pupils consistently achieve the highest grades. Many go on to use their languages in international careers or continue their studies at university level.`);
    } else if (academicInterests.includes('humanities')) {
        contentParagraphs.push(`${firstName}'s interest in the humanities is something we'd certainly nurture. Our English, History, Geography and Philosophy departments are real strengths of the College – we pride ourselves on developing young people who can think critically, write persuasively, and engage meaningfully with complex ideas.`);
    } else if (academicInterests.includes('arts')) {
        contentParagraphs.push(`${firstName}'s creative interests would flourish here. Our Art, Music and Drama departments offer exceptional opportunities, and we're immensely proud of our pupils who go on to study at the UK's leading art schools and conservatoires.`);
    }

    // Sports and activities - combine into one natural paragraph
    if (activities.includes('sports') && specificSports.length > 0) {
        const sportsList = specificSports.length === 2 ? 
            specificSports.join(' and ') : 
            specificSports.slice(0, -1).join(', ') + ' and ' + specificSports.slice(-1);
        contentParagraphs.push(`Sport is a huge part of life here, and I was delighted to read that ${firstName} plays ${sportsList}. We have superb facilities and coaching across all sports, and I'd be very happy to introduce you to our Director of Sport. There's a wonderful energy around our sporting programme – whether pupils are playing at county level or simply enjoying being part of a team.`);
    } else if (activities.includes('sports')) {
        contentParagraphs.push(`Sport is a huge part of life here at Cheltenham College, and we have excellent facilities across all disciplines. Whether ${firstName} has established sporting interests or wants to try something new, there's something for everyone.`);
    }

    // Boarding - weave into the narrative more naturally
    let boardingNote = '';
    if (boardingPreference === 'Full Boarding') {
        boardingNote = ` I know you're thinking about boarding for ${firstName}, and I'm confident you'll love our houses. They really do provide a home-from-home, with dedicated houseparents and a strong pastoral team. The friendships our boarders form are incredibly special and tend to last a lifetime.`;
    } else if (boardingPreference === 'Considering Both') {
        boardingNote = ` I understand you're weighing up day versus boarding for ${firstName} – many families are in exactly the same position. We're very happy to talk through both options and help you work out what might suit your family best.`;
    }

    // Pastoral care - make it feel more personal
    if (priorities.pastoral === 3) {
        contentParagraphs.push(`I was particularly struck by how important pastoral care is to you, and I want you to know that's absolutely at the heart of what we do. Every single child is known as an individual here – not just by their housemaster or housemistress, but across the College. Our pastoral team works incredibly closely with tutors and houseparents to ensure each pupil gets exactly the support they need to thrive.${boardingNote}`);
    } else if (boardingNote) {
        contentParagraphs.push(boardingNote.trim());
    }

    // Combine all content paragraphs
    const mainContent = contentParagraphs.join('\n\n');

    // Closing section - more conversational
    const closingSection = `I've put together a personalised prospectus for ${firstName}, which I hope will give you a real sense of what life could be like here. Do take your time with it – the link is below.

What I'd really love is for you to come and visit us. There's honestly nothing quite like seeing the College in action, meeting our pupils and staff, and getting a feel for the place. I can arrange a tour at a time that works for you, and we can absolutely tailor it around ${firstName}'s particular interests – whether that's spending time in the Science labs, watching a sports session, or sitting in on a lesson.

If you have any questions – big or small – please do just pick up the phone or drop me an email. I'm here to help, and I'd love to hear from you.`;

    // Build plain text email with better formatting
    const parts = [
        `Dear ${parentLastName ? 'Mr/Mrs ' + parentLastName : parentFirstName},`,
        '',
        openingPara,
        '',
        mainContent,
        '',
        closingSection,
        '',
        `Personalised Prospectus: ${prospectusUrl}`,
        '',
        'With very best wishes,',
        '',
        'Jack Avery',
        'College Admissions',
        'Lead on Prep Schools, Sports Professional & Westall Resident Tutor',
        'Cheltenham College',
        '',
        'ja.avery@cheltenhamcollege.org',
        '+44 (0)1242 265600',
        'www.cheltenhamcollege.org'
    ];

    const textContent = parts.filter(p => p !== null && p !== '').join('\n');

    // Build HTML email with improved formatting
    const htmlParts = [
        `<p>Dear ${parentLastName ? 'Mr/Mrs ' + parentLastName : parentFirstName},</p>`,
        `<p>${openingPara}</p>`,
        ...mainContent.split('\n\n').map(p => `<p>${p}</p>`),
        ...closingSection.split('\n\n').map(p => `<p>${p}</p>`),
        `<p><strong>Personalised Prospectus:</strong> <a href="${prospectusUrl}" style="color: #c9a961; text-decoration: none; font-weight: 600;">${prospectusUrl}</a></p>`,
        `<p>With very best wishes,</p>`,
        `<p><strong>Jack Avery</strong><br>
        College Admissions<br>
        Lead on Prep Schools, Sports Professional & Westall Resident Tutor<br>
        Cheltenham College</p>`,
        `<p style="color: #666;">
        <a href="mailto:ja.avery@cheltenhamcollege.org" style="color: #c9a961; text-decoration: none;">ja.avery@cheltenhamcollege.org</a><br>
        +44 (0)1242 265600<br>
        <a href="http://www.cheltenhamcollege.org" style="color: #c9a961; text-decoration: none;">www.cheltenhamcollege.org</a>
        </p>`
    ];

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.7;
            color: #333;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
        }
        .email-wrapper {
            max-width: 650px;
            margin: 20px auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .content {
            padding: 40px;
        }
        p {
            margin: 0 0 16px 0;
            line-height: 1.7;
        }
        a {
            color: #c9a961;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .signature {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="content">
            ${htmlParts.filter(p => p !== '').join('\n            ')}
        </div>
    </div>
</body>
</html>`;

    return {
        to: parentEmail,
        subject: `Welcome to Cheltenham College - ${firstName}'s Personalised Prospectus`,
        textContent,
        htmlContent
    };
}

// ========================================
// SEND EMAIL DRAFT TO JACK
// ========================================
async function sendEmailDraftToJack(enquiryData, prospectusUrl) {
    try {
        const transporter = createEmailTransporter();
        
        // Generate the personalized PARENT email
        const emailContent = generateParentEmailDraft(enquiryData, prospectusUrl);
        
        // Include parent's email in subject so Jack can forward directly
        const parentEmail = enquiryData.email || 'no-email';
        const childFullName = enquiryData.childName || 'Child';
        
        // Send it TO JACK with [DRAFT] prefix, full child name, and parent email
        const info = await transporter.sendMail({
            from: EMAIL_CONFIG.from,
            to: EMAIL_CONFIG.recipient,
            subject: `[DRAFT] ${childFullName} - ${parentEmail}`,
            text: emailContent.textContent,
            html: emailContent.htmlContent
        });

        console.log('✅ Email draft sent to Jack:', info.messageId);
        
        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error('❌ Email sending error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Generate inquiry ID
function generateInquiryId() {
    return 'INQ-' + Date.now().toString() + Math.floor(Math.random() * 1000);
}

// Transform form data
function transformFormData(formData) {
    const stageMap = {
        'lower': 'Lower', '13-14': 'Lower', '13–14': 'Lower',
        'upper': 'Upper', '16-18': 'Upper', '16–18': 'Upper',
        'senior': 'Senior'
    };

    const boardingMap = {
        'full boarding': 'Full Boarding',
        'boarding': 'Full Boarding',
        'boarder': 'Full Boarding',
        'day': 'Day',
        'considering': 'Considering Both',
        'considering both': 'Considering Both'
    };

    const norm = (v = '') => v.toString().trim().toLowerCase();
    const stageIn = formData.stage || 'Lower';
    const stage = stageMap[norm(stageIn)] || (['Lower', 'Upper', 'Senior'].includes(stageIn) ? stageIn : 'Lower');

    const genderRaw = (formData.gender || '').toString().trim().toLowerCase();
    const gender = genderRaw.startsWith('f') ? 'female' : genderRaw.startsWith('m') ? 'male' : '';

    const bpIn = formData.boardingPreference || '';
    const bpNorm = boardingMap[norm(bpIn)] || (['Full Boarding', 'Day', 'Considering Both'].includes(bpIn) ? bpIn : '');

    const toInt = (x, d = 2) => {
        const n = parseInt(x, 10);
        return Number.isFinite(n) ? Math.max(1, Math.min(3, n)) : d;
    };

    return {
        childName: formData.childName || '',
        parentName: formData.parentName || '',
        familyName: formData.familyName || (formData.parentName ? `the ${formData.parentName.split(' ').pop()} family` : ''),
        email: formData.email || '',
        phone: formData.phone || '',
        stage,
        gender,
        boardingPreference: bpNorm,
        academicInterests: Array.isArray(formData.academicInterests) ? formData.academicInterests : (formData.academicInterests ? [formData.academicInterests] : []),
        activities: Array.isArray(formData.activities) ? formData.activities : (formData.activities ? [formData.activities] : []),
        specificSports: Array.isArray(formData.specificSports) ? formData.specificSports : [],
        universityAspirations: formData.universityAspirations || '',
        priorities: {
            academic: toInt(formData.priorities?.academic || formData.academic, 2),
            sports: toInt(formData.priorities?.sports || formData.sports, 2),
            pastoral: toInt(formData.priorities?.pastoral || formData.pastoral, 2),
            activities: toInt(formData.priorities?.activities || formData.activities, 2)
        },
        additionalInfo: formData.additionalInfo || ''
    };
}

function calculateEntryYear(stage) {
    const currentYear = new Date().getFullYear();
    return stage === 'Lower' || stage === 'Upper' ? (currentYear + 1).toString() : currentYear.toString();
}

// SAVE TO DATABASE AND SEND EMAIL
app.post('/api/submit-enquiry', async (req, res) => {
    console.log('=== NEW ENQUIRY RECEIVED ===');
    
    try {
        const enquiryId = generateInquiryId();
        const transformedData = transformFormData(req.body);

        const formData = {
            stage: transformedData.stage,
            gender: transformedData.gender,
            boardingPreference: transformedData.boardingPreference,
            academicInterests: transformedData.academicInterests,
            activities: transformedData.activities,
            specificSports: transformedData.specificSports,
            priorities: transformedData.priorities,
            universityAspirations: transformedData.universityAspirations,
            additionalInfo: transformedData.additionalInfo
        };

        // INSERT with form_entry and entry_year columns
        const query = `
            INSERT INTO inquiries (
                id, first_name, family_surname, parent_email, parent_name,
                contact_number, age_group, entry_year, form_entry, school, form_data,
                created_at, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), $12)
            RETURNING id
        `;

        const values = [
            enquiryId,
            transformedData.childName,
            transformedData.familyName || 'Family',
            transformedData.email,
            transformedData.parentName,
            transformedData.phone,
            transformedData.stage,
            req.body.entryYear || calculateEntryYear(transformedData.stage),
            req.body.formEntry || '',
            'cheltenham',
            JSON.stringify(formData),
            'new'
        ];

        await pool.query(query, values);
        
        console.log(`✅ Saved: ${transformedData.childName} (${transformedData.email})`);
        console.log(`   Form Entry: ${req.body.formEntry || 'N/A'}`);
        console.log(`   Entry Year: ${req.body.entryYear || 'N/A'}`);
        
        // Generate prospectus URL
        const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
        const prospectusUrl = `${baseUrl}/prospectus?id=${enquiryId}`;

        // Generate and store email draft
        try {
            const emailDraft = generateParentEmailDraft({
                id: enquiryId,
                childName: transformedData.childName,
                parentName: transformedData.parentName,
                familyName: transformedData.familyName,
                email: transformedData.email,
                formData: formData
            }, prospectusUrl);
            
            // Save draft to database
            await pool.query(`
                UPDATE inquiries 
                SET 
                    email_subject = $1,
                    email_html_content = $2,
                    email_text_content = $3,
                    email_recipient = $4,
                    prospectus_url = $5,
                    email_status = 'draft'
                WHERE id = $6
            `, [
                emailDraft.subject,
                emailDraft.htmlContent,
                emailDraft.textContent,
                emailDraft.to,
                prospectusUrl,
                enquiryId
            ]);
            
            console.log('✅ Email draft saved to database');
        } catch (emailError) {
            console.error('❌ Email draft save error:', emailError);
        }

        // Send email draft to Jack
        try {
            const emailResult = await sendEmailDraftToJack({
                id: enquiryId,
                childName: transformedData.childName,
                parentName: transformedData.parentName,
                familyName: transformedData.familyName,
                email: transformedData.email,
                stage: transformedData.stage,
                formData: formData
            }, prospectusUrl);
            
            if (emailResult.success) {
                console.log('✅ Email draft sent to Jack');
            } else {
                console.log('⚠️ Email sending failed (draft still saved to database)');
            }
        } catch (emailError) {
            console.error('❌ Email sending error:', emailError);
        }
        
        // Check settings for auto-display
        const settingsResult = await pool.query('SELECT auto_display_prospectus FROM settings WHERE id = 1');
        const autoDisplay = settingsResult.rows.length > 0 ? settingsResult.rows[0].auto_display_prospectus : true;
        
        console.log(`📋 Auto-display setting: ${autoDisplay ? 'ON' : 'OFF'}`);
        
        res.json({
            success: true,
            enquiryId: enquiryId,
            prospectusURL: `/prospectus?id=${enquiryId}`,
            autoDisplay: autoDisplay
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ success: false, error: 'Failed to save enquiry' });
    }
});

// ========================================
// PROTECTED ADMIN ROUTES (REQUIRE AUTH)
// ========================================

// Admin dashboard
app.get('/admin', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Get current settings
app.get('/api/admin/settings', requireAuth, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM settings WHERE id = 1');
        
        if (result.rows.length === 0) {
            await pool.query(`
                INSERT INTO settings (id, auto_display_prospectus) 
                VALUES (1, TRUE)
                ON CONFLICT (id) DO NOTHING
            `);
            return res.json({ 
                success: true, 
                settings: { auto_display_prospectus: true } 
            });
        }
        
        res.json({ 
            success: true, 
            settings: {
                auto_display_prospectus: result.rows[0].auto_display_prospectus
            }
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch settings' });
    }
});

// Update settings
app.post('/api/admin/settings', requireAuth, async (req, res) => {
    try {
        const { auto_display_prospectus } = req.body;
        
        await pool.query(`
            UPDATE settings 
            SET auto_display_prospectus = $1, updated_at = NOW()
            WHERE id = 1
        `, [auto_display_prospectus]);
        
        console.log(`✅ Settings updated: auto_display_prospectus = ${auto_display_prospectus}`);
        
        res.json({ 
            success: true, 
            message: 'Settings updated successfully',
            settings: { auto_display_prospectus }
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ success: false, error: 'Failed to update settings' });
    }
});

// Get all enquiries
app.get('/api/admin/enquiries', requireAuth, async (req, res) => {
    try {
        const query = `
            SELECT 
                id, 
                first_name, 
                family_surname, 
                parent_email, 
                parent_name,
                age_group, 
                entry_year, 
                form_entry,
                form_data->>'boardingPreference' as boarding,
                form_data->'academicInterests' as interests,
                form_data->'activities' as activities,
                form_data->'specificSports' as specific_sports,
                form_data->>'universityAspirations' as university,
                created_at, 
                status
            FROM inquiries
            WHERE school = 'cheltenham'
            ORDER BY created_at DESC
            LIMIT 100
        `;
        
        const result = await pool.query(query);
        res.json({ success: true, total: result.rows.length, enquiries: result.rows });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch enquiries' });
    }
});

// Get email draft for specific enquiry
app.get('/api/admin/email-draft/:id', requireAuth, async (req, res) => {
    try {
        const query = `
            SELECT 
                email_subject,
                email_html_content,
                email_text_content,
                email_recipient,
                prospectus_url,
                email_status
            FROM inquiries
            WHERE id = $1 AND school = 'cheltenham'
        `;
        
        const result = await pool.query(query, [req.params.id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Enquiry not found' });
        }

        const row = result.rows[0];
        
        res.json({
            success: true,
            draft: {
                subject: row.email_subject,
                htmlContent: row.email_html_content,
                textContent: row.email_text_content,
                recipient: row.email_recipient,
                prospectusUrl: row.prospectus_url,
                status: row.email_status
            }
        });
        
    } catch (error) {
        console.error('❌ Error fetching email draft:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch email draft' });
    }
});

// Get open days
app.get('/api/admin/open-days', requireAuth, async (req, res) => {
    try {
        const includePast = req.query.include_past === 'true';
        
        let query = `
            SELECT id, event_name, event_date, event_time, description, booking_url, is_active
            FROM open_days
            WHERE 1=1
        `;
        
        if (!includePast) {
            query += ` AND (event_date >= CURRENT_DATE OR is_active = false)`;
        }
        
        query += ` ORDER BY event_date ASC`;
        
        const result = await pool.query(query);
        
        const openDays = result.rows.map(row => ({
            id: row.id,
            event_name: row.event_name,
            event_date: row.event_date,
            event_time: row.event_time,
            description: row.description,
            booking_url: row.booking_url,
            is_active: row.is_active
        }));
        
        res.json({ success: true, openDays });
    } catch (error) {
        console.error('Error fetching open days:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch open days' });
    }
});

// Create open day
app.post('/api/admin/open-days', requireAuth, async (req, res) => {
    try {
        const { event_name, event_date, event_time, description, booking_url } = req.body;
        
        const result = await pool.query(`
            INSERT INTO open_days (event_name, event_date, event_time, description, booking_url, is_active)
            VALUES ($1, $2, $3, $4, $5, true)
            RETURNING *
        `, [event_name, event_date, event_time || null, description || null, booking_url || null]);
        
        res.json({ success: true, openDay: result.rows[0] });
    } catch (error) {
        console.error('Error creating open day:', error);
        res.status(500).json({ success: false, error: 'Failed to create open day' });
    }
});

// Update open day
app.put('/api/admin/open-days/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { event_name, event_date, event_time, description, booking_url, is_active } = req.body;
        
        const result = await pool.query(`
            UPDATE open_days
            SET 
                event_name = COALESCE($1, event_name),
                event_date = COALESCE($2, event_date),
                event_time = COALESCE($3, event_time),
                description = COALESCE($4, description),
                booking_url = COALESCE($5, booking_url),
                is_active = COALESCE($6, is_active)
            WHERE id = $7
            RETURNING *
        `, [event_name, event_date, event_time, description, booking_url, is_active, id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Open day not found' });
        }
        
        res.json({ success: true, openDay: result.rows[0] });
    } catch (error) {
        console.error('Error updating open day:', error);
        res.status(500).json({ success: false, error: 'Failed to update open day' });
    }
});

// Delete open day (soft delete)
app.delete('/api/admin/open-days/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(`
            UPDATE open_days
            SET is_active = false
            WHERE id = $1
            RETURNING *
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Open day not found' });
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting open day:', error);
        res.status(500).json({ success: false, error: 'Failed to delete open day' });
    }
});

// ========================================
// PUBLIC API ENDPOINTS (NO AUTH)
// ========================================

// GET ENQUIRY FROM DATABASE
app.get('/api/enquiry/:id', async (req, res) => {
    try {
        const query = `
            SELECT 
                id,
                first_name as "childName",
                family_surname as "familyName",
                parent_email as email,
                parent_name as "parentName",
                contact_number as phone,
                form_data,
                created_at
            FROM inquiries
            WHERE id = $1 AND school = 'cheltenham'
        `;
        
        const result = await pool.query(query, [req.params.id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Enquiry not found' });
        }

        const row = result.rows[0];
        const formData = row.form_data || {};
        
        const responseData = {
            id: row.id,
            childName: row.childName,
            familyName: row.familyName,
            parentName: row.parentName,
            email: row.email,
            phone: row.phone,
            stage: formData.stage,
            gender: formData.gender,
            boardingPreference: formData.boardingPreference,
            academicInterests: formData.academicInterests || [],
            activities: formData.activities || [],
            specificSports: formData.specificSports || [],
            priorities: formData.priorities || {},
            universityAspirations: formData.universityAspirations || '',
            additionalInfo: formData.additionalInfo || '',
            timestamp: row.created_at
        };

        res.json({ success: true, data: responseData });
        
    } catch (error) {
        console.error('❌ Error fetching enquiry:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch enquiry' });
    }
});

// Serve prospectus with SERVER-SIDE HANDLEBARS RENDERING
app.get('/prospectus', async (req, res) => {
    const id = req.query.id;
    
    if (!id) {
        return res.status(400).send('Missing inquiry ID');
    }

    try {
        const query = `
            SELECT 
                id, first_name as "childName", family_surname as "familyName",
                parent_email as email, parent_name as "parentName",
                contact_number as phone, form_data, created_at
            FROM inquiries
            WHERE id = $1 AND school = 'cheltenham'
        `;
        
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Enquiry not found');
        }

        const row = result.rows[0];
        const formData = row.form_data || {};
        
        const ctx = {
            id: row.id,
            childName: row.childName || '[Child\'s Name]',
            familyName: row.familyName || '',
            parentName: row.parentName || '',
            email: row.email || '',
            phone: row.phone || '',
            stage: formData.stage || 'Lower',
            gender: formData.gender || '',
            childGender: formData.gender || '',
            boardingPreference: formData.boardingPreference || '',
            academicInterests: formData.academicInterests || [],
            activities: formData.activities || [],
            specificSports: formData.specificSports || [],
            priorities: formData.priorities || {},
            universityAspirations: formData.universityAspirations || '',
            additionalInfo: formData.additionalInfo || '',
            timestamp: row.created_at,
            deeplApiKey: process.env.DEEPL_API_KEY || '',
            jsonContext: JSON.stringify({
                id: row.id,
                childName: row.childName || '[Child\'s Name]',
                familyName: row.familyName || '',
                parentName: row.parentName || '',
                stage: formData.stage || 'Lower',
                gender: formData.gender || '',
                childGender: formData.gender || '',
                boardingPreference: formData.boardingPreference || '',
                academicInterests: formData.academicInterests || [],
                activities: formData.activities || [],
                specificSports: formData.specificSports || [],
                priorities: formData.priorities || {},
                universityAspirations: formData.universityAspirations || ''
            })
        };

        const htmlTemplate = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
        
        Handlebars.registerHelper('eq', (a, b) => a === b);
        Handlebars.registerHelper('includes', (arr, val) => Array.isArray(arr) && arr.includes(val));
        Handlebars.registerHelper('json', (context) => JSON.stringify(context));

        const template = Handlebars.compile(htmlTemplate);
        const html = template(ctx);
        
        res.send(html);
        
    } catch (error) {
        console.error('❌ Error rendering prospectus:', error);
        res.status(500).send('Failed to load prospectus');
    }
});

// Get public open days (for enquiry form)
app.get('/api/open-days', async (req, res) => {
    try {
        const query = `
            SELECT id, event_name, event_date, event_time, description, booking_url
            FROM open_days
            WHERE event_date >= CURRENT_DATE AND is_active = true
            ORDER BY event_date ASC
            LIMIT 10
        `;
        
        const result = await pool.query(query);
        
        const events = result.rows.map(row => ({
            id: row.id,
            name: row.event_name,
            date_iso: row.event_date,
            date_human: new Date(row.event_date).toLocaleDateString('en-GB', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            }),
            time: row.event_time,
            description: row.description,
            booking_link: row.booking_url
        }));
        
        res.json({ success: true, events });
    } catch (error) {
        console.error('Error fetching open days:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch open days' });
    }
});

// Debug endpoint
app.get('/api/debug', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT school, COUNT(*) as count FROM inquiries GROUP BY school
        `);
        res.json({ database: 'connected', schools: result.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`   📝 Enquiry form: http://localhost:${PORT}/`);
    console.log(`   👤 Admin login: http://localhost:${PORT}/admin/login`);
    console.log(`   🔒 Admin dashboard: http://localhost:${PORT}/admin`);
    console.log(`   📄 Prospectus: http://localhost:${PORT}/prospectus?id=YOUR_ID\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Closing database...');
    pool.end(() => process.exit(0));
});

process.on('SIGINT', () => {
    console.log('\nClosing database...');
    pool.end(() => process.exit(0));
});