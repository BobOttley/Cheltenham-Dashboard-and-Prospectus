// js/smartreply-email-complete.js

/**
 * SMART Reply Email Interface - Complete Version with Enhancements
 * Handles viewing and sending emails via Microsoft 365
 * Includes: Signature support, Auto-refresh, and all original functionality
 */

// State
let currentFolder = 'inbox';
let currentEmail = null;
let emails = [];
let replyToEmail = null;
let sentEmails = [];
let autoRefreshInterval = null;
let currentEnquiryId = null; // Track the current enquiry ID from context

// NEW: Infinite scroll state
let isLoadingMoreEmails = false;
let hasMoreEmails = true;
let currentSkipToken = null;

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 SMART Reply Email Interface initialized');
    
    // Extract enquiry ID from URL if present (when opened from enquiry detail)
    const urlParams = new URLSearchParams(window.location.search);
    currentEnquiryId = urlParams.get('enquiry_id') || urlParams.get('enquiryId');
    
    if (currentEnquiryId) {
        console.log(`📌 Working with Enquiry ID: ${currentEnquiryId}`);
    }
    
    // Check Microsoft connection status
    await checkConnection();
    
    // Load emails
    await loadEmails();
    
    // NEW: Set up infinite scroll
    setupInfiniteScroll();
    
    // Start auto-refresh if enabled
    initializeAutoRefresh();
    
    // Listen for settings updates from iframe
    window.addEventListener('message', handleSettingsMessage);
    
    // Listen for enquiry context updates from parent window
    window.addEventListener('message', handleEnquiryContext);
    
    // Listen for Microsoft connection messages
    window.addEventListener('message', async (event) => {
        if (event.data && event.data.type === 'microsoft-connected') {
            console.log('✅ Microsoft connected! Reloading Smart Reply...');
            
            // Re-check connection and reload emails
            const connected = await checkConnection();
            if (connected) {
                await loadEmails();
                showNotification('✅ Microsoft account connected! Ready to use Smart Reply.', 'success');
            }
        }
    });
});

/**
 * Handle enquiry context from parent window
 */
function handleEnquiryContext(event) {
    if (event.data && event.data.type === 'enquiry-context') {
        currentEnquiryId = event.data.enquiryId;
        console.log(`📌 Updated Enquiry ID context: ${currentEnquiryId}`);
        
        // Pre-fill compose form if recipient email is provided
        if (event.data.recipientEmail) {
            document.getElementById('compose-to').value = event.data.recipientEmail;
        }
    }
}

// Add this function to your smartreply-email.js file (add it near the top, after line 20 or so)

async function importEmailsToHistory(emails) {
    try {
        // FIX: Map emails with body content included AND extract email addresses properly
        const importData = emails.map(email => {
            // Extract actual email addresses from potentially complex objects
            const fromEmail = typeof email.from === 'string' 
                ? email.from 
                : (email.from?.emailAddress?.address || email.from?.address || email.from);
            
            const toEmail = typeof email.to === 'string'
                ? email.to
                : (email.to?.emailAddress?.address || email.to?.address || email.to);
            
            return {
                messageId: email.messageId || email.id,
                from: fromEmail,
                to: toEmail,
                subject: email.subject,
                bodyText: email.text,
                bodyHtml: email.html,
                receivedAt: email.date
            };
        });

        const response = await fetch('/api/admin/import-emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emails: importData })
        });

        const result = await response.json();
        console.log('✅ Email history with body:', result.imported, 'imported,', result.skipped, 'skipped');
        return result;
    } catch (error) {
        console.error('❌ Import error:', error);
    }
}

// Export it so it can be used
window.importEmailsToHistory = importEmailsToHistory;

/**
 * Initialize auto-refresh based on settings
 */
async function initializeAutoRefresh() {
    try {
        // Load settings from DATABASE
        const response = await fetch('/api/smart-reply/settings', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success && data.settings) {
            const isEnabled = data.settings.auto_refresh_enabled !== false; // Default true
            const interval = data.settings.refresh_interval || 60; // Default 60 seconds
            
            console.log(`📧 Auto-refresh settings loaded from DB: enabled=${isEnabled}, interval=${interval}s`);
            
            if (isEnabled) {
                startAutoRefresh(interval);
            } else {
                console.log('ℹ️ Auto-refresh is disabled in settings');
            }
        } else {
            console.warn('⚠️ Could not load settings, using defaults');
            startAutoRefresh(60); // Fallback to 60 seconds
        }
    } catch (error) {
        console.error('❌ Error loading auto-refresh settings:', error);
        // Don't start auto-refresh on error
    }
}

/**
 * Start auto-refresh with specified interval
 */
function startAutoRefresh(intervalSeconds) {
    // Clear existing interval if any
    stopAutoRefresh();
    
    console.log(`🔄 Starting auto-refresh every ${intervalSeconds} seconds`);
    
    // Initial immediate refresh if this is a new session
    const lastRefresh = sessionStorage.getItem('sr_last_refresh');
    if (!lastRefresh) {
        console.log('🔄 Performing initial refresh...');
        refreshEmails(true); // Silent initial refresh
    }
    
    // Set up interval
    autoRefreshInterval = setInterval(() => {
        console.log('🔄 Auto-refreshing emails...');
        refreshEmails(true); // Silent refresh
    }, intervalSeconds * 1000);
    
    // Update UI to show auto-refresh is active
    updateAutoRefreshIndicator(true, intervalSeconds);
}

/**
 * Stop auto-refresh
 */
function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
        console.log('⏹️ Auto-refresh stopped');
    }
    updateAutoRefreshIndicator(false);
}

/**
 * Update auto-refresh indicator in UI
 */
function updateAutoRefreshIndicator(active, intervalSeconds = null) {
    // Create indicator if it doesn't exist
    let indicator = document.getElementById('auto-refresh-indicator');
    if (!indicator && document.querySelector('.sidebar-header')) {
        indicator = document.createElement('div');
        indicator.id = 'auto-refresh-indicator';
        indicator.style.padding = '5px 15px';
        indicator.style.fontSize = '12px';
        indicator.style.borderTop = '1px solid #e0e0e0';
        document.querySelector('.sidebar-header').appendChild(indicator);
    }
    
    if (indicator) {
        if (active) {
            indicator.innerHTML = `
                <span style="color: #28a745;">
                    🔄 Auto-refresh: ON (${intervalSeconds}s)
                </span>
            `;
        } else {
            indicator.innerHTML = `
                <span style="color: #6c757d;">
                    Auto-refresh: OFF
                </span>
            `;
        }
    }
}

/**
 * Handle settings updates from settings tab
 */
function handleSettingsMessage(event) {
    if (event.data && event.data.type === 'sr-settings-updated') {
        const { autoRefresh } = event.data;
        if (autoRefresh) {
            if (autoRefresh.enabled) {
                startAutoRefresh(parseInt(autoRefresh.interval, 10));
            } else {
                stopAutoRefresh();
            }
        }
    }
}

/**
 * Get email signature from DATABASE
 */
