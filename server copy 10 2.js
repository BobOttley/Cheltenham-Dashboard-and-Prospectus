require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const Handlebars = require('handlebars');
const fs = require('fs');
const app = express();
const Anthropic = require('@anthropic-ai/sdk');
const smartReplyRoutes = require('./routes/smartReply');
const contactsRoutes = require('./routes/contacts');
const msauthRoutes = require('./routes/msauth');

// Test Microsoft Graph Service initialization
try {
    const graphService = require('./services/microsoftGraphService');
    console.log('✅ Microsoft Graph Service loaded');
} catch (error) {
    console.error('❌ Microsoft Graph Service failed:', error.message);
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

// Serve static files
app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/api/smart-reply', smartReplyRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/msauth', msauthRoutes);
// Use environment port or fallback to 3000
const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

app.locals.pool = pool;

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
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
        sameSite: 'lax',
        path: '/'
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
        
        console.log('📊 Fetching recent activity...');
        
        // Fixed query with correct column names for frontend
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
                    WHEN ss.seconds_ago < 120 THEN 'viewing'
                    ELSE 'ended'
                END as status
            FROM session_summary ss
            JOIN inquiries i ON ss.enquiry_id = i.id
            ORDER BY ss.last_activity DESC
            LIMIT $1
        `, [limit]);
        
        console.log(`✅ Found ${result.rows.length} unique sessions`);
        
        // Format response to match what admin.html expects
        const activities = result.rows.map(row => ({
            enquiry_id: row.enquiry_id,
            family_surname: row.family_surname,      // ✓ This is what frontend expects
            first_name: row.first_name,
            session_id: row.session_id,
            last_activity_at: row.last_activity,
            total_time: parseInt(row.total_time) || 0,
            modules_viewed: parseInt(row.modules_viewed) || 0,
            seconds_ago: Math.floor(row.seconds_ago),
            status: row.status
        }));
        
        res.json({
            success: true,
            activities: activities
        });
        
    } catch (error) {
        console.error('❌ Error fetching recent activity:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch recent activity',
            details: error.message 
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
                i.previous_status,
                i.priority,
                i.email_sent,
                i.followup_date,
                i.prospectus_opened,
                i.total_sessions,
                i.total_time_spent_seconds,
                i.modules_viewed,
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

/**
 * Generate bulk emails using Claude API
 * POST /api/bulk-generate-emails
 */
app.post('/api/bulk-generate-emails', requireAuth, async (req, res) => {
    try {
        const { enquiryIds, templateType } = req.body;
        
        if (!enquiryIds || !Array.isArray(enquiryIds) || enquiryIds.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid enquiry IDs' 
            });
        }
        
        if (!templateType) {
            return res.status(400).json({ 
                success: false, 
                error: 'Template type is required' 
            });
        }
        
        console.log(`Generating ${enquiryIds.length} emails using template: ${templateType}`);
        
        // Fetch all enquiries from database
        const enquiriesQuery = `
            SELECT * FROM inquiries 
            WHERE id = ANY($1::text[])
        `;
        const enquiriesResult = await pool.query(enquiriesQuery, [enquiryIds]);
        const enquiries = enquiriesResult.rows;
        
        if (enquiries.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'No enquiries found' 
            });
        }
        
        // Generate emails for each enquiry
        const generatedEmails = [];
        
        for (const enquiry of enquiries) {
            try {
                const email = await generateSingleEmail(enquiry, templateType);
                generatedEmails.push(email);
            } catch (error) {
                console.error(`Error generating email for enquiry ${enquiry.id}:`, error);
                // Add a fallback email if generation fails
                generatedEmails.push({
                    enquiryId: enquiry.id,
                    to: enquiry.parent_email,
                    childName: enquiry.first_name,
                    subject: `Regarding ${enquiry.first_name}'s Application`,
                    content: `Error generating personalized email. Please write manually.`,
                    attachments: [],
                    error: error.message
                });
            }
        }
        
        res.json({ 
            success: true, 
            emails: generatedEmails 
        });
        
    } catch (error) {
        console.error('Error in bulk email generation:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to generate emails: ' + error.message 
        });
    }
});

/**
 * Send bulk emails individually
 * POST /api/send-bulk-emails
 */
app.post('/api/send-bulk-emails', requireAuth, async (req, res) => {
    try {
        const { emails } = req.body;
        
        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'No emails to send' 
            });
        }
        
        console.log(`Sending ${emails.length} emails...`);
        
        let sentCount = 0;
        const failedEmails = [];
        
        for (const email of emails) {
            try {
                // Send email using existing nodemailer setup
                await transporter.sendMail({
                    from: process.env.SCHOOL_ADMISSIONS_EMAIL,
                    to: email.to,
                    subject: email.subject,
                    html: email.content,
                    // Note: attachments would need to be handled if you want to send PDFs
                });
                
                sentCount++;
                
                // Update enquiry status
                if (email.enquiryId) {
                    await pool.query(`
                        UPDATE inquiries 
                        SET status = 'contacted', 
                            updated_at = NOW()
                        WHERE id = $1
                    `, [email.enquiryId]);
                    
                    // Log activity
                    const activityLog = `Email sent: "${email.subject}"`;
                    await pool.query(`
                        UPDATE inquiries 
                        SET activity_log = COALESCE(activity_log, '') || $1 || E'\n'
                        WHERE id = $2
                    `, [activityLog, email.enquiryId]);
                }
                
            } catch (error) {
                console.error(`Failed to send email to ${email.to}:`, error);
                failedEmails.push({
                    to: email.to,
                    error: error.message
                });
            }
        }
        
        // Return results
        res.json({ 
            success: true, 
            sent: sentCount,
            failed: failedEmails.length,
            failedEmails: failedEmails
        });
        
    } catch (error) {
        console.error('Error in bulk email sending:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send emails: ' + error.message 
        });
    }
});

/**
 * Generate a single email using Claude API
 * @param {Object} enquiry - Enquiry data from database
 * @param {string} templateType - Type of email template
 * @returns {Object} - Generated email object
 */
