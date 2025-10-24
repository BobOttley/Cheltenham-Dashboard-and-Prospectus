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

// Force fresh connection pool
pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
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

// Generate session ID
function generateSessionId() {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
        country: formData.country || '',
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
        additionalInfo: formData.additionalInfo || '',
        country: formData.country || 'United Kingdom'
    };
}

function calculateEntryYear(stage) {
    const currentYear = new Date().getFullYear();
    return stage === 'Lower' || stage === 'Upper' ? (currentYear + 1).toString() : currentYear.toString();
}

// Helper function to log activity
async function logActivity(enquiryId, activityType, description, adminEmail = null) {
    try {
        await pool.query(`
            INSERT INTO enquiry_activities (enquiry_id, activity_type, description, admin_email)
            VALUES ($1, $2, $3, $4)
        `, [enquiryId, activityType, description, adminEmail]);
    } catch (error) {
        console.error('Error logging activity:', error);
    }
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

        // INSERT with all columns including new ones
        const query = `
            INSERT INTO inquiries (
                id, first_name, family_surname, parent_email, parent_name,
                contact_number, age_group, entry_year, form_entry, school, form_data,
                created_at, status, priority, email_sent, country
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), $12, $13, $14, $15)
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
            'new',
            false,
            false,
            transformedData.country || 'United Kingdom'
        ];

        await pool.query(query, values);
        
        console.log(`✅ Saved: ${transformedData.childName} (${transformedData.email})`);
        console.log(`   Form Entry: ${req.body.formEntry || 'N/A'}`);
        console.log(`   Entry Year: ${req.body.entryYear || 'N/A'}`);
        
        // Log activity
        await logActivity(enquiryId, 'enquiry_submitted', `Enquiry submitted by ${transformedData.email}`);
        
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
                await logActivity(enquiryId, 'email_sent', 'Email draft sent to admissions team');
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
    // Serve admin-enhanced.html if it exists, otherwise fall back to admin.html
    const enhancedPath = path.join(__dirname, 'admin-enhanced.html');
    const defaultPath = path.join(__dirname, 'admin.html');
    
    if (fs.existsSync(enhancedPath)) {
        res.sendFile(enhancedPath);
    } else {
        res.sendFile(defaultPath);
    }
});

// Recent module activity endpoint - FIXED VERSION
app.get('/api/admin/recent-module-activity', requireAuth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        
        // Get recent sessions with proper grouping
        const result = await pool.query(`
            WITH session_summary AS (
                SELECT 
                    mvs.enquiry_id,
                    mvs.session_id,
                    MIN(mvs.started_at) as session_start,
                    MAX(mvs.last_activity_at) as last_activity,
                    MAX(mvs.ended_at) as ended_at,
                    SUM(mvs.time_spent_seconds) as total_time,
                    COUNT(DISTINCT CASE WHEN mvs.module_name != 'session_start' THEN mvs.module_name END) as modules_viewed,
                    EXTRACT(EPOCH FROM (NOW() - MAX(mvs.last_activity_at))) as seconds_ago
                FROM module_view_sessions mvs
                WHERE mvs.started_at >= NOW() - INTERVAL '24 hours'
                GROUP BY mvs.enquiry_id, mvs.session_id
            )
            SELECT 
                ss.enquiry_id,
                i.family_surname,
                i.first_name,
                ss.session_id,
                ss.last_activity,
                ss.total_time,
                ss.modules_viewed,
                ss.seconds_ago,
                CASE 
                    WHEN ss.ended_at IS NOT NULL THEN 'ended'
                    WHEN ss.seconds_ago > 120 THEN 'idle'
                    ELSE 'viewing'
                END as status
            FROM session_summary ss
            JOIN inquiries i ON ss.enquiry_id = i.id
            ORDER BY ss.last_activity DESC
            LIMIT $1
        `, [limit]);
        
        const activities = result.rows.map(row => ({
            enquiry_id: row.enquiry_id,
            family_surname: row.family_surname,
            first_name: row.first_name,
            session_id: row.session_id,
            last_activity: row.last_activity,
            total_time: parseInt(row.total_time) || 0,
            modules_viewed: parseInt(row.modules_viewed) || 0,
            seconds_ago: parseInt(row.seconds_ago) || 0,
            status: row.status
        }));
        
        res.json({ success: true, activities });
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch recent activity',
            activities: [] 
        });
    }
});

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
                settings: { 
                    auto_display_prospectus: true,
                    email_template: null
                } 
            });
        }
        
        res.json({ 
            success: true, 
            settings: {
                auto_display_prospectus: result.rows[0].auto_display_prospectus,
                email_template: result.rows[0].email_template || null
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
        const { auto_display_prospectus, email_template } = req.body;
        
        let query, values;
        
        if (email_template !== undefined) {
            query = `
                UPDATE settings 
                SET email_template = $1, updated_at = NOW()
                WHERE id = 1
            `;
            values = [email_template];
        } else if (auto_display_prospectus !== undefined) {
            query = `
                UPDATE settings 
                SET auto_display_prospectus = $1, updated_at = NOW()
                WHERE id = 1
            `;
            values = [auto_display_prospectus];
        }
        
        await pool.query(query, values);
        
        console.log(`✅ Settings updated`);
        
        res.json({ 
            success: true, 
            message: 'Settings updated successfully'
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ success: false, error: 'Failed to update settings' });
    }
});

// Get all enquiries with enhanced data
app.get('/api/admin/enquiries', requireAuth, async (req, res) => {
    try {
        const query = `
            SELECT 
                i.id, 
                i.first_name, 
                i.family_surname, 
                i.parent_email, 
                i.parent_name,
                i.contact_number,
                i.country,
                i.age_group, 
                i.entry_year, 
                i.form_entry,
                i.form_data->>'gender' as gender,
                i.form_data->>'boardingPreference' as boarding,
                i.form_data->'academicInterests' as interests,
                i.form_data->'activities' as activities_data,
                i.form_data->'specificSports' as specific_sports,
                i.form_data->>'universityAspirations' as university,
                i.created_at, 
                i.status,
                i.priority,
                i.email_sent,
                i.followup_date,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', n.id,
                            'content', n.content,
                            'author', n.admin_email,
                            'created_at', n.created_at
                        ) ORDER BY n.created_at DESC
                    ) FILTER (WHERE n.id IS NOT NULL),
                    '[]'
                ) as notes
            FROM inquiries i
            LEFT JOIN enquiry_notes n ON i.id = n.enquiry_id
            WHERE i.school = 'cheltenham'
            GROUP BY i.id
            ORDER BY i.created_at DESC
            LIMIT 500
        `;
        
        const result = await pool.query(query);
        res.json({ success: true, total: result.rows.length, enquiries: result.rows });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch enquiries' });
    }
});

// Bulk update enquiries
app.post('/api/admin/enquiries/bulk-update', requireAuth, async (req, res) => {
    try {
        const { ids, status } = req.body;
        const adminEmail = req.session.adminEmail;
        
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, error: 'Invalid enquiry IDs' });
        }
        
        if (!status) {
            return res.status(400).json({ success: false, error: 'Status is required' });
        }
        
        // Update all enquiries
        const query = `
            UPDATE inquiries
            SET status = $1, updated_at = NOW()
            WHERE id = ANY($2::text[])
        `;
        
        await pool.query(query, [status, ids]);
        
        // Log activity for each enquiry
        for (const id of ids) {
            await logActivity(id, 'status_changed', `Status changed to ${status} by admin`, adminEmail);
        }
        
        console.log(`✅ Bulk updated ${ids.length} enquiries to status: ${status}`);
        
        res.json({ success: true, updated: ids.length });
    } catch (error) {
        console.error('Error bulk updating enquiries:', error);
        res.status(500).json({ success: false, error: 'Failed to bulk update enquiries' });
    }
});

// Bulk delete enquiries
app.post('/api/admin/enquiries/bulk-delete', requireAuth, async (req, res) => {
    try {
        const { ids } = req.body;
        const adminEmail = req.session.adminEmail;
        
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, error: 'Invalid enquiry IDs' });
        }
        
        // Log deletion activity before deleting
        for (const id of ids) {
            await logActivity(id, 'enquiry_deleted', `Enquiry permanently deleted by ${adminEmail}`, adminEmail);
        }
        
        // Delete enquiries (CASCADE will delete related notes and activities)
        const query = `
            DELETE FROM inquiries
            WHERE id = ANY($1::text[])
        `;
        
        const result = await pool.query(query, [ids]);
        
        console.log(`✅ Bulk deleted ${result.rowCount} enquiries`);
        
        res.json({ success: true, deleted: result.rowCount });
    } catch (error) {
        console.error('Error bulk deleting enquiries:', error);
        res.status(500).json({ success: false, error: 'Failed to bulk delete enquiries' });
    }
});

// Update single enquiry (status, priority, follow-up, email_sent)
app.patch('/api/admin/enquiries/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, priority, followup_date, email_sent } = req.body;
        const adminEmail = req.session.adminEmail;
        
        const updates = [];
        const values = [];
        let paramCount = 1;
        
        if (status !== undefined) {
            updates.push(`status = $${paramCount++}`);
            values.push(status);
            await logActivity(id, 'status_changed', `Status changed to ${status}`, adminEmail);
        }
        
        if (priority !== undefined) {
            updates.push(`priority = $${paramCount++}`);
            values.push(priority);
            await logActivity(id, 'priority_changed', `Priority ${priority ? 'enabled' : 'disabled'}`, adminEmail);
        }
        
        if (followup_date !== undefined) {
            updates.push(`followup_date = $${paramCount++}`);
            values.push(followup_date);
            if (followup_date) {
                await logActivity(id, 'followup_set', `Follow-up reminder set for ${followup_date}`, adminEmail);
            } else {
                await logActivity(id, 'followup_cleared', 'Follow-up reminder cleared', adminEmail);
            }
        }
        
        if (email_sent !== undefined) {
            updates.push(`email_sent = $${paramCount++}`);
            values.push(email_sent);
            if (email_sent) {
                await logActivity(id, 'email_sent', 'Email sent to parent', adminEmail);
            }
        }
        
        if (updates.length === 0) {
            return res.status(400).json({ success: false, error: 'No fields to update' });
        }
        
        updates.push(`updated_at = NOW()`);
        values.push(id);
        
        const query = `
            UPDATE inquiries
            SET ${updates.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `;
        
        const result = await pool.query(query, values);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Enquiry not found' });
        }
        
        res.json({ success: true, enquiry: result.rows[0] });
    } catch (error) {
        console.error('Error updating enquiry:', error);
        res.status(500).json({ success: false, error: 'Failed to update enquiry' });
    }
});

// Delete single enquiry
app.delete('/api/admin/enquiries/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const adminEmail = req.session.adminEmail;
        
        // Check if enquiry exists
        const checkQuery = 'SELECT first_name, family_surname FROM inquiries WHERE id = $1';
        const checkResult = await pool.query(checkQuery, [id]);
        
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Enquiry not found' });
        }
        
        const enquiry = checkResult.rows[0];
        
        // Log deletion activity before deleting
        await logActivity(id, 'enquiry_deleted', `Enquiry for ${enquiry.first_name} ${enquiry.family_surname} permanently deleted by ${adminEmail}`, adminEmail);
        
        // Delete enquiry (CASCADE will delete related notes and activities)
        const deleteQuery = 'DELETE FROM inquiries WHERE id = $1';
        await pool.query(deleteQuery, [id]);
        
        console.log(`✅ Deleted enquiry: ${id} (${enquiry.first_name} ${enquiry.family_surname})`);
        
        res.json({ success: true, message: 'Enquiry deleted successfully' });
    } catch (error) {
        console.error('Error deleting enquiry:', error);
        res.status(500).json({ success: false, error: 'Failed to delete enquiry' });
    }
});

// Add note to enquiry
app.post('/api/admin/enquiries/:id/notes', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const adminEmail = req.session.adminEmail;
        
        if (!content || content.trim().length === 0) {
            return res.status(400).json({ success: false, error: 'Note content is required' });
        }
        
        const query = `
            INSERT INTO enquiry_notes (enquiry_id, content, admin_email)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        
        const result = await pool.query(query, [id, content.trim(), adminEmail]);
        
        await logActivity(id, 'note_added', 'Admin note added', adminEmail);
        
        res.json({ success: true, note: result.rows[0] });
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ success: false, error: 'Failed to add note' });
    }
});

