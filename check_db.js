// Save this as check_db.js and run with: node check_db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function diagnose() {
    console.log('🔍 DATABASE DIAGNOSTIC');
    console.log('='.repeat(60));
    
    try {
        // 1. Check tables exist
        console.log('\n1. TABLES:');
        const tables = await pool.query(`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('inquiries', 'module_views', 'module_view_sessions')
        `);
        console.log('Found:', tables.rows.map(r => r.table_name));
        
        // 2. Check inquiries columns
        console.log('\n2. INQUIRIES COLUMNS:');
        const cols = await pool.query(`
            SELECT column_name, data_type FROM information_schema.columns 
            WHERE table_name = 'inquiries'
            AND column_name LIKE '%module%' OR column_name LIKE '%prospectus%' OR column_name LIKE '%session%'
            ORDER BY column_name
        `);
        cols.rows.forEach(c => console.log(`  ${c.column_name}: ${c.data_type}`));
        
        // 3. Stats
        console.log('\n3. STATS:');
        const stats = await pool.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN prospectus_opened = TRUE THEN 1 END) as opened
            FROM inquiries
        `);
        console.log('Total enquiries:', stats.rows[0].total);
        console.log('Opened prospectus:', stats.rows[0].opened);
        
        // 4. Sample data
        console.log('\n4. SAMPLE DATA:');
        const sample = await pool.query(`
            SELECT id, first_name, last_name, prospectus_opened, modules_viewed
            FROM inquiries 
            WHERE prospectus_opened = TRUE
            LIMIT 2
        `);
        sample.rows.forEach(r => {
            console.log(`\n${r.first_name} ${r.last_name} (${r.id})`);
            console.log('Modules:', r.modules_viewed);
        });
        
        console.log('\n' + '='.repeat(60));
        
    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await pool.end();
    }
}

diagnose();
