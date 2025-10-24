/* ========================================
   MODULAR DASHBOARD - CORE CONTROLLER
   Main orchestration and data management
   ======================================== */

class DashboardController {
    constructor(config) {
        this.config = config;
        this.modules = new Map();
        this.data = null;
        this.isLoading = false;
        this.lastUpdated = null;
        
        console.log('🎯 Dashboard Controller initialized');
        this.init();
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    
    async init() {
        console.log('🚀 Initializing dashboard...');
        
        // Load enabled modules
        await this.loadModules();
        
        // Fetch initial data
        await this.fetchData();
        
        // Setup refresh button
        this.setupRefreshButton();
        
        // Setup auto-refresh if configured
        if (this.config.refreshInterval) {
            this.setupAutoRefresh();
        }
        
        console.log('✅ Dashboard ready');
    }

    // ========================================
    // MODULE LOADING SYSTEM
    // ========================================
    
    async loadModules() {
        console.log('📦 Loading modules...');
        
        // Sort modules by priority
        const sortedModules = Object.entries(this.config.modules)
            .filter(([name, config]) => config.enabled)
            .sort(([, a], [, b]) => a.priority - b.priority);
        
        // Load each module script
        for (const [name, config] of sortedModules) {
            try {
                await this.loadModuleScript(name, config.script);
                console.log(`✅ Module loaded: ${name}`);
            } catch (error) {
                console.error(`❌ Failed to load module: ${name}`, error);
                this.showModuleError(name, error.message);
            }
        }
    }

    loadModuleScript(name, scriptPath) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = scriptPath;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load ${scriptPath}`));
            document.body.appendChild(script);
        });
    }

    // ========================================
    // MODULE REGISTRATION
    // ========================================
    
    registerModule(name, moduleInstance) {
        console.log(`📝 Registering module: ${name}`);
        this.modules.set(name, moduleInstance);
        
        // If data already loaded, render this module
        if (this.data) {
            this.renderModule(name, this.data);
        }
    }

    // ========================================
    // DATA FETCHING
    // ========================================
    
    async fetchData() {
        if (this.isLoading) {
            console.log('⏳ Data fetch already in progress...');
            return;
        }

        this.isLoading = true;
        console.log('🔄 Fetching dashboard data...');

        try {
            const response = await fetch(this.config.apiEndpoint);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Unknown error');
            }
            
            this.data = result;
            this.lastUpdated = new Date();
            
            console.log('✅ Data fetched successfully:', this.data);
            
            // Update last updated time
            this.updateLastUpdatedTime();
            
            // Render all modules with new data
            this.renderAllModules();
            
        } catch (error) {
            console.error('❌ Error fetching data:', error);
            this.showGlobalError(error.message);
        } finally {
            this.isLoading = false;
        }
    }

    // ========================================
    // MODULE RENDERING
    // ========================================
    
    renderAllModules() {
        console.log('🎨 Rendering all modules...');
        
        this.modules.forEach((moduleInstance, name) => {
            this.renderModule(name, this.data);
        });
    }

    renderModule(name, data) {
        const moduleInstance = this.modules.get(name);
        
        if (!moduleInstance) {
            console.warn(`⚠️ Module not found: ${name}`);
            return;
        }

        const container = document.getElementById(`module-${name}`);
        
        if (!container) {
            console.warn(`⚠️ Container not found for module: ${name}`);
            return;
        }

        try {
            console.log(`🎨 Rendering module: ${name}`);
            moduleInstance.render(data, container);
        } catch (error) {
            console.error(`❌ Error rendering module: ${name}`, error);
            this.showModuleError(name, error.message);
        }
    }

    // ========================================
    // REFRESH FUNCTIONALITY
    // ========================================
    
    setupRefreshButton() {
        const refreshBtn = document.getElementById('refreshDashboard');
        
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                console.log('🔄 Manual refresh triggered');
                this.refresh();
            });
        }
    }

    async refresh() {
        const refreshBtn = document.getElementById('refreshDashboard');
        const icon = refreshBtn?.querySelector('.refresh-icon');
        
        // Add spinning animation
        if (icon) {
            icon.style.display = 'inline-block';
            icon.style.animation = 'spin 0.8s linear infinite';
        }
        
        await this.fetchData();
        
        // Remove spinning animation
        if (icon) {
            icon.style.animation = '';
        }
    }

    setupAutoRefresh() {
        console.log(`⏰ Auto-refresh enabled: ${this.config.refreshInterval / 1000}s`);
        
        setInterval(() => {
            console.log('⏰ Auto-refresh triggered');
            this.fetchData();
        }, this.config.refreshInterval);
    }

    // ========================================
    // UI UPDATES
    // ========================================
    
    updateLastUpdatedTime() {
        const timeElement = document.getElementById('lastUpdatedTime');
        
        if (timeElement && this.lastUpdated) {
            const formatted = this.formatTime(this.lastUpdated);
            timeElement.textContent = formatted;
        }
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    // ========================================
    // ERROR HANDLING
    // ========================================
    
    showModuleError(moduleName, message) {
        const container = document.getElementById(`module-${moduleName}`);
        
        if (container) {
            container.innerHTML = `
                <div class="module-error">
                    <div class="module-error-icon">⚠️</div>
                    <div class="module-error-title">Module Error: ${moduleName}</div>
                    <div class="module-error-message">${message}</div>
                </div>
            `;
        }
    }

    showGlobalError(message) {
        console.error('🚨 Global error:', message);
        
        // Show error in all module containers
        document.querySelectorAll('.dashboard-module').forEach(module => {
            if (module.querySelector('.module-loading')) {
                module.innerHTML = `
                    <div class="module-error">
                        <div class="module-error-icon">⚠️</div>
                        <div class="module-error-title">Failed to Load Data</div>
                        <div class="module-error-message">${message}</div>
                    </div>
                `;
            }
        });
    }

    // ========================================
    // UTILITY METHODS
    // ========================================
    
    getData() {
        return this.data;
    }

    getModule(name) {
        return this.modules.get(name);
    }

    hideModule(name) {
        const container = document.getElementById(`module-${name}`);
        if (container) {
            container.setAttribute('data-enabled', 'false');
        }
    }

    showModule(name) {
        const container = document.getElementById(`module-${name}`);
        if (container) {
            container.setAttribute('data-enabled', 'true');
        }
    }
}

// ========================================
// GLOBAL INITIALIZATION
// ========================================

let dashboard = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM loaded, initializing dashboard...');
    
    if (typeof DASHBOARD_CONFIG === 'undefined') {
        console.error('❌ DASHBOARD_CONFIG not found!');
        return;
    }
    
    dashboard = new DashboardController(DASHBOARD_CONFIG);
});

// Export for module access
window.DashboardController = DashboardController;
window.getDashboard = () => dashboard;