async function getEmailSignature() {
    try {
        const response = await fetch('/api/smart-reply/settings', {
            credentials: 'include'
        });
        const data = await response.json();
        return data.settings?.email_signature || '';
    } catch (error) {
        console.error('Error fetching signature:', error);
        return '';
    }
}

/**
 * Format signature as HTML
 */
function formatSignatureHtml(signature) {
    if (!signature) return '';
    
    // Convert plain text to HTML, preserving line breaks
    const htmlSignature = signature
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/\n/g, '<br>');
    
    return `
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; color: #666;">
            ${htmlSignature}
        </div>
    `;
}

/**
 * Check if Microsoft account is connected
 */
async function checkConnection() {
    try {
        const response = await fetch('/api/msauth/status', {
            credentials: 'include'
        });
        const data = await response.json();

        if (!data.connected) {
            showConnectionWarning();
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error checking connection:', error);
        showConnectionWarning();
        return false;
    }
}

/**
 * Show connection warning
 */
function showConnectionWarning() {
    const emailList = document.getElementById('email-list');
    emailList.innerHTML = `
        <div class="connection-warning">
            <div class="connection-warning-icon">⚠️</div>
            <div class="connection-warning-content">
                <h3>Microsoft Account Not Connected</h3>
                <p>Please connect your Microsoft 365 account in Settings to view and send emails.</p>
                <button class="btn btn-primary" style="margin-top: 10px;" onclick="window.location.href='/html/smartreply-settings.html'">
                    Go to Settings
                </button>
            </div>
        </div>
    `;
}

/**
 * Load emails from API
 */
async function loadEmails() {
    const emailList = document.getElementById('email-list');
    
    // Show loading
    emailList.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading emails...</p>
        </div>
    `;

    // Reset state for fresh load
    emails = [];
    currentSkipToken = null;
    hasMoreEmails = true;
    isLoadingMoreEmails = false;

    try {
        // Load first batch of 50 emails
        const response = await fetch('/api/smart-reply/emails?limit=50', {
            credentials: 'include'
        });
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to load emails');
        }

        emails = data.emails || [];
        
        // Store skip token for pagination
        currentSkipToken = data.skipToken || null;
        
        // Check if there might be more emails
        if (emails.length < 50) {
            hasMoreEmails = false;
        }
        
        if (emails && emails.length > 0 && typeof importEmailsToHistory === 'function') {
            await importEmailsToHistory(emails);
        }

        // Update counts
        document.getElementById('inbox-count').textContent = emails.length;
        
        // Store last refresh time
        sessionStorage.setItem('sr_last_refresh', Date.now());

        // Render emails
        await renderEmailList();

        console.log(`✅ Loaded ${emails.length} emails (hasMore: ${hasMoreEmails})`);
    } catch (error) {
        console.error('❌ Error loading emails:', error);
        
        if (error.message.includes('connect')) {
            showConnectionWarning();
        } else {
            emailList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">❌</div>
                    <div class="empty-state-text">Failed to load emails</div>
                    <button class="btn btn-primary" style="margin-top: 15px;" onclick="loadEmails()">
                        Retry
                    </button>
                </div>
            `;
        }
    }
}

/**
 * NEW: Set up infinite scroll
 */
function setupInfiniteScroll() {
    const emailList = document.getElementById('email-list');
    
    if (!emailList) {
        console.error('❌ Email list element not found');
        return;
    }
    
    emailList.addEventListener('scroll', async () => {
        // Check if user has scrolled near the bottom (within 100px)
        const scrollPosition = emailList.scrollTop + emailList.clientHeight;
        const scrollHeight = emailList.scrollHeight;
        
        if (scrollPosition >= scrollHeight - 100) {
            // User is near bottom, load more emails
            if (!isLoadingMoreEmails && hasMoreEmails) {
                console.log('📥 Loading more emails...');
                await loadMoreEmails();
            }
        }
    });
    
    console.log('✅ Infinite scroll set up');
}

/**
 * NEW: Load more emails (for infinite scroll)
 */
async function loadMoreEmails() {
    if (isLoadingMoreEmails || !hasMoreEmails) {
        return;
    }
    
    isLoadingMoreEmails = true;
    
    // Show loading indicator at bottom
    const emailList = document.getElementById('email-list');
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-more-indicator';
    loadingDiv.className = 'loading-more';
    loadingDiv.innerHTML = `
        <div style="text-align: center; padding: 20px; color: #666;">
            <div class="loading-spinner" style="width: 24px; height: 24px; margin: 0 auto 8px; border: 3px solid #e5e7eb; border-radius: 50%; border-top-color: #6366f1; animation: spin 1s linear infinite;"></div>
            <p style="font-size: 13px;">Loading more emails...</p>
        </div>
    `;
    emailList.appendChild(loadingDiv);
    
    try {
        // Build URL with skip token if we have one
        let url = '/api/smart-reply/emails?limit=50';
        if (currentSkipToken) {
            url += `&skipToken=${encodeURIComponent(currentSkipToken)}`;
        }
        
        const response = await fetch(url, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to load more emails');
        }
        
        const newEmails = data.emails || [];
        
        // Check if there are more emails to load
        if (newEmails.length === 0 || newEmails.length < 50) {
            hasMoreEmails = false;
            console.log('✅ All emails loaded');
        }
        
        // Update skip token for next batch
        currentSkipToken = data.skipToken || null;
        
        // Add new emails to existing array
        emails = [...emails, ...newEmails];
        
        // Import to history if function exists
        if (newEmails && newEmails.length > 0 && typeof importEmailsToHistory === 'function') {
            await importEmailsToHistory(newEmails);
        }
        
        // Update count
        document.getElementById('inbox-count').textContent = emails.length;
        
        // Remove loading indicator
        const indicator = document.getElementById('loading-more-indicator');
        if (indicator) indicator.remove();
        
        // Re-render the email list to include new emails
        await renderEmailList();
        
        console.log(`✅ Loaded ${newEmails.length} more emails (total: ${emails.length})`);
        
    } catch (error) {
        console.error('❌ Error loading more emails:', error);
        
        // Remove loading indicator
        const indicator = document.getElementById('loading-more-indicator');
        if (indicator) indicator.remove();
        
        // Show error message
        const errorDiv = document.createElement('div');
        errorDiv.style.textAlign = 'center';
        errorDiv.style.padding = '20px';
        errorDiv.style.color = '#ef4444';
        errorDiv.innerHTML = `
            <p>Failed to load more emails</p>
            <button class="btn btn-primary" style="margin-top: 10px;" onclick="loadMoreEmails()">
                Retry
            </button>
        `;
        emailList.appendChild(errorDiv);
    } finally {
        isLoadingMoreEmails = false;
    }
}


/**
 * Render email list
 */