async function generateSingleEmail(enquiry, templateType) {
    // Search knowledge base for relevant content
    const relevantContent = await searchKnowledgeBase(enquiry);
    
    // Load static QA and URL mappings
    const { qaData, urlMappings } = loadStaticKnowledge();
    
    // Get relevant PDFs (NOW PASSING TEMPLATE TYPE)
    const relevantPDFs = getRelevantPDFs(enquiry, templateType);
    
    // Get template instructions
    const templateInstructions = await getTemplateInstructions(templateType, enquiry);
    
    // Build the prompt for Claude (NOW PASSING qaData and urlMappings)
    const prompt = buildEmailPrompt(enquiry, templateType, templateInstructions, relevantContent, relevantPDFs, qaData, urlMappings);
    
    console.log(`Calling Claude API for ${enquiry.first_name}...`);
    
    // Call Claude API
    const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{
            role: 'user',
            content: prompt
        }]
    });
    
    let emailContent = message.content[0].text;

    // Remove markdown code blocks
    emailContent = emailContent.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();

    // Strip any HTML/body wrappers from Claude
    emailContent = emailContent
        .replace(/<html[^>]*>/gi, '')
        .replace(/<\/html>/gi, '')
        .replace(/<body[^>]*>/gi, '')
        .replace(/<\/body>/gi, '')
        .replace(/<div[^>]*>/gi, '')
        .replace(/<\/div>/gi, '');

    // Fix malformed links - handle all variations
    emailContent = emailContent
        // Fix: <a href=""url"" style="..."> -> <a href="url">
        .replace(/<a\s+href=""([^"]+)""\s+style="[^"]*">/gi, '<a href="$1">')
        // Fix: <a href="url style="..."> -> <a href="url">
        .replace(/<a\s+href="([^"]+)\s+style="[^"]*">/gi, '<a href="$1">')
        // Fix: <a href=url> -> <a href="url">
        .replace(/<a\s+href=([^\s>]+)>/gi, '<a href="$1">')
        // Fix: <a href="url> (missing closing quote)
        .replace(/<a\s+href="([^"]+)>/gi, '<a href="$1">')
        // Remove any remaining style attributes from links
        .replace(/(<a\s+href="[^"]+)"[^>]*>/gi, '$1">')
        // Convert <br> to <br/>
        .replace(/<br>/gi, '<br/>')
        // Remove empty paragraphs: <p></p> or <p> </p> or <p>\n</p>
        .replace(/<p>\s*<\/p>/gi, '')
        // Remove paragraphs with only <br/>
        .replace(/<p>\s*<br\/>\s*<\/p>/gi, '')
        // Remove excessive whitespace between tags
        .replace(/>\s+</g, '><')
        // Add back single space after closing tags for readability
        .replace(/><p>/g, '>\n<p>')
        .replace(/><\/p>/g, '></p>\n')
        .trim();

    // Wrap in minimal clean structure
    emailContent = `<div style="font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.5;">
${emailContent}
</div>`;
    
    return {
        enquiryId: enquiry.id,
        to: enquiry.parent_email,
        childName: enquiry.first_name,
        subject: generateEmailSubject(enquiry, templateType),
        content: emailContent,
        attachments: relevantPDFs
    };
}

/**
 * Search knowledge base (chunks.jsonl) for relevant content
 * @param {Object} enquiry - Enquiry data
 * @returns {Array} - Array of relevant text chunks
 */
async function searchKnowledgeBase(enquiry) {
    try {
        const chunksPath = path.join(__dirname, 'chunks.jsonl');
        
        // Check if file exists
        if (!fs.existsSync(chunksPath)) {
            console.log('⚠️ chunks.jsonl not found, skipping knowledge base search');
            return [];
        }
        
        // Read chunks.jsonl
        const fileContent = fs.readFileSync(chunksPath, 'utf8');
        const lines = fileContent.split('\n').filter(line => line.trim());
        const chunks = lines.map(line => JSON.parse(line));
        
        // Extract keywords from enquiry
        const formData = enquiry.form_data || {};
        const keywords = [];
        
        // Add academic interests
        if (formData.academicInterests) {
            keywords.push(...formData.academicInterests.map(i => i.toLowerCase()));
        }
        
        // Add activities
        if (formData.activities) {
            keywords.push(...formData.activities.map(a => a.toLowerCase()));
        }
        
        // Add specific sports
        if (formData.specificSports) {
            keywords.push(...formData.specificSports.map(s => s.toLowerCase()));
        }
        
        // Add boarding if relevant
        if (formData.boardingPreference && formData.boardingPreference !== 'Day') {
            keywords.push('boarding', 'house', 'pastoral');
        }
        
        // Add stage/age group
        if (enquiry.age_group) {
            keywords.push(enquiry.age_group.toLowerCase());
        }
        
        // Search chunks for matching keywords
        const relevantChunks = chunks
            .map(chunk => {
                const text = chunk.text.toLowerCase();
                const matchCount = keywords.filter(keyword => text.includes(keyword)).length;
                return { ...chunk, matchCount };
            })
            .filter(chunk => chunk.matchCount > 0)
            .sort((a, b) => b.matchCount - a.matchCount)
            .slice(0, 5); // Top 5 most relevant chunks
        
        console.log(`✅ Found ${relevantChunks.length} relevant chunks from knowledge base`);
        return relevantChunks;
        
    } catch (error) {
        console.error('❌ Error searching knowledge base:', error);
        return [];
    }
}

/**
 * Load static QA and URL mappings from Python config files
 * @returns {Object} - { qaData, urlMappings }
 */
function loadStaticKnowledge() {
    const qaData = {};
    const urlMappings = {};
    
    try {
        // Load static_qa_config.py
        const qaPath = path.join(__dirname, 'static_qa_config.py');
        if (fs.existsSync(qaPath)) {
            const qaContent = fs.readFileSync(qaPath, 'utf8');
            
            // Parse Python dict for STATIC_QA (basic parsing)
            const qaMatch = qaContent.match(/STATIC_QA\s*=\s*{([^}]+)}/s);
            if (qaMatch) {
                const qaLines = qaMatch[1].split('\n');
                qaLines.forEach(line => {
                    const match = line.match(/["']([^"']+)["']\s*:\s*["']([^"']+)["']/);
                    if (match) {
                        qaData[match[1].toLowerCase()] = match[2];
                    }
                });
            }
            console.log(`✅ Loaded ${Object.keys(qaData).length} static QA entries`);
        }
        
        // Load url_mapping.py
        const urlPath = path.join(__dirname, 'url_mapping.py');
        if (fs.existsSync(urlPath)) {
            const urlContent = fs.readFileSync(urlPath, 'utf8');
            
            // Parse Python dict for PAGE_LINKS (basic parsing)
            const urlMatch = urlContent.match(/PAGE_LINKS\s*=\s*{([^}]+)}/s);
            if (urlMatch) {
                const urlLines = urlMatch[1].split('\n');
                urlLines.forEach(line => {
                    const match = line.match(/["']([^"']+)["']\s*:\s*["']([^"']+)["']/);
                    if (match) {
                        urlMappings[match[1].toLowerCase()] = match[2];
                    }
                });
            }
            console.log(`✅ Loaded ${Object.keys(urlMappings).length} URL mappings`);
        }
        
    } catch (error) {
        console.error('❌ Error loading static knowledge:', error);
    }
    
    return { qaData, urlMappings };
}

/**
 * Get relevant PDFs based on enquiry data and template type
 * @param {Object} enquiry - Enquiry data
 * @param {string} templateType - The email template being used
 * @returns {Array} - Array of relevant PDF objects
 */
