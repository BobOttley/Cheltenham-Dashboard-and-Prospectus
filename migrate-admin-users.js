/**
 * Migration Script: Convert Environment Variable Admins to Database Users
 * 
 * This script will:
 * 1. Read the 3 existing admin users from environment variables
 * 2. Hash their passwords using bcrypt
 * 3. Insert them into the users table as super_admins
 * 4. Set must_change_password = false (they already have working passwords)
 * 
 * Run this ONCE after creating the users table
 */

require('dotenv').config();
const { Pool } = require('pg');
const { hashPassword } = require('./helpers/auth');

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Admin users from environment variables
const ADMIN_USERS = [
    {
        email: process.env.ADMIN_USER1_EMAIL,
        password: process.env.ADMIN_USER1_PASSWORD,
        full_name: 'Super Admin 1' // You can customize these names
    },
    {
        email: process.env.ADMIN_USER2_EMAIL,
        password: process.env.ADMIN_USER2_PASSWORD,
        full_name: 'Super Admin 2'
    },
    {
        email: process.env.ADMIN_USER3_EMAIL,
        password: process.env.ADMIN_USER3_PASSWORD,
        full_name: 'Super Admin 3'
    }
].filter(user => user.email && user.password);

async function migrateAdminUsers() {
    console.log('\n🔄 Starting admin user migration...\n');
    
    try {
        // Check if users table exists
        const tableCheck = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'users'
            );
        `);
        
        if (!tableCheck.rows[0].exists) {
            console.error('❌ Error: Users table does not exist!');
            console.log('Please run the database-migration-users.sql file first.');
            process.exit(1);
        }
        
        console.log('✅ Users table found\n');
        
        // Migrate each admin user
        for (let i = 0; i < ADMIN_USERS.length; i++) {
            const user = ADMIN_USERS[i];
            console.log(`Processing ${i + 1}/${ADMIN_USERS.length}: ${user.email}`);
            
            try {
                // Check if user already exists
                const existingUser = await pool.query(
                    'SELECT id FROM users WHERE email = $1',
                    [user.email]
                );
                
                if (existingUser.rows.length > 0) {
                    console.log(`  ⚠️  User already exists, skipping...`);
                    continue;
                }
                
                // Hash the password
                console.log('  🔐 Hashing password...');
                const passwordHash = await hashPassword(user.password);
                
                // Insert into database
                console.log('  💾 Creating user in database...');
                const result = await pool.query(`
                    INSERT INTO users (
                        email, 
                        password_hash, 
                        full_name, 
                        role, 
                        is_active, 
                        must_change_password,
                        created_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
                    RETURNING id, email, full_name
                `, [
                    user.email,
                    passwordHash,
                    user.full_name,
                    'super_admin',
                    true,
                    false // They don't need to change password since we're migrating existing ones
                ]);
                
                console.log(`  ✅ User created successfully (ID: ${result.rows[0].id})\n`);
                
            } catch (error) {
                console.error(`  ❌ Error creating user: ${error.message}\n`);
            }
        }
        
        // Display summary
        const userCount = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['super_admin']);
        console.log('─────────────────────────────────────');
        console.log(`✅ Migration complete!`);
        console.log(`📊 Total super admins in database: ${userCount.rows[0].count}`);
        console.log('─────────────────────────────────────\n');
        
        // Display all users
        const allUsers = await pool.query(`
            SELECT id, email, full_name, role, is_active, created_at 
            FROM users 
            ORDER BY created_at ASC
        `);
        
        console.log('👥 Current users in database:');
        console.table(allUsers.rows);
        
    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    } finally {
        await pool.end();
        console.log('\n✅ Database connection closed');
    }
}

// Run the migration
migrateAdminUsers().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