async function renderEmailList() {
    const emailList = document.getElementById('email-list');

    if (emails.length === 0) {
        emailList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-text">No emails found</div>
            </div>
        `;
        return;
    }

    // Get match status for all emails at once
    const emailsWithStatus = await Promise.all(emails.map(async (email, index) => {
        // Extract email address from email.from (might be object or string)
        const senderEmail = typeof email.from === 'string' 
            ? email.from 
            : (email.from?.emailAddress?.address || email.from?.address || email.from);
        
        const status = await checkEmailMatchStatus(email.messageId, senderEmail);
        return { ...email, index, matchStatus: status };
    }));

    emailList.innerHTML = emailsWithStatus.map((email) => {
        const date = new Date(email.date);
        const timeStr = formatTime(date);
        const unreadClass = email.isRead ? '' : 'unread';
        
        // Determine badge
        let badge = '';
        if (email.matchStatus && email.matchStatus.isMatched) {
            badge = `<span class="enquiry-badge badge-linked">${email.matchStatus.enquiryId}</span>`;
        } else {
            badge = `<span class="enquiry-badge badge-new">NEW</span>`;
        }
        
        return `
            <div class="email-item ${unreadClass}" onclick="selectEmail(${email.index})">
                <div class="email-header-row">
                    <div class="email-from">
                        <span>${escapeHtml(email.fromName || email.from)}</span>
                    </div>
                    <div class="email-time">${timeStr}</div>
                </div>
                <div class="email-subject">${escapeHtml(email.subject)}</div>
                <div class="email-preview">${escapeHtml(email.bodyPreview || '')}</div>
                ${badge}
            </div>
        `;
    }).join('');
}


/**
 * Select an email to view
 */
function selectEmail(index) {
    currentEmail = emails[index];
    
    // Update active state
    document.querySelectorAll('.email-item').forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Render email viewer
    renderEmailViewer();
}

async function renderEmailViewer() {
    const viewer = document.getElementById('email-viewer');
    
    if (!currentEmail) {
        viewer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-text">Select an email to view</div>
            </div>
        `;
        return;
    }

    const date = new Date(currentEmail.date);
    const dateStr = date.toLocaleString();

    // Extract email address from currentEmail.from
    const senderEmail = typeof currentEmail.from === 'string' 
        ? currentEmail.from 
        : (currentEmail.from?.emailAddress?.address || currentEmail.from?.address || currentEmail.from);

    // Check match status for this email
    const matchStatus = await checkEmailMatchStatus(currentEmail.messageId, senderEmail);

    // Build enquiry panel HTML
    let enquiryPanel = '';
    if (matchStatus && matchStatus.isMatched) {
        // Email is linked to an enquiry - COMPACT PROFESSIONAL VERSION
        enquiryPanel = `
            <div style="background:linear-gradient(135deg, #1e3a5f 0%, #2a4a6b 100%);border-radius:6px;padding:10px 14px;margin-bottom:16px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                <div style="display:flex;align-items:center;justify-content:space-between;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span style="color:#c9a961;font-size:18px;">🔗</span>
                        <span style="font-weight:600;color:white;font-size:13px;letter-spacing:0.3px;">${matchStatus.enquiryId}</span>
                    </div>
                    <button onclick="openEnquiry('${matchStatus.enquiryId}')" style="background:#c9a961;color:white;border:none;padding:6px 14px;border-radius:4px;font-size:12px;cursor:pointer;font-weight:600;transition:all 0.2s;box-shadow:0 2px 4px rgba(0,0,0,0.15);" onmouseover="this.style.background='#b8975a'" onmouseout="this.style.background='#c9a961'">
                        View Details
                    </button>
                </div>
            </div>
        `;
    } else {
        // Email is NEW and needs matching - COMPACT PROFESSIONAL VERSION
        enquiryPanel = `
            <div style="background:#fee2e2;border-left:4px solid #dc2626;border-radius:6px;padding:12px;margin-bottom:16px;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
                    <span style="color:#dc2626;font-size:16px;">⚠️</span>
                    <span style="font-weight:600;color:#991b1b;font-size:13px;">NEW - Not Linked</span>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button onclick="showLinkOptions('${currentEmail.messageId}', '${escapeHtml(currentEmail.from)}')" style="background:#1e3a5f;color:white;border:none;padding:6px 12px;border-radius:4px;font-size:12px;cursor:pointer;font-weight:500;flex:1;min-width:120px;">
                        Link to Existing
                    </button>
                    <button onclick="createEnquiryFromEmail('${currentEmail.messageId}', '${escapeHtml(currentEmail.from)}')" style="background:#c9a961;color:white;border:none;padding:6px 12px;border-radius:4px;font-size:12px;cursor:pointer;font-weight:500;flex:1;min-width:120px;">
                        Create New
                    </button>
                </div>
                <div id="link-options-${currentEmail.messageId}" style="display:none;margin-top:12px;padding-top:12px;border-top:1px solid #fca5a5;">
                    <input type="text" id="link-enquiry-id" placeholder="Enter INQ-ID or search..." style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;font-size:12px;margin-bottom:8px;" oninput="searchEnquiriesInline(this.value)">
                    <div id="search-results-inline" style="max-height:150px;overflow-y:auto;"></div>
                    <button onclick="linkEmailToEnquiry('${currentEmail.messageId}', '${escapeHtml(currentEmail.from)}')" style="background:#16a34a;color:white;border:none;padding:6px 12px;border-radius:4px;font-size:12px;cursor:pointer;font-weight:500;width:100%;margin-top:8px;">
                        Link Now
                    </button>
                </div>
            </div>
        `;
    }

    viewer.innerHTML = `
        <div class="email-viewer-header">
            <div class="email-subject-line">${escapeHtml(currentEmail.subject)}</div>
            <div class="email-meta">
                <div class="email-meta-item">
                    <span class="email-meta-label">From:</span>
                    <span class="email-meta-value">${escapeHtml(currentEmail.fromName || currentEmail.from)}</span>
                </div>
                <div class="email-meta-item">
                    <span class="email-meta-label">Date:</span>
                    <span class="email-meta-value">${dateStr}</span>
                </div>
            </div>
        </div>
        
        ${enquiryPanel}
        
        <div class="email-actions" style="display:flex;gap:8px;margin-bottom:16px;">
            <button class="btn btn-primary" onclick="replyToCurrentEmail()" style="background:#1e3a5f;color:white;border:none;padding:8px 16px;border-radius:4px;font-size:13px;cursor:pointer;font-weight:500;">Reply</button>
            <button class="btn btn-secondary" onclick="replyWithAI()" style="background:#c9a961;color:white;border:none;padding:8px 16px;border-radius:4px;font-size:13px;cursor:pointer;font-weight:500;">SMART Reply</button>
            <button class="btn btn-danger" onclick="deleteEmail('${currentEmail.messageId}')" style="background:#dc2626;color:white;border:none;padding:8px 16px;border-radius:4px;font-size:13px;cursor:pointer;font-weight:500;margin-left:auto;">🗑️ Delete</button>
        </div>
        
        <div class="email-body" id="email-body-content">
            ${currentEmail.body || currentEmail.bodyPreview || '<p>No content</p>'}
        </div>
    `;
}

async function checkEmailMatchStatus(messageId, senderEmail) {
    try {
        console.log('🔍 Checking status for:', senderEmail);
        const response = await fetch('/api/smart-reply/admin/check-email-match', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ messageId, senderEmail })
        });
        const data = await response.json();
        console.log('📊 API returned:', data);
        console.log('📊 Full response details:', { 
            status: response.status, 
            ok: response.ok,
            isMatched: data.isMatched,
            enquiryId: data.enquiryId 
        });
        return data;
    } catch (error) {
        console.error('Error checking match status:', error);
        return { isMatched: false };
    }
}

