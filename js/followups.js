// ========================================
// ENHANCED FOLLOW-UPS MODULE
// Requires status update and notes when completing
// ========================================

let allFollowups = [];
let currentFollowupFilter = 'all';

// Main load function called by switchTab
async function loadFollowups() {
    showLoading('followups-content');
    
    // Get enquiries with follow-up dates from allEnquiries
    allFollowups = allEnquiries.filter(e => e.followup_date);
    
    // Sort by followup_date
    allFollowups.sort((a, b) => new Date(a.followup_date) - new Date(b.followup_date));
    
    updateFollowupCounts();
    filterFollowups(currentFollowupFilter);
}

// Get current admin user with proper fallback
function getCurrentAdminUser() {
    // Check window global
    if (window.currentAdminEmail) {
        return window.currentAdminEmail;
    }
    
    // Check sessionStorage
    if (sessionStorage.getItem('adminEmail')) {
        window.currentAdminEmail = sessionStorage.getItem('adminEmail');
        return window.currentAdminEmail;
    }
    
    // Check localStorage
    if (localStorage.getItem('adminEmail')) {
        window.currentAdminEmail = localStorage.getItem('adminEmail');
        return window.currentAdminEmail;
    }
    
    // Check UI element
    const adminEmailElement = document.getElementById('adminEmailDisplay');
    if (adminEmailElement && adminEmailElement.textContent) {
        const email = adminEmailElement.textContent.trim();
        window.currentAdminEmail = email;
        return email;
    }
    
    return null;
}

// Update the count badges
function updateFollowupCounts() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let overdue = 0, todayCount = 0, upcoming = 0;
    
    allFollowups.forEach(e => {
        const followupDate = new Date(e.followup_date);
        const followupDay = new Date(followupDate.getFullYear(), followupDate.getMonth(), followupDate.getDate());
        
        if (followupDay < today) {
            overdue++;
        } else if (followupDay.getTime() === today.getTime()) {
            todayCount++;
        } else {
            upcoming++;
        }
    });
    
    document.getElementById('countAll').textContent = allFollowups.length;
    document.getElementById('countOverdue').textContent = overdue;
    document.getElementById('countToday').textContent = todayCount;
    document.getElementById('countUpcoming').textContent = upcoming;
}