// Get activity log for enquiry
app.get('/api/admin/enquiries/:id/activities', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
            SELECT id, activity_type, description, admin_email, created_at
            FROM enquiry_activities
            WHERE enquiry_id = $1
            ORDER BY created_at DESC
            LIMIT 50
        `;
        
        const result = await pool.query(query, [id]);
        
        res.json({ success: true, activities: result.rows });
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch activities' });
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

// ========================================
// ENHANCED MODULE TRACKING - FIXED VERSION
// ========================================

// Start a new viewing session - FIXED VERSION
app.post('/api/session/start', async (req, res) => {
    const { enquiryId } = req.body;
    
    if (!enquiryId) {
        return res.status(400).json({ success: false, error: 'Missing enquiry ID' });
    }

    try {
        const sessionId = generateSessionId();
        const userAgent = req.headers['user-agent'] || 'Unknown';

        // Create initial session record in module_view_sessions table
        await pool.query(`
            INSERT INTO module_view_sessions (
                enquiry_id,
                module_name,
                session_id,
                started_at,
                last_activity_at,
                time_spent_seconds,
                scroll_depth_percent,
                user_agent
            ) VALUES ($1, 'session_start', $2, NOW(), NOW(), 0, 0, $3)
        `, [enquiryId, sessionId, userAgent]);

        // Mark prospectus as opened and increment session count
        await pool.query(`
            UPDATE inquiries 
            SET 
                prospectus_opened = TRUE,
                prospectus_opened_at = COALESCE(prospectus_opened_at, NOW()),
                total_sessions = COALESCE(total_sessions, 0) + 1,
                last_session_at = NOW()
            WHERE id = $1
        `, [enquiryId]);

        console.log(`📖 Session started: ${enquiryId} (${sessionId})`);

        res.json({ 
            success: true, 
            sessionId: sessionId 
        });
    } catch (error) {
        console.error('Error starting session:', error);
        res.status(500).json({ success: false, error: 'Failed to start session' });
    }
});

// Track module visit - FIXED VERSION
app.post('/api/track-module-visit', async (req, res) => {
    const { enquiryId, moduleName, sessionId, visitNumber, timeSpentSeconds, scrollDepth } = req.body;
    
    if (!enquiryId || !moduleName || !sessionId) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    try {
        // Store in module_visits table (for individual visit tracking)
        await pool.query(`
            INSERT INTO module_visits (
                enquiry_id, 
                module_name, 
                session_id, 
                visit_number,
                time_spent_seconds, 
                scroll_depth_percent,
                viewed_at
            ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
        `, [enquiryId, moduleName, sessionId, visitNumber, timeSpentSeconds || 0, scrollDepth || 0]);

        // Also store/update in module_view_sessions for session tracking
        await pool.query(`
            INSERT INTO module_view_sessions (
                enquiry_id,
                module_name,
                session_id,
                started_at,
                last_activity_at,
                time_spent_seconds,
                scroll_depth_percent,
                user_agent
            ) VALUES ($1, $2, $3, NOW(), NOW(), $4, $5, $6)
            ON CONFLICT (enquiry_id, module_name, session_id)
            DO UPDATE SET
                last_activity_at = NOW(),
                time_spent_seconds = EXCLUDED.time_spent_seconds,
                scroll_depth_percent = GREATEST(module_view_sessions.scroll_depth_percent, EXCLUDED.scroll_depth_percent)
        `, [enquiryId, moduleName, sessionId, timeSpentSeconds || 0, scrollDepth || 0, 'Unknown']);

        // Update aggregate in module_views table
        await pool.query(`
            INSERT INTO module_views (
                enquiry_id, 
                module_name, 
                total_view_count,
                total_time_spent_seconds,
                first_viewed_at,
                last_viewed_at
            ) VALUES ($1, $2, 1, $3, NOW(), NOW())
            ON CONFLICT (enquiry_id, module_name) 
            DO UPDATE SET 
                total_view_count = module_views.total_view_count + 1,
                total_time_spent_seconds = module_views.total_time_spent_seconds + $3,
                last_viewed_at = NOW()
        `, [enquiryId, moduleName, timeSpentSeconds || 0]);

        // Update aggregate in inquiries table
        await pool.query(`
            UPDATE inquiries
            SET modules_viewed = 
                CASE 
                    WHEN modules_viewed IS NULL THEN jsonb_build_object($2::text, 1)
                    WHEN modules_viewed ? $2::text THEN jsonb_set(modules_viewed, ARRAY[$2::text], to_jsonb((modules_viewed->>$2::text)::int + 1))
                    ELSE modules_viewed || jsonb_build_object($2::text, 1)
                END,
                prospectus_opened = TRUE,
                prospectus_opened_at = COALESCE(prospectus_opened_at, NOW())
            WHERE id = $1
        `, [enquiryId, moduleName]);

        console.log(`✅ Tracked: ${moduleName} for ${enquiryId} (visit #${visitNumber}, ${timeSpentSeconds}s)`);
        res.json({ success: true });
    } catch (error) {
        console.error('Error tracking module visit:', error);
        res.status(500).json({ success: false, error: 'Failed to track module visit' });
    }
});