// ===================================================================
// STEP 4: Link email to enquiry
// ===================================================================

function showLinkOptions(messageId, senderEmail) {
    const optionsDiv = document.getElementById(`link-options-${messageId}`);
    if (optionsDiv) {
        optionsDiv.style.display = optionsDiv.style.display === 'none' ? 'block' : 'none';
    }
}

async function linkEmailToEnquiry(messageId, senderEmail) {
    const enquiryId = document.getElementById('link-enquiry-id').value.trim().toUpperCase();
    
    if (!enquiryId || !enquiryId.startsWith('INQ-')) {
        showNotification('Please enter a valid enquiry ID (e.g., INQ-1234567890)', 'error');
        return;
    }

    try {
        const response = await fetch('/api/smart-reply/admin/link-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ enquiryId, messageId, senderEmail })
        });

        const data = await response.json();
        
        if (data.success) {
            showNotification(`✅ Email linked to ${enquiryId}`, 'success');
            // Refresh the viewer to show updated status
            await renderEmailViewer();
            // Refresh email list to update badge
            await renderEmailList();
        } else {
            showNotification(data.error || 'Failed to link email', 'error');
        }
    } catch (error) {
        console.error('Error linking email:', error);
        showNotification('Failed to link email', 'error');
    }
}

// ===================================================================
// STEP 5: Create enquiry from email
// ===================================================================

async function createEnquiryFromEmail(messageId, senderEmail) {
    if (!confirm(`Create a new enquiry from ${senderEmail}?`)) {
        return;
    }

    try {
        const response = await fetch('/api/smart-reply/admin/create-enquiry-from-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ 
                messageId, 
                senderEmail,
                senderName: currentEmail.fromName || senderEmail,
                subject: currentEmail.subject
            })
        });

        const data = await response.json();
        
        if (data.success) {
            showNotification(`✅ New enquiry created: ${data.enquiryId}`, 'success');
            // Refresh the viewer to show updated status
            await renderEmailViewer();
            // Refresh email list to update badge
            await renderEmailList();
            
            // Optionally open the new enquiry
            if (confirm('Would you like to view the new enquiry?')) {
                openEnquiry(data.enquiryId);
            }
        } else {
            showNotification(data.error || 'Failed to create enquiry', 'error');
        }
    } catch (error) {
        console.error('Error creating enquiry:', error);
        showNotification('Failed to create enquiry', 'error');
    }
}

// ===================================================================
// STEP 6: Inline search for enquiries
// ===================================================================

let searchTimeout;
async function searchEnquiriesInline(query) {
    clearTimeout(searchTimeout);
    
    const resultsContainer = document.getElementById('search-results-inline');
    
    if (!query || query.length < 2) {
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
        return;
    }

    searchTimeout = setTimeout(async () => {
        try {
            const response = await fetch(`/api/smart-reply/admin/enquiries/search?q=${encodeURIComponent(query)}`, {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success && data.enquiries && data.enquiries.length > 0) {
                resultsContainer.style.display = 'block';
                resultsContainer.innerHTML = data.enquiries.map(enq => `
                    <div class="search-result-item" onclick="selectEnquiryInline('${enq.id}')" style="padding:8px;cursor:pointer;border-bottom:1px solid #eee;hover:background:#f5f5f5;">
                        <div style="font-weight:600;font-size:12px;color:#1e3a5f;">${enq.id}</div>
                        <div style="font-size:12px;color:#333;">${escapeHtml(enq.first_name + ' ' + enq.family_name)}</div>
                        <div style="font-size:11px;color:#666;">${escapeHtml(enq.email)}</div>
                    </div>
                `).join('');
            } else {
                resultsContainer.style.display = 'block';
                resultsContainer.innerHTML = '<div style="padding:8px;font-size:12px;color:#666;">No enquiries found</div>';
            }
        } catch (error) {
            console.error('Search error:', error);
            resultsContainer.innerHTML = '<div style="padding:8px;font-size:12px;color:#dc2626;">Error searching</div>';
        }
    }, 300);
}

function selectEnquiryInline(enquiryId) {
    document.getElementById('link-enquiry-id').value = enquiryId;
    document.getElementById('search-results-inline').style.display = 'none';
}

// ===================================================================
// STEP 7: Helper function to open enquiry
// ===================================================================

function openEnquiry(enquiryId) {
    // Try to open in parent window if in iframe
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({
            type: 'open-enquiry',
            enquiryId: enquiryId
        }, '*');
    } else {
        // Open in new tab
        window.open(`/admin/enquiry/${enquiryId}`, '_blank');
    }
}

console.log('✅ Enhanced Smart Reply email matching loaded');

/**
 * Create formatted quoted HTML for replies - preserves original formatting
 */
function createQuotedEmailHtml(email) {
    const originalDate = new Date(email.date).toLocaleString();
    const originalFrom = escapeHtml(email.fromName || email.from);
    const originalTo = escapeHtml(email.to || '');
    const originalSubject = escapeHtml(email.subject);
    
    // Use original HTML if available, otherwise convert text
    const emailBody = email.html || escapeHtml(email.text || email.bodyPreview || '').replace(/\n/g, '<br>');
    
    return `
        <div style="border-left: 3px solid #ccc; margin: 20px 0; padding-left: 15px; color: #666; font-size: 13px;">
            <p style="margin: 5px 0;"><strong>On ${originalDate}, ${originalFrom} wrote:</strong></p>
            <div style="margin-top: 10px; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
                ${emailBody}
            </div>
        </div>
    `;
}

/**
 * Reply to current email
 */
function replyToCurrentEmail() {
    if (!currentEmail) return;

    replyToEmail = currentEmail;
    
    // Create formatted HTML quote
    const quotedHtml = createQuotedEmailHtml(currentEmail);
    
    document.getElementById('compose-to').value = currentEmail.from;
    document.getElementById('compose-subject').value = `Re: ${currentEmail.subject}`;
    
    // Store the HTML-formatted quoted email as a data attribute
    const composeBody = document.getElementById('compose-body');
    composeBody.dataset.quotedHtml = quotedHtml;
    composeBody.value = ''; // Start with empty compose area
    composeBody.placeholder = 'Type your reply here...';

    // Show AI section for replies
    document.getElementById('ai-section').style.display = 'block';
    
    // Update modal title
    const modalTitle = document.querySelector('.modal-header h3');
    if (modalTitle) {
        modalTitle.textContent = `↩️ Reply to ${currentEmail.fromName || currentEmail.from}`;
    }

    openComposeModal();
}

/**
 * Reply with AI
 */
function replyWithAI() {
    if (!currentEmail) return;

    replyToCurrentEmail();
    
    // Automatically trigger AI generation
    setTimeout(() => {
        generateAIResponse();
    }, 500);
}

