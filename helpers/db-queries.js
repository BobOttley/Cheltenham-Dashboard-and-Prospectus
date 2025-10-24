/**
 * Database query helpers
 * Common reusable database queries
 */

/**
 * Find user by email
 * @param {Pool} pool - PostgreSQL pool
 * @param {string} email - User email
 * @returns {Promise<object|null>} - User object or null
 */
async function findUserByEmail(pool, email) {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    return result.rows[0] || null;
}

/**
 * Find user by ID
 * @param {Pool} pool - PostgreSQL pool
 * @param {number} id - User ID
 * @returns {Promise<object|null>} - User object or null
 */
async function findUserById(pool, id) {
    const result = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0] || null;
}

/**
 * Get all active team members (for assignment dropdown)
 * @param {Pool} pool - PostgreSQL pool
 * @returns {Promise<Array>} - Array of active users
 */
async function getActiveTeamMembers(pool) {
    const result = await pool.query(
        `SELECT id, email, full_name, role 
         FROM users 
         WHERE is_active = true 
         ORDER BY full_name ASC`
    );
    return result.rows;
}

/**
 * Get all users (admin view)
 * @param {Pool} pool - PostgreSQL pool
 * @returns {Promise<Array>} - Array of all users
 */
async function getAllUsers(pool) {
    const result = await pool.query(
        `SELECT id, email, full_name, role, is_active, created_at, last_login_at, must_change_password
         FROM users 
         ORDER BY created_at DESC`
    );
    return result.rows;
}

/**
 * Create new user
 * @param {Pool} pool - PostgreSQL pool
 * @param {object} userData - User data
 * @returns {Promise<object>} - Created user
 */
async function createUser(pool, userData) {
    const { email, password_hash, full_name, role, created_by_user_id } = userData;
    
    const result = await pool.query(
        `INSERT INTO users (email, password_hash, full_name, role, created_by_user_id, must_change_password)
         VALUES ($1, $2, $3, $4, $5, true)
         RETURNING id, email, full_name, role, is_active, created_at`,
        [email, password_hash, full_name, role, created_by_user_id]
    );
    
    return result.rows[0];
}

/**
 * Update user
 * @param {Pool} pool - PostgreSQL pool
 * @param {number} id - User ID
 * @param {object} updates - Fields to update
 * @returns {Promise<object>} - Updated user
 */
async function updateUser(pool, id, updates) {
    const { email, full_name, role } = updates;
    
    const result = await pool.query(
        `UPDATE users 
         SET email = $1, full_name = $2, role = $3
         WHERE id = $4
         RETURNING id, email, full_name, role, is_active, created_at`,
        [email, full_name, role, id]
    );
    
    return result.rows[0];
}

/**
 * Update user password
 * @param {Pool} pool - PostgreSQL pool
 * @param {number} id - User ID
 * @param {string} password_hash - New password hash
 * @returns {Promise<void>}
 */
async function updateUserPassword(pool, id, password_hash) {
    await pool.query(
        `UPDATE users 
         SET password_hash = $1, must_change_password = false
         WHERE id = $2`,
        [password_hash, id]
    );
}

/**
 * Toggle user active status
 * @param {Pool} pool - PostgreSQL pool
 * @param {number} id - User ID
 * @param {boolean} isActive - New active status
 * @returns {Promise<object>} - Updated user
 */
async function toggleUserActive(pool, id, isActive) {
    const result = await pool.query(
        `UPDATE users 
         SET is_active = $1
         WHERE id = $2
         RETURNING id, email, full_name, role, is_active`,
        [isActive, id]
    );
    
    return result.rows[0];
}

/**
 * Update last login timestamp
 * @param {Pool} pool - PostgreSQL pool
 * @param {number} id - User ID
 * @returns {Promise<void>}
 */
async function updateLastLogin(pool, id) {
    await pool.query(
        'UPDATE users SET last_login_at = NOW() WHERE id = $1',
        [id]
    );
}

/**
 * Delete user
 * @param {Pool} pool - PostgreSQL pool
 * @param {number} id - User ID
 * @returns {Promise<void>}
 */
async function deleteUser(pool, id) {
    // First, unassign any inquiries assigned to this user
    await pool.query(
        'UPDATE inquiries SET assigned_to_user_id = NULL, assigned_at = NULL, assigned_by_user_id = NULL WHERE assigned_to_user_id = $1',
        [id]
    );
    
    // Then delete the user
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
}

/**
 * Assign inquiry to user
 * @param {Pool} pool - PostgreSQL pool
 * @param {string} enquiryId - Inquiry ID
 * @param {number} userId - User ID to assign to
 * @param {number} assignedBy - User ID who is making the assignment
 * @returns {Promise<void>}
 */
async function assignInquiry(pool, enquiryId, userId, assignedBy) {
    await pool.query(
        `UPDATE inquiries 
         SET assigned_to_user_id = $1, assigned_at = NOW(), assigned_by_user_id = $2
         WHERE id = $3`,
        [userId, assignedBy, enquiryId]
    );
}

/**
 * Unassign inquiry
 * @param {Pool} pool - PostgreSQL pool
 * @param {string} enquiryId - Inquiry ID
 * @returns {Promise<void>}
 */
async function unassignInquiry(pool, enquiryId) {
    await pool.query(
        `UPDATE inquiries 
         SET assigned_to_user_id = NULL, assigned_at = NULL, assigned_by_user_id = NULL
         WHERE id = $1`,
        [enquiryId]
    );
}

/**
 * Get inquiries assigned to a specific user
 * @param {Pool} pool - PostgreSQL pool
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - Array of inquiries
 */
async function getInquiriesByAssignee(pool, userId) {
    const result = await pool.query(
        `SELECT * FROM inquiries 
         WHERE assigned_to_user_id = $1
         ORDER BY created_at DESC`,
        [userId]
    );
    return result.rows;
}

/**
 * Get inquiry with assignee details
 * @param {Pool} pool - PostgreSQL pool
 * @param {string} enquiryId - Inquiry ID
 * @returns {Promise<object|null>} - Inquiry with assignee details
 */
async function getInquiryWithAssignee(pool, enquiryId) {
    const result = await pool.query(
        `SELECT i.*, 
                u.full_name as assignee_name, 
                u.email as assignee_email,
                ab.full_name as assigned_by_name
         FROM inquiries i
         LEFT JOIN users u ON i.assigned_to_user_id = u.id
         LEFT JOIN users ab ON i.assigned_by_user_id = ab.id
         WHERE i.id = $1`,
        [enquiryId]
    );
    return result.rows[0] || null;
}

module.exports = {
    findUserByEmail,
    findUserById,
    getActiveTeamMembers,
    getAllUsers,
    createUser,
    updateUser,
    updateUserPassword,
    toggleUserActive,
    updateLastLogin,
    deleteUser,
    assignInquiry,
    unassignInquiry,
    getInquiriesByAssignee,
    getInquiryWithAssignee
};
