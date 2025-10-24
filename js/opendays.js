/**
 * OPEN DAYS MODULE
 * Handles all Open Days management functionality
 */

// Global state for open days
let currentOpenDays = [];

/**
 * Initialize Open Days module
 * IMPORTANT: This should be called when the Open Days tab becomes active
 */
async function initOpenDaysModule() {
    console.log('🔧 Initializing Open Days Module');
    
    // Wait for the content element to be available
    const contentElement = await waitForElement('opendays-content', 5000);
    
    if (!contentElement) {
        console.error('⚠️ Failed to initialize: opendays-content not found in DOM');
        console.log('Make sure opendays-tab.html is loaded correctly');
        return;
    }
    
    console.log('✅ Open Days content element found');
    
    // Load the data
    await loadOpenDays();
}

/**
 * Load all open days from the server
 */
async function loadOpenDays() {
    // Wait for DOM element to be available
    const contentElement = await waitForElement('opendays-content', 5000);
    
    if (!contentElement) {
        console.error('Open Days content container not found in DOM');
        return;
    }
    
    showLoading('opendays-content');
    
    try {
        const includePast = document.getElementById('showPastEvents')?.checked || false;
        const res = await fetch('/api/admin/open-days?include_past=' + includePast);
        const data = await res.json();
        
        if (!data.success) throw new Error(data.error);
        
        currentOpenDays = data.openDays || [];
        
        if (currentOpenDays.length === 0) {
            document.getElementById('opendays-content').innerHTML = 
                `<div class="empty-state">
                    <div class="empty-state-icon">📅</div>
                    <div class="empty-state-text">No open days found</div>
                </div>`;
            return;
        }
        
        renderOpenDays();
        
    } catch (error) {
        console.error('Error loading open days:', error);
        const contentEl = document.getElementById('opendays-content');
        if (contentEl) {
            contentEl.innerHTML = 
                `<div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <div class="empty-state-text">Error: ${escapeHtml(error.message)}</div>
                </div>`;
        }
    }
}

/**
 * Wait for an element to be available in the DOM
 * @param {string} elementId - ID of element to wait for
 * @param {number} timeout - Maximum time to wait in milliseconds
 * @returns {Promise<HTMLElement|null>} The element or null if timeout
 */
function waitForElement(elementId, timeout = 5000) {
    return new Promise((resolve) => {
        // Check if element already exists
        const element = document.getElementById(elementId);
        if (element) {
            resolve(element);
            return;
        }
        
        // Set up observer to watch for element
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.getElementById(elementId);
            if (element) {
                obs.disconnect();
                resolve(element);
            }
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Set timeout
        setTimeout(() => {
            observer.disconnect();
            resolve(null);
        }, timeout);
    });
}

/**
 * Render open days cards
 */
function renderOpenDays() {
    const contentElement = document.getElementById('opendays-content');
    
    if (!contentElement) {
        console.error('Cannot render: opendays-content element not found');
        return;
    }
    
    let html = '';
    
    currentOpenDays.forEach(event => {
        const eventDate = new Date(event.event_date);
        const isPast = eventDate < new Date();
        const isActive = event.is_active !== false;
        const status = isPast ? 'past' : (isActive ? 'active' : 'inactive');
        
        html += `<div class="open-day-card ${!isActive ? 'inactive' : ''}">`;
        html += `<div class="open-day-header-row">`;
        html += `<div>`;
        html += `<div class="open-day-title">${escapeHtml(event.event_name)}</div>`;
        html += `<div class="open-day-date">${eventDate.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })}</div>`;
        
        if (event.event_time) {
            html += `<div class="open-day-time">🕐 ${escapeHtml(event.event_time)}</div>`;
        }
        
        html += `</div>`;
        html += `<span class="badge badge-${status}">${status}</span>`;
        html += `</div>`;
        
        if (event.description) {
            html += `<div class="open-day-description">${escapeHtml(event.description)}</div>`;
        }
        
        if (event.booking_url) {
            html += `<a href="${escapeHtml(event.booking_url)}" target="_blank" class="open-day-booking">🔗 Booking link</a>`;
        }
        
        html += `<div class="open-day-actions">`;
        html += `<button class="btn btn-secondary btn-sm" onclick="editOpenDay(${event.id})">Edit</button>`;
        
        if (isActive) {
            html += `<button class="btn btn-danger btn-sm" onclick="deleteOpenDay(${event.id})">Delete</button>`;
        } else {
            html += `<button class="btn btn-success btn-sm" onclick="reactivateOpenDay(${event.id})">Reactivate</button>`;
        }
        
        html += `</div>`;
        html += `</div>`;
    });
    
    contentElement.innerHTML = html;
}

