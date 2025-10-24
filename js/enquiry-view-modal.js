// ========================================
// ENQUIRY VIEW MODAL MODULE
// Modular file for enquiry detail viewing
// Depends on: allEnquiries array from admin.html
// ========================================

let currentViewEnquiryId = null;

/**
 * Main function to view enquiry details in modal
 */
async function viewEnquiryDetail(id) {
    currentViewEnquiryId = id;
    const enquiry = allEnquiries.find(e => e.id === id);
    if (!enquiry) return;
    
    document.getElementById('enquiryDetailModal').classList.add('active');
    // Capitalize "The" if family_surname starts with "the"
    let familyName = enquiry.family_surname;
    if (familyName && familyName.toLowerCase().startsWith('the ')) {
        familyName = 'The' + familyName.slice(3);
    }
    document.getElementById('enquiryDetailTitle').textContent = `${enquiry.first_name} and ${familyName}`;
    
    const interests = parseJSONField(enquiry.interests);
    const activitiesList = parseJSONField(enquiry.activities_data || enquiry.activities);
    const sports = parseJSONField(enquiry.specific_sports);
    
    const createdDate = new Date(enquiry.created_at);
    const dateStr = createdDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const timeStr = createdDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    let html = buildEnquiryDetailHTML(enquiry, { dateStr, timeStr, interests, activitiesList, sports });
    
    document.getElementById('enquiryDetailContent').innerHTML = html;
    
    // Load tracking data
    await loadSessionHistory(id);
    await loadModuleDetails(id);
    await loadActivityLog(id);
    await loadEmailHistory(id);
}

function parseJSONField(field) {
    try {
        if (!field) return [];
        if (Array.isArray(field)) return field;
        if (typeof field === 'string') return JSON.parse(field);
        return [];
    } catch (e) {
        return [];
    }
}

function buildEnquiryDetailHTML(enquiry, { dateStr, timeStr, interests, activitiesList, sports }) {
    return `
        ${buildHeaderSection(enquiry, dateStr, timeStr)}
        <div style="display: flex; flex-direction: column; gap: 20px;">
            ${buildFamilyInfoSection(enquiry, dateStr, timeStr)}
            ${buildAdmissionSection(enquiry)}
            ${buildInterestsSection(interests, activitiesList, sports, enquiry)}
            ${buildStatusSection(enquiry)}
            ${buildFollowupSection(enquiry)}
            ${buildNotesSection(enquiry)}
            ${buildActivityLogSection(enquiry)}
        </div>
        ${buildSessionHistorySection()}
        ${buildModuleDetailsSection()}
        ${buildEmailHistorySection()}
    `;
}

function buildHeaderSection(enquiry, dateStr, timeStr) {
    return `
        <div style="background:linear-gradient(135deg,#1e3a5f 0%,#2d4a6f 100%);color:white;padding:20px;border-radius:8px;margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <div style="font-size:13px;opacity:0.9;margin-bottom:5px;">Enquiry ID</div>
                    <div style="font-size:18px;font-weight:600;margin-bottom:15px;">${enquiry.id}</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:13px;opacity:0.9;margin-bottom:5px;">Submitted</div>
                    <div style="font-size:16px;font-weight:500;margin-bottom:5px;">${dateStr}</div>
                    <div style="font-size:14px;opacity:0.9;">${timeStr}</div>
                </div>
            </div>
        </div>
    `;
}

