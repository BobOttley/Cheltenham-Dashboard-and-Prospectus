/**
 * SETTINGS MODULE
 * Handles all system settings functionality
 */

/**
 * Initialize Settings module
 */
function initSettingsModule() {
    console.log('🔧 Initializing Settings Module');
    loadSettings();
}

/**
 * Load current settings from server
 */
async function loadSettings() {
    try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        
        if (!data.success) throw new Error(data.error);
        
        const settings = data.settings;
        
        // Update toggle
        const toggle = document.getElementById('autoDisplayToggle');
        if (toggle) {
            toggle.checked = settings.auto_display_prospectus;
        }
        
        // Update UI
        updateSettingsUI(settings.auto_display_prospectus);
        
        // Update email template if exists
        const templateField = document.getElementById('emailTemplateText');
        if (templateField && settings.email_template) {
            templateField.value = settings.email_template;
        }
        
        console.log('✅ Settings loaded successfully');
        
    } catch (error) {
        console.error('Error loading settings:', error);
        showNotification('Failed to load settings', 'error');
    }
}

/**
 * Update settings when toggle is changed
 */
async function updateSettings() {
    const toggle = document.getElementById('autoDisplayToggle');
    if (!toggle) return;
    
    const autoDisplay = toggle.checked;
    
    try {
        const res = await fetch('/api/admin/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ auto_display_prospectus: autoDisplay })
        });
        
        const data = await res.json();
        
        if (data.success) {
            updateSettingsUI(autoDisplay);
            showNotification('Settings updated successfully!');
        } else {
            throw new Error('Failed to update settings');
        }
    } catch (error) {
        console.error('Error updating settings:', error);
        showNotification('Failed to update settings', 'error');
        // Revert toggle
        toggle.checked = !autoDisplay;
    }
}

/**
 * Update the settings UI to reflect current state
 * @param {boolean} autoDisplay - Whether auto-display is enabled
 */
function updateSettingsUI(autoDisplay) {
    const indicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const toggleLabel = document.getElementById('toggleLabel');
    
    if (!indicator || !statusText || !toggleLabel) return;
    
    if (autoDisplay) {
        indicator.className = 'status-indicator on';
        statusText.innerHTML = '<strong>Status: ENABLED</strong> - Prospectus auto-displays after form submission';
        toggleLabel.textContent = 'Auto-display is ON';
    } else {
        indicator.className = 'status-indicator off';
        statusText.innerHTML = '<strong>Status: DISABLED</strong> - Admissions team manually emails prospectus links';
        toggleLabel.textContent = 'Auto-display is OFF';
    }
}

/**
 * Save email template
 */
async function saveEmailTemplate() {
    const templateField = document.getElementById('emailTemplateText');
    if (!templateField) return;
    
    const template = templateField.value;
    
    if (!template.trim()) {
        showNotification('Email template cannot be empty', 'error');
        return;
    }
    
    try {
        const res = await fetch('/api/admin/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email_template: template })
        });
        
        const data = await res.json();
        
        if (data.success) {
            showNotification('Email template saved successfully!');
        } else {
            throw new Error(data.error || 'Failed to save template');
        }
    } catch (error) {
        console.error('Error saving email template:', error);
        showNotification('Failed to save email template: ' + error.message, 'error');
    }
}

/**
 * Insert variable at cursor position in textarea
 * @param {string} variable - Variable to insert
 */
function insertVariable(variable) {
    const templateField = document.getElementById('emailTemplateText');
    if (!templateField) return;
    
    const start = templateField.selectionStart;
    const end = templateField.selectionEnd;
    const text = templateField.value;
    
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    
    templateField.value = before + variable + after;
    
    // Set cursor position after inserted variable
    templateField.selectionStart = templateField.selectionEnd = start + variable.length;
    templateField.focus();
}

/**
 * Setup variable tag click handlers
 */
function setupVariableClickHandlers() {
    const variableTags = document.querySelectorAll('.variable-tag');
    variableTags.forEach(tag => {
        tag.addEventListener('click', function() {
            insertVariable(this.textContent);
        });
    });
}

/**
 * Show notification toast
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('success' or 'error')
 */
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = 'notification ' + type;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Make functions globally available
window.initSettingsModule = initSettingsModule;
window.loadSettings = loadSettings;
window.updateSettings = updateSettings;
window.updateSettingsUI = updateSettingsUI;
window.saveEmailTemplate = saveEmailTemplate;
window.insertVariable = insertVariable;
window.setupVariableClickHandlers = setupVariableClickHandlers;

// Setup variable click handlers when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupVariableClickHandlers);
} else {
    // DOM already loaded, setup immediately
    setTimeout(setupVariableClickHandlers, 100);
}
