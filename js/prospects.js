// ========================================
// TOP PROSPECTS MODULE
// ========================================
// This module handles the Top Prospects tab functionality
// Dependencies: Requires allEnquiries, showNotification, and viewEnquiryDetail functions from admin.html
// ========================================

let currentInsightsText = '';

/**
 * Load top prospects data from API
 * Called when: Tab is opened, sort changes, or refresh button clicked
 */
async function loadTopProspects() {
    const sortBy = document.getElementById('prospects-sort').value;
    const loading = document.getElementById('prospects-loading');
    const tableContainer = document.getElementById('prospects-table-container');
    
    loading.style.display = 'block';
    tableContainer.style.display = 'none';
    
    try {
        const response = await fetch(`/api/admin/top-prospects?sortBy=${sortBy}&limit=50`);
        const data = await response.json();
        
        if (data.success) {
            renderProspectsTable(data.prospects);
            updateProspectsSummary(data.prospects);
        } else {
            showError('Failed to load prospects');
        }
    } catch (error) {
        console.error('Error loading prospects:', error);
        showError('Failed to load prospects: ' + error.message);
    } finally {
        loading.style.display = 'none';
        tableContainer.style.display = 'block';
    }
}

/**
 * Render the prospects table with engagement data
 * @param {Array} prospects - Array of prospect objects from API
 */
function renderProspectsTable(prospects) {
    const tbody = document.getElementById('prospects-tbody');
    
    if (prospects.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px; color: #64748b;">
                    <div class="no-prospects">
                        <div class="no-prospects-icon">📊</div>
                        <p>No engaged prospects yet. Check back after parents start viewing prospectuses.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = prospects.map(prospect => {
        // Determine engagement level for styling
        const engagementClass = 
            prospect.engagement_score >= 70 ? 'high' :
            prospect.engagement_score >= 40 ? 'medium' : 'low';
        
        const engagementLabel = 
            prospect.engagement_score >= 70 ? 'High' :
            prospect.engagement_score >= 40 ? 'Medium' : 'Low';
        
        // Format last visit date
        const lastVisit = prospect.last_session_at 
            ? new Date(prospect.last_session_at).toLocaleDateString('en-GB', { 
                day: 'numeric', 
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })
            : 'Never';
        
        const statusClass = prospect.status || 'new';
        
        return `
            <tr>
                <td><strong>${escapeHtml(prospect.parent_name)}</strong></td>
                <td>${escapeHtml(prospect.student_name || 'N/A')}</td>
                <td>
                    <div class="engagement-score">
                        <div class="score-bar">
                            <div class="score-fill ${engagementClass}" style="width: ${prospect.engagement_score}%"></div>
                        </div>
                        <span class="score-text ${engagementClass}">${prospect.engagement_score}</span>
                    </div>
                </td>
                <td><strong>${prospect.total_sessions}</strong> session${prospect.total_sessions !== 1 ? 's' : ''}</td>
                <td><strong>${prospect.time_spent_minutes}</strong> min</td>
                <td><strong>${prospect.unique_modules_viewed}</strong> modules</td>
                <td>${lastVisit}</td>
                <td><span class="status-badge ${statusClass}">${prospect.status}</span></td>
                <td>
                    <button onclick="generateAIInsights('${prospect.id}')" class="btn-ai" title="Generate AI insights">
                        🤖 Analyze
                    </button>
                    <button onclick="viewEnquiryDetail('${prospect.id}')" class="btn btn-secondary btn-sm" style="margin-left: 5px;">
                        View Details
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Update the summary statistics cards
 * @param {Array} prospects - Array of prospect objects
 */
function updateProspectsSummary(prospects) {
    document.getElementById('total-prospects').textContent = prospects.length;
    
    const highEngagement = prospects.filter(p => p.engagement_score >= 70).length;
    document.getElementById('high-engagement').textContent = highEngagement;
    
    const avgSessions = prospects.reduce((sum, p) => sum + p.total_sessions, 0) / prospects.length;
    document.getElementById('avg-sessions').textContent = avgSessions.toFixed(1);
    
    const avgTime = prospects.reduce((sum, p) => sum + p.time_spent_minutes, 0) / prospects.length;
    document.getElementById('avg-time').textContent = Math.round(avgTime) + ' min';
}

/**
 * Generate AI insights for a specific prospect
 * Opens modal with loading state, fetches insights from API, displays results
 * @param {string} enquiryId - The UUID of the enquiry/prospect
 */
async function generateAIInsights(enquiryId) {
    const modal = document.getElementById('ai-insights-modal');
    const loading = document.getElementById('ai-insights-loading');
    const content = document.getElementById('ai-insights-content');
    const error = document.getElementById('ai-insights-error');
    
    // Show modal and loading state
    modal.style.display = 'block';
    loading.style.display = 'block';
    content.style.display = 'none';
    error.style.display = 'none';
    
    try {
        const response = await fetch('/api/admin/generate-prospect-insights', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ enquiryId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Store for clipboard copy
            currentInsightsText = data.insights;
            
            // Display prospect info
            document.getElementById('ai-prospect-name').textContent = data.prospectName || 'N/A';
            document.getElementById('ai-student-name').textContent = data.studentName || 'N/A';
            
            // Format the insights text (convert markdown-style bold to HTML)
            const formattedInsights = data.insights
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>')
                .replace(/•/g, '&bull;');
            
            document.getElementById('ai-insights-text').innerHTML = formattedInsights;
            
            // Show content
            loading.style.display = 'none';
            content.style.display = 'block';
        } else {
            throw new Error(data.error || 'Failed to generate insights');
        }
    } catch (err) {
        console.error('Error generating insights:', err);
        loading.style.display = 'none';
        error.style.display = 'block';
        document.getElementById('ai-error-message').textContent = err.message;
    }
}

/**
 * Close the AI insights modal
 */
function closeAIInsightsModal() {
    document.getElementById('ai-insights-modal').style.display = 'none';
}

/**
 * Copy AI insights text to clipboard
 * Uses the Clipboard API with fallback error handling
 */
function copyInsightsToClipboard() {
    navigator.clipboard.writeText(currentInsightsText).then(() => {
        // Use global showNotification function from admin.html
        if (typeof showNotification === 'function') {
            showNotification('✅ Copied to clipboard!');
        } else {
            alert('✅ Copied to clipboard!');
        }
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('❌ Failed to copy to clipboard');
    });
}

/**
 * Helper function to escape HTML and prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - HTML-safe text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show error message in the prospects table
 * @param {string} message - Error message to display
 */
function showError(message) {
    const tbody = document.getElementById('prospects-tbody');
    tbody.innerHTML = `
        <tr>
            <td colspan="9" style="text-align: center; padding: 40px; color: #ef4444;">
                ❌ ${escapeHtml(message)}
            </td>
        </tr>
    `;
}

// ========================================
// EVENT LISTENERS
// ========================================

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    const modal = document.getElementById('ai-insights-modal');
    if (event.target === modal) {
        closeAIInsightsModal();
    }
});

// Note: loadTopProspects() is called from admin.html switchTab() function when prospects tab is opened