/**
 * Open modal to add new open day
 */
function openAddOpenDayModal() {
    document.getElementById('openDayModalTitle').textContent = 'Add Open Day';
    document.getElementById('openDayForm').reset();
    document.getElementById('openDayId').value = '';
    
    // Use 'active' class instead of 'style.display'
    document.getElementById('openDayModal').classList.add('active');
}

/**
 * Edit existing open day
 * @param {number} id - Open day ID
 */
function editOpenDay(id) {
    const event = currentOpenDays.find(e => e.id === id);
    if (!event) return;
    
    document.getElementById('openDayModalTitle').textContent = 'Edit Open Day';
    document.getElementById('openDayId').value = event.id;
    document.getElementById('eventName').value = event.event_name;
    document.getElementById('eventDate').value = event.event_date;
    document.getElementById('eventTime').value = event.event_time || '';
    document.getElementById('eventDescription').value = event.description || '';
    document.getElementById('bookingUrl').value = event.booking_url || '';
    document.getElementById('openDayModal').classList.add('active');
}

/**
 * Close open day modal
 */
function closeOpenDayModal() {
    document.getElementById('openDayModal').classList.remove('active');
}

/**
 * Save open day (create or update)
 * @param {Event} e - Form submit event
 */
async function saveOpenDay(e) {
    e.preventDefault();
    
    const id = document.getElementById('openDayId').value;
    const data = {
        event_name: document.getElementById('eventName').value,
        event_date: document.getElementById('eventDate').value,
        event_time: document.getElementById('eventTime').value,
        description: document.getElementById('eventDescription').value,
        booking_url: document.getElementById('bookingUrl').value
    };
    
    try {
        const url = id ? `/api/admin/open-days/${id}` : '/api/admin/open-days';
        const method = id ? 'PUT' : 'POST';
        
        const res = await fetch(url, {
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        
        const result = await res.json();
        if (!result.success) throw new Error(result.error);
        
        closeOpenDayModal();
        loadOpenDays();
        showNotification('Open day saved successfully!');
    } catch (error) {
        console.error('Error saving open day:', error);
        alert('Error: ' + error.message);
    }
}

/**
 * Delete open day (soft delete)
 * @param {number} id - Open day ID
 */
async function deleteOpenDay(id) {
    if (!confirm('Delete this open day?')) return;
    
    try {
        const res = await fetch(`/api/admin/open-days/${id}`, {
            method: 'DELETE'
        });
        
        const result = await res.json();
        if (!result.success) throw new Error(result.error);
        
        loadOpenDays();
        showNotification('Open day deleted successfully');
    } catch (error) {
        console.error('Error deleting open day:', error);
        alert('Error: ' + error.message);
    }
}

/**
 * Reactivate a deleted open day
 * @param {number} id - Open day ID
 */
async function reactivateOpenDay(id) {
    try {
        const res = await fetch(`/api/admin/open-days/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ is_active: true })
        });
        
        const result = await res.json();
        if (!result.success) throw new Error(result.error);
        
        loadOpenDays();
        showNotification('Open day reactivated successfully');
    } catch (error) {
        console.error('Error reactivating open day:', error);
        alert('Error: ' + error.message);
    }
}

/**
 * Show loading spinner
 * @param {string} elementId - Element ID to show loading in
 */
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Loading open days...</p>
            </div>
        `;
    }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
window.initOpenDaysModule = initOpenDaysModule;
window.loadOpenDays = loadOpenDays;
window.openAddOpenDayModal = openAddOpenDayModal;
window.editOpenDay = editOpenDay;
window.closeOpenDayModal = closeOpenDayModal;
window.saveOpenDay = saveOpenDay;
window.deleteOpenDay = deleteOpenDay;
window.reactivateOpenDay = reactivateOpenDay;