async function generateAIResponse() {
  if (!replyToEmail) {
    showNotification('No email selected for reply', 'error');
    return;
  }

  const aiSection = document.getElementById('ai-section');
  const originalHtml = aiSection ? aiSection.innerHTML : '';

  if (aiSection) {
    aiSection.innerHTML = `
      <div class="loading">
        <div class="loading-spinner"></div>
        <p>Generating SMART Reply...</p>
      </div>
    `;
  }

  try {
    const response = await fetch('/api/smart-reply/generate-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        originalEmail: {
          from: replyToEmail.from,
          subject: replyToEmail.subject,
          // send BOTH text and html so the AI has clean text
          text: replyToEmail.text || replyToEmail.bodyPreview || '',
          html: replyToEmail.html || ''
        },
        enquiryId: currentEmail?.enquiryId || null,
        instructions: 'Generate a professional response. Do not include a signature as it will be added automatically.'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    if (!data || data.success === false) {
      throw new Error((data && data.error) || 'Failed to generate response');
    }

    // Prefer clean text; fall back to stripped HTML
    let generatedText =
      (data.body && data.body.text) ||
      (data.response && data.response.text) ||
      (data.text) ||
      (data.body && data.body.html && stripHtml(data.body.html)) ||
      (data.response && data.response.html && stripHtml(data.response.html)) ||
      (data.html && stripHtml(data.html)) ||
      '';

    generatedText = generatedText.trim();
    if (!generatedText) throw new Error('No generated text found in API response');

    // Set AI-generated reply in compose body + stash pretty HTML
    const composeBody = document.getElementById('compose-body');
    composeBody.value = generatedText;

    const aiHtml =
      (data.body && data.body.html) ||
      (data.response && data.response.html) ||
      data.html ||
      '';
    composeBody.dataset.aiHtml = aiHtml || '';

    if (aiSection) aiSection.innerHTML = originalHtml;
    showNotification('✅ SMART Reply generated!', 'success');

  } catch (error) {
    console.error('Error generating AI response:', error);
    if (aiSection) aiSection.innerHTML = originalHtml;
    showNotification('Failed to generate SMART Reply: ' + error.message, 'error');
  }
}

/**
 * Convert plain text URLs to clickable HTML links
 */
function convertUrlsToLinks(text) {
    // Regex to match URLs
    const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;
    
    return text.replace(urlRegex, (url) => {
        return `<a href="${url}" style="color: #0066cc; text-decoration: underline;">${url}</a>`;
    });
}

// Fixed sendEmail function with proper error handling
// Add this to your smartreply-email.js or replace the existing sendEmail function

