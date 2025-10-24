#!/usr/bin/env node

/**
 * Session Tracking Diagnostic Tool
 * Run this to test your session tracking system
 */

const fetch = require('node-fetch');
const { Pool } = require('pg');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test enquiry ID (you can change this to an actual enquiry ID)
const TEST_ENQUIRY_ID = 'INQ-1760182304267539';

async function runDiagnostics() {
    console.log('🔍 Session Tracking Diagnostics\n');
    console.log('================================\n');

    try {
        // 1. Check database tables
        console.log('1. Checking Database Tables:');
        console.log('----------------------------');
        
        const tables = ['module_view_sessions', 'module_visits', 'module_views'];
        
        for (const table of tables) {
            const result = await pool.query(`
                SELECT COUNT(*) as count 
                FROM ${table} 
                WHERE enquiry_id = $1
            `, [TEST_ENQUIRY_ID]);
            
            console.log(`   ✓ ${table}: ${result.rows[0].count} records`);
        }
        
        // 2. Check recent sessions
        console.log('\n2. Recent Sessions (last 24h):');
        console.log('--------------------------------');
        
        const sessionsResult = await pool.query(`
            SELECT 
                session_id,
                MIN(started_at) as started,
                MAX(last_activity_at) as last_activity,
                MAX(ended_at) as ended,
                COUNT(DISTINCT module_name) as modules,
                SUM(time_spent_seconds) as total_time
            FROM module_view_sessions
            WHERE enquiry_id = $1
                AND started_at >= NOW() - INTERVAL '24 hours'
            GROUP BY session_id
            ORDER BY started DESC
            LIMIT 5
        `, [TEST_ENQUIRY_ID]);
        
        if (sessionsResult.rows.length === 0) {
            console.log('   ⚠️  No sessions found in last 24 hours');
        } else {
            sessionsResult.rows.forEach(row => {
                const status = row.ended ? 'ENDED' : 'ACTIVE';
                console.log(`   ${status}: ${row.session_id}`);
                console.log(`      Started: ${row.started}`);
                console.log(`      Modules: ${row.modules}`);
                console.log(`      Time: ${row.total_time}s`);
                console.log('');
            });
        }
        
        // 3. Check for orphaned records
        console.log('3. Data Integrity Checks:');
        console.log('-------------------------');
        
        // Check for sessions without end times that are old
        const orphanedResult = await pool.query(`
            SELECT COUNT(*) as count
            FROM module_view_sessions
            WHERE ended_at IS NULL
                AND last_activity_at < NOW() - INTERVAL '1 hour'
        `);
        
        console.log(`   Orphaned sessions: ${orphanedResult.rows[0].count}`);
        
        // Check for duplicate sessions
        const duplicatesResult = await pool.query(`
            SELECT enquiry_id, module_name, session_id, COUNT(*) as count
            FROM module_view_sessions
            GROUP BY enquiry_id, module_name, session_id
            HAVING COUNT(*) > 1
            LIMIT 5
        `);
        
        if (duplicatesResult.rows.length > 0) {
            console.log(`   ⚠️  Found ${duplicatesResult.rows.length} duplicate entries`);
        } else {
            console.log(`   ✓ No duplicate entries found`);
        }
        
        // 4. Test API endpoints
        console.log('\n4. Testing API Endpoints:');
        console.log('------------------------');
        
        // Test session start
        console.log('   Testing /api/session/start...');
        const startResponse = await fetch(`${BASE_URL}/api/session/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enquiryId: TEST_ENQUIRY_ID })
        });
        
        if (startResponse.ok) {
            const data = await startResponse.json();
            console.log(`   ✓ Session started: ${data.sessionId}`);
            
            // Test tracking a module view
            console.log('   Testing /api/track-module-visit...');
            const trackResponse = await fetch(`${BASE_URL}/api/track-module-visit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enquiryId: TEST_ENQUIRY_ID,
                    moduleName: 'diagnostic_test',
                    sessionId: data.sessionId,
                    visitNumber: 1,
                    timeSpentSeconds: 5,
                    scrollDepth: 50
                })
            });
            
            if (trackResponse.ok) {
                console.log('   ✓ Module visit tracked');
            } else {
                console.log('   ❌ Module tracking failed');
            }
            
            // End the test session
            console.log('   Testing /api/session/end...');
            const endResponse = await fetch(`${BASE_URL}/api/session/end`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: data.sessionId })
            });
            
            if (endResponse.ok) {
                console.log('   ✓ Session ended');
            } else {
                console.log('   ❌ Session end failed');
            }
            
            // Clean up test data
            await pool.query(`
                DELETE FROM module_view_sessions 
                WHERE session_id = $1
            `, [data.sessionId]);
            
            await pool.query(`
                DELETE FROM module_visits 
                WHERE session_id = $1
            `, [data.sessionId]);
            
        } else {
            console.log('   ❌ Session start failed');
        }
        
        // 5. Check tracking consistency
        console.log('\n5. Data Consistency Check:');
        console.log('---------------------------');
        
        const consistencyResult = await pool.query(`
            WITH mvs_summary AS (
                SELECT 
                    enquiry_id,
                    COUNT(DISTINCT session_id) as mvs_sessions
                FROM module_view_sessions
                WHERE enquiry_id = $1
                GROUP BY enquiry_id
            ),
            mv_summary AS (
                SELECT 
                    enquiry_id,
                    COUNT(DISTINCT session_id) as mv_sessions
                FROM module_visits
                WHERE enquiry_id = $1
                GROUP BY enquiry_id
            )
            SELECT 
                COALESCE(mvs.mvs_sessions, 0) as view_sessions,
                COALESCE(mv.mv_sessions, 0) as visits_sessions
            FROM mvs_summary mvs
            FULL OUTER JOIN mv_summary mv ON mvs.enquiry_id = mv.enquiry_id
        `, [TEST_ENQUIRY_ID]);
        
        if (consistencyResult.rows.length > 0) {
            const row = consistencyResult.rows[0];
            console.log(`   module_view_sessions: ${row.view_sessions} sessions`);
            console.log(`   module_visits: ${row.visits_sessions} sessions`);
            
            if (row.view_sessions !== row.visits_sessions) {
                console.log('   ⚠️  Session count mismatch between tables');
            } else {
                console.log('   ✓ Session counts match');
            }
        }
        
        console.log('\n================================');
        console.log('Diagnostics complete!\n');
        
    } catch (error) {
        console.error('❌ Diagnostic error:', error);
    } finally {
        await pool.end();
    }
}

// Run diagnostics
runDiagnostics();