// Update module activity (heartbeat) - FIXED VERSION
app.post('/api/session/module-activity', async (req, res) => {
    const { enquiryId, moduleName, sessionId, visitNumber, timeSpentSeconds, scrollDepth } = req.body;
    
    if (!enquiryId || !moduleName || !sessionId) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    try {
        // Update module_visits
        await pool.query(`
            UPDATE module_visits
            SET 
                time_spent_seconds = $5,
                scroll_depth_percent = $6,
                updated_at = NOW()
            WHERE enquiry_id = $1 
                AND module_name = $2 
                AND session_id = $3
                AND visit_number = $4
        `, [enquiryId, moduleName, sessionId, visitNumber, timeSpentSeconds, scrollDepth]);

        // Update module_view_sessions for real-time tracking
        await pool.query(`
            UPDATE module_view_sessions
            SET 
                last_activity_at = NOW(),
                time_spent_seconds = $4,
                scroll_depth_percent = GREATEST(scroll_depth_percent, $5)
            WHERE enquiry_id = $1 
                AND module_name = $2 
                AND session_id = $3
                AND ended_at IS NULL
        `, [enquiryId, moduleName, sessionId, timeSpentSeconds, scrollDepth || 0]);

        // Update total time in inquiries table
        await pool.query(`
            UPDATE inquiries
            SET total_time_spent_seconds = (
                SELECT COALESCE(SUM(time_spent_seconds), 0)
                FROM module_view_sessions
                WHERE enquiry_id = $1
            )
            WHERE id = $1
        `, [enquiryId]);

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating module activity:', error);
        res.status(500).json({ success: false, error: 'Failed to update activity' });
    }
});

