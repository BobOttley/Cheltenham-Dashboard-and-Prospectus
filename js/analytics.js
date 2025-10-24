// ========================================
// ANALYTICS MODULE
// Requires Chart.js: https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js
// ========================================

let chartInstances = {};
let analyticsData = []; // Store enquiries data locally

/**
 * Initialize Analytics Module
 */
async function initAnalyticsModule() {
    console.log('📊 Initializing Analytics Module');
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js not loaded! Analytics will not work.');
        const container = document.querySelector('#analytics-tab');
        if (container) {
            container.innerHTML = `
                <div style="padding: 40px; text-align: center; color: #ef4444;">
                    <h3>Chart.js Library Required</h3>
                    <p>Please ensure Chart.js is loaded in your admin.html</p>
                </div>
            `;
        }
        return;
    }
    
    // Wait for canvas elements to be in DOM
    const canvasIds = [
        'monthlyTrendsChart',
        'countryChart', 
        'formEntryChart',
        'genderChart',
        'boardingTypeChart',
        'conversionFunnelChart',
        'engagementScoreChart',
        'timeToConversionChart',
        'peakEnquiryTimesChart',
        'returnVisitorChart',
        'interestCorrelationChart',
        'dropoffAnalysisChart'
    ];
    
    // Check if all canvas elements exist
    const allExist = canvasIds.every(id => document.getElementById(id));
    
    if (!allExist) {
        console.error('❌ Not all canvas elements found in DOM');
        console.log('Missing elements:', canvasIds.filter(id => !document.getElementById(id)));
        
        // Wait a bit and try again
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const stillMissing = canvasIds.filter(id => !document.getElementById(id));
        if (stillMissing.length > 0) {
            console.error('❌ Still missing after delay:', stillMissing);
            return;
        }
    }
    
    console.log('✅ All canvas elements found');
    
    // Load analytics data
    await loadAnalytics();
}

/**
 * Load analytics data and initialize charts
 */
async function loadAnalytics() {
    try {
        // Check if we already have data in the global context
        if (typeof allEnquiries !== 'undefined' && allEnquiries.length > 0) {
            console.log('📊 Using existing enquiries data:', allEnquiries.length);
            analyticsData = allEnquiries;
        } else {
            // Fetch enquiries from API
            console.log('📊 Fetching enquiries data from API...');
            const response = await fetch('/api/admin/enquiries');
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch enquiries');
            }
            
            analyticsData = data.enquiries || [];
            console.log('✅ Loaded enquiries:', analyticsData.length);
        }
        
        if (analyticsData.length === 0) {
            console.warn('⚠️ No enquiries data available for analytics');
            showEmptyState();
            return;
        }
        
        // Initialize charts with data
        await initializeCharts();
        
    } catch (error) {
        console.error('❌ Error loading analytics:', error);
        showErrorState(error.message);
    }
}

/**
 * Show empty state when no data
 */
function showEmptyState() {
    const container = document.querySelector('#analytics-tab .analytics-grid');
    if (container) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; padding: 60px; text-align: center; color: #94a3b8;">
                <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">No Data Available</div>
                <div>Start collecting enquiries to see analytics</div>
            </div>
        `;
    }
}

/**
 * Show error state
 */
function showErrorState(message) {
    const container = document.querySelector('#analytics-tab .analytics-grid');
    if (container) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; padding: 60px; text-align: center; color: #ef4444;">
                <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Error Loading Analytics</div>
                <div>${message}</div>
            </div>
        `;
    }
}

/**
 * Initialize all chart instances
 */