function getRelevantPDFs(enquiry, templateType) {
    const pdfs = [];
    
    // FOR OPEN DAY INVITES - Keep it minimal
    if (templateType === 'open-day-invite') {
        // Only include admissions policy for open day invites
        pdfs.push({
            label: 'Admissions Policy',
            url: 'https://s3.eu-west-2.amazonaws.com/penai.co.uk/pdfs/Admissions-Policy-CC.pdf'
        });
        return pdfs; // Exit early - don't clutter invite with policies
    }
    
    // FOR OTHER EMAIL TYPES - Include context-specific PDFs
    
    // Always include admissions policy
    pdfs.push({
        label: 'Admissions Policy',
        url: 'https://s3.eu-west-2.amazonaws.com/penai.co.uk/pdfs/Admissions-Policy-CC.pdf'
    });
    
    // Get form data
    const formData = enquiry.form_data || {};
    
    // Check for learning support needs in additional info
    if (formData.additionalInfo && 
        formData.additionalInfo.toLowerCase().includes('learning')) {
        pdfs.push({
            label: 'Learning Support & SEN Policy',
            url: 'https://s3.eu-west-2.amazonaws.com/penai.co.uk/pdfs/Learning-Support-and-SEN-Policy-CC.pdf'
        });
    }
    
    // Check for international families
    if (enquiry.country && enquiry.country !== 'United Kingdom') {
        pdfs.push({
            label: 'EAL Policy',
            url: 'https://s3.eu-west-2.amazonaws.com/penai.co.uk/pdfs/EAL-Policy-C.pdf'
        });
        pdfs.push({
            label: 'Guardianship Policy',
            url: 'https://s3.eu-west-2.amazonaws.com/penai.co.uk/pdfs/Guardianship-Policy-CC.pdf'
        });
    }
    
    // Check for boarding enquiries from form_data
    if (formData.boardingPreference && 
        formData.boardingPreference !== 'Day') {
        pdfs.push({
            label: 'House Principles',
            url: 'https://s3.eu-west-2.amazonaws.com/penai.co.uk/pdfs/House-Principles-C.pdf'
        });
    }
    
    // Check for scholarship interest from priorities
    if (formData.priorities?.academic === 3) {
        pdfs.push({
            label: 'Scholarship Application Form',
            url: 'https://s3.eu-west-2.amazonaws.com/penai.co.uk/pdfs/13-Scholarship-Application-Form-2026-2.pdf'
        });
    }
    
    return pdfs;
}

/**
 * Get template-specific instructions for Claude
 * @param {string} templateType - Type of email template
 * @param {Object} enquiry - Enquiry data (needed for open day lookups)
 * @returns {string} - Template instructions
 */
async function getTemplateInstructions(templateType, enquiry) {
    let openDayInfo = '';
    let openDayDatesText = ''; // NEW: formatted dates ready to paste
    
    if (templateType === 'open-day-invite') {
        try {
            // Fetch ALL upcoming open days (not just 1)
            const result = await pool.query(`
                SELECT event_name, event_date, event_time, description
                FROM open_days 
                WHERE is_active = TRUE 
                AND event_date >= CURRENT_DATE 
                ORDER BY event_date ASC 
                LIMIT 5
            `);
            
            if (result.rows.length > 0) {
                // Format dates as ready-to-use bullet points
                const datesList = result.rows.map(day => {
                    const date = new Date(day.event_date).toLocaleDateString('en-GB', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                    });
                    const time = day.event_time || 'TBC';
                    return `• ${day.event_name} on ${date} at ${time}`;
                }).join('<br/>');
                
                openDayDatesText = datesList;
                
                openDayInfo = `
CRITICAL - YOU MUST INCLUDE THESE EXACT DATES IN THE EMAIL:

Copy this text EXACTLY into the email after describing what an open day involves:

"We have several upcoming Open Days you could attend:

${datesList}

If none of these dates suit your schedule, we'd be delighted to arrange a private tour at a time that works for you."

DO NOT CHANGE THIS TEXT. DO NOT SAY "admissions will be in touch about dates". THE DATES ARE RIGHT THERE.
`;
            } else {
                openDayInfo = `
NO SCHEDULED OPEN DAYS - USE THIS TEXT:

"We don't currently have public Open Days scheduled, but we'd be delighted to arrange a private tour for you and [CHILD NAME] at a time that suits your family. Private tours are tailored to your child's specific interests and allow for more in-depth conversations with relevant staff."
`;
            }
        } catch (error) {
            console.error('Error fetching open days:', error);
            openDayInfo = `
- Offer to arrange a private tour tailored to their child's interests
- Mention the admissions team will be in touch to arrange
`;
        }
    }

    const templates = {
        'welcome': `
            Write a warm, welcoming introduction email. 
            - Thank them for their enquiry
            - Acknowledge the child's specific interests from the form (academics, sports, activities)
            - Provide a brief school overview highlighting relevant programs
            - Invite them to visit campus
            - Include next steps
            Tone: Warm, enthusiastic, personal
        `,
        'open-day-invite': `
            CRITICAL INSTRUCTIONS FOR OPEN DAY INVITATION:
            
            ${openDayInfo}
            
            STRUCTURE YOUR EMAIL LIKE THIS:
            
            1. Opening: Thank parent for interest, mention child's name and entry year
            
            2. DATES PARAGRAPH: Include the exact dates text provided above
            
            3. PERSONALIZATION PARAGRAPH: Reference their specific form responses:
               - Mention their academic interests
               - Mention their activities/sports
               - Mention boarding if relevant
               - Mention university aspirations if provided
               - Connect these to what they'll see at Open Day
            
            4. What to expect paragraph: Describe Open Day experience tailored to their interests
            
            5. CLOSING PARAGRAPH - CRITICAL FORMAT:
               "Please do let me know which date would suit you best, and I'll send you confirmation along with all the details for the day. If none of these dates work for your family, I'd be very happy to arrange a private tour at a time that's convenient for you.
               
               I look forward to hearing from you and to welcoming you both to College soon."
            
            CRITICAL RULES:
            - The dates MUST appear word-for-word from the text provided
            - You MUST reference their specific interests from the form data
            - DO NOT write generic content
            - DO NOT say "our admissions team will be in touch" or "we'll contact you"
            - DO ask them to let you know which date suits them
            - The closing MUST ask them to confirm their preferred date
            
            Tone: Warm, personal, specific
        `,
        'post-visit': `
            Write a personal follow-up after a campus visit.
            - Thank them for visiting
            - Reference specific moments from their tour (if known)
            - Address any questions they raised
            - Outline next steps in the application process
            - Offer continued support
            Tone: Personal, thoughtful, helpful
        `,
        'academic': `
            Write a professional response focusing on academics.
            - Address their specific academic questions/interests from the form
            - Highlight relevant department achievements
            - Explain curriculum and teaching approach
            - Mention support available
            - Include exam results/university destinations if relevant
            Tone: Professional, informative, reassuring
        `,
        'boarding': `
            Write detailed information about boarding life.
            - Explain boarding house structure
            - Describe pastoral care approach
            - Detail daily routines and weekend activities
            - Address safety and wellbeing
            - Emphasize community and support
            Tone: Warm, reassuring, detailed
        `,
        'custom': `
            Write a flexible, personalized email addressing their specific needs.
            - Adapt to the context and concerns in the enquiry
            - Be thorough but concise
            - Address all points raised
            - Provide relevant information
            Tone: Adaptable, professional, helpful
        `
    };
    
    return templates[templateType] || templates['custom'];
}