// End session - FIXED VERSION
app.post('/api/session/end', async (req, res) => {
    const { sessionId } = req.body;
    
    if (!sessionId) {
        return res.status(400).json({ success: false, error: 'Missing session ID' });
    }

    try {
        // Mark all module_view_sessions records as ended
        await pool.query(`
            UPDATE module_view_sessions
            SET ended_at = NOW()
            WHERE session_id = $1 AND ended_at IS NULL
        `, [sessionId]);

        console.log(`📚 Session ended: ${sessionId}`);
        res.json({ success: true });
    } catch (error) {
        console.error('Error ending session:', error);
        res.status(500).json({ success: false, error: 'Failed to end session' });
    }
});

// Track interaction (Phase 2)
app.post('/api/track-interaction', async (req, res) => {
    const { enquiryId, sessionId, moduleName, interactionType, details, timestamp } = req.body;
    
    if (!enquiryId || !sessionId || !moduleName || !interactionType) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    try {
        await pool.query(`
            INSERT INTO module_interactions (
                enquiry_id,
                session_id,
                module_name,
                interaction_type,
                details,
                interacted_at
            ) VALUES ($1, $2, $3, $4, $5, to_timestamp($6::bigint / 1000.0))
        `, [enquiryId, sessionId, moduleName, interactionType, details, timestamp]);

        console.log(`🎯 Interaction: ${moduleName} → ${interactionType} → ${details}`);
        res.json({ success: true });
    } catch (error) {
        console.error('Error tracking interaction:', error);
        res.status(500).json({ success: false, error: 'Failed to track interaction' });
    }
});

