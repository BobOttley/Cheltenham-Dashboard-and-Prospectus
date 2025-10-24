/* ====== ENHANCED MODULE TRACKING WITH TIME & IDLE DETECTION ====== */
/* FIXED VERSION - Works with lazy-loaded modules + Better logging */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        IDLE_TIMEOUT: 120000,        // 2 minutes of inactivity = idle
        HEARTBEAT_INTERVAL: 10000,   // Send activity update every 10 seconds
        VISIBILITY_THRESHOLD: 0.1,   // 10% of module must be visible (industry standard)
        MIN_VIEW_TIME: 2000,         // Must view for 2 seconds to count
        SCROLL_SAMPLE_RATE: 1000     // Sample scroll position every second
    };

    // State
    let sessionId = null;
    let enquiryId = null;
    let activeModules = new Map(); // moduleName -> { startTime, lastActivity, scrollDepth, observer }
    let idleTimer = null;
    let heartbeatTimer = null;
    let isIdle = false;
    let isVisible = true;

    /* ====== INITIALIZATION ====== */
    
    let initAttempts = 0;
    const MAX_ATTEMPTS = 100; // Try for 10 seconds (100 * 100ms)
    
    function initEnhancedTracking() {
        enquiryId = window.PENAI_FAMILY_ID;
        if (!enquiryId) {
            initAttempts++;
            if (initAttempts >= MAX_ATTEMPTS) {
                console.error('❌ Tracking disabled: No enquiry ID found after 10 seconds');
                return;
            }
            // Wait for PENAI_FAMILY_ID to be set
            setTimeout(initEnhancedTracking, 100);
            return;
        }

        console.log('🚀 Enhanced module tracking initialized for:', enquiryId);
        
        startSession();
        setupEventListeners();
        observeModules();
    }

    /* ====== SESSION MANAGEMENT ====== */

    async function startSession() {
        try {
            const response = await fetch('/api/session/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enquiryId })
            });

            const data = await response.json();
            if (data.success) {
                sessionId = data.sessionId;
                console.log(`✅ Session started: ${sessionId}`);
                startHeartbeat();
            }
        } catch (error) {
            console.error('Failed to start session:', error);
        }
    }

    async function endSession() {
        if (!sessionId) return;

        try {
            // Save final state for all active modules
            for (const [moduleName, data] of activeModules.entries()) {
                await sendActivity(moduleName, data, true);
            }

            await fetch('/api/session/end', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId })
            });

            console.log('📚 Session ended');
        } catch (error) {
            console.error('Failed to end session:', error);
        }
    }

    /* ====== ACTIVITY TRACKING ====== */

    function recordActivity() {
        if (isIdle) {
            console.log('🔄 User returned from idle');
            isIdle = false;
        }

        // Update last activity for all active modules
        const now = Date.now();
        for (const data of activeModules.values()) {
            data.lastActivity = now;
        }

        resetIdleTimer();
    }

    function resetIdleTimer() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            console.log('💤 User is idle');
            isIdle = true;
            // Stop counting time for all modules
        }, CONFIG.IDLE_TIMEOUT);
    }

    function handleVisibilityChange() {
        if (document.hidden) {
            console.log('👁️ Page hidden');
            isVisible = false;
            isIdle = true;
        } else {
            console.log('👁️ Page visible');
            isVisible = true;
            recordActivity();
        }
    }

    /* ====== MODULE OBSERVATION - HYBRID APPROACH FOR FAST SCROLLING ====== */

    function observeModules() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const module = entry.target;
                
                // Get module name from data-mod OR from class name (mod--sports -> sports)
                let moduleName = module.dataset.mod;
                if (!moduleName) {
                    const classList = Array.from(module.classList);
                    const modClass = classList.find(c => c.startsWith('mod--'));
                    if (modClass) {
                        moduleName = modClass.replace('mod--', '');
                    }
                }
                
                if (!moduleName) return;

                if (entry.isIntersecting) {
                    handleModuleEnter(moduleName, module);
                } else {
                    handleModuleLeave(moduleName);
                }
            });
        }, {
            root: null,
            threshold: CONFIG.VISIBILITY_THRESHOLD,
            rootMargin: '0px'
        });

        // Track which modules we've already observed
        const observedModules = new Set();

        // Function to check for and observe new modules
        const checkForNewModules = () => {
            const modules = document.querySelectorAll('.mod');
            let newCount = 0;
            
            modules.forEach(module => {
                if (!observedModules.has(module)) {
                    observer.observe(module);
                    observedModules.add(module);
                    newCount++;
                }
            });
            
            if (newCount > 0) {
                console.log(`🔍 Now tracking ${observedModules.size} modules (${newCount} new)`);
            }
        };

        // Check immediately and then every 2 seconds for lazy-loaded modules
        checkForNewModules();
        const checkInterval = setInterval(checkForNewModules, 2000);
        
        // Also watch for DOM changes using MutationObserver
        const mutationObserver = new MutationObserver(() => {
            checkForNewModules();
        });
        
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // BACKUP: Scroll-based visibility check to catch modules missed during fast scrolling
        let scrollCheckTimeout = null;
        const checkVisibleModules = () => {
            const modules = document.querySelectorAll('.mod');
            const viewportHeight = window.innerHeight;
            
            modules.forEach(module => {
                let moduleName = module.dataset.mod;
                if (!moduleName) {
                    const classList = Array.from(module.classList);
                    const modClass = classList.find(c => c.startsWith('mod--'));
                    if (modClass) {
                        moduleName = modClass.replace('mod--', '');
                    }
                }
                
                if (!moduleName) return;
                
                const rect = module.getBoundingClientRect();
                const isVisible = (
                    rect.top < viewportHeight &&
                    rect.bottom > 0 &&
                    rect.height > 0
                );
                
                // If module is visible but not in activeModules, trigger enter
                if (isVisible && !activeModules.has(moduleName)) {
                    handleModuleEnter(moduleName, module);
                }
            });
        };

        // Check on scroll (debounced)
        window.addEventListener('scroll', () => {
            clearTimeout(scrollCheckTimeout);
            scrollCheckTimeout = setTimeout(checkVisibleModules, 300);
        }, { passive: true });

        // Also check periodically (every 2 seconds) as a final safety net
        setInterval(checkVisibleModules, 2000);
    }

    function handleModuleEnter(moduleName, moduleElement) {
        if (activeModules.has(moduleName)) return;

        console.log(`👀 Viewing: ${moduleName}`);
        
        const now = Date.now();
        activeModules.set(moduleName, {
            element: moduleElement,
            startTime: now,
            lastActivity: now,
            scrollDepth: 0,
            isFirstView: !hasBeenTrackedBefore(moduleName)
        });

        // Start tracking scroll depth
        startScrollTracking(moduleName, moduleElement);

        // Track after minimum view time
        setTimeout(() => {
            if (activeModules.has(moduleName) && !isIdle) {
                trackModuleView(moduleName);
            }
        }, CONFIG.MIN_VIEW_TIME);
    }

    function handleModuleLeave(moduleName) {
        const data = activeModules.get(moduleName);
        if (!data) return;

        const timeSpent = Math.floor((Date.now() - data.startTime) / 1000);
        console.log(`👋 Left: ${moduleName} (${timeSpent}s)`);
        
        // Send final activity update
        sendActivity(moduleName, data, false);
        
        // Keep in activeModules for session but mark as left
        data.hasLeft = true;
    }

    /* ====== SCROLL TRACKING ====== */

    function startScrollTracking(moduleName, moduleElement) {
        const data = activeModules.get(moduleName);
        if (!data) return;

        const updateScroll = () => {
            if (!activeModules.has(moduleName) || isIdle) return;

            const rect = moduleElement.getBoundingClientRect();
            const elementHeight = moduleElement.scrollHeight || moduleElement.offsetHeight;
            const viewportHeight = window.innerHeight;
            
            // Calculate how much of the module has been seen
            const visibleTop = Math.max(0, -rect.top);
            const visibleBottom = Math.min(elementHeight, viewportHeight - rect.top);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const scrollDepth = Math.round((visibleHeight / elementHeight) * 100);
            
            // Update max scroll depth
            data.scrollDepth = Math.max(data.scrollDepth, scrollDepth);
        };

        // Update on scroll
        const scrollHandler = () => {
            if (activeModules.has(moduleName)) {
                updateScroll();
            }
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });
        
        // Also sample periodically
        const scrollInterval = setInterval(() => {
            if (!activeModules.has(moduleName)) {
                clearInterval(scrollInterval);
                window.removeEventListener('scroll', scrollHandler);
            } else {
                updateScroll();
            }
        }, CONFIG.SCROLL_SAMPLE_RATE);
    }

    /* ====== DATA TRANSMISSION ====== */

    async function trackModuleView(moduleName) {
        const data = activeModules.get(moduleName);
        if (!data || !sessionId) return;

        const timeSpent = Math.floor((Date.now() - data.startTime) / 1000);

        try {
            await fetch('/api/track-module-enhanced', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enquiryId,
                    moduleName,
                    sessionId,
                    timeSpentSeconds: timeSpent,
                    scrollDepth: data.scrollDepth,
                    isFirstView: data.isFirstView
                })
            });

            console.log(`✅ Tracked: ${moduleName} (${timeSpent}s, ${data.scrollDepth}% scrolled)`);
            markAsTracked(moduleName);
        } catch (error) {
            console.error('Failed to track module:', error);
        }
    }

    async function sendActivity(moduleName, data, isFinal = false) {
        if (!sessionId || !data || isIdle) return;

        const timeSpent = Math.floor((Date.now() - data.startTime) / 1000);

        try {
            await fetch('/api/session/activity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enquiryId,
                    moduleName,
                    sessionId,
                    timeSpentSeconds: timeSpent,
                    scrollDepth: data.scrollDepth
                })
            });

            if (isFinal) {
                console.log(`✅ Final activity: ${moduleName} (${timeSpent}s)`);
            } else {
                // Log heartbeat updates too
                console.log(`⏱️ Heartbeat: ${moduleName} (${timeSpent}s)`);
            }
        } catch (error) {
            console.error('Failed to send activity:', error);
        }
    }

    function startHeartbeat() {
        heartbeatTimer = setInterval(() => {
            if (isIdle || !isVisible) return;

            // Send activity update for all active modules
            for (const [moduleName, data] of activeModules.entries()) {
                if (!data.hasLeft) {
                    sendActivity(moduleName, data, false);
                }
            }
        }, CONFIG.HEARTBEAT_INTERVAL);
    }

    /* ====== LOCAL STORAGE HELPERS ====== */

    function hasBeenTrackedBefore(moduleName) {
        try {
            const key = `tracked_${enquiryId}_${moduleName}`;
            return localStorage.getItem(key) === 'true';
        } catch (e) {
            return false;
        }
    }

    function markAsTracked(moduleName) {
        try {
            const key = `tracked_${enquiryId}_${moduleName}`;
            localStorage.setItem(key, 'true');
        } catch (e) {
            // Ignore localStorage errors
        }
    }

    /* ====== EVENT LISTENERS ====== */

    function setupEventListeners() {
        // Activity detection
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
            document.addEventListener(event, recordActivity, { passive: true });
        });

        // Visibility change
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Page unload
        window.addEventListener('beforeunload', () => {
            endSession();
        });

        // Initial activity
        recordActivity();
    }

    /* ====== START TRACKING ====== */

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnhancedTracking);
    } else {
        initEnhancedTracking();
    }

})();