async function sendEmail(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }

    const to = document.getElementById('compose-to').value.trim();
    const subject = document.getElementById('compose-subject').value.trim();
    const bodyText = document.getElementById('compose-body').value;
    const composeBody = document.getElementById('compose-body');
    const quotedHtml = composeBody.dataset.quotedHtml || '';

    // Basic validation
    if (!to) {
        showNotification('Please add a recipient email address.', 'error');
        return;
    }
    if (!subject) {
        showNotification('Please add a subject.', 'error');
        return;
    }
    if (!bodyText || !bodyText.trim()) {
        showNotification('Your message is empty. Please write something.', 'error');
        return;
    }

    // Get and format signature (but don't add to body - server handles it)
    const signature = await getEmailSignature();
    // const signatureHtml = formatSignatureHtml(signature); // Not needed, server adds it

    // Prepare HTML body WITHOUT signature (server adds it)
    const aiGeneratedHtml = composeBody.dataset.aiHtml || '';
    let fullHtmlBody;

    if (aiGeneratedHtml) {
        // Use AI-generated HTML if available
        fullHtmlBody = aiGeneratedHtml + (quotedHtml || '');
    } else {
        // Convert plain text with URL detection
        const convertedBody = textToCleanHtml(bodyText);
        fullHtmlBody = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #333;">
                ${convertedBody}
                ${quotedHtml}
            </div>
        `;
    }

    // Save sent email to history
        try {
            await fetch('/api/admin/save-sent-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enquiryId: currentEnquiryId || null,  // Link to enquiry if available
                    messageId: data.messageId || 'sent-' + Date.now(),
                    toEmail: to,
                    toName: to,
                    subject: subject,
                    bodyText: bodyText,
                    bodyHtml: fullHtmlBody
                })
            });
            console.log('✅ Sent email saved to history');
        } catch (err) {
            console.error('Failed to save to history:', err);
        }
    
    // Find the submit button - handle multiple possible IDs and selectors
    let submitBtn = document.getElementById('send-email-btn') || 
                    document.querySelector('button[type="submit"]') ||
                    document.querySelector('.modal-footer button[onclick*="sendEmail"]') ||
                    document.querySelector('button.btn-primary[type="submit"]');
    
    let originalText = '';
    let originalDisabled = false;
    
    // Only update button if it exists
    if (submitBtn) {
        originalText = submitBtn.innerHTML;
        originalDisabled = submitBtn.disabled;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
    } else {
        console.log('Submit button not found, but continuing with send...');
    }

    // Send email via API
    try {
        const response = await fetch('/api/smart-reply/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                to: to,
                subject: subject,
                body: bodyText,
                inReplyTo: replyToEmail ? replyToEmail.id : null,
                enquiryId: currentEnquiryId || null
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            if (data.needsAuth) {
                showNotification('Please connect your Microsoft account. Go to Settings and connect your account.', 'error');
                throw new Error(data.error || 'Microsoft account not connected');
            }

            // Surface backend "details" (Graph error message) if present
            const msg = data.error || 'Failed to send email';
            const details = data.details ? ` – ${data.details}` : '';
            throw new Error(msg + details);
        }

        showNotification('✅ Email sent successfully!', 'success');
        
        // Email is automatically saved to email_history by backend when enquiryId is provided
        if (currentEnquiryId) {
            console.log('✅ Email linked to enquiry:', currentEnquiryId);
        } else {
            console.log('ℹ️ No enquiry ID - email not linked to any enquiry');
        }
        
        closeComposeModal();

        // Refresh emails (sent + inbox counts)
        await loadEmails();
        
        // Select sent folder if function exists
        if (typeof selectFolder === 'function') {
            selectFolder('sent');
        }

        // Refresh emails (sent + inbox counts)
        await loadEmails();
        
        // Select sent folder if function exists
        if (typeof selectFolder === 'function') {
            selectFolder('sent');
        }

    } catch (error) {
        console.error('❌ Error sending email:', error);
        showNotification(String(error.message || error), 'error');
    } finally {
        // Restore button state only if it exists
        if (submitBtn) {
            submitBtn.innerHTML = originalText || 'Send';
            submitBtn.disabled = originalDisabled;
        }
    }
}

// Helper function to get email signature
function getEmailSignature() {
    return localStorage.getItem('sr_email_signature') || '';
}

// Helper function to format signature as HTML
function formatSignatureHtml(signature) {
    if (!signature) return '';
    
    // If signature already contains HTML tags, use it as-is
    if (signature.includes('<') && signature.includes('>')) {
        return `
            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                ${signature}
            </div>
        `;
    }
    
    // Convert plain text to HTML, preserving line breaks
    const htmlSignature = signature
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/\n/g, '<br>');
    
    return `
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; color: #666;">
            ${htmlSignature}
        </div>
    `;
}

// Helper function to convert text to clean HTML
function textToCleanHtml(text) {
    if (!text) return '';
    
    let out = text;
    
    // Fix malformed AI-generated link attempts
    out = out.replace(/(https?:\/\/[^"\s]+)"\s*style="[^"]*">([^<]+)/g, (match, url, linkText) => {
        const cleanUrl = url.replace(/"$/, '');
        return `<a href="${cleanUrl}" style="color:#0066cc;text-decoration:underline;">${linkText}</a>`;
    });
    
    // Handle markdown-style links [text](url)
    out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (match, linkText, url) => {
        return `<a href="${url}" style="color:#0066cc;text-decoration:underline;">${linkText}</a>`;
    });
    
    // Handle remaining bare URLs
    const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;
    out = out.replace(urlRegex, (url) => {
        return `<a href="${url}" style="color:#0066cc;text-decoration:underline;">${url}</a>`;
    });
    
    // Handle **bold** markdown
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Convert paragraphs & line breaks
    return out
        .split('\n\n')
        .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
        .join('\n');
}

// Ensure showNotification function exists
if (typeof showNotification === 'undefined') {
    window.showNotification = function(message, type = 'info') {
        // Try to find notification element
        const notification = document.getElementById('notification');
        if (notification) {
            const icon = document.getElementById('notification-icon');
            const title = document.getElementById('notification-title');
            const messageEl = document.getElementById('notification-message');
            
            const config = {
                success: { icon: '✅', title: 'Success' },
                error: { icon: '❌', title: 'Error' },
                info: { icon: 'ℹ️', title: 'Info' }
            };
            
            if (icon) icon.textContent = config[type].icon;
            if (title) title.textContent = config[type].title;
            if (messageEl) messageEl.textContent = message;
            
            notification.className = `notification ${type} show`;
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 4000);
        } else {
            // Fallback to alert if notification element doesn't exist
            console.log(`[${type.toUpperCase()}] ${message}`);
            if (type === 'error') {
                alert('Error: ' + message);
            }
        }
    };
}

// Ensure closeComposeModal function exists
if (typeof closeComposeModal === 'undefined') {
    window.closeComposeModal = function() {
        const modal = document.getElementById('compose-modal');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
        }
        
        // Reset form fields
        const fields = ['compose-to', 'compose-subject', 'compose-body'];
        fields.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = '';
                if (element.dataset) {
                    element.dataset.quotedHtml = '';
                    element.dataset.aiHtml = '';
                }
            }
        });
        
        // Hide AI section
        const aiSection = document.getElementById('ai-section');
        if (aiSection) {
            aiSection.style.display = 'none';
        }
        
        // Reset modal title if exists
        const modalTitle = document.querySelector('.modal-header h3');
        if (modalTitle) {
            modalTitle.textContent = '✉️ New Message';
        }
        
        // Clear reply context
        if (typeof replyToEmail !== 'undefined') {
            replyToEmail = null;
        }
    };
}

// Ensure loadEmails function exists
if (typeof loadEmails === 'undefined') {
    window.loadEmails = async function() {
        console.log('Loading emails...');
        try {
            const response = await fetch('/api/smart-reply/emails?limit=250', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                console.log('Emails loaded successfully');
                // Update UI with emails if needed
                if (typeof renderEmailList === 'function') {
                    renderEmailList();
                }
            }
        } catch (error) {
            console.error('Error loading emails:', error);
        }
    };
}

// Export for global use
window.sendEmail = sendEmail;

console.log('✅ sendEmail function fixed and loaded');

/**
 * Open compose modal
 */
function openComposeModal() {
    document.getElementById('compose-modal').classList.add('show');
    
    // Show enquiry indicator if we have an ID
    if (currentEnquiryId) {
        let indicator = document.getElementById('compose-enquiry-indicator');
        if (!indicator) {
            const modalHeader = document.querySelector('.modal-header');
            if (modalHeader) {
                indicator = document.createElement('div');
                indicator.id = 'compose-enquiry-indicator';
                indicator.style.cssText = 'font-size: 12px; color: #666; margin-top: 5px; padding: 4px 8px; background: #f0f0f0; border-radius: 4px; display: inline-block;';
                indicator.innerHTML = `📌 Linked to Enquiry: <strong>${currentEnquiryId}</strong>`;
                modalHeader.appendChild(indicator);
            }
        } else {
            indicator.innerHTML = `📌 Linked to Enquiry: <strong>${currentEnquiryId}</strong>`;
            indicator.style.display = 'block';
        }
    } else {
        const indicator = document.getElementById('compose-enquiry-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }
}

/**
 * Close compose modal
 */
function closeComposeModal() {
    document.getElementById('compose-modal').classList.remove('show');
    
    // Reset form
    document.getElementById('compose-to').value = '';
    document.getElementById('compose-subject').value = '';
    document.getElementById('compose-body').value = '';
    document.getElementById('compose-body').dataset.quotedHtml = '';
    document.getElementById('compose-body').dataset.aiHtml = '';
    
    // Hide AI section
    document.getElementById('ai-section').style.display = 'none';
    
    // Reset modal title
    const modalTitle = document.querySelector('.modal-header h3');
    if (modalTitle) {
        modalTitle.textContent = '✉️ New Message';
    }
    
    replyToEmail = null;
}

/**
 * Refresh emails (can be silent)
 */
async function refreshEmails(silent = false) {
    console.log('🔄 Refreshing emails...');
    
    if (!silent) {
        const refreshBtn = document.querySelector('[onclick="refreshEmails()"]');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-sync fa-spin"></i>';
            refreshBtn.disabled = true;
        }
    }
    
    // FIXED: Refresh the current folder, not always inbox
    if (currentFolder === 'sent') {
        await loadSentEmails();
    } else if (currentFolder === 'drafts') {
        await loadDrafts();
    } else {
        await loadEmails();
    }
    
    if (!silent) {
        showNotification('Emails refreshed', 'info');
        
        const refreshBtn = document.querySelector('[onclick="refreshEmails()"]');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-sync"></i>';
            refreshBtn.disabled = false;
        }
    }
}

/**
 * Save email as draft to Outlook
 */
async function saveDraft() {
    const to = document.getElementById('compose-to').value;
    const subject = document.getElementById('compose-subject').value;
    const body = document.getElementById('compose-body').value;
    
    if (!to && !subject && !body) {
        showNotification('Draft is empty', 'error');
        return;
    }
    
    try {
        const signature = getEmailSignature();
        const htmlBody = textToCleanHtml(body) + formatSignatureHtml(signature);
        
        const response = await fetch('/api/smart-reply/save-draft', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                to: to || '',
                subject: subject || '(No Subject)',
                body: htmlBody
            })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to save draft');
        }
        
        showNotification('✅ Draft saved successfully!', 'success');
        closeComposeModal();
        
        // Refresh drafts folder if currently viewing it
        if (currentFolder === 'drafts') {
            await loadDrafts();
        }
        
    } catch (error) {
        console.error('❌ Error saving draft:', error);
        showNotification('Failed to save draft: ' + error.message, 'error');
    }
}

window.saveDraft = saveDraft;

/**
 * Select folder
 */
function selectFolder(folder) {
    currentFolder = folder;
    
    console.log('📁 Switching to folder:', folder);
    
    // Update active state on sidebar
    document.querySelectorAll('.folder-item').forEach(item => {
        if (item.dataset.folder === folder) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update folder title
    const folderTitles = {
        'inbox': 'Inbox',
        'sent': 'Sent',
        'drafts': 'Drafts'
    };
    document.getElementById('folder-title').textContent = folderTitles[folder] || 'Inbox';
    
    // Load appropriate content
    if (folder === 'inbox') {
        loadEmails();
    } else if (folder === 'sent') {
        loadSentEmails();
    } else if (folder === 'drafts') {
        loadDrafts();
    }
    
    // Clear viewer
    document.getElementById('email-viewer').innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">🔭</div>
            <div class="empty-state-text">Select an email to view</div>
        </div>
    `;
}


