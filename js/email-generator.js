// ========================================
// EMAIL GENERATOR MODULE
// AI-Powered Bulk Email Generation
// ========================================

/**
 * Main function called when "Generate Emails" button is clicked
 */
function bulkGenerateEmails() {
    if (!selectedEnquiries || selectedEnquiries.size === 0) {
        alert('Please select at least one enquiry first');
        return;
    }
    
    const modal = createTemplateSelectionModal(selectedEnquiries.size);
    document.body.appendChild(modal);
}

/**
 * Create the template selection modal
 */
function createTemplateSelectionModal(count) {
    const modal = document.createElement('div');
    modal.id = 'emailGenerationModal';
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header" style="border-bottom: 2px solid #c9a961; padding-bottom: 15px; margin-bottom: 20px;">
                <h2 style="color: #1e3a5f; margin: 0;">✉️ Generate Personalized Emails</h2>
                <p style="color: #666; margin: 10px 0 0 0;">
                    <strong>${count}</strong> ${count === 1 ? 'enquiry' : 'enquiries'} selected
                </p>
            </div>
            
            <div class="modal-body">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: 600; color: #1e3a5f; margin-bottom: 10px;">
                        Select Email Template:
                    </label>
                    <select id="emailTemplate" style="width: 100%; padding: 12px; border: 2px solid #e5e5e5; border-radius: 8px; font-size: 14px;">
                        <option value="welcome">Welcome & Introduction</option>
                        <option value="open-day-invite">Open Day Invitation</option>
                        <option value="post-visit">Post-Visit Follow-up</option>
                        <option value="academic">Academic Inquiry Response</option>
                        <option value="boarding">Boarding Information</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; color: #1e3a5f; font-size: 14px;">Template Details:</h4>
                    <p id="templateDescription" style="margin: 0; color: #666; font-size: 13px; line-height: 1.6;">
                        Warm, welcoming introduction email acknowledging the child's interests, providing school overview, and inviting to campus.
                    </p>
                </div>
                
                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
                    <p style="margin: 0; font-size: 13px; color: #856404;">
                        <strong>ℹ️ Note:</strong> AI will generate personalized emails. You'll review and copy HTML to paste in Outlook.
                    </p>
                </div>
            </div>
            
            <div class="modal-footer" style="display: flex; gap: 10px; justify-content: flex-end; padding-top: 20px; border-top: 1px solid #e5e5e5;">
                <button onclick="closeTemplateModal()" class="btn btn-secondary">Cancel</button>
                <button onclick="startEmailGeneration()" class="btn btn-primary">🤖 Generate Emails</button>
            </div>
        </div>
    `;
    
    const selectElement = modal.querySelector('#emailTemplate');
    selectElement.addEventListener('change', updateTemplateDescription);
    
    modal.addEventListener('click', function(event) {
        if (event.target === modal) closeTemplateModal();
    });
    
    return modal;
}

/**
 * Template descriptions
 */
const templateDescriptions = {
    'welcome': 'Warm, welcoming introduction email acknowledging the child\'s interests, providing school overview, and inviting to campus.',
    'open-day-invite': 'Friendly invitation to upcoming open day with event details and what to expect.',
    'post-visit': 'Personal follow-up after campus visit, recapping conversation, addressing questions, and outlining next steps.',
    'academic': 'Professional response focusing on specific academic programs, department achievements, curriculum, and support available.',
    'boarding': 'Detailed information about boarding life, pastoral care, daily routines, and weekend activities with reassuring tone.',
    'custom': 'Flexible template that adapts to the specific context and needs mentioned in the enquiry.'
};

/**
 * Update template description
 */
function updateTemplateDescription() {
    const select = document.getElementById('emailTemplate');
    const description = document.getElementById('templateDescription');
    if (select && description) {
        description.textContent = templateDescriptions[select.value] || '';
    }
}

/**
 * Close template modal
 */
function closeTemplateModal() {
    const modal = document.getElementById('emailGenerationModal');
    if (modal) modal.remove();
}

/**
 * Start email generation
 */
async function startEmailGeneration() {
    const templateType = document.getElementById('emailTemplate').value;
    const selectedIds = Array.from(selectedEnquiries);
    
    closeTemplateModal();
    
    const loadingModal = createLoadingModal(selectedIds.length);
    document.body.appendChild(loadingModal);
    
    try {
        const response = await fetch('/api/bulk-generate-emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                enquiryIds: selectedIds, 
                templateType: templateType 
            })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to generate emails');
        }
        
        document.getElementById('emailLoadingModal').remove();
        showEmailPreviewModal(data.emails);
        
    } catch (error) {
        console.error('Error generating emails:', error);
        document.getElementById('emailLoadingModal').remove();
        
        if (typeof showNotification === 'function') {
            showNotification('❌ Error: ' + error.message, 'error');
        } else {
            alert('❌ Error: ' + error.message);
        }
    }
}

/**
 * Create loading modal
 */
function createLoadingModal(count) {
    const modal = document.createElement('div');
    modal.id = 'emailLoadingModal';
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px; text-align: center;">
            <div class="spinner" style="margin: 20px auto;"></div>
            <h3 style="color: #1e3a5f; margin: 20px 0 10px 0;">🤖 Generating Personalized Emails...</h3>
            <p style="color: #666; margin: 0;">AI is crafting ${count} personalized ${count === 1 ? 'email' : 'emails'}.</p>
            <p style="color: #999; font-size: 13px; margin: 20px 0 0 0;">This may take 30-60 seconds...</p>
        </div>
    `;
    
    return modal;
}

/**
 * Show email preview modal
 */