function buildFamilyInfoSection(enquiry, dateStr, timeStr) {
    return `
        <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px;">
            <h3 style="color:#1e3a5f;margin-bottom:15px;font-size:18px;display:flex;justify-content:space-between;align-items:center;">
                Family Information
                <span style="font-size:11px;color:#999;font-weight:400;">Click to edit →</span>
            </h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
                <div>
                    <label style="font-weight:600;color:#64748b;font-size:13px;display:block;margin-bottom:5px;">Child's Name</label>
                    <div class="detail-value" onclick="makeFieldEditable(event, '${enquiry.id}', 'first_name', '${(enquiry.first_name || '').replace(/'/g, '\\\'')}')" style="font-size:15px;cursor:pointer;padding:8px;border-radius:4px;transition:background 0.2s;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='transparent'">${enquiry.first_name || '-'}</div>
                </div>
                <div>
                    <label style="font-weight:600;color:#64748b;font-size:13px;display:block;margin-bottom:5px;">Parent/Guardian Name</label>
                    <div class="detail-value" onclick="makeFieldEditable(event, '${enquiry.id}', 'parent_name', '${(enquiry.parent_name || '').replace(/'/g, '\\\'')}')" style="font-size:15px;cursor:pointer;padding:8px;border-radius:4px;transition:background 0.2s;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='transparent'">${enquiry.parent_name || '-'}</div>
                </div>
                <div>
                    <label style="font-weight:600;color:#64748b;font-size:13px;display:block;margin-bottom:5px;">Family Surname</label>
                    <div class="detail-value" onclick="makeFieldEditable(event, '${enquiry.id}', 'family_surname', '${(enquiry.family_surname || '').replace(/'/g, '\\\'')}')" style="font-size:15px;cursor:pointer;padding:8px;border-radius:4px;transition:background 0.2s;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='transparent'">${enquiry.family_surname || '-'}</div>
                </div>
                <div>
                    <label style="font-weight:600;color:#64748b;font-size:13px;display:block;margin-bottom:5px;">Parent Email</label>
                    <div class="detail-value" onclick="makeFieldEditable(event, '${enquiry.id}', 'parent_email', '${(enquiry.parent_email || '').replace(/'/g, '\\\'')}')" style="font-size:15px;cursor:pointer;padding:8px;border-radius:4px;transition:background 0.2s;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='transparent'">${enquiry.parent_email || '-'}</div>
                </div>
                <div>
                    <label style="font-weight:600;color:#64748b;font-size:13px;display:block;margin-bottom:5px;">Contact Number</label>
                    <div class="detail-value" onclick="makeFieldEditable(event, '${enquiry.id}', 'contact_number', '${(enquiry.contact_number || '').replace(/'/g, '\\\'')}')" style="font-size:15px;cursor:pointer;padding:8px;border-radius:4px;transition:background 0.2s;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='transparent'">${enquiry.contact_number || '-'}</div>
                </div>
                <div>
                    <label style="font-weight:600;color:#64748b;font-size:13px;display:block;margin-bottom:5px;">Boarding Preference</label>
                    <div class="detail-value" onclick="makeFieldEditable(event, '${enquiry.id}', 'boarding_preference', '${(enquiry.boarding || '').replace(/'/g, '\\\'')}', 'boarding_preference')" style="font-size:15px;cursor:pointer;padding:8px;border-radius:4px;transition:background 0.2s;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='transparent'">${enquiry.boarding || '-'}</div>
                </div>
                <div>
                    <label style="font-weight:600;color:#64748b;font-size:13px;display:block;margin-bottom:5px;">Country of Origin</label>
                    <div class="detail-value" onclick="makeFieldEditable(event, '${enquiry.id}', 'country', '${(enquiry.country || '').replace(/'/g, '\\\'')}')" style="font-size:15px;cursor:pointer;padding:8px;border-radius:4px;transition:background 0.2s;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='transparent'">${enquiry.country || 'Unknown'}</div>
                </div>
            </div>
        </div>
    `;
}

function buildAdmissionSection(enquiry) {
    return `
        <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px;">
            <h3 style="color:#1e3a5f;margin-bottom:15px;font-size:18px;">Admission Details</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
                <div>
                    <label style="font-weight:600;color:#64748b;font-size:13px;display:block;margin-bottom:5px;">Form Entry</label>
                    <div class="detail-value" onclick="makeFieldEditable(event, '${enquiry.id}', 'form_entry', '${(enquiry.form_entry || '').replace(/'/g, '\\\'')}', 'form_entry')" style="font-size:15px;cursor:pointer;padding:8px;border-radius:4px;transition:background 0.2s;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='transparent'">${enquiry.form_entry || '-'}</div>
                </div>
                <div>
                    <label style="font-weight:600;color:#64748b;font-size:13px;display:block;margin-bottom:5px;">Entry Year</label>
                    <div class="detail-value" onclick="makeFieldEditable(event, '${enquiry.id}', 'entry_year', '${(enquiry.entry_year || '').replace(/'/g, '\\\'')}', 'entry_year')" style="font-size:15px;cursor:pointer;padding:8px;border-radius:4px;transition:background 0.2s;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='transparent'">${enquiry.entry_year || '-'}</div>
                </div>
                <div>
                    <label style="font-weight:600;color:#64748b;font-size:13px;display:block;margin-bottom:5px;">Gender</label>
                    <div class="detail-value" onclick="makeFieldEditable(event, '${enquiry.id}', 'gender', '${(enquiry.gender || '').replace(/'/g, '\\\'')}', 'gender')" style="font-size:15px;cursor:pointer;padding:8px;border-radius:4px;transition:background 0.2s;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='transparent'">${enquiry.gender === 'male' ? 'Boy' : enquiry.gender === 'female' ? 'Girl' : '-'}</div>
                </div>
                <div>
                    <label style="font-weight:600;color:#64748b;font-size:13px;display:block;margin-bottom:5px;">Age Group</label>
                    <div class="detail-value" onclick="makeFieldEditable(event, '${enquiry.id}', 'age_group', '${(enquiry.age_group || '').replace(/'/g, '\\\'')}', 'age_group')" style="font-size:15px;cursor:pointer;padding:8px;border-radius:4px;transition:background 0.2s;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='transparent'">${enquiry.age_group || '-'}</div>
                </div>
            </div>
        </div>
    `;
}