async function initializeCharts() {
    console.log('📈 Initializing charts...');
    
    // Destroy existing charts first
    Object.values(chartInstances).forEach(chart => {
        if (chart) {
            try {
                chart.destroy();
            } catch (e) {
                console.warn('Error destroying chart:', e);
            }
        }
    });
    chartInstances = {};

    // Get data for charts
    const monthlyData = getMonthlyTrends();
    const countryData = getCountryDistribution();
    const formEntryData = getFormEntryDistribution();
    const genderData = getGenderDistribution();
    const boardingData = getBoardingDistribution();
    const conversionData = getConversionFunnel();
    const engagementData = getEngagementScoreDistribution();
    const timeToConversionData = getTimeToConversion();
    const peakTimesData = getPeakEnquiryTimes();
    const returnVisitorData = getReturnVisitorRate();
    const interestCorrelationData = getInterestCorrelation();
    const dropoffData = getDropoffAnalysis();

    // Professional color palettes (matching old admin.html)
    const corporateColors = {
        // Distinct, professional colors for 5+ categories
        multiCategory: [
            '#2563eb', // Professional Blue
            '#dc2626', // Corporate Red
            '#059669', // Business Green
            '#d97706', // Executive Orange
            '#7c3aed', // Premium Purple
            '#0891b2', // Teal
            '#e11d48'  // Rose
        ],
        // Professional gradient for trends (blue to indigo)
        trend: {
            line: '#2563eb',
            fill: 'rgba(37, 99, 235, 0.1)'
        },
        // Distinct 3-color palette for boarding
        boarding: [
            '#2563eb', // Primary Blue
            '#059669', // Success Green
            '#d97706'  // Neutral Orange
        ],
        // Professional gradient for conversion funnel (6 stages)
        funnel: [
            '#10b981', // Start Green (New)
            '#3b82f6', // Progress Blue (Contacted)
            '#8b5cf6', // Visit Purple (Open Day/Tour)
            '#f59e0b', // Follow-up Orange (Follow-up)
            '#6366f1', // Applying Indigo (Applying)
            '#059669'  // Success Green (Accepted)
        ]
    };

    // Common chart options
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    padding: 15,
                    font: {
                        size: 12,
                        family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                    },
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 8,
                    boxHeight: 8
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                padding: 12,
                titleFont: {
                    size: 14,
                    weight: '600'
                },
                bodyFont: {
                    size: 13
                },
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                boxWidth: 12,
                boxHeight: 12,
                boxPadding: 6
            }
        }
    };

    try {
        // Monthly Trends Chart - Line chart
        const monthlyCanvas = document.getElementById('monthlyTrendsChart');
        if (monthlyCanvas) {
            const monthlyCtx = monthlyCanvas.getContext('2d');
            chartInstances.monthly = new Chart(monthlyCtx, {
                type: 'line',
                data: {
                    labels: monthlyData.labels,
                    datasets: [{
                        label: 'Enquiries',
                        data: monthlyData.data,
                        borderColor: corporateColors.trend.line,
                        backgroundColor: corporateColors.trend.fill,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        pointBackgroundColor: corporateColors.trend.line,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: corporateColors.trend.line,
                        pointHoverBorderWidth: 3,
                        borderWidth: 3
                    }]
                },
                options: {
                    ...commonOptions,
                    plugins: {
                        ...commonOptions.plugins,
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: { size: 11 },
                                color: '#64748b'
                            },
                            grid: {
                                color: 'rgba(148, 163, 184, 0.1)',
                                drawBorder: false
                            }
                        },
                        x: {
                            ticks: {
                                font: { size: 11 },
                                color: '#64748b'
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // Country Distribution - Bar chart
        const countryCanvas = document.getElementById('countryChart');
        if (countryCanvas) {
            const countryCtx = countryCanvas.getContext('2d');
            chartInstances.country = new Chart(countryCtx, {
                type: 'bar',
                data: {
                    labels: countryData.labels,
                    datasets: [{
                        label: 'Enquiries',
                        data: countryData.data,
                        backgroundColor: corporateColors.multiCategory,
                        borderRadius: 6,
                        borderWidth: 0
                    }]
                },
                options: {
                    ...commonOptions,
                    plugins: {
                        ...commonOptions.plugins,
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: { size: 11 },
                                color: '#64748b'
                            },
                            grid: {
                                color: 'rgba(148, 163, 184, 0.1)',
                                drawBorder: false
                            }
                        },
                        x: {
                            ticks: {
                                font: { size: 11 },
                                color: '#64748b'
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // Form Entry Distribution - Doughnut chart
        const formCanvas = document.getElementById('formEntryChart');
        if (formCanvas) {
            const formCtx = formCanvas.getContext('2d');
            chartInstances.formEntry = new Chart(formCtx, {
                type: 'doughnut',
                data: {
                    labels: formEntryData.labels,
                    datasets: [{
                        data: formEntryData.data,
                        backgroundColor: corporateColors.multiCategory,
                        borderWidth: 0
                    }]
                },
                options: commonOptions
            });
        }

        // Gender Distribution - Pie chart
        const genderCanvas = document.getElementById('genderChart');
        if (genderCanvas) {
            const genderCtx = genderCanvas.getContext('2d');
            chartInstances.gender = new Chart(genderCtx, {
                type: 'pie',
                data: {
                    labels: genderData.labels,
                    datasets: [{
                        data: genderData.data,
                        backgroundColor: [corporateColors.multiCategory[0], corporateColors.multiCategory[2]],
                        borderWidth: 0
                    }]
                },
                options: commonOptions
            });
        }

        // Boarding Distribution - Doughnut chart
        const boardingCanvas = document.getElementById('boardingTypeChart');
        if (boardingCanvas) {
            const boardingCtx = boardingCanvas.getContext('2d');
            chartInstances.boarding = new Chart(boardingCtx, {
                type: 'doughnut',
                data: {
                    labels: boardingData.labels,
                    datasets: [{
                        data: boardingData.data,
                        backgroundColor: corporateColors.boarding,
                        borderWidth: 0
                    }]
                },
                options: commonOptions
            });
        }

        // Conversion Funnel - Bar chart
        const funnelCanvas = document.getElementById('conversionFunnelChart');
        if (funnelCanvas) {
            const funnelCtx = funnelCanvas.getContext('2d');
            chartInstances.funnel = new Chart(funnelCtx, {
                type: 'bar',
                data: {
                    labels: conversionData.labels,
                    datasets: [{
                        label: 'Count',
                        data: conversionData.data,
                        backgroundColor: corporateColors.funnel,
                        borderRadius: 6,
                        borderWidth: 0
                    }]
                },
                options: {
                    ...commonOptions,
                    indexAxis: 'y',
                    plugins: {
                        ...commonOptions.plugins,
                        legend: { display: false }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            ticks: {
                                font: { size: 11 },
                                color: '#64748b'
                            },
                            grid: {
                                color: 'rgba(148, 163, 184, 0.1)',
                                drawBorder: false
                            }
                        },
                        y: {
                            ticks: {
                                font: { size: 11 },
                                color: '#64748b'
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }
        
        // Engagement Score Distribution - Bar chart
        const engagementCanvas = document.getElementById('engagementScoreChart');
        if (engagementCanvas) {
            const engagementCtx = engagementCanvas.getContext('2d');
            chartInstances.engagement = new Chart(engagementCtx, {
                type: 'bar',
                data: {
                    labels: engagementData.labels,
                    datasets: [{
                        label: 'Enquiries',
                        data: engagementData.data,
                        backgroundColor: ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981'],
                        borderRadius: 6,
                        borderWidth: 0
                    }]
                },
                options: {
                    ...commonOptions,
                    plugins: {
                        ...commonOptions.plugins,
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: { size: 11 },
                                color: '#64748b'
                            },
                            grid: {
                                color: 'rgba(148, 163, 184, 0.1)',
                                drawBorder: false
                            }
                        },
                        x: {
                            ticks: {
                                font: { size: 10 },
                                color: '#64748b',
                                maxRotation: 45,
                                minRotation: 45
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // Time to Conversion - Bar chart
        const timeConversionCanvas = document.getElementById('timeToConversionChart');
        if (timeConversionCanvas) {
            const timeConversionCtx = timeConversionCanvas.getContext('2d');
            chartInstances.timeConversion = new Chart(timeConversionCtx, {
                type: 'bar',
                data: {
                    labels: timeToConversionData.labels,
                    datasets: [{
                        label: 'Conversions',
                        data: timeToConversionData.data,
                        backgroundColor: corporateColors.multiCategory[0],
                        borderRadius: 6,
                        borderWidth: 0
                    }]
                },
                options: {
                    ...commonOptions,
                    plugins: {
                        ...commonOptions.plugins,
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: { size: 11 },
                                color: '#64748b'
                            },
                            grid: {
                                color: 'rgba(148, 163, 184, 0.1)',
                                drawBorder: false
                            }
                        },
                        x: {
                            ticks: {
                                font: { size: 11 },
                                color: '#64748b'
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // Peak Enquiry Times - Bar chart
        const peakTimesCanvas = document.getElementById('peakEnquiryTimesChart');
        if (peakTimesCanvas) {
            const peakTimesCtx = peakTimesCanvas.getContext('2d');
            chartInstances.peakTimes = new Chart(peakTimesCtx, {
                type: 'bar',
                data: {
                    labels: peakTimesData.labels,
                    datasets: [{
                        label: 'Enquiries',
                        data: peakTimesData.data,
                        backgroundColor: corporateColors.multiCategory,
                        borderRadius: 6,
                        borderWidth: 0
                    }]
                },
                options: {
                    ...commonOptions,
                    plugins: {
                        ...commonOptions.plugins,
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: { size: 11 },
                                color: '#64748b'
                            },
                            grid: {
                                color: 'rgba(148, 163, 184, 0.1)',
                                drawBorder: false
                            }
                        },
                        x: {
                            ticks: {
                                font: { size: 11 },
                                color: '#64748b'
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // Return Visitor Rate - Doughnut chart
        const returnVisitorCanvas = document.getElementById('returnVisitorChart');
        if (returnVisitorCanvas) {
            const returnVisitorCtx = returnVisitorCanvas.getContext('2d');
            chartInstances.returnVisitor = new Chart(returnVisitorCtx, {
                type: 'doughnut',
                data: {
                    labels: returnVisitorData.labels,
                    datasets: [{
                        data: returnVisitorData.data,
                        backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#2563eb'],
                        borderWidth: 0
                    }]
                },
                options: commonOptions
            });
        }

        // Interest Correlation - Horizontal Bar chart
        const interestCanvas = document.getElementById('interestCorrelationChart');
        if (interestCanvas) {
            const interestCtx = interestCanvas.getContext('2d');
            chartInstances.interest = new Chart(interestCtx, {
                type: 'bar',
                data: {
                    labels: interestCorrelationData.labels,
                    datasets: [{
                        label: 'Count',
                        data: interestCorrelationData.data,
                        backgroundColor: corporateColors.multiCategory,
                        borderRadius: 6,
                        borderWidth: 0
                    }]
                },
                options: {
                    ...commonOptions,
                    indexAxis: 'y',
                    plugins: {
                        ...commonOptions.plugins,
                        legend: { display: false }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            ticks: {
                                font: { size: 11 },
                                color: '#64748b'
                            },
                            grid: {
                                color: 'rgba(148, 163, 184, 0.1)',
                                drawBorder: false
                            }
                        },
                        y: {
                            ticks: {
                                font: { size: 11 },
                                color: '#64748b'
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // Drop-off Analysis - Bar chart
        const dropoffCanvas = document.getElementById('dropoffAnalysisChart');
        if (dropoffCanvas) {
            const dropoffCtx = dropoffCanvas.getContext('2d');
            chartInstances.dropoff = new Chart(dropoffCtx, {
                type: 'bar',
                data: {
                    labels: dropoffData.labels,
                    datasets: [{
                        label: 'Count',
                        data: dropoffData.data,
                        backgroundColor: corporateColors.funnel,
                        borderRadius: 6,
                        borderWidth: 0
                    }]
                },
                options: {
                    ...commonOptions,
                    plugins: {
                        ...commonOptions.plugins,
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: { size: 11 },
                                color: '#64748b'
                            },
                            grid: {
                                color: 'rgba(148, 163, 184, 0.1)',
                                drawBorder: false
                            }
                        },
                        x: {
                            ticks: {
                                font: { size: 10 },
                                color: '#64748b',
                                maxRotation: 45,
                                minRotation: 45
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }
        
        console.log('✅ All charts initialized successfully');
        
    } catch (error) {
        console.error('❌ Error creating charts:', error);
        showErrorState('Failed to create charts: ' + error.message);
    }
}

/**
 * Get monthly trends data
 */
function getMonthlyTrends() {
    const months = {};
    const now = new Date();
    
    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
        months[key] = 0;
    }
    
    // Count enquiries per month
    analyticsData.forEach(e => {
        const date = new Date(e.created_at);
        const key = date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
        if (months.hasOwnProperty(key)) {
            months[key]++;
        }
    });
    
    return {
        labels: Object.keys(months),
        data: Object.values(months)
    };
}

/**
 * Get country distribution data
 */
function getCountryDistribution() {
    const counts = {};
    
    analyticsData.forEach(e => {
        const country = e.country || 'Unknown';
        counts[country] = (counts[country] || 0) + 1;
    });
    
    // Sort by count descending and take top 10
    const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    return {
        labels: sorted.map(([country]) => country),
        data: sorted.map(([, count]) => count)
    };
}

/**
 * Get form entry distribution data
 */
function getFormEntryDistribution() {
    const counts = {
        'Third Form': 0,
        'Fourth Form': 0,
        'Fifth Form': 0,
        'Lower Sixth Form': 0,
        'Upper Sixth Form': 0
    };
    
    analyticsData.forEach(e => {
        if (counts.hasOwnProperty(e.form_entry)) {
            counts[e.form_entry]++;
        }
    });
    
    return {
        labels: Object.keys(counts),
        data: Object.values(counts)
    };
}

/**
 * Get gender distribution data
 */
function getGenderDistribution() {
    const counts = {
        'Male': 0,
        'Female': 0
    };
    
    analyticsData.forEach(e => {
        const gender = e.gender || (e.form_data && e.form_data.gender);
        if (gender === 'male') counts['Male']++;
        else if (gender === 'female') counts['Female']++;
    });
    
    return {
        labels: Object.keys(counts),
        data: Object.values(counts)
    };
}

/**
 * Get boarding distribution data
 */
function getBoardingDistribution() {
    const counts = {
        'Boarding': 0,
        'Day': 0,
        'Considering': 0
    };
    
    analyticsData.forEach(e => {
        const boarding = e.boarding || (e.form_data && e.form_data.boardingPreference);
        if (boarding && boarding.includes('Boarding')) counts['Boarding']++;
        else if (boarding && boarding.includes('Day')) counts['Day']++;
        else if (boarding && boarding.includes('Considering')) counts['Considering']++;
    });
    
    return {
        labels: Object.keys(counts),
        data: Object.values(counts)
    };
}

/**
 * Get conversion funnel data
 */
function getConversionFunnel() {
    const counts = {
        'New': 0,
        'Contacted': 0,
        'Follow-up': 0,
        'Applying': 0,
        'Accepted': 0
    };
    
    analyticsData.forEach(e => {
        if (e.status === 'new') counts['New']++;
        else if (e.status === 'contacted') counts['Contacted']++;
        else if (e.status === 'followup') counts['Follow-up']++;
        else if (e.status === 'applying') counts['Applying']++;
        else if (e.status === 'accepted') counts['Accepted']++;
    });
    
    return {
        labels: Object.keys(counts),
        data: Object.values(counts)
    };
}

/**
 * Get engagement score distribution
 * Score based on: session count, total time, modules viewed
 * ONLY counts enquiries that have opened the prospectus
 */
function getEngagementScoreDistribution() {
    const scores = {
        'Not Engaged (0-20)': 0,
        'Low (21-40)': 0,
        'Medium (41-60)': 0,
        'High (61-80)': 0,
        'Very High (81-100)': 0
    };
    
    let processedCount = 0;
    let skippedCount = 0;
    
    analyticsData.forEach(e => {
        // ONLY count if they've opened the prospectus
        if (!e.prospectus_opened) {
            skippedCount++;
            return; // Skip this enquiry
        }
        
        processedCount++;
        
        // Calculate engagement score (0-100)
        let score = 0;
        
        // Sessions count (max 40 points) - 10 points per session
        const sessions = parseInt(e.total_sessions) || 0;
        score += Math.min(sessions * 10, 40);
        
        // Total time spent (max 30 points) - 1 point per minute
        const timeSeconds = parseInt(e.total_time_spent_seconds) || 0;
        const timeMinutes = Math.floor(timeSeconds / 60);
        score += Math.min(timeMinutes, 30);
        
        // Modules viewed (max 30 points) - count unique modules from modules_viewed JSON
        let modulesCount = 0;
        if (e.modules_viewed) {
            try {
                const modulesObj = typeof e.modules_viewed === 'string' 
                    ? JSON.parse(e.modules_viewed) 
                    : e.modules_viewed;
                modulesCount = Object.keys(modulesObj).length;
            } catch (err) {
                console.warn('Error parsing modules_viewed:', err);
            }
        }
        score += Math.min(modulesCount * 5, 30);
        
        // Categorize
        if (score <= 20) scores['Not Engaged (0-20)']++;
        else if (score <= 40) scores['Low (21-40)']++;
        else if (score <= 60) scores['Medium (41-60)']++;
        else if (score <= 80) scores['High (61-80)']++;
        else scores['Very High (81-100)']++;
    });
    
    console.log('📊 Engagement Distribution:', {
        totalEnquiries: analyticsData.length,
        withProspectusOpen: processedCount,
        withoutProspectusOpen: skippedCount,
        scores: scores
    });
    
    return {
        labels: Object.keys(scores),
        data: Object.values(scores)
    };
}

/**
 * Get time to conversion data
 * Measures days from enquiry to "accepted" status (actual conversions only)
 * Uses realistic timeframes for school admissions (months, not days)
 */
function getTimeToConversion() {
    const buckets = {
        '0-30 days': 0,
        '1-3 months': 0,
        '3-6 months': 0,
        '6-9 months': 0,
        '9-12 months': 0,
        '12+ months': 0
    };
    
    analyticsData.forEach(e => {
        if (e.status === 'accepted') {
            const createdDate = new Date(e.created_at);
            const now = new Date();
            const daysDiff = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff <= 30) buckets['0-30 days']++;
            else if (daysDiff <= 90) buckets['1-3 months']++;
            else if (daysDiff <= 180) buckets['3-6 months']++;
            else if (daysDiff <= 270) buckets['6-9 months']++;
            else if (daysDiff <= 365) buckets['9-12 months']++;
            else buckets['12+ months']++;
        }
    });
    
    return {
        labels: Object.keys(buckets),
        data: Object.values(buckets)
    };
}

/**
 * Get peak enquiry times
 * Show which days of week get most enquiries
 */
function getPeakEnquiryTimes() {
    const days = {
        'Monday': 0,
        'Tuesday': 0,
        'Wednesday': 0,
        'Thursday': 0,
        'Friday': 0,
        'Saturday': 0,
        'Sunday': 0
    };
    
    analyticsData.forEach(e => {
        const date = new Date(e.created_at);
        const dayName = date.toLocaleDateString('en-GB', { weekday: 'long' });
        if (days.hasOwnProperty(dayName)) {
            days[dayName]++;
        }
    });
    
    return {
        labels: Object.keys(days),
        data: Object.values(days)
    };
}

/**
 * Get return visitor rate
 * Show single visit vs multiple visits
 */
function getReturnVisitorRate() {
    const categories = {
        'Single Visit': 0,
        '2-3 Visits': 0,
        '4-5 Visits': 0,
        '6+ Visits': 0
    };
    
    analyticsData.forEach(e => {
        // Only count if they opened the prospectus
        if (!e.prospectus_opened) {
            return;
        }
        
        const sessions = parseInt(e.total_sessions) || 0;
        
        if (sessions <= 1) categories['Single Visit']++;
        else if (sessions <= 3) categories['2-3 Visits']++;
        else if (sessions <= 5) categories['4-5 Visits']++;
        else categories['6+ Visits']++;
    });
    
    return {
        labels: Object.keys(categories),
        data: Object.values(categories)
    };
}

/**
 * Get interest correlation
 * Show which interests are most common among accepted students
 */
function getInterestCorrelation() {
    const interestCounts = {};
    
    // Only look at accepted or applying students
    analyticsData
        .filter(e => e.status === 'accepted' || e.status === 'applying')
        .forEach(e => {
            let interests = [];
            
            // Parse interests field
            try {
                if (typeof e.interests === 'string') {
                    interests = JSON.parse(e.interests);
                } else if (Array.isArray(e.interests)) {
                    interests = e.interests;
                }
            } catch (err) {
                // Ignore parse errors
            }
            
            interests.forEach(interest => {
                interestCounts[interest] = (interestCounts[interest] || 0) + 1;
            });
        });
    
    // Get top 8 interests
    const sorted = Object.entries(interestCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);
    
    return {
        labels: sorted.map(([interest]) => interest.charAt(0).toUpperCase() + interest.slice(1)),
        data: sorted.map(([, count]) => count)
    };
}
// ========================================
// FIXED DROP-OFF ANALYSIS FUNCTION
// Replace the getDropoffAnalysis function in your analytics.js file with this version
// ========================================

/**
 * Get drop-off analysis
 * Shows where enquiries dropped off based on their previous_status field
 * This field is set when an enquiry is archived or deleted
 */
function getDropoffAnalysis() {
    console.log('📊 DROP-OFF ANALYSIS FUNCTION CALLED');
    console.log('Total enquiries:', analyticsData.length);
    
    const dropoffs = {
        'New': 0,
        'Contacted': 0,
        'Open Day': 0,
        'Private Tour': 0,
        'Follow-up': 0,
        'Applying': 0
    };
    
    // Only count archived enquiries
    const archivedEnquiries = analyticsData.filter(e => e.status === 'archived');
    
    console.log('📦 Archived enquiries count:', archivedEnquiries.length);
    
    if (archivedEnquiries.length === 0) {
        console.log('⚠️ No archived enquiries found for drop-off analysis');
        return {
            labels: Object.keys(dropoffs),
            data: Object.values(dropoffs)
        };
    }
    
    // Process each archived enquiry
    archivedEnquiries.forEach(e => {
        let dropoffStage = null;
        
        // PRIMARY METHOD: Use previous_status field
        if (e.previous_status && e.previous_status !== 'archived') {
            dropoffStage = e.previous_status;
            console.log(`✅ Using previous_status for ${e.id}: ${dropoffStage}`);
        }
        // FALLBACK METHOD: Parse activity_log if previous_status not available
        else if (e.activity_log) {
            try {
                let activities = typeof e.activity_log === 'string' 
                    ? JSON.parse(e.activity_log) 
                    : e.activity_log;
                
                if (Array.isArray(activities)) {
                    // Sort by timestamp descending (most recent first)
                    activities.sort((a, b) => new Date(b.timestamp || b.created_at) - new Date(a.timestamp || a.created_at));
                    
                    // Find the most recent status change that's NOT to archived
                    for (let activity of activities) {
                        const description = activity.description || activity.action || '';
                        
                        // Look for status change patterns
                        if (description.includes('Status changed to')) {
                            const statusMatch = description.match(/Status changed to (\w+)/);
                            if (statusMatch && statusMatch[1] !== 'archived') {
                                dropoffStage = statusMatch[1];
                                console.log(`📜 Found status in activity_log for ${e.id}: ${dropoffStage}`);
                                break;
                            }
                        }
                        // Also check for deletion with status info
                        else if (description.includes('Last status was:')) {
                            const statusMatch = description.match(/Last status was: (\w+)/);
                            if (statusMatch && statusMatch[1] !== 'archived') {
                                dropoffStage = statusMatch[1];
                                console.log(`🗑️ Found deletion status for ${e.id}: ${dropoffStage}`);
                                break;
                            }
                        }
                    }
                }
            } catch (err) {
                console.error('⚠️ Error parsing activity log for enquiry:', e.id, err);
            }
        }
        
        // If no dropoff stage found, default to 'new'
        if (!dropoffStage) {
            dropoffStage = 'new';
            console.warn(`⚠️ No previous status found for enquiry ${e.id}, defaulting to 'new'`);
        }
        
        // Map status to dropoff category
        switch(dropoffStage.toLowerCase()) {
            case 'new':
                dropoffs['New']++;
                break;
            case 'contacted':
                dropoffs['Contacted']++;
                break;
            case 'openday':
            case 'open day':
                dropoffs['Open Day']++;
                break;
            case 'privatetour':
            case 'private tour':
                dropoffs['Private Tour']++;
                break;
            case 'followup':
            case 'follow-up':
                dropoffs['Follow-up']++;
                break;
            case 'applying':
                dropoffs['Applying']++;
                break;
            default:
                console.warn(`⚠️ Unknown status: ${dropoffStage}, counting as 'New'`);
                dropoffs['New']++;
        }
    });
    
    console.log('\n📊 FINAL Drop-off Distribution:', dropoffs);
    
    // Calculate percentages
    const totalDropoffs = Object.values(dropoffs).reduce((a, b) => a + b, 0);
    if (totalDropoffs > 0) {
        console.log('\n📈 Drop-off Percentages:');
        Object.entries(dropoffs).forEach(([stage, count]) => {
            const percentage = ((count / totalDropoffs) * 100).toFixed(1);
            console.log(`   ${stage}: ${count} (${percentage}%)`);
        });
    }
    
    // Provide diagnostic information if all showing as "New"
    if (dropoffs['New'] === totalDropoffs && totalDropoffs > 0) {
        console.warn('\n⚠️ WARNING: All drop-offs showing as "New"');
        console.log('This indicates that previous_status is not being saved properly.');
        console.log('\n🔧 TO FIX THIS:');
        console.log('1. Ensure your database has a "previous_status" column in the inquiries table');
        console.log('2. Update your server.js endpoints as provided in the fix');
        console.log('3. The fix will save the current status before archiving');
        console.log('\n📝 Sample archived enquiry for debugging:', archivedEnquiries[0]);
    }
    
    return {
        labels: Object.keys(dropoffs),
        data: Object.values(dropoffs)
    };
}

// ========================================
// ADDITIONAL HELPER FUNCTION FOR TESTING
// ========================================

/**
 * Test function to verify drop-off data
 * Call this from console: testDropoffData()
 */
window.testDropoffData = function() {
    console.log('🧪 TESTING DROP-OFF DATA');
    
    const archived = analyticsData.filter(e => e.status === 'archived');
    
    console.log(`Found ${archived.length} archived enquiries`);
    
    if (archived.length > 0) {
        console.log('\n📋 Sample of archived enquiries with their previous_status:');
        archived.slice(0, 5).forEach(e => {
            console.log(`ID: ${e.id}`);
            console.log(`  Current Status: ${e.status}`);
            console.log(`  Previous Status: ${e.previous_status || 'NOT SET'}`);
            console.log(`  Has Activity Log: ${e.activity_log ? 'Yes' : 'No'}`);
        });
    }
    
    // Also check if the column exists in the data
    if (archived.length > 0 && !archived[0].hasOwnProperty('previous_status')) {
        console.warn('\n⚠️ The "previous_status" field is not present in the API response!');
        console.log('Make sure the /api/admin/enquiries endpoint includes this field in the SELECT query.');
    }
    
    return archived;
};
// Export functions to window for global access
window.initAnalyticsModule = initAnalyticsModule;
window.loadAnalytics = loadAnalytics;