/**
 * Build the complete prompt for Claude
 * @param {Object} enquiry - Enquiry data
 * @param {string} templateType - Template type
 * @param {string} templateInstructions - Instructions for this template
 * @param {Array} relevantContent - Relevant knowledge base chunks
 * @param {Array} relevantPDFs - Relevant PDF documents
 * @param {Object} qaData - Static QA mappings
 * @param {Object} urlMappings - URL mappings
 * @returns {string} - Complete prompt
 */
function buildEmailPrompt(enquiry, templateType, templateInstructions, relevantContent, relevantPDFs, qaData = {}, urlMappings = {}) {
    // Extract form_data fields properly
    const formData = enquiry.form_data || {};
    const academicInterests = formData.academicInterests || [];
    const activities = formData.activities || [];
    const specificSports = formData.specificSports || [];
    const boardingPreference = formData.boardingPreference || 'Not specified';
    const priorities = formData.priorities || {};
    const universityAspirations = formData.universityAspirations || '';
    const additionalInfo = formData.additionalInfo || '';
    
    // Format static QA data for Claude
    let qaSection = '';
    if (Object.keys(qaData).length > 0) {
        qaSection = `
QUICK REFERENCE ANSWERS (from static_qa_config.py):
${Object.entries(qaData).slice(0, 10).map(([q, a]) => `Q: ${q}\nA: ${a}`).join('\n\n')}
`;
    }
    
    // Format URL mappings for Claude
    let urlSection = '';
    if (Object.keys(urlMappings).length > 0) {
        urlSection = `
USEFUL PAGE LINKS (from url_mapping.py):
${Object.entries(urlMappings).slice(0, 10).map(([page, url]) => `- ${page}: ${url}`).join('\n')}
`;
    }
    
    return `You are an experienced admissions officer at Cheltenham College, a prestigious independent boarding school in the UK.

    IMPORTANT WRITING RULES:
    - Use British English spelling throughout (e.g., "enrol" not "enroll", "programme" not "program", "honour" not "honor")
    - DO NOT mention booking systems or booking URLs
    - If inviting to Open Day: state that the admissions team will contact them to arrange attendance
    - DO NOT include registration links - explain that admissions will follow up by email to confirm details


    TASK: Write a personalized email to a prospective family.

TEMPLATE TYPE: ${templateType}

INSTRUCTIONS:
${templateInstructions}

FAMILY INFORMATION:
- Parent Name: ${enquiry.parent_name || 'Not specified'}
- Child Name: ${enquiry.first_name || 'Not specified'}
- Family Surname: ${enquiry.family_surname || 'Not specified'}
- Child Age Group: ${enquiry.age_group || 'Not specified'}
- Entry Year: ${enquiry.entry_year || 'Not specified'}
- Country: ${enquiry.country || 'United Kingdom'}
- Boarding Preference: ${boardingPreference}

CHILD'S ACADEMIC INTERESTS (from enquiry form):
${academicInterests.length > 0 ? academicInterests.map(i => `- ${i}`).join('\n') : '- Not specified'}

CHILD'S ACTIVITIES & INTERESTS (from enquiry form):
${activities.length > 0 ? activities.map(a => `- ${a}`).join('\n') : '- Not specified'}

SPECIFIC SPORTS THE CHILD PLAYS (from enquiry form):
${specificSports.length > 0 ? specificSports.map(s => `- ${s}`).join('\n') : '- Not specified'}

UNIVERSITY ASPIRATIONS:
${universityAspirations || 'Not specified'}

FAMILY PRIORITIES (1=Low, 2=Medium, 3=High):
- Academic Excellence: ${priorities.academic || 'Not specified'}
- Sports & Activities: ${priorities.sports || 'Not specified'}
- Pastoral Care: ${priorities.pastoral || 'Not specified'}
- Co-curricular Opportunities: ${priorities.activities || 'Not specified'}

ADDITIONAL INFORMATION FROM FAMILY:
${additionalInfo || 'None provided'}

${relevantContent.length > 0 ? `
RELEVANT SCHOOL INFORMATION (from chunks.jsonl):
${relevantContent.map((chunk, i) => `${i+1}. ${chunk.text}`).join('\n\n')}
` : ''}

${qaSection}

${urlSection}

${relevantPDFs.length > 0 ? `
    INCLUDE THESE RESOURCES (as clickable links with pretty formatting):
    ${relevantPDFs.map(pdf => `- ${pdf.label}: ${pdf.url}`).join('\n')}
    
    Format them like this example:
    <a href="https://s3.eu-west-2.amazonaws.com/penai.co.uk/pdfs/Admissions-Policy-CC.pdf" style="color: #c9a961; text-decoration: none;">Admissions Policy</a>
    
    CRITICAL: Copy the URLs EXACTLY. Do not modify or encode them.
    ` : ''}


IMPORTANT GUIDELINES:
1. Address the parent by name (${enquiry.parent_name})
2. Reference the child by name (${enquiry.first_name}) throughout
3. **CRITICAL - YOU MUST USE THIS DATA**: The family provided specific information:
   ${academicInterests.length > 0 ? `- Academic interests: ${academicInterests.join(', ')} - YOU MUST MENTION THESE` : ''}
   ${activities.length > 0 ? `- Activities: ${activities.join(', ')} - YOU MUST MENTION THESE` : ''}
   ${specificSports.length > 0 ? `- Sports: ${specificSports.join(', ')} - YOU MUST MENTION THESE SPORTS` : ''}
   ${boardingPreference !== 'Not specified' ? `- Boarding preference: ${boardingPreference} - YOU MUST MENTION THIS` : ''}
   ${universityAspirations ? `- University aspirations: ${universityAspirations} - YOU MUST MENTION THIS` : ''}
   ${enquiry.country && enquiry.country !== 'United Kingdom' ? `- Country: ${enquiry.country} - ACKNOWLEDGE THEY ARE INTERNATIONAL` : ''}
   
   Example: "I was delighted to see that ${enquiry.first_name} is interested in ${academicInterests[0] || 'X'}, enjoys ${specificSports[0] || 'sport'}, and is keen on ${activities[0] || 'Y'}. During your visit you'll have the chance to explore our ${academicInterests[0] || 'X'} department and ${specificSports[0] || 'sports'} facilities."
   
4. If they selected Oxford or Cambridge aspirations, mention university preparation support
5. If they are international (not UK), acknowledge this and mention international support/guardianship if relevant
6. If they play specific sports, mention those sports facilities and coaching
7. Use the school information from chunks.jsonl to provide accurate, detailed responses
8. Use the Quick Reference Answers and Page Links where relevant
9. If they have high priorities (3/3) in certain areas, emphasize how the school excels there
10. Keep the tone professional but warm and personal
11. Use proper email formatting with paragraphs
12. Include a proper email signature
13. If you mention programs or facilities, be specific
14. DON'T make up facts - only use information provided above
15. Keep the email concise but informative (250-400 words)
16. **FOR OPEN DAY INVITES**: You MUST include the specific dates provided in the template instructions
17. **FOR OPEN DAY INVITES**: Offer private tour as alternative if dates don't suit

FORMAT:
- Write in simple, clean HTML suitable for pasting into Outlook
- Use plain <p> tags for paragraphs (no inline styles)
- Use <br/> for line breaks within paragraphs
- Make links clickable: <a href="URL">text</a> (no styling needed)
- DO NOT include <html>, <head>, <body>, or <div> wrapper tags
- Start directly with the first <p> tag
- Use proper formatting for the signature

Sign the email as:
[Admin Name - you can use a placeholder]
Admissions Team
Cheltenham College
01242 123456
admissions@cheltenhamcollege.org

Write the complete email now (starting with <p>Dear...):`;
}