function buildInterestsSection(interests, activitiesList, sports, enquiry) {
    const capitalizeItem = (item) => {
        // Special handling for acronyms
        if (item.toLowerCase() === 'ccf') return 'CCF';
        
        // Handle multi-word items with underscores
        return item.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };
    
    const formatList = (items) => items.length > 0 
        ? '<ul style="margin:0;padding-left:20px;">' + items.map(i => `<li>${capitalizeItem(i)}</li>`).join('') + '</ul>'
        : '<span style="color:#999;">None specified</span>';
    
    return `
        <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px;">
            <h3 style="color:#1e3a5f;margin-bottom:15px;font-size:18px;display:flex;justify-content:space-between;align-items:center;">
                Interests & Activities
                <span style="font-size:11px;color:#999;font-weight:400;">Click to edit →</span>
            </h3>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
                <div>
                    <label style="font-weight:600;color:#64748b;font-size:13px;display:block;margin-bottom:8px;">Academic Interests</label>
                    <div class="detail-value" onclick="editInterests(event, '${enquiry.id}', 'interests', ${JSON.stringify(interests).replace(/"/g, '&quot;')})" style="cursor:pointer;padding:8px;border-radius:4px;transition:background 0.2s;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='transparent'">
                        ${formatList(interests)}
                    </div>
                </div>
                <div>
                    <label style="font-weight:600;color:#64748b;font-size:13px;display:block;margin-bottom:8px;">Co-curricular Activities</label>
                    <div class="detail-value" onclick="editInterests(event, '${enquiry.id}', 'activities', ${JSON.stringify(activitiesList).replace(/"/g, '&quot;')})" style="cursor:pointer;padding:8px;border-radius:4px;transition:background 0.2s;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='transparent'">
                        ${formatList(activitiesList)}
                    </div>
                </div>
                <div>
                    <label style="font-weight:600;color:#64748b;font-size:13px;display:block;margin-bottom:8px;">Sports</label>
                    <div class="detail-value" onclick="editInterests(event, '${enquiry.id}', 'sports', ${JSON.stringify(sports).replace(/"/g, '&quot;')})" style="cursor:pointer;padding:8px;border-radius:4px;transition:background 0.2s;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='transparent'">
                        ${formatList(sports)}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function buildStatusSection(enquiry) {
    return `
        <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px;">
            <h3 style="color:#1e3a5f;margin-bottom:15px;font-size:18px;">Status & Priority</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:15px;">
                <div>
                    <label style="font-weight:600;color:#64748b;font-size:13px;display:block;margin-bottom:5px;">Current Status</label>
                    <select id="statusSelect" style="width:100%;padding:8px;border:1px solid #e2e8f0;border-radius:6px;" onchange="updateEnquiryStatus('${enquiry.id}', this.value)">
                        <option value="new" ${enquiry.status === 'new' ? 'selected' : ''}>New</option>
                        <option value="contacted" ${enquiry.status === 'contacted' ? 'selected' : ''}>Contacted</option>
                        <option value="openday" ${enquiry.status === 'openday' ? 'selected' : ''}>Open Day</option>
                        <option value="privatetour" ${enquiry.status === 'privatetour' ? 'selected' : ''}>Private Tour</option>
                        <option value="followup" ${enquiry.status === 'followup' ? 'selected' : ''}>Follow-up</option>
                        <option value="applying" ${enquiry.status === 'applying' ? 'selected' : ''}>Applying</option>
                        <option value="accepted" ${enquiry.status === 'accepted' ? 'selected' : ''}>Accepted</option>
                        <option value="archived" ${enquiry.status === 'archived' ? 'selected' : ''}>Archived</option>
                    </select>
                </div>
                <div>
                    <label style="font-weight:600;color:#64748b;font-size:13px;display:block;margin-bottom:5px;">Priority</label>
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span class="priority-star ${enquiry.priority ? 'active' : ''}" onclick="togglePriorityModal('${enquiry.id}')" style="font-size:24px;">★</span>
                        <span>${enquiry.priority ? 'Priority Enquiry' : 'Standard'}</span>
                    </div>
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
                <div>
                    <label style="font-weight:600;color:#64748b;font-size:13px;display:block;margin-bottom:5px;">Email Sent to Parent</label>
                    <div class="detail-value" onclick="makeFieldEditable(event, '${enquiry.id}', 'email_sent', '${enquiry.email_sent}', 'email_sent')" style="font-size:15px;cursor:pointer;padding:8px;border-radius:4px;transition:background 0.2s;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='transparent'">${enquiry.email_sent ? '✓ Yes' : '✗ Not yet'}</div>
                </div>
                <div>
                    <label style="font-weight:600;color:#64748b;font-size:13px;display:block;margin-bottom:5px;">Prospectus</label>
                    <div><a href="/prospectus?id=${enquiry.id}" target="_blank" style="background:#1e3a5f;color:white;padding:6px 12px;border-radius:4px;text-decoration:none;display:inline-block;font-size:13px;">View Prospectus</a></div>
                </div>
            </div>
        </div>
    `;
}

function buildFollowupSection(enquiry) {
    const followupDate = enquiry.followup_date ? enquiry.followup_date.split('T')[0] : '';
    const followupTime = enquiry.followup_date ? new Date(enquiry.followup_date).toTimeString().slice(0,5) : '09:00';
    
    let html = `
        <div style="background:#fff3cd;padding:20px;border-radius:8px;margin-bottom:20px;">
            <h4 style="margin:0 0 10px 0;color:#333;">Follow-up Reminder</h4>
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;">
                <input type="date" id="followupDate" value="${followupDate}" style="padding:8px;border:1px solid #ddd;border-radius:4px;">
                <input type="time" id="followupTime" value="${followupTime}" style="padding:8px;border:1px solid #ddd;border-radius:4px;">
                <button class="btn btn-primary btn-sm" onclick="updateFollowupDate('${enquiry.id}')">Set Reminder</button>
                ${enquiry.followup_date ? `<button class="btn btn-secondary btn-sm" onclick="clearFollowupDate('${enquiry.id}')">Clear</button>` : ''}
            </div>
    `;
    
    if (enquiry.followup_date) {
        const followupDateTime = new Date(enquiry.followup_date);
        const formattedDate = followupDateTime.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        const formattedTime = followupDateTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        html += `<div style="padding:10px;background:white;border-radius:4px;">Reminder set for: <strong>${formattedDate} at ${formattedTime}</strong></div>`;
    }
    
    html += `</div>`;
    return html;
}

function buildNotesSection(enquiry) {
    let html = `
        <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px;">
            <h3 style="color:#1e3a5f;margin-bottom:15px;font-size:18px;">Admin Notes</h3>
    `;
    
    if (enquiry.notes && enquiry.notes.length > 0) {
        enquiry.notes.forEach(note => {
            const noteDate = new Date(note.created_at);
            const noteDateStr = noteDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const noteTimeStr = noteDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            const noteAuthor = note.author || note.admin_email || 'Admin';
            const noteContent = note.content || note.text || note.note || '';
            
            html += `
                <div style="background:white;padding:12px;border-radius:6px;margin-bottom:10px;border-left:3px solid #c9a961;">
                    <div style="font-size:12px;color:#64748b;margin-bottom:5px;">${noteAuthor} • ${noteDateStr} at ${noteTimeStr}</div>
                    <div style="font-size:14px;">${noteContent}</div>
                </div>
            `;
        });
    } else {
        html += '<p style="color:#999;">No notes yet</p>';
    }
    
    html += `
            <textarea id="newNoteContent" placeholder="Add a note..." style="width:100%;padding:10px;border:1px solid #e2e8f0;border-radius:6px;resize:vertical;min-height:80px;margin-top:10px;"></textarea>
            <button class="btn btn-primary btn-sm" onclick="addNote('${enquiry.id}')" style="margin-top:8px;">Add Note</button>
        </div>
    `;
    return html;
}

function buildActivityLogSection(enquiry) {
    return `
        <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;cursor:pointer;" onclick="toggleSection('activityLog')">
                <h3 style="color:#1e3a5f;margin:0;font-size:18px;">Activity Log</h3>
                <span id="activityLogToggle" style="font-size:20px;color:#64748b;">▶</span>
            </div>
            <div id="activityLogContent" style="display:none;">
                <p style="color:#999;text-align:center;padding:20px;">Loading activities...</p>
            </div>
        </div>
    `;
}

function buildSessionHistorySection() {
    return `
        <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;cursor:pointer;" onclick="toggleSection('sessionHistory')">
                <div style="display:flex;align-items:center;gap:20px;">
                    <h3 style="color:#1e3a5f;margin:0;font-size:18px;">Session History</h3>
                    <div style="display:flex;gap:20px;">
                        <div style="text-align:center;">
                            <div style="font-size:20px;font-weight:600;color:#1e3a5f;" id="totalSessionsCount">0</div>
                            <div style="font-size:12px;color:#64748b;">sessions</div>
                        </div>
                        <div style="text-align:center;">
                            <div style="font-size:20px;font-weight:600;color:#1e3a5f;" id="totalTimeSpent">0m</div>
                            <div style="font-size:12px;color:#64748b;">total time</div>
                        </div>
                        <div style="text-align:center;">
                            <div style="font-size:20px;font-weight:600;color:#1e3a5f;" id="uniqueModulesViewed">0</div>
                            <div style="font-size:12px;color:#64748b;">modules</div>
                        </div>
                    </div>
                </div>
                <span id="sessionHistoryToggle" style="font-size:20px;color:#64748b;">▶</span>
            </div>
            <div id="sessionHistoryContent" style="display:none;">
                <p style="color:#999;text-align:center;padding:20px;">Loading sessions...</p>
            </div>
        </div>
    `;
}

function buildModuleDetailsSection() {
    return `
        <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;cursor:pointer;" onclick="toggleSection('moduleDetails')">
                <h3 style="color:#1e3a5f;margin:0;font-size:18px;">Module Details</h3>
                <span id="moduleDetailsToggle" style="font-size:20px;color:#64748b;">▶</span>
            </div>
            <div id="moduleDetailsContent" style="display:none;">
                <p style="color:#999;text-align:center;padding:20px;">Loading module details...</p>
            </div>
        </div>
    `;
}

// LOAD SESSION HISTORY
async function loadSessionHistory(enquiryId) {
    try {
        const res = await fetch(`/api/enquiry/${enquiryId}/sessions`);
        const data = await res.json();
        
        if (data.success && data.sessions) {
            const sessions = data.sessions;
            
            const totalSessions = sessions.length;
            const totalTime = sessions.reduce((sum, s) => sum + (parseInt(s.total_time) || 0), 0);
            const uniqueModules = new Set(sessions.flatMap(s => s.modules || [])).size;
            
            document.getElementById('totalSessionsCount').textContent = totalSessions;
            document.getElementById('totalTimeSpent').textContent = formatTime(totalTime);
            document.getElementById('uniqueModulesViewed').textContent = uniqueModules;
            
            let html = '';
            sessions.forEach(session => {
                const isActive = !session.ended_at;
                const startDate = new Date(session.started_at);
                const dateStr = startDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                const timeStr = startDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                const duration = session.total_time_seconds || session.total_time || 0;
                const durationMins = Math.floor(duration / 60);
                const durationSecs = duration % 60;
                const status = isActive ? '🔴 ACTIVE NOW' : 'ENDED';
                
                const modules = session.modules || [];
                const modulesViewed = session.modules_viewed || modules.length;
                
                html += `
                    <div style="padding:15px;background:white;border-radius:6px;margin-bottom:10px;border-left:4px solid #c9a961;">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
                            <div>
                                <div style="font-size:15px;font-weight:600;color:#1e3a5f;margin-bottom:4px;">${dateStr}</div>
                                <div style="font-size:13px;color:#64748b;">${timeStr} ${status}</div>
                            </div>
                            <div style="background:#f1f5f9;padding:6px 12px;border-radius:6px;font-weight:600;color:#1e3a5f;">${durationMins}m ${durationSecs}s</div>
                        </div>
                        <div style="font-size:13px;color:#64748b;margin-bottom:8px;">
                            ${modulesViewed} module${modulesViewed !== 1 ? 's' : ''} viewed
                        </div>
                        <div style="display:flex;flex-wrap:wrap;gap:6px;">
                            ${modules.length > 0 ? modules.map(module => `
                                <div style="background:#e0f2fe;color:#0369a1;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:500;">
                                    ${formatModuleName(module)}
                                </div>
                            `).join('') : '<span style="color:#94a3b8;font-size:13px;">No module details available</span>'}
                        </div>
                    </div>
                `;
            });
            
            document.getElementById('sessionHistoryContent').innerHTML = html || '<p style="color:#999;text-align:center;padding:20px;">No sessions yet</p>';
        }
    } catch (error) {
        console.error('Error loading session history:', error);
        document.getElementById('sessionHistoryContent').innerHTML = '<p style="color:#ef4444;text-align:center;">Failed to load sessions</p>';
    }
}

// LOAD MODULE DETAILS
async function loadModuleDetails(enquiryId) {
    try {
        // Try the visit-history endpoint which has different field names
        const res = await fetch(`/api/enquiry/${enquiryId}/visit-history`);
        const data = await res.json();
        
        console.log('VISIT HISTORY API RESPONSE:', data);
        
        if (data.success && data.modules) {
            console.log('First module data:', data.modules[0]);
            
            let html = '';
            data.modules.forEach(module => {
                console.log('Processing module:', module.module_name, 'Raw data:', module);
                
                // Use the field names from visit-history endpoint
                const viewCount = module.total_visits || module.view_count || 0;
                const totalTime = module.total_time_seconds || module.time_spent_seconds || 0;
                
                console.log('Extracted values - viewCount:', viewCount, 'totalTime:', totalTime);
                
                const avgTime = viewCount > 0 
                    ? formatTime(Math.floor(totalTime / viewCount))
                    : '0s';
                
                html += `
                    <div style="padding:15px;background:white;border-radius:6px;margin-bottom:10px;border-left:4px solid #17a2b8;">
                        <div style="font-weight:600;color:#1e3a5f;margin-bottom:8px;">${formatModuleName(module.module_name)}</div>
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;font-size:13px;color:#64748b;">
                            <div>
                                <div style="font-weight:600;color:#1e3a5f;">${viewCount}</div>
                                <div>Views</div>
                            </div>
                            <div>
                                <div style="font-weight:600;color:#1e3a5f;">${formatTime(totalTime)}</div>
                                <div>Time Spent</div>
                            </div>
                            <div>
                                <div style="font-weight:600;color:#1e3a5f;">${avgTime}</div>
                                <div>Avg/View</div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            document.getElementById('moduleDetailsContent').innerHTML = html || '<p style="color:#999;text-align:center;padding:20px;">No modules viewed yet</p>';
        }
    } catch (error) {
        console.error('Error loading module details:', error);
        document.getElementById('moduleDetailsContent').innerHTML = '<p style="color:#ef4444;text-align:center;">Failed to load module details</p>';
    }
}