/**
 * Load sent emails
 */
async function loadSentEmails() {
    const emailList = document.getElementById('email-list');
    
    // Show loading
    emailList.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading sent emails...</p>
        </div>
    `;

    try {
        const response = await fetch('/api/smart-reply/sent-emails?limit=250', {
            credentials: 'include'
        });
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to load sent emails');
        }

        sentEmails = data.emails || [];
        
        // Update count
        document.getElementById('sent-count').textContent = sentEmails.length;

        if (sentEmails.length === 0) {
            emailList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔭</div>
                    <div class="empty-state-text">No sent emails</div>
                </div>
            `;
            return;
        }

        // Render sent emails
        emailList.innerHTML = sentEmails.map((email, index) => {
            const date = new Date(email.sent_at);
            const timeStr = formatTime(date);
            
            return `
                <div class="email-item" onclick="viewSentEmail(${index})">
                    <div class="email-from">
                        <span>To: ${escapeHtml(email.recipient)}</span>
                        <span class="email-time">${timeStr}</span>
                    </div>
                    <div class="email-subject">${escapeHtml(email.subject)}</div>
                    <div class="email-preview">${escapeHtml(stripHtml(email.body_html || '').substring(0, 100))}...</div>
                    ${email.enquiry_id ? `
                    <div class="email-enquiry-tag" style="font-size: 11px; color: #666; margin-top: 4px; padding: 2px 6px; background: #f5f5f5; border-radius: 3px; display: inline-block;">
                        📌 ${email.enquiry_id}
                    </div>
                    ` : ''}
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error loading sent emails:', error);
        emailList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">❌</div>
                <div class="empty-state-text">Failed to load sent emails</div>
            </div>
        `;
    }
}

/**
 * View a sent email
 */
function viewSentEmail(index) {
    const viewer = document.getElementById('email-viewer');
    const item = sentEmails[index];
    if (!item) {
        viewer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔭</div>
                <div class="empty-state-text">No sent email found</div>
            </div>
        `;
        return;
    }

    // Normalise fields from DB row shape
    const to = item.recipient || '';
    const subject = item.subject || '(No Subject)';
    const date = item.sent_at ? new Date(item.sent_at) : new Date();
    const dateStr = date.toLocaleString();
    const bodyHtml = item.body_html || '';

    // Render the viewer
    viewer.innerHTML = `
        <div class="email-viewer-header">
            <div class="email-subject-line">${escapeHtml(subject)}</div>
            <div class="email-meta">
                <div class="email-meta-item">
                    <span class="email-meta-label">To:</span>
                    <span>${escapeHtml(to)}</span>
                </div>
                <div class="email-meta-item">
                    <span class="email-meta-label">Date:</span>
                    <span>${dateStr}</span>
                </div>
            </div>
            <div class="email-actions">
                <button class="btn btn-primary" onclick="composeFollowUp('${to.replace(/'/g, "\\'")}', '${('Re: ' + subject).replace(/'/g, "\\'")}')">
                    ✏️ Compose follow-up
                </button>
            </div>
        </div>
        <div class="email-content">
            <div class="email-body">
                ${bodyHtml || '<p>(No content)</p>'}
            </div>
        </div>
    `;
}


async function loadDrafts() {
    const emailList = document.getElementById('email-list');
    
    // Show loading
    emailList.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading drafts...</p>
        </div>
    `;

    try {
        const response = await fetch('/api/smart-reply/drafts?limit=250', {
            credentials: 'include'
        });
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to load drafts');
        }

        const drafts = data.emails || [];
        
        // Update count
        document.getElementById('drafts-count').textContent = drafts.length;

        if (drafts.length === 0) {
            emailList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔭</div>
                    <div class="empty-state-text">No drafts</div>
                </div>
            `;
            return;
        }

        // Render drafts
        emailList.innerHTML = drafts.map((draft, index) => {
            const date = new Date(draft.date || draft.created_at);
            const timeStr = formatTime(date);
            
            return `
                <div class="email-item" onclick="viewDraft(${index}, ${JSON.stringify(draft).replace(/"/g, '&quot;')})">
                    <div class="email-header-row">
                        <div class="email-from">To: ${escapeHtml(draft.to || draft.recipient || '(No recipient)')}</div>
                        <div class="email-time">${timeStr}</div>
                    </div>
                    <div class="email-subject">${escapeHtml(draft.subject || '(No Subject)')}</div>
                    <div class="email-preview">${escapeHtml(draft.bodyPreview || draft.text || '').substring(0, 100)}</div>
                </div>
            `;
        }).join('');

        console.log(`✅ Loaded ${drafts.length} drafts`);
    } catch (error) {
        console.error('❌ Error loading drafts:', error);
        
        emailList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">❌</div>
                <div class="empty-state-text">Failed to load drafts</div>
                <button class="btn btn-primary" style="margin-top: 15px;" onclick="loadDrafts()">
                    Retry
                </button>
            </div>
        `;
    }
}

/**
 * View a draft - NEW FUNCTION
 */
function viewDraft(index, draftData) {
    const viewer = document.getElementById('email-viewer');
    
    const date = new Date(draftData.date || draftData.created_at);
    const dateStr = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    viewer.innerHTML = `
        <div class="email-viewer-header">
            <div class="email-subject-line">${escapeHtml(draftData.subject || '(No Subject)')}</div>
            
            <div class="email-meta">
                <div class="email-sender">
                    <div class="sender-info">
                        <div class="sender-name">Draft</div>
                        <div class="sender-email">To: ${escapeHtml(draftData.to || draftData.recipient || 'No recipient')}</div>
                    </div>
                </div>
                <div class="email-timestamp">${dateStr}</div>
            </div>
            
            <div class="email-actions">
                <button class="action-btn primary" onclick="editDraft('${draftData.id}')">
                    ✏️ Edit Draft
                </button>
                <button class="action-btn" onclick="deleteDraft('${draftData.id}')">
                    🗑️ Delete
                </button>
            </div>
        </div>
        
        <div class="email-content">
            <div class="email-body">
                ${draftData.html || draftData.body_html || draftData.text || draftData.body_text || '(No content)'}
            </div>
        </div>
    `;
}

/**
 * Edit draft - placeholder
 */
function editDraft(draftId) {
    alert('Edit draft functionality coming soon! Draft ID: ' + draftId);
    // TODO: Load draft into compose modal
}