/**
 * Generate email subject line
 * @param {Object} enquiry - Enquiry data
 * @param {string} templateType - Template type
 * @returns {string} - Subject line
 */
function generateEmailSubject(enquiry, templateType) {
    const subjects = {
        'welcome': `Welcome to Cheltenham College - ${enquiry.first_name}'s Application`,
        'open-day-invite': `Visit Us: Open Day Invitation for ${enquiry.first_name}`,
        'post-visit': `Thank You for Visiting Cheltenham College`,
        'academic': `Academic Programs at Cheltenham College - ${enquiry.first_name}`,
        'boarding': `Boarding Life at Cheltenham College - ${enquiry.first_name}`,
        'custom': `Regarding ${enquiry.first_name}'s Application to Cheltenham College`
    };
    
    return subjects[templateType] || subjects['custom'];
}

// ========================================
// FIX FOR DROP-OFF ANALYSIS
// Replace these endpoints in your server.js file
// ========================================

// Bulk update enquiries - FIXED VERSION
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
        
        // IF ARCHIVING - SAVE PREVIOUS STATUS FIRST
        if (status === 'archived') {
            // Only update previous_status if the enquiry is not already archived
            const query = `
                UPDATE inquiries
                SET 
                    previous_status = CASE 
                        WHEN status != 'archived' THEN status 
                        ELSE previous_status 
                    END,
                    status = $1, 
                    updated_at = NOW()
                WHERE id = ANY($2::text[])
            `;
            await pool.query(query, [status, ids]);
            
            // Log what status each was before archiving
            const checkQuery = `
                SELECT id, status, previous_status 
                FROM inquiries 
                WHERE id = ANY($1::text[])
            `;
            const checkResult = await pool.query(checkQuery, [ids]);
            console.log('📦 Archived enquiries with previous statuses:', checkResult.rows);
            
        } else {
            // Regular update
            const query = `
                UPDATE inquiries
                SET status = $1, updated_at = NOW()
                WHERE id = ANY($2::text[])
            `;
            await pool.query(query, [status, ids]);
        }
        
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

// Update single enquiry - FIXED VERSION
app.patch('/api/admin/enquiries/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, priority, followup_date, email_sent } = req.body;
        const adminEmail = req.session.adminEmail;
        
        const updates = [];
        const values = [];
        let paramCount = 1;
        
        if (status !== undefined) {
            // IF ARCHIVING - SAVE PREVIOUS STATUS (only if not already archived)
            if (status === 'archived') {
                // First check current status
                const checkQuery = 'SELECT status FROM inquiries WHERE id = $1';
                const checkResult = await pool.query(checkQuery, [id]);
                
                if (checkResult.rows.length > 0 && checkResult.rows[0].status !== 'archived') {
                    updates.push(`previous_status = status`);
                }
            }
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
            if (followup_date) {
                updates.push(`followup_date = $${paramCount++}`);
                values.push(followup_date);
                await logActivity(id, 'followup_set', `Follow-up reminder set for ${followup_date}`, adminEmail);
            } else {
                updates.push(`followup_date = NULL`);
                await logActivity(id, 'followup_cleared', 'Follow-up reminder cleared', adminEmail);
            }
        }
        
        if (email_sent !== undefined) {
            updates.push(`email_sent = $${paramCount++}`);
            values.push(email_sent);
        }
        
        if (updates.length === 0) {
            return res.json({ success: true, message: 'No updates provided' });
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
        
        res.json({ success: true, enquiry: result.rows[0] });
    } catch (error) {
        console.error('Error updating enquiry:', error);
        res.status(500).json({ success: false, error: 'Failed to update enquiry' });
    }
});

// Bulk delete enquiries - ENHANCED VERSION (saves status before deletion)
app.post('/api/admin/enquiries/bulk-delete', requireAuth, async (req, res) => {
    try {
        const { ids } = req.body;
        const adminEmail = req.session.adminEmail;
        
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, error: 'Invalid enquiry IDs' });
        }
        
        // First, save the status of enquiries being deleted for analytics
        const saveQuery = `
            SELECT id, status, first_name, family_surname 
            FROM inquiries 
            WHERE id = ANY($1::text[])
        `;
        const enquiriesToDelete = await pool.query(saveQuery, [ids]);
        
        // Log deletion activity with previous status
        for (const enquiry of enquiriesToDelete.rows) {
            await logActivity(
                enquiry.id, 
                'enquiry_deleted', 
                `Enquiry deleted by ${adminEmail}. Last status was: ${enquiry.status}`, 
                adminEmail
            );
        }
        
        // Delete enquiries (CASCADE will delete related notes and activities)
        const query = `
            DELETE FROM inquiries
            WHERE id = ANY($1::text[])
        `;
        
        const result = await pool.query(query, [ids]);
        
        console.log(`✅ Bulk deleted ${result.rowCount} enquiries`);
        console.log('   Deleted enquiries had these statuses:', 
            enquiriesToDelete.rows.map(e => `${e.id}: ${e.status}`).join(', ')
        );
        
        res.json({ success: true, deleted: result.rowCount });
    } catch (error) {
        console.error('Error bulk deleting enquiries:', error);
        res.status(500).json({ success: false, error: 'Failed to bulk delete enquiries' });
    }
});