// LOAD ACTIVITY LOG
async function loadActivityLog(enquiryId) {
    try {
        const res = await fetch(`/api/admin/enquiries/${enquiryId}/activities`);
        const data = await res.json();
        
        console.log('ACTIVITY LOG API RESPONSE:', data);
        
        if (data.success && data.activities) {
            const activities = data.activities || [];
            
            if (activities.length === 0) {
                document.getElementById('activityLogContent').innerHTML = '<p style="color:#999;text-align:center;padding:20px;">No activities yet</p>';
                return;
            }
            
            let html = '';
            activities.forEach(activity => {
                const actDate = new Date(activity.created_at);
                const dateStr = actDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                const timeStr = actDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                
                const desc = activity.description || activity.activity_type;
                const user = activity.admin_email || 'System';
                
                html += `
                    <div style="padding:12px;background:white;border-radius:6px;margin-bottom:8px;">
                        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:4px;">
                            <div style="font-weight:600;color:#1e3a5f;font-size:14px;">${desc}</div>
                            <div style="font-size:12px;color:#64748b;">${dateStr} at ${timeStr}</div>
                        </div>
                        <div style="font-size:12px;color:#64748b;">${user}</div>
                    </div>
                `;
            });
            
            document.getElementById('activityLogContent').innerHTML = html;
        } else {
            document.getElementById('activityLogContent').innerHTML = '<p style="color:#999;text-align:center;padding:20px;">No activities yet</p>';
        }
    } catch (error) {
        console.error('Error loading activity log:', error);
        document.getElementById('activityLogContent').innerHTML = '<p style="color:#999;text-align:center;">No activity log available</p>';
    }
}