// Enhanced admin analytics - FIXED VERSION
app.get('/api/admin/module-analytics-enhanced', requireAuth, async (req, res) => {
    try {
        // Top modules by views and time
        const modulesResult = await pool.query(`
            SELECT 
                mv.module_name,
                COUNT(DISTINCT mv.enquiry_id) as unique_viewers,
                SUM(mv.total_view_count) as total_views,
                SUM(mv.total_time_spent_seconds) as total_time_spent_seconds,
                ROUND(AVG(mv.total_time_spent_seconds)::numeric, 2) as avg_time_seconds
            FROM module_views mv
            GROUP BY mv.module_name
            ORDER BY total_views DESC
        `);

        // Overall engagement stats
        const engagementStats = await pool.query(`
            SELECT 
                COUNT(*) as total_enquiries,
                COUNT(CASE WHEN prospectus_opened = TRUE THEN 1 END) as opened_count,
                ROUND(
                    COALESCE(
                        (COUNT(CASE WHEN prospectus_opened = TRUE THEN 1 END)::DECIMAL / 
                        NULLIF(COUNT(*), 0) * 100),
                        0
                    ),
                    2
                ) as open_rate,
                SUM(COALESCE(total_sessions, 0)) as total_sessions,
                SUM(COALESCE(total_time_spent_seconds, 0)) as total_time_seconds,
                ROUND(
                    AVG(COALESCE(total_time_spent_seconds, 0))::numeric, 2
                ) as avg_time_per_user
            FROM inquiries
            WHERE school = 'cheltenham'
        `);
        
        // Calculate total module views
        const moduleViewsResult = await pool.query(`
            SELECT COALESCE(SUM(total_view_count), 0) as total_module_views
            FROM module_views
        `);

        // Timeline data (last 30 days)
        const timelineResult = await pool.query(`
            SELECT 
                DATE(started_at) as date,
                COUNT(DISTINCT session_id) as sessions,
                COUNT(DISTINCT enquiry_id) as unique_viewers
            FROM module_view_sessions
            WHERE started_at >= NOW() - INTERVAL '30 days'
            GROUP BY DATE(started_at)
            ORDER BY date DESC
        `);

        // Active sessions - FIXED QUERY
        const activeSessionsResult = await pool.query(`
            WITH latest_sessions AS (
                SELECT 
                    mvs.enquiry_id,
                    mvs.session_id,
                    MIN(mvs.started_at) as session_start,
                    MAX(mvs.last_activity_at) as last_activity_at,
                    MAX(mvs.ended_at) as ended_at,
                    SUM(mvs.time_spent_seconds) as time_spent_seconds,
                    COUNT(DISTINCT CASE WHEN mvs.module_name != 'session_start' THEN mvs.module_name END) as modules_viewing
                FROM module_view_sessions mvs
                WHERE mvs.last_activity_at >= NOW() - INTERVAL '5 minutes'
                GROUP BY mvs.enquiry_id, mvs.session_id
            )
            SELECT 
                ls.enquiry_id,
                COALESCE(i.family_surname, 'Unknown') || ' Family' as viewer_name,
                ls.session_id,
                ls.time_spent_seconds,
                ls.last_activity_at,
                EXTRACT(EPOCH FROM (NOW() - ls.last_activity_at)) as seconds_since_activity,
                ls.modules_viewing,
                CASE 
                    WHEN ls.ended_at IS NOT NULL THEN 'ended'
                    WHEN EXTRACT(EPOCH FROM (NOW() - ls.last_activity_at)) > 120 THEN 'idle'
                    ELSE 'active'
                END as session_status
            FROM latest_sessions ls
            JOIN inquiries i ON ls.enquiry_id = i.id
            WHERE ls.ended_at IS NULL OR ls.last_activity_at >= NOW() - INTERVAL '5 minutes'
            ORDER BY ls.last_activity_at DESC
        `);

        // Time distribution
        const timeDistResult = await pool.query(`
            WITH time_ranges AS (
                SELECT 
                    CASE 
                        WHEN total_time_spent_seconds < 60 THEN '< 1 min'
                        WHEN total_time_spent_seconds < 180 THEN '1-3 min'
                        WHEN total_time_spent_seconds < 300 THEN '3-5 min'
                        WHEN total_time_spent_seconds < 600 THEN '5-10 min'
                        ELSE '10+ min'
                    END as time_range,
                    CASE 
                        WHEN total_time_spent_seconds < 60 THEN 1
                        WHEN total_time_spent_seconds < 180 THEN 2
                        WHEN total_time_spent_seconds < 300 THEN 3
                        WHEN total_time_spent_seconds < 600 THEN 4
                        ELSE 5
                    END as sort_order
                FROM inquiries
                WHERE prospectus_opened = TRUE AND total_time_spent_seconds > 0
            )
            SELECT time_range, COUNT(*) as user_count
            FROM time_ranges
            GROUP BY time_range, sort_order
            ORDER BY sort_order
        `);

        const stats = engagementStats.rows[0];
        const totalModuleViews = moduleViewsResult.rows[0].total_module_views;

        res.json({
            success: true,
            topModules: modulesResult.rows.map(row => ({
                module_name: row.module_name,
                unique_viewers: parseInt(row.unique_viewers) || 0,
                total_views: parseInt(row.total_views) || 0,
                total_time_spent_seconds: parseInt(row.total_time_spent_seconds) || 0,
                avg_time_seconds: parseFloat(row.avg_time_seconds) || 0
            })),
            engagementStats: {
                total_enquiries: parseInt(stats.total_enquiries) || 0,
                opened_count: parseInt(stats.opened_count) || 0,
                open_rate: parseFloat(stats.open_rate) || 0,
                total_sessions: parseInt(stats.total_sessions) || 0,
                total_time_seconds: parseInt(stats.total_time_seconds) || 0,
                avg_time_per_user: parseFloat(stats.avg_time_per_user) || 0,
                total_module_views: parseInt(totalModuleViews) || 0
            },
            timeline: timelineResult.rows.map(row => ({
                date: row.date,
                sessions: parseInt(row.sessions) || 0,
                unique_viewers: parseInt(row.unique_viewers) || 0
            })),
            activeSessions: activeSessionsResult.rows.map(row => ({
                enquiry_id: row.enquiry_id,
                viewer_name: row.viewer_name,
                session_id: row.session_id,
                time_spent_seconds: parseInt(row.time_spent_seconds) || 0,
                last_activity_at: row.last_activity_at,
                seconds_since_activity: parseInt(row.seconds_since_activity) || 0,
                modules_viewing: parseInt(row.modules_viewing) || 0,
                session_status: row.session_status
            })),
            timeDistribution: timeDistResult.rows.map(row => ({
                time_range: row.time_range,
                user_count: parseInt(row.user_count) || 0
            }))
        });
    } catch (error) {
        console.error('Error fetching enhanced analytics:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch analytics',
            details: error.message 
        });
    }
});