// Delete single enquiry - ENHANCED VERSION
app.delete('/api/admin/enquiries/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const adminEmail = req.session.adminEmail;
        
        // Check if enquiry exists and get its status
        const checkQuery = 'SELECT first_name, family_surname, status FROM inquiries WHERE id = $1';
        const checkResult = await pool.query(checkQuery, [id]);
        
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Enquiry not found' });
        }
        
        const enquiry = checkResult.rows[0];
        
        // Log deletion activity with the status before deletion
        await logActivity(
            id, 
            'enquiry_deleted', 
            `Enquiry for ${enquiry.first_name} ${enquiry.family_surname} permanently deleted by ${adminEmail}. Last status was: ${enquiry.status}`, 
            adminEmail
        );
        
        // Delete enquiry (CASCADE will delete related notes and activities)
        const deleteQuery = 'DELETE FROM inquiries WHERE id = $1';
        await pool.query(deleteQuery, [id]);
        
        console.log(`✅ Deleted enquiry: ${id} (${enquiry.first_name} ${enquiry.family_surname}) - Last status was: ${enquiry.status}`);
        
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

        console.log(`📔 Session started: ${enquiryId} (${sessionId})`);

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

        console.log(`📕 Session ended: ${sessionId}`);
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
        console.log('📊 Fetching enhanced module analytics...');
        
        // 1. Get overall engagement statistics
        const statsResult = await pool.query(`
            SELECT 
                COUNT(*) as total_enquiries,
                COUNT(*) FILTER (WHERE prospectus_opened = TRUE) as opened_count,
                ROUND(
                    (COUNT(*) FILTER (WHERE prospectus_opened = TRUE)::DECIMAL / 
                    NULLIF(COUNT(*), 0)) * 100, 
                    2
                ) as open_rate
            FROM inquiries
            WHERE school = 'cheltenham'
        `);
        
        // 2. Get total module views (includes revisits - for reference)
        const moduleViewsResult = await pool.query(`
            SELECT 
                COALESCE(SUM(total_view_count), 0) as total_module_views
            FROM module_views mv
            JOIN inquiries i ON mv.enquiry_id = i.id
            WHERE i.school = 'cheltenham'
        `);
        
        // 3. ⭐ NEW: Get UNIQUE modules per user
        const uniqueModulesResult = await pool.query(`
            SELECT 
                mv.enquiry_id,
                COUNT(DISTINCT mv.module_name) as unique_modules
            FROM module_views mv
            JOIN inquiries i ON mv.enquiry_id = i.id
            WHERE i.school = 'cheltenham' 
              AND mv.total_view_count > 0
            GROUP BY mv.enquiry_id
        `);
        
        // Calculate average UNIQUE modules per user
        const totalUniqueModules = uniqueModulesResult.rows.reduce((sum, row) => 
            sum + parseInt(row.unique_modules || 0), 0
        );
        const avgUniqueModules = uniqueModulesResult.rows.length > 0 ? 
            totalUniqueModules / uniqueModulesResult.rows.length : 0;
        
        // 4. Get detailed module performance
        const modulesResult = await pool.query(`
            SELECT 
                mv.module_name,
                COUNT(DISTINCT mv.enquiry_id) as unique_viewers,
                SUM(mv.total_view_count) as total_views,
                SUM(COALESCE(mv.total_time_spent_seconds, 0)) as total_time_spent_seconds,
                ROUND(AVG(COALESCE(mv.total_time_spent_seconds, 0))::numeric, 2) as avg_time_seconds
            FROM module_views mv
            JOIN inquiries i ON mv.enquiry_id = i.id
            WHERE i.school = 'cheltenham'
            GROUP BY mv.module_name
            ORDER BY unique_viewers DESC, total_views DESC
            LIMIT 20
        `);
        
        // 5. Get active/recent sessions
        const activeSessionsResult = await pool.query(`
            WITH latest_sessions AS (
                SELECT 
                    mvs.enquiry_id,
                    mvs.session_id,
                    MIN(mvs.started_at) as session_start,
                    MAX(mvs.last_activity_at) as last_activity_at,
                    MAX(mvs.ended_at) as ended_at,
                    SUM(mvs.time_spent_seconds) as total_session_time,
                    (ARRAY_AGG(mvs.module_name ORDER BY mvs.last_activity_at DESC) FILTER (WHERE mvs.module_name != 'session_start'))[1] as current_module,
                    COUNT(DISTINCT CASE WHEN mvs.module_name != 'session_start' THEN mvs.module_name END) as modules_viewing
                FROM module_view_sessions mvs
                WHERE mvs.last_activity_at >= NOW() - INTERVAL '5 minutes'
                GROUP BY mvs.enquiry_id, mvs.session_id
            )
            SELECT 
                ls.enquiry_id,
                CASE 
                    WHEN i.family_surname ILIKE 'the %' THEN INITCAP(i.family_surname)
                    WHEN i.family_surname ILIKE '% family' THEN i.family_surname
                    ELSE COALESCE(i.family_surname, 'Unknown') || ' Family'
                END as viewer_name,
                ls.session_id,
                ls.current_module as module_name,
                ls.total_session_time as time_spent_seconds,
                ls.last_activity_at,
                EXTRACT(EPOCH FROM (NOW() - ls.last_activity_at)) as seconds_since_activity,
                ls.modules_viewing,
                CASE 
                    WHEN ls.ended_at IS NOT NULL THEN 'idle'
                    WHEN EXTRACT(EPOCH FROM (NOW() - ls.last_activity_at)) > 120 THEN 'idle'
                    ELSE 'viewing'
                END as session_status
            FROM latest_sessions ls
            JOIN inquiries i ON ls.enquiry_id = i.id
            WHERE ls.ended_at IS NULL OR ls.last_activity_at >= NOW() - INTERVAL '5 minutes'
            ORDER BY ls.last_activity_at DESC
        `);

        const stats = statsResult.rows[0];
        const totalModuleViews = moduleViewsResult.rows[0].total_module_views;

        console.log('✅ Analytics fetched:', {
            enquiries: stats.total_enquiries,
            opened: stats.opened_count,
            totalViews: totalModuleViews,
            avgUniqueModules: avgUniqueModules.toFixed(1)
        });

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
                total_module_views: parseInt(totalModuleViews) || 0,
                avg_unique_modules_per_user: parseFloat(avgUniqueModules.toFixed(1)) || 0  // ⭐ NEW!
            },
            activeSessions: activeSessionsResult.rows.map(row => ({
                enquiry_id: row.enquiry_id,
                viewer_name: row.viewer_name,
                session_id: row.session_id,
                module_name: row.module_name,
                time_spent_seconds: parseInt(row.time_spent_seconds) || 0,
                last_activity_at: row.last_activity_at,
                seconds_since_activity: parseInt(row.seconds_since_activity) || 0,
                modules_viewing: parseInt(row.modules_viewing) || 0,
                session_status: row.session_status
            }))
        });
    } catch (error) {
        console.error('❌ Error fetching enhanced analytics:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch analytics',
            details: error.message 
        });
    }
});

// Get session history for an enquiry
// Get session history for an enquiry - FIXED VERSION
app.get('/api/enquiry/:id/sessions', async (req, res) => {
    try {
        // Get session summaries with MAXIMUM time instead of SUM
        const sessionsResult = await pool.query(`
            SELECT 
                session_id,
                MIN(started_at) as started_at,
                MAX(ended_at) as ended_at,
                MAX(last_activity_at) as last_activity,
                BOOL_OR(was_idle) as was_idle,
                MAX(time_spent_seconds) as total_time_seconds  -- ✓ CHANGED FROM SUM TO MAX
            FROM module_view_sessions
            WHERE enquiry_id = $1
            GROUP BY session_id
            ORDER BY started_at DESC
        `, [req.params.id]);

        // Get modules for each session
        const sessionsWithModules = await Promise.all(
            sessionsResult.rows.map(async (session) => {
                const modulesResult = await pool.query(`
                    SELECT DISTINCT module_name
                    FROM module_view_sessions
                    WHERE enquiry_id = $1 AND session_id = $2
                        AND module_name IS NOT NULL
                        AND module_name != ''
                        AND module_name != 'session_start'
                    ORDER BY module_name
                `, [req.params.id, session.session_id]);

                return {
                    ...session,
                    modules: modulesResult.rows.map(row => row.module_name),
                    modules_viewed: modulesResult.rows.length,
                    total_time: parseInt(session.total_time_seconds) || 0  // Convert to integer
                };
            })
        );

        const totalSessions = sessionsWithModules.length;
        const totalTime = sessionsWithModules.reduce((sum, s) => sum + (parseInt(s.total_time) || 0), 0);
        const uniqueModules = new Set(
            sessionsWithModules.flatMap(s => s.modules || [])
        ).size;

        res.json({ 
            success: true, 
            sessions: sessionsWithModules,
            summary: {
                totalSessions,
                totalTime,
                uniqueModules
            }
        });
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch sessions',
            details: error.message 
        });
    }
});

