// ========================================
// ENHANCED ANALYTICS MODULE
// ========================================

/**
 * Load enhanced analytics data
 */
async function loadEnhancedAnalytics() {
    console.log('📊 Loading enhanced analytics...');
    
    try {
        const response = await fetch('/api/admin/module-analytics-enhanced');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Analytics data received:', data);
        
        if (!data.success) {
            throw new Error(data.error || 'Unknown error');
        }
        
        // Update all dashboard sections
        updateSummaryCards(data);
        renderModuleTable(data.topModules || []);
        renderRecentActivity(data.activeSessions || []);
        
        // Auto-refresh activity every 10 seconds
        setTimeout(loadEnhancedAnalytics, 10000);
        
    } catch (error) {
        console.error('❌ Error loading analytics:', error);
        showEnhancedError(error.message);
    }
}

/**
 * Update summary cards
 */
function updateSummaryCards(data) {
    console.log('📊 Updating summary cards...');
    
    const stats = data.engagementStats || {};
    const totalEnquiries = parseInt(stats.total_enquiries) || 0;
    const openedCount = parseInt(stats.opened_count) || 0;
    const totalModuleViews = parseInt(stats.total_module_views) || 0;
    const openRate = totalEnquiries > 0 ? 
        Math.round((openedCount / totalEnquiries) * 100) : 0;
    
    // UNIQUE modules per user (max 15)
    const avgUniqueModules = parseFloat(stats.avg_unique_modules_per_user) || 0;
    const displayUniqueAvg = Math.min(avgUniqueModules, 15).toFixed(1);
    
    // TOTAL views per user (includes revisits)
    const avgTotalViews = openedCount > 0 ? 
        (totalModuleViews / openedCount).toFixed(1) : '0.0';
    
    // Update cards
    updateElement('prospectusOpens', openedCount.toLocaleString());
    updateElement('prospectusOpensTrend', 
        `${openedCount} / ${totalEnquiries}<br>` +
        `<span style="color: #10b981; font-weight: 600;">${openRate}% opened</span>`,
        true
    );
    updateElement('uniqueViewers', displayUniqueAvg);
    updateElement('avgViewsPerUser', avgTotalViews);
    updateElement('engagementRate', `${openRate}%`);
    
    console.log('✅ Summary cards updated');
}

/**
 * Render module performance table
 */
function renderModuleTable(modules) {
    console.log('📋 Rendering module table:', modules.length, 'modules');
    
    const tbody = document.getElementById('modulePerformanceTableBody');
    
    if (!tbody) {
        console.error('❌ Module table body not found');
        return;
    }
    
    // Handle empty state
    if (!modules || modules.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px;">
                    <div class="empty-state-icon">📊</div>
                    <div class="empty-state-title">No module data yet</div>
                    <div class="empty-state-text">Data will appear when users start viewing modules</div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Calculate max viewers for relative engagement percentage
    const maxViewers = Math.max(...modules.map(m => parseInt(m.unique_viewers) || 0));
    
    // Build table rows
    tbody.innerHTML = modules.map(module => {
        const uniqueViewers = parseInt(module.unique_viewers) || 0;
        const totalViews = parseInt(module.total_views) || 0;
        const avgViews = uniqueViewers > 0 ? (totalViews / uniqueViewers).toFixed(1) : '0.0';
        const engagementPercent = maxViewers > 0 ? 
            Math.round((uniqueViewers / maxViewers) * 100) : 0;
        
        // Format module name
        const displayName = formatModuleName(module.module_name);
        
        return `
            <tr>
                <td><strong>${displayName}</strong></td>
                <td>${uniqueViewers}</td>
                <td>${totalViews}</td>
                <td>${avgViews}x</td>
                <td>
                    <div class="engagement-bar">
                        <div class="engagement-bar-bg">
                            <div class="engagement-bar-fill" style="width: ${engagementPercent}%"></div>
                        </div>
                        <span class="engagement-percent">${engagementPercent}%</span>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    console.log('✅ Module table rendered');
}

/**
 * Render recent activity list
 */
function renderRecentActivity(sessions) {
    console.log('🔴 Rendering recent activity:', sessions.length, 'sessions');
    
    const container = document.getElementById('recentActivityList');
    
    if (!container) {
        console.error('❌ Activity list container not found');
        return;
    }
    
    // Handle empty state
    if (!sessions || sessions.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #94a3b8;">
                <div style="font-size: 48px; margin-bottom: 12px;">💤</div>
                <p style="font-weight: 500; margin-bottom: 4px;">No active sessions</p>
                <p style="font-size: 14px;">Users will appear here when they view the prospectus</p>
            </div>
        `;
        return;
    }
    
    // Render activity items
    container.innerHTML = sessions.map(session => {
        // Use session_status from API instead of status
        const isViewing = session.session_status === 'viewing';
        const badgeClass = isViewing ? 'viewing' : 'idle';
        const badgeText = isViewing ? 'VIEWING' : 'IDLE';
        
        // Use the module_name that's returned by the API
        const moduleName = formatModuleName(session.module_name);
        
        // Calculate time - use seconds_since_activity to get real elapsed time
        const secondsAgo = parseInt(session.seconds_since_activity) || 0;
        const totalSessionSeconds = parseInt(session.time_spent_seconds) || 0;
        
        // For VIEWING: show live elapsed time (total + seconds since last update)
        // For IDLE: just show the last recorded time
        const displaySeconds = isViewing ? totalSessionSeconds + secondsAgo : totalSessionSeconds;
        const duration = formatDuration(displaySeconds);
        
        // Only show "time ago" when IDLE (not when actively viewing)
        const timeAgoText = isViewing ? '' : getTimeAgo(session.last_activity_at);
        
        // Use viewer_name from API response
        const userName = session.viewer_name || 'Unknown User';
        
        return `
            <div class="activity-item">
                <div class="activity-header">
                    <div class="activity-user">
                        ${isViewing ? '<span style="display: inline-block; width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-right: 8px; animation: pulse 2s ease-in-out infinite;"></span>' : ''}
                        ${escapeHtml(userName)}
                    </div>
                    <div class="activity-time">${duration}</div>
                </div>
                <div class="activity-module">
                    ${moduleName} <span class="activity-badge ${badgeClass}">${badgeText}</span>
                </div>
                ${timeAgoText ? `<div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">${timeAgoText}</div>` : ''}
            </div>
        `;
    }).join('');
    
    console.log('✅ Recent activity rendered');
}

/**
 * Format module name for display
 */
function formatModuleName(moduleName) {
    if (!moduleName) return 'Unknown Module';
    
    return moduleName
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Format duration in seconds to readable format
 */
function formatDuration(seconds) {
    if (!seconds) return '0s';
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    if (mins > 0) {
        return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
}

/**
 * Get time ago string
 */
function getTimeAgo(timestamp) {
    if (!timestamp) return 'unknown';
    
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins === 1) return '1 min ago';
    if (diffMins < 60) return `${diffMins} mins ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
}

/**
 * Update element content safely
 */
function updateElement(id, content, isHTML = false) {
    const element = document.getElementById(id);
    if (element) {
        if (isHTML) {
            element.innerHTML = content;
        } else {
            element.textContent = content;
        }
    }
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
 * Show error message
 */
function showEnhancedError(message) {
    const tbody = document.getElementById('modulePerformanceTableBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: #ef4444;">
                    ❌ ${escapeHtml(message)}
                </td>
            </tr>
        `;
    }
}