// Filter function called by button clicks
function filterFollowups(filter) {
    currentFollowupFilter = filter;
    
    // Update active tab
    document.querySelectorAll('.followup-filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event?.target?.classList.add('active');
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let filtered = allFollowups;
    
    if (filter === 'overdue') {
        filtered = allFollowups.filter(e => {
            const followupDate = new Date(e.followup_date);
            const followupDay = new Date(followupDate.getFullYear(), followupDate.getMonth(), followupDate.getDate());
            return followupDay < today;
        });
    } else if (filter === 'today') {
        filtered = allFollowups.filter(e => {
            const followupDate = new Date(e.followup_date);
            const followupDay = new Date(followupDate.getFullYear(), followupDate.getMonth(), followupDate.getDate());
            return followupDay.getTime() === today.getTime();
        });
    } else if (filter === 'upcoming') {
        filtered = allFollowups.filter(e => {
            const followupDate = new Date(e.followup_date);
            const followupDay = new Date(followupDate.getFullYear(), followupDate.getMonth(), followupDate.getDate());
            return followupDay > today;
        });
    }
    
    renderFollowups(filtered);
}

// Render the follow-up cards
function renderFollowups(followups) {
    if (followups.length === 0) {
        document.getElementById('followups-content').innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <div class="empty-state-text">No follow-ups in this category</div>
            </div>
        `;
        return;
    }
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let html = '';
    
    followups.forEach(e => {
        const followupDate = new Date(e.followup_date);
        const followupDay = new Date(followupDate.getFullYear(), followupDate.getMonth(), followupDate.getDate());
        
        let cardClass = 'followup-card';
        let statusText = '';
        
        if (followupDay < today) {
            cardClass += ' overdue';
            const daysOverdue = Math.ceil((today - followupDay) / (1000 * 60 * 60 * 24));
            statusText = `Overdue by ${daysOverdue} day${daysOverdue > 1 ? 's' : ''}`;
        } else if (followupDay.getTime() === today.getTime()) {
            cardClass += ' today';
            statusText = 'Due Today';
        } else {
            cardClass += ' upcoming';
            const daysUntil = Math.ceil((followupDay - today) / (1000 * 60 * 60 * 24));
            statusText = `Due in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`;
        }
        
        const formattedDate = followupDate.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        
        const formattedTime = followupDate.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Get current status badge
        const statusBadge = getStatusBadge(e.status);
        
        html += `
            <div class="${cardClass}">
                <div class="followup-header">
                    <div>
                        <div class="followup-title">
                            ${e.priority ? '⭐ ' : ''}${e.first_name || ''} ${e.family_surname || ''}
                            ${statusBadge}
                        </div>
                        <div class="followup-date">${statusText} - ${formattedDate} at ${formattedTime}</div>
                    </div>
                </div>
                <div class="followup-meta">
                    <span>📧 ${e.parent_email || 'No email'}</span>
                    <span>📞 ${e.contact_number || 'No phone'}</span>
                    <span>🌍 ${e.country || 'No country'}</span>
                    <span>🎓 ${e.form_entry || 'No form'}</span>
                </div>
                <div class="followup-actions">
                    <button class="btn btn-primary btn-sm" onclick="if(window.viewEnquiryDetail){window.viewEnquiryDetail('${e.id}')}">👁️ View Details</button>
                    <button class="btn btn-success btn-sm" onclick="openCompleteFollowupModal('${e.id}')">✓ Complete Follow-up</button>
                    <button class="btn btn-secondary btn-sm" onclick="rescheduleFollowup('${e.id}')">📅 Reschedule</button>
                </div>
            </div>
        `;
    });
    
    document.getElementById('followups-content').innerHTML = html;
}

// Get status badge HTML
function getStatusBadge(status) {
    const statusConfig = {
        'new': { color: '#10b981', text: 'New' },
        'contacted': { color: '#3b82f6', text: 'Contacted' },
        'openday': { color: '#8b5cf6', text: 'Open Day' },
        'privatetour': { color: '#ec4899', text: 'Private Tour' },
        'followup': { color: '#f59e0b', text: 'Follow-up' },
        'applying': { color: '#14b8a6', text: 'Applying' },
        'accepted': { color: '#22c55e', text: 'Accepted' },
        'archived': { color: '#64748b', text: 'Archived' }
    };
    
    const config = statusConfig[status] || statusConfig['new'];
    return `<span style="background:${config.color}; color:white; padding:2px 8px; border-radius:4px; font-size:12px; margin-left:10px;">${config.text}</span>`;
}

// Open modal to complete follow-up with required fields
function openCompleteFollowupModal(id) {
    const enquiry = allEnquiries.find(e => e.id === id);
    if (!enquiry) {
        alert('Error: Enquiry not found');
        return;
    }

    const existingModal = document.querySelector('.modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';

    modal.innerHTML = `
        <div class="modal-content" style="max-width:650px;">
            <div class="modal-header">
                <h2 style="margin:0;font-size:20px;">✓ Complete Follow-up</h2>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body" style="padding:25px;">
                <div style="background:#f8fafc;padding:15px;border-radius:8px;margin-bottom:20px;border-left:4px solid #3b82f6;">
                    <div style="font-size:18px;font-weight:600;color:#1e3a5f;margin-bottom:4px;">
                        ${enquiry.first_name} ${enquiry.family_surname}
                    </div>
                    <div style="font-size:14px;color:#64748b;">
                        📧 ${enquiry.parent_email} ${enquiry.contact_number ? '• 📞 ' + enquiry.contact_number : ''}
                    </div>
                </div>
                
                <div style="margin-bottom:20px;">
                    <label style="display:block;font-weight:600;color:#374151;margin-bottom:8px;font-size:14px;">
                        Status Update <span style="color:#ef4444;">*</span>
                    </label>
                    <select id="followupNewStatus" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:6px;font-size:14px;background:white;">
                        <option value="">Select new status</option>
                        <option value="keep">Keep Current (${enquiry.status})</option>
                        <option value="contacted">Contacted</option>
                        <option value="openday">Open Day</option>
                        <option value="privatetour">Private Tour</option>
                        <option value="followup">Follow-up</option>
                        <option value="applying">Applying</option>
                        <option value="accepted">Accepted</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                <div style="margin-bottom:20px;">
                    <label style="display:block;font-weight:600;color:#374151;margin-bottom:8px;font-size:14px;">
                        Action Taken <span style="color:#ef4444;">*</span>
                    </label>
                    <select id="followupAction" onchange="toggleOtherAction()" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:6px;font-size:14px;background:white;">
                        <option value="">Select an action</option>
                        <option value="Called Parent">Called Parent</option>
                        <option value="Emailed Parent">Emailed Parent</option>
                        <option value="Left Message">Left Message</option>
                        <option value="Met in Person">Met in Person</option>
                        <option value="other">Other</option>
                    </select>
                    <input type="text" id="followupActionOther" placeholder="Specify other action" 
                        style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:6px;font-size:14px;display:none;margin-top:10px;">
                </div>

                <div style="margin-bottom:20px;">
                    <label style="display:block;font-weight:600;color:#374151;margin-bottom:8px;font-size:14px;">
                        Notes <span style="color:#ef4444;">*</span>
                    </label>
                    <textarea id="followupNotes" placeholder="Add details of this follow-up (what was discussed, outcome, next steps...)" 
                        style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:6px;font-size:14px;min-height:100px;resize:vertical;font-family:inherit;"></textarea>
                </div>

                <div style="background:#fef3c7;border:1px solid #fbbf24;padding:12px;border-radius:6px;margin-bottom:20px;">
                    <label style="display:flex;align-items:center;cursor:pointer;margin:0;">
                        <input type="checkbox" id="followupScheduleAnother" onchange="toggleNextFollowup()" style="width:18px;height:18px;margin-right:10px;cursor:pointer;"> 
                        <span style="font-weight:500;color:#92400e;">Schedule another follow-up</span>
                    </label>
                </div>

                <div id="nextFollowupSection" style="display:none;background:#f0fdf4;padding:15px;border-radius:6px;border:1px solid #86efac;margin-bottom:20px;">
                    <div style="font-weight:600;color:#166534;margin-bottom:12px;">Next Follow-up Details</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                        <div>
                            <label style="display:block;font-weight:500;color:#374151;margin-bottom:6px;font-size:13px;">Date</label>
                            <input type="date" id="nextFollowupDate" style="width:100%;padding:8px;border:2px solid #86efac;border-radius:6px;font-size:14px;">
                        </div>
                        <div>
                            <label style="display:block;font-weight:500;color:#374151;margin-bottom:6px;font-size:13px;">Time</label>
                            <input type="time" id="nextFollowupTime" style="width:100%;padding:8px;border:2px solid #86efac;border-radius:6px;font-size:14px;">
                        </div>
                    </div>
                </div>

                <div style="display:flex;justify-content:flex-end;gap:12px;padding-top:10px;">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()" style="padding:10px 20px;">Cancel</button>
                    <button class="btn btn-success" onclick="completeFollowup('${id}')" style="padding:10px 24px;">✓ Mark Complete</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Toggle other action input
function toggleOtherAction() {
    const actionSelect = document.getElementById('followupAction');
    const otherInput = document.getElementById('followupActionOther');
    if (actionSelect.value === 'other') {
        otherInput.style.display = 'block';
        otherInput.required = true;
    } else {
        otherInput.style.display = 'none';
        otherInput.required = false;
    }
}

// Toggle next follow-up section
function toggleNextFollowup() {
    const checkbox = document.getElementById('followupScheduleAnother');
    const section = document.getElementById('nextFollowupSection');
    section.style.display = checkbox.checked ? 'block' : 'none';
}

// Complete follow-up with validation and proper admin tracking
async function completeFollowup(id) {
    const newStatus = document.getElementById('followupNewStatus').value;
    const action = document.getElementById('followupAction').value;
    const actionOther = document.getElementById('followupActionOther').value;
    const notes = document.getElementById('followupNotes').value.trim();
    const scheduleAnother = document.getElementById('followupScheduleAnother').checked;
    const nextDate = document.getElementById('nextFollowupDate').value;
    const nextTime = document.getElementById('nextFollowupTime').value;
    
    // Validation
    if (!newStatus) {
        alert('Please select a status update');
        return;
    }
    
    if (!action) {
        alert('Please select the action taken');
        return;
    }
    
    if (action === 'other' && !actionOther.trim()) {
        alert('Please specify the other action taken');
        return;
    }
    
    if (!notes) {
        alert('Please add notes about this follow-up');
        return;
    }
    
    if (scheduleAnother && !nextDate) {
        alert('Please select a date for the next follow-up');
        return;
    }
    
    try {
        const enquiry = allEnquiries.find(e => e.id === id);
        if (!enquiry) throw new Error('Enquiry not found');
        
        // Get current admin user
        const adminUser = getCurrentAdminUser() || 'Admin';
        
        // Prepare update data
        const updateData = {
            followup_date: null // Clear current follow-up
        };
        
        // Update status if not keeping current
        if (newStatus !== 'keep') {
            updateData.status = newStatus;
        }
        
        // Set new follow-up if scheduled
        if (scheduleAnother) {
            const nextDateTime = new Date(nextDate + 'T' + nextTime);
            updateData.followup_date = nextDateTime.toISOString();
        } else if (newStatus === 'followup') {
            // If status is follow-up but no date set, prompt
            alert('Status set to "Follow-up" requires scheduling a follow-up date');
            return;
        }
        
        // Update enquiry
        const res = await fetch(`/api/admin/enquiries/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        
        // Create clean, formatted note
        const actionText = action === 'other' ? actionOther : action;
        const statusText = newStatus === 'keep' ? enquiry.status : newStatus;
        
        // Format note cleanly without duplication
        const noteLines = [
            `✓ Follow-up completed by ${adminUser}`,
            `Action: ${actionText}`,
            `Status: ${statusText}`,
            '',
            notes
        ];
        
        const fullNote = noteLines.join('\n');
        
        const noteRes = await fetch(`/api/admin/enquiries/${id}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: fullNote })
        });
        
        const noteData = await noteRes.json();
        if (!noteData.success) throw new Error(noteData.error);
        
        // Update local data
        if (newStatus !== 'keep') {
            enquiry.status = newStatus;
        }
        enquiry.followup_date = scheduleAnother ? updateData.followup_date : null;
        
        // Add note to local data
        if (!enquiry.notes) enquiry.notes = [];
        enquiry.notes.push(noteData.note);
        
        // Close modal
        document.querySelector('.modal').remove();
        
        // Show success message
        const message = scheduleAnother 
            ? `Follow-up completed and next one scheduled for ${new Date(nextDate).toLocaleDateString('en-GB')}`
            : 'Follow-up completed successfully';
        if (window.showNotification) {
            window.showNotification(message);
        } else {
            alert(message);
        }
        
        // Reload follow-ups
        loadFollowups();
        if (window.updateStats) window.updateStats();
    } catch (error) {
        alert('Error completing follow-up: ' + error.message);
    }
}