// Get session history for an enquiry
app.get('/api/enquiry/:id/sessions', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                session_id,
                MIN(started_at) as started_at,
                MAX(ended_at) as ended_at,
                COUNT(DISTINCT module_name) as modules_viewed,
                SUM(time_spent_seconds) as total_time,
                MAX(last_activity_at) as last_activity,
                BOOL_OR(was_idle) as was_idle
            FROM module_view_sessions
            WHERE enquiry_id = $1
            GROUP BY session_id
            ORDER BY started_at DESC
        `, [req.params.id]);

        res.json({ 
            success: true, 
            sessions: result.rows 
        });
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch sessions' });
    }
});

// Get detailed module views
app.get('/api/enquiry/:id/modules-detailed', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                mv.module_name,
                mv.total_view_count,
                mv.total_time_spent_seconds,
                mv.first_viewed_at,
                mv.last_viewed_at,
                COUNT(DISTINCT mvs.session_id) as session_count,
                AVG(mvs.scroll_depth_percent) as avg_scroll_depth
            FROM module_views mv
            LEFT JOIN module_view_sessions mvs 
                ON mv.enquiry_id = mvs.enquiry_id 
                AND mv.module_name = mvs.module_name
            WHERE mv.enquiry_id = $1
            GROUP BY mv.module_name, mv.total_view_count, mv.total_time_spent_seconds, 
                     mv.first_viewed_at, mv.last_viewed_at
            ORDER BY mv.last_viewed_at DESC
        `, [req.params.id]);

        res.json({ success: true, modules: result.rows });
    } catch (error) {
        console.error('Error fetching modules:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch modules' });
    }
});

