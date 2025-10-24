// js/smartreply-client.js

/**
 * Smart Reply Client-Side JavaScript
 * Handles Microsoft OAuth connection and status
 */

let microsoftPopup = null;

/**
 * Check Microsoft connection status
 */
async function checkMicrosoftStatus() {
    const statusContainer = document.getElementById('status-container');
    
    // Show loading state
    statusContainer.innerHTML = `
        <div class="status-box loading">
            <div class="status-icon">⏳</div>
            <div class="status-title">Checking connection status...</div>
        </div>
    `;

    try {
        const response = await fetch('/api/msauth/status', {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.connected) {
            // Connected state
            statusContainer.innerHTML = `
                <div class="status-box connected">
                    <div class="status-icon">✅</div>
                    <div class="status-title">Microsoft Account Connected</div>
                    <div class="status-email">${data.email || 'Connected'}</div>
                    ${data.displayName ? `<div class="status-email">${data.displayName}</div>` : ''}
                    <button class="btn btn-danger" onclick="disconnectMicrosoft()">
                        Disconnect Account
                    </button>
                </div>
            `;
        } else {
            // Not connected state
            statusContainer.innerHTML = `
                <div class="status-box not-connected">
                    <div class="status-icon">⚠️</div>
                    <div class="status-title">Microsoft Account Not Connected</div>
                    <div class="status-email">Connect your account to use Smart Reply features</div>
                    <button class="btn btn-primary" onclick="connectMicrosoft()">
                        🔐 Connect Microsoft Account
                    </button>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error checking status:', error);
        statusContainer.innerHTML = `
            <div class="status-box not-connected">
                <div class="status-icon">❌</div>
                <div class="status-title">Error Checking Status</div>
                <div class="status-email">${error.message}</div>
                <button class="btn btn-primary" onclick="checkMicrosoftStatus()">
                    Retry
                </button>
            </div>
        `;
    }
}

/**
 * Connect Microsoft account
 */
async function connectMicrosoft() {
    try {
        const button = event.target;
        button.disabled = true;
        button.innerHTML = '<span class="loading-spinner"></span> Connecting...';

        // Get auth URL from backend
        const response = await fetch('/api/msauth/login', {
            credentials: 'include'
        });
        const data = await response.json();

        if (!data.success || !data.authUrl) {
            throw new Error('Failed to get authentication URL');
        }

        // Open OAuth popup
        const width = 600;
        const height = 700;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;

        microsoftPopup = window.open(
            data.authUrl,
            'Microsoft Login',
            `width=${width},height=${height},left=${left},top=${top}`
        );

        // Listen for success message from popup
        window.addEventListener('message', handleOAuthMessage);

    } catch (error) {
        console.error('Error connecting Microsoft:', error);
        alert('Failed to connect: ' + error.message);
        checkMicrosoftStatus(); // Refresh UI
    }
}

/**
 * Handle OAuth callback message from popup
 */
function handleOAuthMessage(event) {
    // Security: verify origin if needed
    // if (event.origin !== window.location.origin) return;

    if (event.data && event.data.type === 'microsoft-auth-success') {
        console.log('✅ Microsoft authentication successful:', event.data.email);
        
        // Close popup if still open
        if (microsoftPopup && !microsoftPopup.closed) {
            microsoftPopup.close();
        }

        // Show success notification
        showNotification('✅ Microsoft account connected successfully!', 'success');

        // Refresh status
        checkMicrosoftStatus();

        // Remove event listener
        window.removeEventListener('message', handleOAuthMessage);
    }
}

/**
 * Disconnect Microsoft account
 */
async function disconnectMicrosoft() {
    if (!confirm('Are you sure you want to disconnect your Microsoft account?\n\nYou will need to reconnect to use Smart Reply features.')) {
        return;
    }

    try {
        const response = await fetch('/api/msauth/disconnect', {
            method: 'POST',
            credentials: 'include'
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Microsoft account disconnected', 'info');
            checkMicrosoftStatus();
        } else {
            throw new Error(data.error || 'Failed to disconnect');
        }
    } catch (error) {
        console.error('Error disconnecting:', error);
        alert('Failed to disconnect: ' + error.message);
    }
}

/**
 * Show notification (simple version)
 */
function showNotification(message, type = 'info') {
    // You can implement a fancy notification system here
    // For now, just log it
    console.log(`[${type.toUpperCase()}]`, message);
    
    // Optional: use your existing notification system if you have one
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    }
}

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Smart Reply client initialized');
    checkMicrosoftStatus();
});