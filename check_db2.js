// Save this as check_db2.js and run with: node check_db2.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function diagnose() {
    console.log('🔍 DETAILED DATABASE DIAGNOSTIC');
    console.log('='.repeat(60));
    
    try {
        // 1. Check what columns actually exist
        console.log('\n1. ALL INQUIRIES COLUMNS:');
        const cols = await pool.query(`
            SELECT column_name, data_type, ordinal_position
            FROM information_schema.columns 
            WHERE table_name = 'inquiries'
            ORDER BY ordinal_position
        `);
        cols.rows.forEach(c => console.log(`  ${c.ordinal_position}. ${c.column_name}: ${c.data_type}`));
        
        // 2. Check module_view_sessions structure
        console.log('\n2. MODULE_VIEW_SESSIONS TABLE:');
        const sessionCols = await pool.query(`
            SELECT column_name, data_type
            FROM information_schema.columns 
            WHERE table_name = 'module_view_sessions'
            ORDER BY ordinal_position
        `);
        sessionCols.rows.forEach(c => console.log(`  ${c.column_name}: ${c.data_type}`));
        
        // 3. Check module_views structure
        console.log('\n3. MODULE_VIEWS TABLE:');
        const viewCols = await pool.query(`
            SELECT column_name, data_type
            FROM information_schema.columns 
            WHERE table_name = 'module_views'
            ORDER BY ordinal_position
        `);
        viewCols.rows.forEach(c => console.log(`  ${c.column_name}: ${c.data_type}`));
        
        // 4. Check for views (database views, not tables)
        console.log('\n4. DATABASE VIEWS:');
        const views = await pool.query(`
            SELECT table_name FROM information_schema.views 
            WHERE table_schema = 'public'
        `);
        console.log('Found:', views.rows.map(r => r.table_name));
        
        // 5. Stats
        console.log('\n5. ENQUIRY STATS:');
        const stats = await pool.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN prospectus_opened = TRUE THEN 1 END) as opened,
                COUNT(CASE WHEN modules_viewed IS NOT NULL AND modules_viewed != '{}'::jsonb THEN 1 END) as has_modules
            FROM inquiries
        `);
        console.log('Total enquiries:', stats.rows[0].total);
        console.log('Opened prospectus:', stats.rows[0].opened);
        console.log('Has module data:', stats.rows[0].has_modules);
        
        // 6. Check session data
        console.log('\n6. SESSION DATA:');
        const sessionCount = await pool.query('SELECT COUNT(*) FROM module_view_sessions');
        console.log('Total sessions in module_view_sessions:', sessionCount.rows[0].count);
        
        const viewCount = await pool.query('SELECT COUNT(*) FROM module_views');
        console.log('Total entries in module_views:', viewCount.rows[0].count);
        
        // 7. Sample enquiry with modules
        console.log('\n7. SAMPLE ENQUIRY WITH MODULES:');
        const sample = await pool.query(`
            SELECT id, first_name, prospectus_opened, modules_viewed
            FROM inquiries 
            WHERE modules_viewed IS NOT NULL 
            AND modules_viewed != '{}'::jsonb
            LIMIT 1
        `);
        if (sample.rows.length > 0) {
            const r = sample.rows[0];
            console.log(`ID: ${r.id}`);
            console.log(`Name: ${r.first_name}`);
            console.log(`Opened: ${r.prospectus_opened}`);
            console.log(`Modules viewed:`, JSON.stringify(r.modules_viewed, null, 2));
        } else {
            console.log('No enquiries with module data yet');
        }
        
        // 8. Test the enhanced analytics query
        console.log('\n8. TEST ENHANCED ANALYTICS QUERY:');
        try {
            const analyticsTest = await pool.query(`
                SELECT 
                    key as module_name,
                    COUNT(DISTINCT id) as unique_viewers,
                    SUM((value::text)::int) as total_views
                FROM inquiries, jsonb_each(modules_viewed)
                WHERE modules_viewed IS NOT NULL AND modules_viewed != '{}'::jsonb
                GROUP BY key
                ORDER BY total_views DESC
                LIMIT 5
            `);
            console.log('✅ Query works! Top modules:');
            analyticsTest.rows.forEach(m => {
                console.log(`  - ${m.module_name}: ${m.total_views} views (${m.unique_viewers} viewers)`);
            });
        } catch (err) {
            console.log('❌ Query failed:', err.message);
        }
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ Diagnostic complete');
        
    } catch (err) {
        console.error('ERROR:', err.message);
        console.error(err.stack);
    } finally {
        await pool.end();
    }
}

diagnose();