// Get detailed visit history for an enquiry
app.get('/api/enquiry/:id/visit-history', async (req, res) => {
    const { id } = req.params;
    
    try {
        // Get all visits grouped by module
        const result = await pool.query(`
            SELECT 
                module_name,
                COUNT(*) as total_visits,
                SUM(time_spent_seconds) as total_time_seconds,
                AVG(time_spent_seconds) as avg_time_per_visit,
                MAX(scroll_depth_percent) as max_scroll_depth,
                MIN(viewed_at) as first_viewed_at,
                MAX(viewed_at) as last_viewed_at,
                json_agg(
                    json_build_object(
                        'visit_number', visit_number,
                        'time_spent', time_spent_seconds,
                        'scroll_depth', scroll_depth_percent,
                        'viewed_at', viewed_at
                    ) ORDER BY viewed_at DESC
                ) as visits
            FROM module_visits
            WHERE enquiry_id = $1
            GROUP BY module_name
            ORDER BY last_viewed_at DESC
        `, [id]);

        res.json({ 
            success: true, 
            modules: result.rows 
        });
    } catch (error) {
        console.error('Error fetching visit history:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch visit history' });
    }
});

// Get interaction history for an enquiry
app.get('/api/enquiry/:id/interactions', async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(`
            SELECT 
                module_name,
                interaction_type,
                details,
                interacted_at,
                COUNT(*) OVER (PARTITION BY module_name, interaction_type) as interaction_count
            FROM module_interactions
            WHERE enquiry_id = $1
            ORDER BY interacted_at DESC
            LIMIT 100
        `, [id]);

        res.json({ 
            success: true, 
            interactions: result.rows 
        });
    } catch (error) {
        console.error('Error fetching interactions:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch interactions' });
    }
});

