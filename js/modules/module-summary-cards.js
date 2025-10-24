/* ========================================
   MODULE: SUMMARY CARDS
   Displays key metrics in card format
   ======================================== */

class SummaryCardsModule {
    constructor() {
        this.name = 'summary-cards';
        console.log(`📊 ${this.name} module loaded`);
        
        // Register this module with the dashboard controller
        const dashboard = window.getDashboard();
        if (dashboard) {
            dashboard.registerModule(this.name, this);
        }
    }

    // ========================================
    // MAIN RENDER METHOD
    // ========================================
    
    render(data, container) {
        console.log(`🎨 Rendering ${this.name}...`);
        
        // Extract stats from data
        const stats = data.engagementStats || {};
        const metrics = this.calculateMetrics(stats);
        
        // Build HTML
        const html = this.buildHTML(metrics);
        
        // Update container
        container.innerHTML = html;
    }

    // ========================================
    // DATA PROCESSING
    // ========================================
    
    calculateMetrics(stats) {
        const totalEnquiries = parseInt(stats.total_enquiries) || 0;
        const openedCount = parseInt(stats.opened_count) || 0;
        const totalModuleViews = parseInt(stats.total_module_views) || 0;
        
        // Calculate open rate
        const openRate = totalEnquiries > 0 ? 
            Math.round((openedCount / totalEnquiries) * 100) : 0;
        
        // Average UNIQUE modules per user (max 15)
        const avgUniqueModules = parseFloat(stats.avg_unique_modules_per_user) || 0;
        const displayUniqueAvg = Math.min(avgUniqueModules, 15).toFixed(1);
        
        // Average TOTAL views per user (includes revisits)
        const avgTotalViews = openedCount > 0 ? 
            (totalModuleViews / openedCount).toFixed(1) : '0.0';
        
        return {
            totalEnquiries,
            openedCount,
            openRate,
            totalModuleViews,
            avgUniqueModules: displayUniqueAvg,
            avgTotalViews
        };
    }

    // ========================================
    // HTML GENERATION
    // ========================================
    
    buildHTML(metrics) {
        return `
            <div class="module-header">
                <h2 class="module-title">
                    📊 Overview
                </h2>
            </div>
            
            <div class="module-body">
                <div class="analytics-summary-grid module-grid module-grid-4">
                    ${this.buildCard({
                        label: 'Total Enquiries',
                        value: metrics.totalEnquiries,
                        trend: 'Total prospectuses sent',
                        icon: '📧'
                    })}
                    
                    ${this.buildCard({
                        label: 'Prospectuses Opened',
                        value: metrics.openedCount,
                        trend: `${metrics.openRate}% open rate`,
                        icon: '👁️'
                    })}
                    
                    ${this.buildCard({
                        label: 'Total Module Views',
                        value: metrics.totalModuleViews,
                        trend: 'All module interactions',
                        icon: '📖'
                    })}
                    
                    ${this.buildCard({
                        label: 'Avg Unique Modules',
                        value: metrics.avgUniqueModules,
                        trend: `${metrics.avgTotalViews} avg total views`,
                        icon: '📈'
                    })}
                </div>
            </div>
        `;
    }

    buildCard({ label, value, trend, icon }) {
        return `
            <div class="metric-card">
                <div class="metric-header">
                    <div class="metric-icon">${icon}</div>
                    <div class="metric-label">${label}</div>
                </div>
                <div class="metric-value">${value}</div>
                <div class="metric-trend">${trend}</div>
            </div>
        `;
    }
}

// ========================================
// MODULE STYLES
// ========================================

const styles = `
<style>
/* Summary Cards Specific Styles */
.analytics-summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
}

.metric-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 24px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.metric-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, #1e3a5f 0%, #3b82f6 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.metric-card:hover {
    border-color: #1e3a5f;
    box-shadow: 0 8px 24px rgba(30, 58, 95, 0.15);
    transform: translateY(-4px);
}

.metric-card:hover::before {
    opacity: 1;
}

.metric-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}

.metric-icon {
    font-size: 24px;
    filter: grayscale(0.3);
}

.metric-label {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.metric-value {
    font-size: 42px;
    font-weight: 700;
    color: #1e3a5f;
    line-height: 1;
    margin-bottom: 12px;
    font-variant-numeric: tabular-nums;
}

.metric-trend {
    font-size: 13px;
    color: #94a3b8;
    font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
    .analytics-summary-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {
    .analytics-summary-grid {
        grid-template-columns: 1fr;
    }
    
    .metric-card {
        padding: 20px;
    }
    
    .metric-value {
        font-size: 36px;
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', styles);

// ========================================
// AUTO-INITIALIZE
// ========================================

// Create instance when script loads
new SummaryCardsModule();
