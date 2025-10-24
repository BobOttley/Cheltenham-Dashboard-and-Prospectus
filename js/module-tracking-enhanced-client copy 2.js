/* ====== FULL ENHANCED MODULE TRACKING ====== */
/* Phase 1: Multiple module visits tracking */
/* Phase 2: Interactive element tracking (houses, accordions, tabs, etc.) */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        IDLE_TIMEOUT: 120000,        // 2 minutes of inactivity = idle
        HEARTBEAT_INTERVAL: 10000,   // Send activity update every 10 seconds
        VISIBILITY_THRESHOLD: 0.45,  // 35% of module must be visible (INITIAL)
        REENTRY_THRESHOLD: 0.40,     // 40% required for RE-ENTRY (even stricter)
        MIN_VIEW_TIME: 2000,         // Must view for 2 seconds to count
        MIN_AWAY_TIME: 10000,        // Must be away 10+ seconds before new visit
        SCROLL_SAMPLE_RATE: 1000     // Sample scroll position every second
    };

    // State
    let sessionId = null;
    let enquiryId = null;
    let moduleVisits = new Map();  // moduleName -> [visit1, visit2, ...] array of visits
    let currentModuleVisits = new Map(); // moduleName -> current active visit object
    let lastVisitStart = new Map(); // moduleName -> timestamp of last visit start
    let lastVisitEnd = new Map(); // moduleName -> timestamp when module left viewport
    let idleTimer = null;
    let heartbeatTimer = null;
    let isIdle = false;
    let isVisible = true;

    /* ====== INITIALIZATION ====== */
    
    let initAttempts = 0;
    const MAX_ATTEMPTS = 100;
    
    function initEnhancedTracking() {
        enquiryId = window.PENAI_FAMILY_ID;
        if (!enquiryId) {
            initAttempts++;
            if (initAttempts >= MAX_ATTEMPTS) {
                console.error('❌ Tracking disabled: No enquiry ID found after 10 seconds');
                return;
            }
            setTimeout(initEnhancedTracking, 100);
            return;
        }

        console.log('🚀 Full enhanced tracking initialized for:', enquiryId);
        
        startSession();
        setupEventListeners();
        observeModules();
        setupInteractionTracking();
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
            // Save final state for all active module visits
            for (const [moduleName, visit] of currentModuleVisits.entries()) {
                await sendModuleVisit(moduleName, visit, true);
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

        // Update last activity for all current visits
        const now = Date.now();
        for (const visit of currentModuleVisits.values()) {
            visit.lastActivity = now;
        }

        resetIdleTimer();
    }

    function resetIdleTimer() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            console.log('💤 User is idle');
            isIdle = true;
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

    /* ====== MODULE OBSERVATION - HYBRID APPROACH ====== */

    function observeModules() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const module = entry.target;
                
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
                    // Check if this is a re-entry (has been visited before)
                    const isReentry = lastVisitEnd.has(moduleName);
                    
                    // For re-entries, require 30% visibility (stricter)
                    // For first entry, 25% is required
                    const requiredThreshold = isReentry ? CONFIG.REENTRY_THRESHOLD : CONFIG.VISIBILITY_THRESHOLD;
                    
                    if (entry.intersectionRatio >= requiredThreshold) {
                        handleModuleEnter(moduleName, module);
                    } else if (isReentry) {
                        console.log(`⚠️ Re-entry for ${moduleName} but only ${Math.round(entry.intersectionRatio * 100)}% visible (need ${Math.round(requiredThreshold * 100)}%)`);
                    }
                } else {
                    handleModuleLeave(moduleName);
                }
            });
        }, {
            root: null,
            threshold: [0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4], // Multiple thresholds to catch re-entry
            rootMargin: '0px'
        });

        const observedModules = new Set();

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

        checkForNewModules();
        setInterval(checkForNewModules, 2000);
        
        const mutationObserver = new MutationObserver(() => {
            checkForNewModules();
        });
        
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // BACKUP: Scroll-based visibility check
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
                
                if (isVisible && !currentModuleVisits.has(moduleName)) {
                    handleModuleEnter(moduleName, module);
                }
            });
        };

        window.addEventListener('scroll', () => {
            clearTimeout(scrollCheckTimeout);
            scrollCheckTimeout = setTimeout(checkVisibleModules, 300);
        }, { passive: true });

        setInterval(checkVisibleModules, 2000);
    }

    function handleModuleEnter(moduleName, moduleElement) {
        const now = Date.now();
        
        // CRITICAL: If already tracking this module, don't create a new visit
        if (currentModuleVisits.has(moduleName)) {
            console.log(`⭐️ Already tracking ${moduleName}, ignoring duplicate enter event`);
            return;
        }
        
        // Check if this is a re-entry
        const lastEnd = lastVisitEnd.get(moduleName);
        const isReentry = lastEnd !== undefined;
        
        if (isReentry) {
            const timeAway = now - lastEnd;
            
            // STRICTER RE-ENTRY RULES:
            // Must be away for at least 10 seconds before counting as new visit
            if (timeAway < CONFIG.MIN_AWAY_TIME) {
                console.log(`⭐️ Ignoring re-entry for ${moduleName} (only away ${Math.floor(timeAway/1000)}s, need 10s)`);
                return;
            }
            
            console.log(`🔄 Re-entering ${moduleName} after ${Math.floor(timeAway/1000)}s away`);
        }
        
        // Get visit count for this module
        const visits = moduleVisits.get(moduleName) || [];
        const visitNumber = visits.length + 1;
        
        console.log(`👀 Viewing: ${moduleName} (visit #${visitNumber})`);
        
        // Record this visit start time
        lastVisitStart.set(moduleName, now);
        
        const visit = {
            element: moduleElement,
            startTime: now,
            lastActivity: now,
            scrollDepth: 0,
            visitNumber: visitNumber,
            tracked: false  // Flag to prevent duplicate tracking
        };
        
        currentModuleVisits.set(moduleName, visit);

        // Start tracking scroll depth
        startScrollTracking(moduleName, moduleElement);

        // Track after minimum view time
        setTimeout(() => {
            if (currentModuleVisits.has(moduleName) && !isIdle) {
                trackModuleVisit(moduleName, visit);
            }
        }, CONFIG.MIN_VIEW_TIME);
    }

    function handleModuleLeave(moduleName) {
        const visit = currentModuleVisits.get(moduleName);
        if (!visit) return;

        const now = Date.now();
        const timeSpent = Math.floor((now - visit.startTime) / 1000);
        console.log(`👋 Left: ${moduleName} (visit #${visit.visitNumber}, ${timeSpent}s)`);
        
        // Send final visit data
        sendModuleVisit(moduleName, visit, true);
        
        // Store this visit
        const visits = moduleVisits.get(moduleName) || [];
        visits.push({
            visitNumber: visit.visitNumber,
            startTime: visit.startTime,
            endTime: now,
            timeSpent: timeSpent,
            scrollDepth: visit.scrollDepth
        });
        moduleVisits.set(moduleName, visits);
        
        // Record when this module left viewport (for re-entry tracking)
        lastVisitEnd.set(moduleName, now);
        
        // Remove from current visits
        currentModuleVisits.delete(moduleName);
    }

    /* ====== SCROLL TRACKING ====== */

    function startScrollTracking(moduleName, moduleElement) {
        const visit = currentModuleVisits.get(moduleName);
        if (!visit) return;

        const updateScroll = () => {
            if (!currentModuleVisits.has(moduleName) || isIdle) return;

            const rect = moduleElement.getBoundingClientRect();
            const elementHeight = moduleElement.scrollHeight || moduleElement.offsetHeight;
            const viewportHeight = window.innerHeight;
            
            const visibleTop = Math.max(0, -rect.top);
            const visibleBottom = Math.min(elementHeight, viewportHeight - rect.top);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const scrollDepth = Math.round((visibleHeight / elementHeight) * 100);
            
            visit.scrollDepth = Math.max(visit.scrollDepth, scrollDepth);
        };

        const scrollHandler = () => {
            if (currentModuleVisits.has(moduleName)) {
                updateScroll();
            }
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });
        
        const scrollInterval = setInterval(() => {
            if (!currentModuleVisits.has(moduleName)) {
                clearInterval(scrollInterval);
                window.removeEventListener('scroll', scrollHandler);
            } else {
                updateScroll();
            }
        }, CONFIG.SCROLL_SAMPLE_RATE);
    }

    /* ====== INTERACTION TRACKING (PHASE 2) ====== */

    function setupInteractionTracking() {
        console.log('🎯 Setting up comprehensive interaction tracking...');
    
        document.addEventListener('click', (e) => {
            
            // ========================================
            // HERO MODULE - Mute/Unmute Button
            // ========================================
            const heroModule = e.target.closest('.mod--hero');
            if (heroModule) {
                // Mute button (multiple possible selectors)
                if (e.target.classList.contains('mute-button') || 
                    e.target.classList.contains('mute-btn') ||
                    e.target.classList.contains('sound-toggle') ||
                    e.target.closest('.mute-button, .mute-btn, .sound-toggle')) {
                    
                    const video = heroModule.querySelector('video');
                    const isMuting = video && !video.muted;
                    
                    console.log(`🔇 Hero video ${isMuting ? 'mute' : 'unmute'}`);
                    trackInteraction('hero', isMuting ? 'video_mute' : 'video_unmute', 'hero_video');
                }
            }
    
            // ========================================
            // FINAL HERO MODULE - Mute/Unmute Button
            // ========================================
            const finalHeroModule = e.target.closest('.mod--final_hero, .mod--final-hero');
            if (finalHeroModule) {
                if (e.target.classList.contains('mute-button') || 
                    e.target.classList.contains('mute-btn') ||
                    e.target.classList.contains('sound-toggle') ||
                    e.target.closest('.mute-button, .mute-btn, .sound-toggle')) {
                    
                    const video = finalHeroModule.querySelector('video');
                    const isMuting = video && !video.muted;
                    
                    console.log(`🔇 Final Hero video ${isMuting ? 'mute' : 'unmute'}`);
                    trackInteraction('final_hero', isMuting ? 'video_mute' : 'video_unmute', 'final_hero_video');
                }
            }
    
            // ========================================
            // CCF MODULE - Mute/Unmute Button
            // ========================================
            const ccfModule = e.target.closest('.mod--ccf');
            if (ccfModule) {
                // CCF has a specific button with ID "ccfAudioToggle"
                if (e.target.id === 'ccfAudioToggle' ||
                    e.target.classList.contains('mute-button') || 
                    e.target.classList.contains('mute-btn') ||
                    e.target.classList.contains('sound-toggle') ||
                    e.target.closest('#ccfAudioToggle, .mute-button, .mute-btn, .sound-toggle')) {
                    
                    const video = ccfModule.querySelector('.ccf-video, video');
                    const isMuting = video && !video.muted;
                    
                    console.log(`🔇 CCF video ${isMuting ? 'mute' : 'unmute'}`);
                    trackInteraction('ccf', isMuting ? 'video_mute' : 'video_unmute', 'ccf_video');
                }
            }
    
            // ========================================
            // CTA BUTTONS - Book Your Visit, Come and See Us
            // ========================================
            const ctaButton = e.target.closest('.cta-button, .book-visit-btn, .visit-btn, .come-see-us-btn');
            if (ctaButton) {
                const buttonText = ctaButton.textContent.trim();
                const parentModule = ctaButton.closest('[class*="mod--"]');
                const moduleName = parentModule?.className.match(/mod--([a-z_]+)/)?.[1] || 'unknown';
                
                console.log(`🎯 CTA clicked: ${buttonText} in ${moduleName}`);
                trackInteraction(moduleName, 'cta_click', buttonText);
            }
    
            // ========================================
            // UPPER SCHOOL - Section Filter Buttons
            // ========================================
            const upperSchoolModule = e.target.closest('.mod--upper_school, .mod--upper-school');
            if (upperSchoolModule) {
                // Check for section filter buttons
                const sectionButton = e.target.closest('[data-section]') || 
                                    (e.target.hasAttribute('data-section') ? e.target : null);
                
                if (sectionButton) {
                    const section = sectionButton.getAttribute('data-section') || 
                                  sectionButton.textContent.trim();
                    
                    console.log(`📚 Upper School section: ${section}`);
                    trackInteraction('upper_school', 'section_filter', section);
                }
                
                // Alternative: button class-based detection
                if (e.target.classList.contains('section-btn') || 
                    e.target.closest('.section-btn')) {
                    const btn = e.target.classList.contains('section-btn') ? 
                               e.target : e.target.closest('.section-btn');
                    const section = btn.textContent.trim();
                    
                    console.log(`📚 Upper School section: ${section}`);
                    trackInteraction('upper_school', 'section_filter', section);
                }
            }
    
            // ========================================
            // SCIENCES & MATHEMATICS - Subject Filter Buttons
            // ========================================
            const sciencesModule = e.target.closest('.mod--sciences_mathematics, .mod--sciences-mathematics');
            if (sciencesModule) {
                const subjectButton = e.target.closest('[data-subject]') || 
                                    (e.target.hasAttribute('data-subject') ? e.target : null);
                
                if (subjectButton) {
                    const subject = subjectButton.getAttribute('data-subject') || 
                                  subjectButton.textContent.trim();
                    
                    console.log(`🔬 Science subject: ${subject}`);
                    trackInteraction('sciences_mathematics', 'subject_filter', subject);
                }
                
                // Alternative: button class-based
                if (e.target.classList.contains('subject-btn') || 
                    e.target.closest('.subject-btn')) {
                    const btn = e.target.classList.contains('subject-btn') ? 
                               e.target : e.target.closest('.subject-btn');
                    const subject = btn.textContent.trim();
                    
                    console.log(`🔬 Science subject: ${subject}`);
                    trackInteraction('sciences_mathematics', 'subject_filter', subject);
                }
            }
    
            // ========================================
            // HUMANITIES & SOCIAL SCIENCES - Subject Filter Buttons
            // ========================================
            const humanitiesModule = e.target.closest('.mod--humanities_social, .mod--humanities-social');
            if (humanitiesModule) {
                const subjectButton = e.target.closest('[data-subject]') || 
                                    (e.target.hasAttribute('data-subject') ? e.target : null);
                
                if (subjectButton) {
                    const subject = subjectButton.getAttribute('data-subject') || 
                                  subjectButton.textContent.trim();
                    
                    console.log(`📖 Humanities subject: ${subject}`);
                    trackInteraction('humanities_social', 'subject_filter', subject);
                }
                
                if (e.target.classList.contains('subject-btn') || 
                    e.target.closest('.subject-btn')) {
                    const btn = e.target.classList.contains('subject-btn') ? 
                               e.target : e.target.closest('.subject-btn');
                    const subject = btn.textContent.trim();
                    
                    console.log(`📖 Humanities subject: ${subject}`);
                    trackInteraction('humanities_social', 'subject_filter', subject);
                }
            }
    
            // ========================================
            // LANGUAGES & CLASSICS - Subject Filter Buttons
            // ========================================
            const languagesModule = e.target.closest('.mod--languages_classics, .mod--languages-classics');
            if (languagesModule) {
                const subjectButton = e.target.closest('[data-subject]') || 
                                    (e.target.hasAttribute('data-subject') ? e.target : null);
                
                if (subjectButton) {
                    const subject = subjectButton.getAttribute('data-subject') || 
                                  subjectButton.textContent.trim();
                    
                    console.log(`🗣️ Language subject: ${subject}`);
                    trackInteraction('languages_classics', 'subject_filter', subject);
                }
                
                if (e.target.classList.contains('subject-btn') || 
                    e.target.closest('.subject-btn')) {
                    const btn = e.target.classList.contains('subject-btn') ? 
                               e.target : e.target.closest('.subject-btn');
                    const subject = btn.textContent.trim();
                    
                    console.log(`🗣️ Language subject: ${subject}`);
                    trackInteraction('languages_classics', 'subject_filter', subject);
                }
            }
    
            // ========================================
            // CREATIVE ARTS & DESIGN - Subject Filter Buttons
            // ========================================
            const creativeArtsModule = e.target.closest('.mod--creative_arts, .mod--creative-arts');
            if (creativeArtsModule) {
                const subjectButton = e.target.closest('[data-subject]') || 
                                    (e.target.hasAttribute('data-subject') ? e.target : null);
                
                if (subjectButton) {
                    const subject = subjectButton.getAttribute('data-subject') || 
                                  subjectButton.textContent.trim();
                    
                    console.log(`🎨 Creative Arts subject: ${subject}`);
                    trackInteraction('creative_arts', 'subject_filter', subject);
                }
                
                if (e.target.classList.contains('subject-btn') || 
                    e.target.closest('.subject-btn')) {
                    const btn = e.target.classList.contains('subject-btn') ? 
                               e.target : e.target.closest('.subject-btn');
                    const subject = btn.textContent.trim();
                    
                    console.log(`🎨 Creative Arts subject: ${subject}`);
                    trackInteraction('creative_arts', 'subject_filter', subject);
                }
            }
    
            // ========================================
            // APPLIED & VOCATIONAL STUDIES - Subject Filter Buttons
            // ========================================
            const appliedModule = e.target.closest('.mod--applied_vocational, .mod--applied-vocational');
            if (appliedModule) {
                const subjectButton = e.target.closest('[data-subject]') || 
                                    (e.target.hasAttribute('data-subject') ? e.target : null);
                
                if (subjectButton) {
                    const subject = subjectButton.getAttribute('data-subject') || 
                                  subjectButton.textContent.trim();
                    
                    console.log(`💼 Applied/Vocational subject: ${subject}`);
                    trackInteraction('applied_vocational', 'subject_filter', subject);
                }
                
                if (e.target.classList.contains('subject-btn') || 
                    e.target.closest('.subject-btn')) {
                    const btn = e.target.classList.contains('subject-btn') ? 
                               e.target : e.target.closest('.subject-btn');
                    const subject = btn.textContent.trim();
                    
                    console.log(`💼 Applied/Vocational subject: ${subject}`);
                    trackInteraction('applied_vocational', 'subject_filter', subject);
                }
            }
    
            // ========================================
            // HOUSE SYSTEM - Expand/Collapse (FIXED!)
            // ========================================
            const houseCard = e.target.closest('.house-card');
            if (houseCard) {
                // EXPAND/COLLAPSE BUTTON
                if (e.target.classList.contains('expand-button')) {
                    const houseName = houseCard.querySelector('.house-name')?.textContent || 
                                    houseCard.querySelector('.house-title')?.textContent || 
                                    'unknown';
                    
                    // CRITICAL FIX: Check if CURRENTLY expanded BEFORE the click changes it
                    const isCurrentlyExpanded = houseCard.classList.contains('expanded');
                    const action = isCurrentlyExpanded ? 'house_collapse' : 'house_expand';
                    
                    console.log(`🏠 House ${action}: ${houseName}`);
                    trackInteraction('house_system', action, houseName);
                }
                
                if (e.target.classList.contains('mute-button') || e.target.closest('.mute-button')) {
                    const houseName = houseCard.querySelector('.house-name')?.textContent || 
                                    houseCard.querySelector('.house-title')?.textContent || 
                                    'unknown';
                    const video = houseCard.querySelector('.house-video, video');
                    const isMuting = video && !video.muted;
                    
                    console.log(`🔇 House video ${isMuting ? 'mute' : 'unmute'}: ${houseName}`);
                    trackInteraction('house_system', isMuting ? 'video_mute' : 'video_unmute', houseName);
                }
                
                if (e.target.classList.contains('close-button') || e.target.closest('.close-button')) {
                    const houseName = houseCard.querySelector('.house-name')?.textContent || 
                                    houseCard.querySelector('.house-title')?.textContent || 
                                    'unknown';
                    
                    console.log(`❌ House close: ${houseName}`);
                    trackInteraction('house_system', 'house_close', houseName);
                }
            }
    
            // ========================================
            // PASTORAL CARE - Journey Steps (from previous fix)
            // ========================================
            const journeyStep = e.target.closest('.journey-step');
            if (journeyStep) {
                let stepNumber = journeyStep.getAttribute('data-step');
                
                if (!stepNumber) {
                    const allSteps = Array.from(journeyStep.parentElement.querySelectorAll('.journey-step'));
                    stepNumber = allSteps.indexOf(journeyStep) + 1;
                }
                
                console.log(`📍 Journey step clicked: step_${stepNumber}`);
                trackInteraction('pastoral_care', 'journey_step_click', `step_${stepNumber}`);
            }
    
            // ========================================
            // PASTORAL CARE - Expandable Pillars
            // ========================================
            const pillarCard = e.target.closest('.pillar-card.expandable');
            if (pillarCard && !e.target.closest('.expandable-content')) {
                const pillarTitle = pillarCard.querySelector('.pillar-title')?.textContent || 'unknown';
                const isExpanding = !pillarCard.classList.contains('expanded');
                
                console.log(`📋 Pillar ${isExpanding ? 'expand' : 'collapse'}: ${pillarTitle}`);
                trackInteraction('pastoral_care', isExpanding ? 'pillar_expand' : 'pillar_collapse', pillarTitle);
            }
    
            // ========================================
            // STUDENT GALLERY - Category Tabs
            // ========================================
            if (e.target.classList.contains('category-tab') || e.target.closest('.category-tab')) {
                const tab = e.target.classList.contains('category-tab') ? e.target : e.target.closest('.category-tab');
                const category = tab.textContent.trim();
                
                console.log(`🖼️ Gallery category: ${category}`);
                trackInteraction('student_gallery', 'category_tab_click', category);
            }
    
            // ========================================
            // SPORTS - Sport Tabs & Unmute
            // ========================================
            if (e.target.classList.contains('sport-tab') || e.target.closest('.sport-tab')) {
                const tab = e.target.classList.contains('sport-tab') ? e.target : e.target.closest('.sport-tab');
                const sportType = tab.getAttribute('data-sport') || tab.textContent.trim();
                
                console.log(`⚽ Sport tab: ${sportType}`);
                trackInteraction('sports', 'sport_tab_click', sportType);
            }
    
            if (e.target.classList.contains('unmute-btn') || e.target.closest('.unmute-btn')) {
                const section = e.target.closest('.sport-section');
                const sportType = section?.id?.replace('-section', '') || 'unknown';
                
                console.log(`🔊 Sport video unmute: ${sportType}`);
                trackInteraction('sports', 'video_unmute', sportType);
            }
    
        }, { passive: true });
    
        console.log('✅ Comprehensive interaction tracking setup complete');
    }
    
    async function trackInteraction(moduleName, interactionType, details) {
        if (!sessionId || isIdle) return;
    
        try {
            await fetch('/api/track-interaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enquiryId,
                    sessionId,
                    moduleName,
                    interactionType,
                    details
                })
            });
            
            console.log(`✅ Tracked: ${moduleName} → ${interactionType} → ${details}`);
        } catch (error) {
            console.error('Error tracking interaction:', error);
        }
    }
    
    async function trackInteraction(moduleName, interactionType, details) {
        if (!sessionId || isIdle) return;
    
        try {
            await fetch('/api/track-interaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enquiryId,
                    sessionId,
                    moduleName,
                    interactionType,
                    details
                })
            });
            
            console.log(`✅ Tracked: ${moduleName} → ${interactionType} → ${details}`);
        } catch (error) {
            console.error('Error tracking interaction:', error);
        }
    }

    async function trackInteraction(moduleName, interactionType, details) {
        if (!sessionId || isIdle) return;

        try {
            await fetch('/api/track-interaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enquiryId,
                    sessionId,
                    moduleName,
                    interactionType,
                    details,
                    timestamp: Date.now()
                })
            });

            console.log(`🎯 Interaction: ${moduleName} → ${interactionType} → ${details}`);
        } catch (error) {
            console.error('Failed to track interaction:', error);
        }
    }

    /* ====== DATA TRANSMISSION ====== */

    async function trackModuleVisit(moduleName, visit) {
        if (!sessionId) return;
        
        // CRITICAL: Don't track if already tracked
        if (visit.tracked) {
            console.log(`⭐️ Already tracked ${moduleName} visit #${visit.visitNumber}`);
            return;
        }

        const timeSpent = Math.floor((Date.now() - visit.startTime) / 1000);

        try {
            await fetch('/api/track-module-visit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enquiryId,
                    moduleName,
                    sessionId,
                    visitNumber: visit.visitNumber,
                    timeSpentSeconds: timeSpent,
                    scrollDepth: visit.scrollDepth
                })
            });

            // Mark as tracked to prevent duplicates
            visit.tracked = true;
            
            console.log(`✅ Tracked: ${moduleName} (visit #${visit.visitNumber}, ${timeSpent}s, ${visit.scrollDepth}% scrolled)`);
        } catch (error) {
            console.error('Failed to track module visit:', error);
        }
    }

    async function sendModuleVisit(moduleName, visit, isFinal = false) {
        if (!sessionId || !visit || isIdle) return;

        const timeSpent = Math.floor((Date.now() - visit.startTime) / 1000);

        try {
            await fetch('/api/session/module-activity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enquiryId,
                    moduleName,
                    sessionId,
                    visitNumber: visit.visitNumber,
                    timeSpentSeconds: timeSpent,
                    scrollDepth: visit.scrollDepth
                })
            });

            if (isFinal) {
                console.log(`✅ Final activity: ${moduleName} (visit #${visit.visitNumber}, ${timeSpent}s)`);
            }
        } catch (error) {
            console.error('Failed to send visit activity:', error);
        }
    }

    function startHeartbeat() {
        heartbeatTimer = setInterval(() => {
            if (isIdle || !isVisible) return;

            // Send activity update for all current visits
            for (const [moduleName, visit] of currentModuleVisits.entries()) {
                sendModuleVisit(moduleName, visit, false);
            }
        }, CONFIG.HEARTBEAT_INTERVAL);
    }

    /* ====== EVENT LISTENERS ====== */

    function setupEventListeners() {
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
            document.addEventListener(event, recordActivity, { passive: true });
        });

        document.addEventListener('visibilitychange', handleVisibilityChange);

        window.addEventListener('beforeunload', () => {
            endSession();
        });

        recordActivity();
    }

    /* ====== START TRACKING ====== */

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnhancedTracking);
    } else {
        initEnhancedTracking();
    }

})();