function showEmailPreviewModal(emails) {
    const modal = document.createElement('div');
    modal.id = 'emailPreviewModal';
    modal.className = 'modal';
    modal.style.display = 'block';
    
    window.generatedEmails = emails;
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header" style="border-bottom: 2px solid #c9a961; padding-bottom: 15px; margin-bottom: 20px; position: sticky; top: 0; background: white; z-index: 10;">
                <h2 style="color: #1e3a5f; margin: 0;">📧 Review Generated Emails</h2>
                <p style="color: #666; margin: 10px 0 0 0;">Click "Copy HTML" to copy formatted email, then paste in Outlook.</p>
            </div>
            
            <div class="modal-body" id="emailsList">
                ${emails.map((email, index) => createEmailPreviewCard(email, index)).join('')}
            </div>
            
            <div class="modal-footer" style="display: flex; gap: 10px; justify-content: flex-end; padding-top: 20px; border-top: 1px solid #e5e5e5; position: sticky; bottom: 0; background: white;">
                <button onclick="closeEmailPreviewModal()" class="btn btn-primary">✅ Done</button>
            </div>
        </div>
    `;
    
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            if (confirm('Close without copying emails?')) {
                closeEmailPreviewModal();
            }
        }
    });
    
    document.body.appendChild(modal);
}

/**
 * Create email preview card
 */
function createEmailPreviewCard(email, index) {
    const escapedContent = escapeHtml(email.content);
    
    return `
        <div class="email-preview-card" id="email-card-${index}" style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px; border: 2px solid #e5e5e5;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                <div style="flex: 1;">
                    <h4 style="color: #1e3a5f; margin: 0 0 5px 0;">To: ${escapeHtml(email.to)}</h4>
                    <p style="color: #666; margin: 0; font-size: 14px;">Re: ${escapeHtml(email.childName)}</p>
                    <p style="color: #999; margin: 5px 0 0 0; font-size: 13px;">Subject: ${escapeHtml(email.subject)}</p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button onclick="copyEmailHTML(${index})" class="btn btn-sm btn-primary" title="Copy HTML to paste in Outlook">
                        📋 Copy HTML
                    </button>
                    <button onclick="editEmail(${index})" class="btn btn-sm btn-secondary" title="Edit email">
                        ✏️ Edit
                    </button>
                </div>
            </div>
            
            <div class="email-content-preview" id="email-preview-${index}" style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #ddd; max-height: 300px; overflow-y: auto; font-size: 14px; line-height: 1.6;">
                ${email.content}
            </div>
            
            <textarea 
                id="email-edit-${index}" 
                class="email-content-editor" 
                style="display: none; width: 100%; min-height: 300px; padding: 15px; border: 2px solid #c9a961; border-radius: 6px; font-family: inherit; font-size: 14px; line-height: 1.6; margin-top: 15px;"
            >${escapedContent}</textarea>
        </div>
    `;
}

/**
 * Copy email HTML to clipboard
 */
function copyEmailHTML(index) {
    const email = window.generatedEmails[index];
    
    // Use the Clipboard API with HTML type for proper Outlook pasting
    const blob = new Blob([email.content], { type: 'text/html' });
    const clipboardItem = new ClipboardItem({ 'text/html': blob });
    
    navigator.clipboard.write([clipboardItem]).then(() => {
        if (typeof showNotification === 'function') {
            showNotification('✅ Email HTML copied! Paste into Outlook (Ctrl+V)');
        } else {
            alert('✅ Email HTML copied to clipboard!\n\nOpen Outlook and paste (Ctrl+V) into a new email.');
        }
    }).catch(err => {
        console.error('Failed to copy as HTML, trying plain text:', err);
        // Fallback to plain text copy
        navigator.clipboard.writeText(email.content).then(() => {
            if (typeof showNotification === 'function') {
                showNotification('✅ Email copied! Paste into Outlook (Ctrl+V)');
            } else {
                alert('✅ Email copied to clipboard!\n\nOpen Outlook and paste (Ctrl+V) into a new email.');
            }
        }).catch(err2 => {
            console.error('Failed to copy:', err2);
            alert('❌ Failed to copy to clipboard');
        });
    });
}

/**
 * Toggle email editing
 */
function editEmail(index) {
    const preview = document.getElementById(`email-preview-${index}`);
    const editor = document.getElementById(`email-edit-${index}`);
    const card = document.getElementById(`email-card-${index}`);
    
    if (editor.style.display === 'none') {
        preview.style.display = 'none';
        editor.style.display = 'block';
        
        const editBtn = card.querySelector('button[onclick*="editEmail"]');
        if (editBtn) {
            editBtn.innerHTML = '💾 Save';
            editBtn.onclick = () => saveEmail(index);
        }
    }
}

/**
 * Save edited email
 */
function saveEmail(index) {
    const preview = document.getElementById(`email-preview-${index}`);
    const editor = document.getElementById(`email-edit-${index}`);
    const card = document.getElementById(`email-card-${index}`);
    
    window.generatedEmails[index].content = editor.value;
    preview.innerHTML = editor.value;
    
    editor.style.display = 'none';
    preview.style.display = 'block';
    
    const editBtn = card.querySelector('button[onclick*="saveEmail"]');
    if (editBtn) {
        editBtn.innerHTML = '✏️ Edit';
        editBtn.onclick = () => editEmail(index);
    }
    
    if (typeof showNotification === 'function') {
        showNotification('✅ Email updated');
    }
}

/**
 * Close email preview modal
 */
function closeEmailPreviewModal() {
    const modal = document.getElementById('emailPreviewModal');
    if (modal) modal.remove();
    window.generatedEmails = [];
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

console.log('✅ Email Generator Module loaded');