// UTILITY FUNCTIONS
function toggleSection(sectionName) {
    const content = document.getElementById(sectionName + 'Content');
    const toggle = document.getElementById(sectionName + 'Toggle');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        toggle.textContent = '▼';
    } else {
        content.style.display = 'none';
        toggle.textContent = '▶';
    }
}

function formatTime(seconds) {
    if (!seconds || seconds === 0) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    if (secs === 0) return `${mins}m`;
    return `${mins}m ${secs}s`;
}

function formatModuleName(name) {
    return name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getActivityIcon(type) {
    const icons = {
        'enquiry_submitted': '📧',
        'email_sent': '✉️',
        'prospectus_viewed': '👁️',
        'status_changed': '🔄',
        'priority_changed': '⭐',
        'note_added': '📝',
        'followup_reminder_set': '⏰'
    };
    return icons[type] || '📌';
}

// ACTION FUNCTIONS
function closeEnquiryDetailModal() {
    document.getElementById('enquiryDetailModal').classList.remove('active');
    currentViewEnquiryId = null;
}

async function updateEnquiryStatus(id, newStatus) {
    try {
        const res = await fetch(`/api/admin/enquiries/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        
        const enquiry = allEnquiries.find(e => e.id === id);
        if (enquiry) enquiry.status = newStatus;
        
        showNotification('Status updated');
        filterEnquiries();
        updateStats();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function togglePriorityModal(id) {
    try {
        const enquiry = allEnquiries.find(e => e.id === id);
        const newPriority = !enquiry.priority;
        
        const res = await fetch(`/api/admin/enquiries/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priority: newPriority })
        });
        
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        
        enquiry.priority = newPriority;
        showNotification(newPriority ? 'Marked as priority' : 'Removed from priority');
        updateStats();
        renderEnquiriesTable();
        viewEnquiryDetail(id);
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function updateFollowupDate(id) {
    const dateValue = document.getElementById('followupDate').value;
    const timeValue = document.getElementById('followupTime').value;
    
    if (!dateValue) return alert('Please select a date');
    
    const followupDateTime = `${dateValue}T${timeValue}:00`;
    
    try {
        const res = await fetch(`/api/admin/enquiries/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followup_date: followupDateTime, status: 'followup' })
        });
        
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        
        const enquiry = allEnquiries.find(e => e.id === id);
        if (enquiry) {
            enquiry.followup_date = followupDateTime;
            enquiry.status = 'followup';
        }
        
        showNotification('Follow-up reminder set');
        filterEnquiries();
        updateStats();
        viewEnquiryDetail(id);
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function clearFollowupDate(id) {
    if (!confirm('Clear this follow-up reminder?')) return;
    
    try {
        const res = await fetch(`/api/admin/enquiries/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followup_date: null })
        });
        
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        
        const enquiry = allEnquiries.find(e => e.id === id);
        if (enquiry) enquiry.followup_date = null;
        
        showNotification('Follow-up reminder cleared');
        updateStats();
        viewEnquiryDetail(id);
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function addNote(id) {
    const content = document.getElementById('newNoteContent').value.trim();
    if (!content) return alert('Please enter a note');
    
    try {
        const res = await fetch(`/api/admin/enquiries/${id}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });
        
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        
        const enquiry = allEnquiries.find(e => e.id === id);
        if (enquiry) {
            if (!enquiry.notes) enquiry.notes = [];
            enquiry.notes.push({
                content,
                admin_email: 'Admin',
                created_at: new Date().toISOString()
            });
        }
        
        showNotification('Note added');
        viewEnquiryDetail(id);
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function openEmailClient() {
    // Switch to Smart Reply tab
    switchTab('smartreply');
    
    // Send enquiry context to iframe
    setTimeout(() => {
        const iframe = document.getElementById('smartreply-iframe');
        iframe.contentWindow.postMessage({
            type: 'enquiry-context',
            enquiryId: enquiry.id,
            recipientEmail: enquiry.parent_email
        }, '*');
    }, 500);
    
    closeEnquiryDetailModal();
}

async function deleteEnquiry(id) {
    if (!confirm('⚠️ Are you sure you want to delete this enquiry? This cannot be undone!')) return;
    
    try {
        const res = await fetch(`/api/admin/enquiries/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        
        const index = allEnquiries.findIndex(e => e.id === id);
        if (index > -1) allEnquiries.splice(index, 1);
        
        showNotification('Enquiry deleted');
        closeEnquiryDetailModal();
        filterEnquiries();
        updateStats();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// =====================================================
// ADD TO enquiry-view-modal.js - EMAIL HISTORY SECTION
// =====================================================

// PART 1: Add this function to build the email history section HTML
function buildEmailHistorySection() {
    return `
        <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;cursor:pointer;" onclick="toggleSection('emailHistory')">
                <div style="display:flex;align-items:center;gap:12px;">
                    <h3 style="color:#1e3a5f;margin:0;font-size:18px;">Email History</h3>
                    <div style="display:flex;gap:16px;">
                        <div style="text-align:center;">
                            <div style="font-size:16px;font-weight:600;color:#1e3a5f;" id="totalEmailsCount">0</div>
                            <div style="font-size:11px;color:#64748b;">emails</div>
                        </div>
                        <div style="text-align:center;">
                            <div style="font-size:16px;font-weight:600;color:#10b981;" id="sentEmailsCount">0</div>
                            <div style="font-size:11px;color:#64748b;">sent</div>
                        </div>
                        <div style="text-align:center;">
                            <div style="font-size:16px;font-weight:600;color:#3b82f6;" id="receivedEmailsCount">0</div>
                            <div style="font-size:11px;color:#64748b;">received</div>
                        </div>
                    </div>
                </div>
                <span id="emailHistoryToggle" style="font-size:20px;color:#64748b;">▶</span>
            </div>
            <div id="emailHistoryContent" style="display:none;">
                <p style="color:#999;text-align:center;padding:20px;">Loading email history...</p>
            </div>
        </div>
    `;
}

// PART 2: Add this function to load email history data
async function loadEmailHistory(enquiryId) {
    try {
        const res = await fetch(`/api/admin/email-history/${enquiryId}`);
        const data = await res.json();
        
        if (data.success && data.emails) {
            const emails = data.emails;
            
            // Update counters
            const totalEmails = emails.length;
            const sentEmails = emails.filter(e => e.direction === 'sent').length;
            const receivedEmails = emails.filter(e => e.direction === 'received').length;
            
            document.getElementById('totalEmailsCount').textContent = totalEmails;
            document.getElementById('sentEmailsCount').textContent = sentEmails;
            document.getElementById('receivedEmailsCount').textContent = receivedEmails;
            
            // Build email list HTML
            let html = '';
            
            if (emails.length === 0) {
                html = '<p style="color:#999;text-align:center;padding:20px;">No emails yet</p>';
            } else {
                emails.forEach(email => {
                    const isSent = email.direction === 'sent';
                    const icon = isSent ? '📤' : '📥';
                    const bgColor = isSent ? '#f0fdf4' : '#eff6ff';
                    const borderColor = isSent ? '#10b981' : '#3b82f6';
                    const labelColor = isSent ? '#059669' : '#2563eb';
                    const label = isSent ? 'SENT' : 'RECEIVED';
                    
                    const date = new Date(email.sent_at);
                    const dateStr = date.toLocaleDateString('en-GB', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                    });
                    const timeStr = date.toLocaleTimeString('en-GB', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    });
                    
                    const fromTo = isSent 
                        ? `From: ${email.from_email}<br>To: ${email.to_email}`
                        : `From: ${email.from_name || email.from_email}`;
                    
                    html += `
                        <div style="padding:16px;background:${bgColor};border-radius:8px;margin-bottom:12px;border-left:4px solid ${borderColor};">
                            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
                                <div style="flex:1;">
                                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                                        <span style="font-size:20px;">${icon}</span>
                                        <span style="font-size:11px;font-weight:700;color:${labelColor};background:white;padding:3px 8px;border-radius:4px;">${label}</span>
                                    </div>
                                    <div style="font-size:14px;font-weight:600;color:#1e3a5f;margin-bottom:4px;">
                                        ${email.subject || '(No subject)'}
                                    </div>
                                    <div style="font-size:12px;color:#64748b;">
                                        ${fromTo}
                                    </div>
                                </div>
                                <div style="text-align:right;">
                                    <div style="font-size:12px;color:#64748b;">${dateStr}</div>
                                    <div style="font-size:11px;color:#94a3b8;">${timeStr}</div>
                                </div>
                            </div>
                            
                            ${email.body_text ? `
                                <div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.08);">
                                    <div style="font-size:12px;color:#475569;line-height:1.6;max-height:100px;overflow:hidden;position:relative;">
                                        ${truncateText(email.body_text, 200)}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    `;
                });
            }
            
            document.getElementById('emailHistoryContent').innerHTML = html;
        } else {
            document.getElementById('emailHistoryContent').innerHTML = '<p style="color:#999;text-align:center;padding:20px;">No email history available</p>';
        }
    } catch (error) {
        console.error('Error loading email history:', error);
        document.getElementById('emailHistoryContent').innerHTML = '<p style="color:#ef4444;text-align:center;">Failed to load email history</p>';
    }
}

// PART 3: Helper function to truncate text
function truncateText(text, maxLength) {
    if (!text) return '';
    const cleaned = text.replace(/\s+/g, ' ').trim();
    if (cleaned.length <= maxLength) return cleaned;
    return cleaned.substring(0, maxLength) + '...';
}

// PART 4: Function to show full email in modal (optional enhancement)
function showFullEmail(emailId) {
    // TODO: Implement full email viewer modal if needed
    alert('Full email viewer - implement as needed');
}

// PART 5: Modify your openEnquiryModal() function to include email history
// Add this line in openEnquiryModal() after loading other sections:
/*
async function openEnquiryModal(enquiryId) {
    // ... your existing code ...
    
    // Add email history section to modal content
    modalContent += buildEmailHistorySection();
    
    // ... rest of your modal building code ...
    
    // After modal is displayed, load email history
    await loadEmailHistory(enquiryId);
}
*/

// PART 6: Make sure toggleSection() function handles emailHistory
// Your existing toggleSection() should work, but if not, use this:
/*
function toggleSection(sectionName) {
    const content = document.getElementById(sectionName + 'Content');
    const toggle = document.getElementById(sectionName + 'Toggle');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        toggle.textContent = '▼';
    } else {
        content.style.display = 'none';
        toggle.textContent = '▶';
    }
}
*/

// =====================================================
// INTEGRATION NOTES:
// =====================================================
// 1. Add buildEmailHistorySection() function
// 2. Add loadEmailHistory() function  
// 3. Add helper functions (truncateText, showFullEmail)
// 4. In openEnquiryModal(), add: modalContent += buildEmailHistorySection();
// 5. In openEnquiryModal(), after modal display, call: loadEmailHistory(enquiryId);
// 6. Ensure toggleSection() handles 'emailHistory'