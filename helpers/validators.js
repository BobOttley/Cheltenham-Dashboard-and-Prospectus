/**
 * Input validation helpers
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function isValidEmail(email) {
    if (!email || typeof email !== 'string') {
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Validate user role
 * @param {string} role - Role to validate
 * @returns {boolean} - True if valid
 */
function isValidRole(role) {
    const validRoles = ['super_admin', 'team_member'];
    return validRoles.includes(role);
}

/**
 * Sanitize string input (prevent XSS)
 * @param {string} input - String to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeString(input) {
    if (!input || typeof input !== 'string') {
        return '';
    }
    
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove angle brackets
        .substring(0, 500); // Limit length
}

/**
 * Validate user creation data
 * @param {object} data - User data
 * @returns {object} - { valid: boolean, errors: array }
 */
function validateUserCreation(data) {
    const errors = [];
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Valid email is required');
    }
    
    if (!data.full_name || data.full_name.trim().length < 2) {
        errors.push('Full name is required (minimum 2 characters)');
    }
    
    if (!data.role || !isValidRole(data.role)) {
        errors.push('Valid role is required (super_admin or team_member)');
    }
    
    if (!data.password || data.password.length < 8) {
        errors.push('Password is required (minimum 8 characters)');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Validate user update data
 * @param {object} data - User data
 * @returns {object} - { valid: boolean, errors: array }
 */
function validateUserUpdate(data) {
    const errors = [];
    
    if (data.email && !isValidEmail(data.email)) {
        errors.push('Valid email is required');
    }
    
    if (data.full_name && data.full_name.trim().length < 2) {
        errors.push('Full name must be at least 2 characters');
    }
    
    if (data.role && !isValidRole(data.role)) {
        errors.push('Valid role is required (super_admin or team_member)');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Validate inquiry assignment data
 * @param {object} data - Assignment data
 * @returns {object} - { valid: boolean, errors: array }
 */
function validateAssignment(data) {
    const errors = [];
    
    if (!data.enquiryId || typeof data.enquiryId !== 'string') {
        errors.push('Valid enquiry ID is required');
    }
    
    if (data.userId !== null && (!Number.isInteger(data.userId) || data.userId < 1)) {
        errors.push('Valid user ID is required');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Validate password reset data
 * @param {object} data - Password reset data
 * @returns {object} - { valid: boolean, errors: array }
 */
function validatePasswordReset(data) {
    const errors = [];
    
    if (!data.newPassword || data.newPassword.length < 8) {
        errors.push('New password must be at least 8 characters');
    }
    
    if (data.currentPassword && data.newPassword === data.currentPassword) {
        errors.push('New password must be different from current password');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

module.exports = {
    isValidEmail,
    isValidRole,
    sanitizeString,
    validateUserCreation,
    validateUserUpdate,
    validateAssignment,
    validatePasswordReset
};
