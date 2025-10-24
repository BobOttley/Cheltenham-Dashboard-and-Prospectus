// ========================================
// ADMIN USER TRACKING UTILITY
// Add this to your main admin JavaScript file
// ========================================

/**
 * Get the current admin user email
 * This function checks multiple sources to ensure we capture the user
 */
function getCurrentAdminUser() {
    // Check multiple possible sources for the admin email
    
    // 1. Check if it's stored in a global variable (set on login)
    if (window.currentAdminEmail) {
        return window.currentAdminEmail;
    }
    
    // 2. Check sessionStorage
    if (sessionStorage.getItem('adminEmail')) {
        return sessionStorage.getItem('adminEmail');
    }
    
    // 3. Check localStorage (less secure but fallback)
    if (localStorage.getItem('adminEmail')) {
        return localStorage.getItem('adminEmail');
    }
    
    // 4. Try to get from the UI if displayed
    const adminEmailElement = document.getElementById('adminEmailDisplay');
    if (adminEmailElement && adminEmailElement.textContent) {
        return adminEmailElement.textContent.trim();
    }
    
    // 5. Check if it's in a data attribute somewhere
    const adminBar = document.querySelector('[data-admin-email]');
    if (adminBar) {
        return adminBar.getAttribute('data-admin-email');
    }
    
    // 6. Make an API call to check auth status (synchronous for simplicity)
    try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/admin/check-auth', false); // Synchronous
        xhr.send();
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.authenticated && response.email) {
                // Cache it for future use
                window.currentAdminEmail = response.email;
                sessionStorage.setItem('adminEmail', response.email);
                return response.email;
            }
        }
    } catch (error) {
        console.error('Failed to fetch admin auth status:', error);
    }
    
    // If all else fails, return unknown
    return 'Unknown Admin';
}

/**
 * Set the admin user on login
 * Call this when the admin successfully logs in
 */
function setAdminUser(email) {
    window.currentAdminEmail = email;
    sessionStorage.setItem('adminEmail', email);
    
    // Also update any UI elements that show the admin email
    const adminEmailElement = document.getElementById('adminEmailDisplay');
    if (adminEmailElement) {
        adminEmailElement.textContent = email;
    }
}

/**
 * Clear admin user on logout
 */
function clearAdminUser() {
    delete window.currentAdminEmail;
    sessionStorage.removeItem('adminEmail');
    localStorage.removeItem('adminEmail');
}

/**
 * Initialize admin tracking on page load
 * Add this to your admin dashboard initialization
 */
async function initializeAdminTracking() {
    try {
        const response = await fetch('/api/admin/check-auth');
        const data = await response.json();
        
        if (data.authenticated && data.email) {
            setAdminUser(data.email);
            console.log(`Admin session active: ${data.email}`);
            
            // Display admin info in UI if element exists
            const adminInfoElement = document.getElementById('admin-info');
            if (adminInfoElement) {
                adminInfoElement.innerHTML = `
                    <span class="admin-user">
                        <i class="fas fa-user-shield"></i>
                        Logged in as: <strong id="adminEmailDisplay">${data.email}</strong>
                    </span>
                `;
            }
        } else {
            console.warn('No admin session found');
            window.location.href = '/admin/login';
        }
    } catch (error) {
        console.error('Failed to initialize admin tracking:', error);
    }
}

// ========================================
// ENHANCED NOTE CREATION WITH USER TRACKING
// ========================================

/**
 * Create a note with proper admin attribution
 */
async function createNoteWithAttribution(enquiryId, content, context = '') {
    const adminUser = getCurrentAdminUser();
    const timestamp = new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Format the note with attribution header
    const formattedContent = `[${timestamp} - ${adminUser}]\n${context ? context + '\n' : ''}${content}`;
    
    try {
        const response = await fetch(`/api/admin/enquiries/${enquiryId}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: formattedContent })
        });
        
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        
        return data.note;
    } catch (error) {
        console.error('Failed to create note:', error);
        throw error;
    }
}

/**
 * Format activity log entry with admin user
 */
function formatActivityLog(action, details) {
    const adminUser = getCurrentAdminUser();
    const timestamp = new Date().toISOString();
    
    return {
        action: action,
        details: details,
        admin: adminUser,
        timestamp: timestamp
    };
}

// ========================================
// AUDIT TRAIL ENHANCEMENT
// ========================================

/**
 * Log any admin action with full context
 */
async function logAdminAction(enquiryId, action, details) {
    const adminUser = getCurrentAdminUser();
    
    try {
        // This would send to your activity log endpoint
        const response = await fetch('/api/admin/log-activity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                enquiry_id: enquiryId,
                action: action,
                details: details,
                admin_email: adminUser,
                timestamp: new Date().toISOString(),
                ip_address: window.clientIP || 'unknown', // If you track IPs
                user_agent: navigator.userAgent
            })
        });
        
        return response.json();
    } catch (error) {
        console.error('Failed to log admin action:', error);
    }
}

// ========================================
// EXPORT FOR USE IN OTHER MODULES
// ========================================

window.adminTracking = {
    getCurrentAdminUser,
    setAdminUser,
    clearAdminUser,
    initializeAdminTracking,
    createNoteWithAttribution,
    formatActivityLog,
    logAdminAction
};