// Get interaction analytics for admin dashboard
app.get('/api/admin/interaction-analytics', requireAuth, async (req, res) => {
    try {
        // Top interactions by module
        const topInteractions = await pool.query(`
            SELECT 
                module_name,
                interaction_type,
                COUNT(*) as interaction_count,
                COUNT(DISTINCT enquiry_id) as unique_users
            FROM module_interactions
            WHERE interacted_at > NOW() - INTERVAL '30 days'
            GROUP BY module_name, interaction_type
            ORDER BY interaction_count DESC
            LIMIT 20
        `);

        // House system specific analytics
        const houseAnalytics = await pool.query(`
            SELECT 
                details as house_name,
                COUNT(*) FILTER (WHERE interaction_type = 'house_expand') as expansions,
                COUNT(*) FILTER (WHERE interaction_type = 'video_unmute') as video_plays,
                COUNT(DISTINCT enquiry_id) as unique_viewers
            FROM module_interactions
            WHERE module_name = 'house_system'
                AND interacted_at > NOW() - INTERVAL '30 days'
            GROUP BY details
            ORDER BY expansions DESC
        `);

        res.json({
            success: true,
            topInteractions: topInteractions.rows,
            houseAnalytics: houseAnalytics.rows
        });
    } catch (error) {
        console.error('Error fetching interaction analytics:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
    }
});

// Cleanup idle sessions
app.post('/api/admin/cleanup-idle-sessions', requireAuth, async (req, res) => {
    try {
        // Mark sessions as idle if no activity for 5+ minutes and not already ended
        const result = await pool.query(`
            UPDATE module_view_sessions
            SET 
                ended_at = last_activity_at + INTERVAL '5 minutes',
                was_idle = TRUE
            WHERE ended_at IS NULL
                AND last_activity_at < NOW() - INTERVAL '5 minutes'
            RETURNING session_id
        `);

        console.log(`🧹 Cleaned up ${result.rowCount} idle sessions`);
        
        res.json({ 
            success: true, 
            cleaned: result.rowCount 
        });
    } catch (error) {
        console.error('Error cleaning up sessions:', error);
        res.status(500).json({ success: false, error: 'Failed to cleanup sessions' });
    }
});

// Auto-cleanup every 5 minutes
setInterval(async () => {
    try {
        const result = await pool.query(`
            UPDATE module_view_sessions
            SET 
                ended_at = last_activity_at + INTERVAL '5 minutes',
                was_idle = TRUE
            WHERE ended_at IS NULL
                AND last_activity_at < NOW() - INTERVAL '5 minutes'
        `);
        
        if (result.rowCount > 0) {
            console.log(`🧹 Auto-cleanup: Marked ${result.rowCount} sessions as idle`);
        }
    } catch (error) {
        console.error('Auto-cleanup error:', error);
    }
}, 5 * 60 * 1000); // Every 5 minutes

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
        
        // Log prospectus view
        await logActivity(id, 'prospectus_viewed', 'Prospectus page viewed');
        
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
    console.log(`   📊 Admin dashboard: http://localhost:${PORT}/admin`);
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