// Get detailed module views
app.get('/api/enquiry/:id/modules-detailed', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                mv.module_name,
                mv.total_view_count as view_count,
                mv.total_time_spent_seconds as time_spent_seconds,
                mv.first_viewed_at,
                mv.last_viewed_at,
                COUNT(DISTINCT mvs.session_id) as session_count,
                AVG(mvs.scroll_depth_percent) as avg_scroll_depth,
                ROUND(AVG(mvs.time_spent_seconds)) as avg_time_per_view
            FROM module_views mv
            LEFT JOIN module_view_sessions mvs 
                ON mv.enquiry_id = mvs.enquiry_id 
                AND mv.module_name = mvs.module_name
            WHERE mv.enquiry_id = $1
            GROUP BY mv.module_name, mv.total_view_count, mv.total_time_spent_seconds, 
                     mv.first_viewed_at, mv.last_viewed_at
            ORDER BY mv.last_viewed_at DESC
        `, [req.params.id]);

        res.json({ 
            success: true, 
            modules: result.rows 
        });
    } catch (error) {
        console.error('Error fetching modules:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch modules',
            details: error.message 
        });
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

// ========================================
// FIXED /api/admin/module-analytics-enhanced ENDPOINT
// Add this to your server.js file
// ========================================

app.get('/api/admin/module-analytics-enhanced', requireAuth, async (req, res) => {
    try {
        console.log('📊 Fetching enhanced module analytics...');
        
        // 1. Get overall engagement statistics
        const statsResult = await pool.query(`
            SELECT 
                COUNT(*) as total_enquiries,
                COUNT(*) FILTER (WHERE prospectus_opened = TRUE) as opened_count,
                ROUND(
                    (COUNT(*) FILTER (WHERE prospectus_opened = TRUE)::DECIMAL / 
                    NULLIF(COUNT(*), 0)) * 100, 
                    2
                ) as open_rate
            FROM inquiries
        `);
        
        // 2. Get total module views across all users
        const moduleViewsResult = await pool.query(`
            SELECT 
                COALESCE(SUM(total_view_count), 0) as total_module_views
            FROM module_views
        `);
        
        // 3. Get detailed module performance
        const modulesResult = await pool.query(`
            SELECT 
                module_name,
                COUNT(DISTINCT enquiry_id) as unique_viewers,
                SUM(total_view_count) as total_views,
                SUM(COALESCE(total_time_spent_seconds, 0)) as total_time_spent_seconds,
                ROUND(AVG(COALESCE(total_time_spent_seconds, 0)), 2) as avg_time_seconds
            FROM module_views
            GROUP BY module_name
            ORDER BY unique_viewers DESC, total_views DESC
            LIMIT 20
        `);
        
        // 4. Get active/recent sessions for "Recent Activity"
        const activeSessionsResult = await pool.query(`
            SELECT 
                mvs.enquiry_id,
                CASE 
                    WHEN i.family_surname ILIKE 'the %' THEN INITCAP(i.family_surname)
                    WHEN i.family_surname ILIKE '% family' THEN i.family_surname
                    ELSE COALESCE(i.family_surname || ' Family', i.parent_email, 'Unknown')
                END as viewer_name,
                mvs.session_id,
                mvs.module_name,
                COALESCE(mvs.time_spent_seconds, 0) as time_spent_seconds,
                mvs.last_activity_at,
                EXTRACT(EPOCH FROM (NOW() - mvs.last_activity_at))::INTEGER as seconds_since_activity,
                CASE 
                    WHEN mvs.ended_at IS NULL AND EXTRACT(EPOCH FROM (NOW() - mvs.last_activity_at)) < 120 
                    THEN 'viewing'
                    ELSE 'ended'
                END as session_status
            FROM module_view_sessions mvs
            LEFT JOIN inquiries i ON mvs.enquiry_id = i.id
            WHERE mvs.last_activity_at > NOW() - INTERVAL '2 hours'
            ORDER BY mvs.last_activity_at DESC
            LIMIT 20
        `);

        const stats = statsResult.rows[0];
        const totalModuleViews = moduleViewsResult.rows[0].total_module_views;

        console.log('✅ Analytics fetched:', {
            enquiries: stats.total_enquiries,
            opened: stats.opened_count,
            modules: modulesResult.rows.length,
            sessions: activeSessionsResult.rows.length
        });

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
                total_module_views: parseInt(totalModuleViews) || 0
            },
            activeSessions: activeSessionsResult.rows.map(row => ({
                enquiry_id: row.enquiry_id,
                viewer_name: row.viewer_name,
                session_id: row.session_id,
                module_name: row.module_name,
                time_spent_seconds: parseInt(row.time_spent_seconds) || 0,
                last_activity_at: row.last_activity_at,
                seconds_since_activity: parseInt(row.seconds_since_activity) || 0,
                session_status: row.session_status
            }))
        });
    } catch (error) {
        console.error('❌ Error fetching enhanced analytics:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch analytics',
            details: error.message 
        });
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

// ============================================
// TOP PROSPECTS & AI ANALYSIS ENDPOINTS
// Add these to your server.js file
// ============================================

// Get top prospects sorted by visits or time spent
app.get('/api/admin/top-prospects', async (req, res) => {
    try {
        const { sortBy = 'visits', limit = 50 } = req.query;
        
        let orderByClause;
        if (sortBy === 'time') {
            orderByClause = 'i.total_time_spent_seconds DESC NULLS LAST, i.total_sessions DESC';
        } else {
            orderByClause = 'i.total_sessions DESC NULLS LAST, i.total_time_spent_seconds DESC';
        }

        const query = `
            SELECT 
                i.id,
                i.parent_name,
                i.first_name as student_name,
                i.parent_email as email,
                i.contact_number as phone,
                i.status,
                i.created_at,
                i.total_sessions,
                i.total_time_spent_seconds,
                i.last_session_at,
                i.prospectus_opened,
                COUNT(DISTINCT mv.module_name) as unique_modules_viewed,
                json_agg(
                    json_build_object(
                        'module_name', mv.module_name,
                        'view_count', mv.total_view_count,
                        'time_spent', mv.total_time_spent_seconds,
                        'last_viewed', mv.last_viewed_at
                    ) ORDER BY mv.total_view_count DESC
                ) FILTER (WHERE mv.module_name IS NOT NULL) as modules_detail
            FROM inquiries i
            LEFT JOIN module_views mv ON i.id = mv.enquiry_id
            WHERE i.prospectus_opened = true
            GROUP BY i.id
            HAVING i.total_sessions > 0 OR COUNT(DISTINCT mv.module_name) > 0
            ORDER BY ${orderByClause}
            LIMIT $1
        `;

        const result = await pool.query(query, [limit]);

        // Calculate engagement scores
        const prospects = result.rows.map(row => {
            const sessions = parseInt(row.total_sessions) || 0;
            const timeSpent = parseInt(row.total_time_spent_seconds) || 0;
            const modulesViewed = parseInt(row.unique_modules_viewed) || 0;
            
            // Engagement score calculation (0-100)
            const sessionScore = Math.min(sessions * 10, 40); // Max 40 points
            const timeScore = Math.min(Math.floor(timeSpent / 60), 30); // Max 30 points (1 point per minute)
            const moduleScore = Math.min(modulesViewed * 5, 30); // Max 30 points
            
            const engagementScore = sessionScore + timeScore + moduleScore;

            return {
                ...row,
                total_sessions: sessions,
                total_time_spent_seconds: timeSpent,
                unique_modules_viewed: modulesViewed,
                engagement_score: engagementScore,
                time_spent_minutes: Math.floor(timeSpent / 60)
            };
        });

        res.json({
            success: true,
            prospects,
            sortBy,
            count: prospects.length
        });
    } catch (error) {
        console.error('❌ Error fetching top prospects:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch top prospects',
            details: error.message
        });
    }
});

// Generate AI insights for a specific prospect
app.post('/api/admin/generate-prospect-insights', async (req, res) => {
    try {
        const { enquiryId } = req.body;

        if (!enquiryId) {
            return res.status(400).json({
                success: false,
                error: 'enquiryId is required'
            });
        }

        // Fetch prospect data
        const prospectQuery = `
            SELECT 
                i.id,
                i.parent_name,
                i.first_name as student_name,
                i.total_sessions,
                i.total_time_spent_seconds,
                i.last_session_at,
                i.created_at
            FROM inquiries i
            WHERE i.id = $1
        `;
        const prospectResult = await pool.query(prospectQuery, [enquiryId]);

        if (prospectResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Prospect not found'
            });
        }

        const prospect = prospectResult.rows[0];

        // Fetch module viewing data
        const modulesQuery = `
            SELECT 
                module_name,
                total_view_count,
                total_time_spent_seconds,
                first_viewed_at,
                last_viewed_at
            FROM module_views
            WHERE enquiry_id = $1
            ORDER BY total_view_count DESC, total_time_spent_seconds DESC
        `;
        const modulesResult = await pool.query(modulesQuery, [enquiryId]);

        // Fetch session history
        const sessionsQuery = `
            SELECT 
                session_id,
                MIN(started_at) as started_at,
                MAX(ended_at) as ended_at,
                MAX(last_activity_at) as last_activity,
                COUNT(DISTINCT module_name) as modules_in_session,
                SUM(time_spent_seconds) as session_duration
            FROM module_view_sessions
            WHERE enquiry_id = $1
            GROUP BY session_id
            ORDER BY started_at DESC
            LIMIT 10
        `;
        const sessionsResult = await pool.query(sessionsQuery, [enquiryId]);

        // Prepare data for AI analysis (anonymized - no personal info)
        const analysisData = {
            totalSessions: parseInt(prospect.total_sessions) || 0,
            totalTimeSpent: parseInt(prospect.total_time_spent_seconds) || 0,
            daysSinceFirstVisit: Math.floor(
                (new Date() - new Date(prospect.created_at)) / (1000 * 60 * 60 * 24)
            ),
            daysSinceLastVisit: prospect.last_session_at 
                ? Math.floor((new Date() - new Date(prospect.last_session_at)) / (1000 * 60 * 60 * 24))
                : null,
            modules: modulesResult.rows.map(m => ({
                name: m.module_name,
                viewCount: parseInt(m.total_view_count) || 0,
                timeSpent: parseInt(m.total_time_spent_seconds) || 0,
                revisited: parseInt(m.total_view_count) > 1
            })),
            sessions: sessionsResult.rows.map(s => ({
                modulesViewed: parseInt(s.modules_in_session) || 0,
                duration: parseInt(s.session_duration) || 0,
                date: s.started_at
            }))
        };

        // Create prompt for GPT-4o-mini
        const prompt = `You are an expert admissions consultant analyzing prospective student engagement data. 

VIEWING DATA:
- Total Sessions: ${analysisData.totalSessions}
- Total Time Spent: ${Math.floor(analysisData.totalTimeSpent / 60)} minutes
- Days Since First Visit: ${analysisData.daysSinceFirstVisit}
- Days Since Last Visit: ${analysisData.daysSinceLastVisit || 'N/A'}

MODULES VIEWED (sorted by engagement):
${analysisData.modules.map(m => 
    `- ${m.name}: ${m.viewCount} view${m.viewCount > 1 ? 's' : ''}, ${Math.floor(m.timeSpent / 60)} min${m.revisited ? ' (REVISITED)' : ''}`
).join('\n')}

SESSION PATTERN:
${analysisData.sessions.slice(0, 5).map((s, i) => 
    `Session ${i + 1}: ${s.modulesViewed} modules, ${Math.floor(s.duration / 60)} min`
).join('\n')}

TASK: Provide a concise analysis (150-200 words) covering:
1. **Interest Level**: How engaged is this prospect? (High/Medium/Low)
2. **Key Interests**: What are they most interested in based on module views?
3. **Behavioral Insights**: What does their viewing pattern suggest?
4. **Outreach Recommendations**: Specific talking points for admissions to mention in follow-up communication

Format your response as clear paragraphs with bold headers. Be specific and actionable.`;

        // Call OpenAI API (GPT-4o-mini)
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert admissions consultant who analyzes student engagement data to provide actionable insights for follow-up communication.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!openaiResponse.ok) {
            const errorData = await openaiResponse.json();
            throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const aiResult = await openaiResponse.json();
        const insights = aiResult.choices[0].message.content;

        res.json({
            success: true,
            insights,
            prospectName: prospect.parent_name,
            studentName: prospect.student_name,
            rawData: analysisData,
            tokensUsed: aiResult.usage?.total_tokens || 0
        });

    } catch (error) {
        console.error('❌ Error generating AI insights:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate insights',
            details: error.message
        });
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
    console.log(`   📋 Enquiry form: http://localhost:${PORT}/`);
    console.log(`   🔐 Admin login: http://localhost:${PORT}/admin/login`);
    console.log(`   📊 Admin dashboard: http://localhost:${PORT}/admin`);
    console.log(`   📖 Prospectus: http://localhost:${PORT}/prospectus?id=YOUR_ID\n`);
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