/**
 * Delete draft - placeholder  
 */
function deleteDraft(draftId) {
    if (confirm('Delete this draft?')) {
        alert('Delete draft functionality coming soon! Draft ID: ' + draftId);
        // TODO: Call Microsoft Graph API to delete draft
    }
}

/**
 * Open compose pre-filled to the same recipient/subject (for sent view)
 */
function composeFollowUp(to, subject) {
    document.getElementById('compose-to').value = to || '';
    document.getElementById('compose-subject').value = subject || '';
    document.getElementById('compose-body').value = '';
    document.getElementById('compose-body').dataset.quotedHtml = '';
    // Hide AI section by default for a fresh compose from Sent
    document.getElementById('ai-section').style.display = 'none';
    // Reset any existing reply context
    replyToEmail = null;
    openComposeModal();
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const icon = document.getElementById('notification-icon');
    const title = document.getElementById('notification-title');
    const messageEl = document.getElementById('notification-message');

    // Set icon and title based on type
    const config = {
        success: { icon: '✅', title: 'Success' },
        error: { icon: '❌', title: 'Error' },
        info: { icon: 'ℹ️', title: 'Info' }
    };

    icon.textContent = config[type].icon;
    title.textContent = config[type].title;
    messageEl.textContent = message;

    // Set class
    notification.className = `notification ${type} show`;

    // Auto-hide after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

/**
 * Format time (e.g., "2 hours ago", "Yesterday", etc.)
 */
function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Strip HTML tags
 */
function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
}

/**
 * FIXED: Convert plain text to clean HTML with proper link handling
 */
function textToCleanHtml(text) {
  if (!text) return '';

  let out = text;

  // Step 1: Fix malformed AI-generated link attempts
  // Pattern: URL followed by style attribute and link text
  // Example: https://example.com/" style="...">link text
  out = out.replace(/(https?:\/\/[^"\s]+)"\s*style="[^"]*">([^<]+)/g, (match, url, linkText) => {
    // Clean the URL (remove trailing quote if present)
    const cleanUrl = url.replace(/"$/, '');
    return `<a href="${cleanUrl}" style="color:#0066cc;text-decoration:underline;">${linkText}</a>`;
  });

  // Step 2: Handle markdown-style links [text](url)
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (match, linkText, url) => {
    return `<a href="${url}" style="color:#0066cc;text-decoration:underline;">${linkText}</a>`;
  });

  // Step 3: Fix any remaining malformed link patterns
  // Pattern: word(s) followed immediately by a URL
  out = out.replace(/(\b[\w\s]+)\s+(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g, (match, precedingText, url) => {
    // Check if the preceding text looks like it should be link text
    const linkWords = ['page', 'site', 'link', 'here', 'visit', 'see', 'view', 'click'];
    const shouldBeLink = linkWords.some(word => precedingText.toLowerCase().includes(word));
    
    if (shouldBeLink) {
      return `<a href="${url}" style="color:#0066cc;text-decoration:underline;">${precedingText.trim()}</a>`;
    } else {
      // Keep text separate and make URL clickable
      return `${precedingText}<a href="${url}" style="color:#0066cc;text-decoration:underline;">${url}</a>`;
    }
  });

  // Step 4: Handle remaining bare URLs (not already in links)
  // This catches any URLs not handled by the above patterns
  out = out.replace(/(?<!href=["'])(?<!>)(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g, (url) => {
    // Check if this URL is already part of an anchor tag
    if (out.indexOf(`href="${url}"`) === -1) {
      return `<a href="${url}" style="color:#0066cc;text-decoration:underline;">${url}</a>`;
    }
    return url;
  });

  // Step 5: Handle standalone **Heading** lines → <h3>
  out = out.split('\n').map(line => {
    const m = line.match(/^\s*\*\*([^*]+)\*\*\s*$/);
    if (m) {
      return `<h3 style="margin:20px 0 6px;color:#1e3a5f;font-size:16px;">${m[1].trim()}</h3>`;
    }
    return line;
  }).join('\n');

  // Step 6: Handle inline **bold** → <strong>
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Step 7: Convert paragraphs & line breaks
  return out
    .split('\n\n')
    .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
    .join('\n');
}

// Alternative safer escaping function
function escapeHtmlSafe(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Auto-refresh when admin.html loads (check parent window)
if (window.parent && window.parent !== window) {
    // We're in an iframe within admin.html
    const autoRefreshOnLogin = localStorage.getItem('sr_auto_refresh_on_login') !== 'false';
    if (autoRefreshOnLogin) {
        console.log('🚀 Auto-refresh enabled for admin.html login');
        // Start with a slight delay to ensure everything is loaded
        setTimeout(() => {
            refreshEmails(true);
        }, 2000);
    }
}

// Export functions for global access
window.refreshEmails = refreshEmails;
window.sendEmail = sendEmail;
window.selectEmail = selectEmail;
window.selectFolder = selectFolder;
window.openComposeModal = openComposeModal;
window.closeComposeModal = closeComposeModal;
window.replyToCurrentEmail = replyToCurrentEmail;
window.replyWithAI = replyWithAI;
window.generateAIResponse = generateAIResponse;
window.viewSentEmail = viewSentEmail;
window.composeFollowUp = composeFollowUp;
window.loadSentEmails = loadSentEmails;
window.startAutoRefresh = startAutoRefresh;
window.stopAutoRefresh = stopAutoRefresh;
window.showNotification = showNotification;
window.handleEnquiryContext = handleEnquiryContext;
window.setupInfiniteScroll = setupInfiniteScroll;
window.loadMoreEmails = loadMoreEmails;
window.loadDrafts = loadDrafts;
window.viewDraft = viewDraft;
window.editDraft = editDraft;
window.deleteDraft = deleteDraft;

// Function to open enquiry detail
window.openEnquiry = function(enquiryId) {
    console.log('📂 Opening enquiry:', enquiryId);
    
    if (window.parent && window.parent !== window) {
        // We're in an iframe - tell parent to switch tabs and open enquiry
        window.parent.postMessage({
            type: 'open-enquiry',
            enquiryId: enquiryId
        }, '*');
    } else {
        // Standalone mode - open in new tab
        window.open(`/admin.html?tab=enquiries&enquiry=${enquiryId}`, '_blank');
    }
};

// Delete email function
async function deleteEmail(messageId) {
    if (!confirm('Are you sure you want to delete this email? This cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch('/api/smart-reply/admin/delete-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ messageId })
        });

        const data = await response.json();
        
        if (data.success) {
            showNotification('✅ Email deleted', 'success');
            // Clear viewer and refresh list
            document.getElementById('email-viewer').innerHTML = '<div class="no-selection">Select an email to view</div>';
            currentEmail = null;
            await loadEmails();
        } else {
            showNotification(data.error || 'Failed to delete email', 'error');
        }
    } catch (error) {
        console.error('Error deleting email:', error);
        showNotification('Failed to delete email', 'error');
    }
}

window.deleteEmail = deleteEmail;

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopAutoRefresh();
});

console.log('✅ SMART Reply email interface loaded - Complete version with Enquiry Linking');