// Reschedule follow-up
function rescheduleFollowup(id) {
    const enquiry = allEnquiries.find(e => e.id === id);
    if (!enquiry) return;
    
    const currentDate = enquiry.followup_date ? new Date(enquiry.followup_date) : new Date();
    const dateStr = currentDate.toISOString().split('T')[0];
    const timeStr = currentDate.toTimeString().slice(0, 5);
    
    const existingModal = document.querySelector('.modal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width:550px;">
            <div class="modal-header">
                <h2 style="margin:0;font-size:20px;">📅 Reschedule Follow-up</h2>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body" style="padding:25px;">
                <div style="background:#f8fafc;padding:15px;border-radius:8px;margin-bottom:20px;border-left:4px solid #3b82f6;">
                    <div style="font-size:18px;font-weight:600;color:#1e3a5f;">
                        ${enquiry.first_name} ${enquiry.family_surname}
                    </div>
                </div>
                
                <div style="margin-bottom:20px;">
                    <label style="display:block;font-weight:600;color:#374151;margin-bottom:10px;font-size:14px;">
                        New Date & Time
                    </label>
                    <div style="display:grid;grid-template-columns:2fr 1fr;gap:12px;">
                        <input type="date" id="rescheduleDate" value="${dateStr}" 
                               style="padding:10px;border:2px solid #e2e8f0;border-radius:6px;font-size:14px;">
                        <input type="time" id="rescheduleTime" value="${timeStr}" 
                               style="padding:10px;border:2px solid #e2e8f0;border-radius:6px;font-size:14px;">
                    </div>
                </div>
                
                <div style="margin-bottom:20px;">
                    <label style="display:block;font-weight:600;color:#374151;margin-bottom:10px;font-size:14px;">
                        Reason for rescheduling
                    </label>
                    <input type="text" id="rescheduleReason" 
                           placeholder="e.g., Family requested later date" 
                           style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:6px;font-size:14px;">
                </div>
                
                <div style="display:flex;gap:12px;justify-content:flex-end;padding-top:10px;">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()" style="padding:10px 20px;">Cancel</button>
                    <button class="btn btn-primary" onclick="saveReschedule('${id}')" style="padding:10px 24px;">Save</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Save rescheduled follow-up
async function saveReschedule(id) {
    const date = document.getElementById('rescheduleDate').value;
    const time = document.getElementById('rescheduleTime').value;
    const reason = document.getElementById('rescheduleReason').value;
    
    if (!date || !time) {
        alert('Please select date and time');
        return;
    }
    
    try {
        const dateTime = new Date(date + 'T' + time);
        
        // Get current admin user
        const adminUser = getCurrentAdminUser() || 'Admin';
        
        // Update follow-up date
        const res = await fetch(`/api/admin/enquiries/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followup_date: dateTime.toISOString() })
        });
        
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        
        // Add clean note
        const noteLines = [
            `📅 Follow-up rescheduled by ${adminUser}`,
            `New date: ${dateTime.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} at ${time}`
        ];
        
        if (reason) {
            noteLines.push(`Reason: ${reason}`);
        }
        
        const noteContent = noteLines.join('\n');
        
        await fetch(`/api/admin/enquiries/${id}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: noteContent })
        });
        
        // Update local data
        const enquiry = allEnquiries.find(e => e.id === id);
        if (enquiry) {
            enquiry.followup_date = dateTime.toISOString();
        }
        
        document.querySelector('.modal').remove();
        
        if (window.showNotification) {
            window.showNotification('Follow-up rescheduled successfully');
        } else {
            alert('Follow-up rescheduled successfully');
        }
        
        loadFollowups();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Show loading state
function showLoading(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Loading...</p>
            </div>
        `;
    }
}