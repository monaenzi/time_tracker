let selectedProjectId = null;
let timeEntries = [];
let projects = []; // Store projects for name lookup    

// ==================== SAFE STORAGE HELPERS ====================
function safeJsonParse(raw, fallback) {
    if (raw == null || raw === '') return fallback;
    try {
        return JSON.parse(raw);
    } catch (error) {
        // Do not crash the app because of corrupted localStorage.
        // This is exceptional, so logging is acceptable.
        console.error('Failed to parse JSON from localStorage:', error);
        return fallback;
    }
}

function loadTimeEntriesFromStorage() {
    const parsed = safeJsonParse(localStorage.getItem('timeEntries'), []);
    return Array.isArray(parsed) ? parsed : [];
}

timeEntries = loadTimeEntriesFromStorage();

// ==================== TIMER CLASS ====================
// Encapsulates all timer-related state and functionality
class Timer {
    constructor() {
        this.startTime = null;
        this.elapsedTime = 0;
        this.isRunning = false;
        this.interval = null;
    }

    start() {
        this.isRunning = true;
        this.startTime = new Date() - (this.elapsedTime * CONSTANTS.TIME.MS_PER_SECOND);
        DOM.startStopBtn.textContent = '⏹';
        DOM.statusText.textContent = 'Running';
        this.interval = setInterval(() => this.updateUI(), CONSTANTS.TIMEOUTS.UPDATE_INTERVAL);
    }

    pause() {
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.elapsedTime = Math.floor((new Date() - this.startTime) / CONSTANTS.TIME.MS_PER_SECOND);
        DOM.startStopBtn.textContent = '▶';
        DOM.statusText.textContent = 'Paused';
    }

    stop() {
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        const duration = Math.round(this.elapsedTime / CONSTANTS.TIME.SECONDS_PER_MINUTE);
        this.elapsedTime = 0;
        this.startTime = null;
        
        DOM.timerDisplay.textContent = '00:00';
        DOM.startStopBtn.textContent = '▶';
        DOM.statusText.textContent = 'Paused';
        
        return duration;
    }

    updateUI() {
        const diff = Math.floor((new Date() - this.startTime) / CONSTANTS.TIME.MS_PER_SECOND);
        const m = String(Math.floor(diff / CONSTANTS.TIME.SECONDS_PER_MINUTE)).padStart(CONSTANTS.DATE.MONTH_PADDING, CONSTANTS.DATE.PADDING_CHAR);
        const s = String(diff % CONSTANTS.TIME.SECONDS_PER_MINUTE).padStart(CONSTANTS.DATE.DAY_PADDING, CONSTANTS.DATE.PADDING_CHAR);
        DOM.timerDisplay.textContent = `${m}:${s}`;
    }

    getElapsedTime() {
        return this.elapsedTime;
    }

    getIsRunning() {
        return this.isRunning;
    }
}

// Create timer instance
const timer = new Timer();

// ==================== CONSTANTS ====================
const CONSTANTS = {
    TIMEOUTS: {
        FORM_CLOSE_DELAY: 1500,        // milliseconds
        UPDATE_INTERVAL: 1000,         // milliseconds
    },
    TIME: {
        SECONDS_PER_MINUTE: 60,
        MS_PER_SECOND: 1000,
    },
    DATE: {
        MONTH_PADDING: 2,
        DAY_PADDING: 2,
        PADDING_CHAR: '0',
    }
};

// ==================== DOM ELEMENT CACHE ====================
// Cache frequently accessed DOM elements for better performance
const DOM = {
    // Timer elements
    timerDisplay: document.getElementById('timerDisplay'),
    startStopBtn: document.getElementById('startStopBtn'),
    statusText: document.getElementById('statusText'),
    resetBtn: document.getElementById('resetBtn'),
    
    // Project selection elements
    selectedProjectText: document.getElementById('selectedProjectText'),
    activeProjectName: document.getElementById('activeProjectName'),
    projectDropdown: document.getElementById('projectDropdown'),
    projectsList: document.getElementById('projectsList'),
    selectTrigger: document.getElementById('selectTrigger'),
    
    // History elements
    historyBtn: document.getElementById('historyBtn'),
    historySection: document.getElementById('historySection'),
    entryList: document.getElementById('entryList'),
    totalTime: document.getElementById('totalTime'),
    
    // Form elements
    addEntryBtn: document.getElementById('addEntryBtn'),
    entryFormModal: document.getElementById('entryFormModal'),
    closeFormBtn: document.getElementById('closeFormBtn'),
    cancelFormBtn: document.getElementById('cancelFormBtn'),
    entryForm: document.getElementById('entryForm'),
    formProjectId: document.getElementById('formProjectId'),
    formDate: document.getElementById('formDate'),
    formDurationMinutes: document.getElementById('formDurationMinutes'),
    formError: document.getElementById('formError'),
    formSuccess: document.getElementById('formSuccess'),
    submitFormBtn: document.getElementById('submitFormBtn')
};

// ==================== ERROR HANDLING ====================
// Standardized error handling function
function handleError(error, context = {}) {
    const {
        userMessage = 'An error occurred. Please try again.',
        logMessage = 'Error',
        showInUI = false,
        uiElement = null,
        fallbackAction = null
    } = context;

    // Always log errors for debugging
    console.error(`${logMessage}:`, error);

    // Show user-facing error message if requested
    if (showInUI && uiElement) {
        if (uiElement === 'formError') {
            DOM.formError.style.display = 'block';
            DOM.formError.textContent = userMessage;
        } else if (uiElement === 'projectsList') {
            const errorTextColor = getComputedStyle(document.documentElement).getPropertyValue('--error-text').trim() || '#fca5a5';
            DOM.projectsList.innerHTML = `<div style="padding: 10px; color: ${errorTextColor};">${userMessage}</div>`;
        } else if (uiElement instanceof HTMLElement) {
            uiElement.textContent = userMessage;
            uiElement.style.display = 'block';
        }
    }

    // Execute fallback action if provided
    if (fallbackAction && typeof fallbackAction === 'function') {
        fallbackAction();
    }

    // Return error for further handling if needed
    return error;
}

// ==================== UI HELPERS (ERROR + RETRY) ====================
function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function renderProjectsListError(message, onRetry) {
    if (!DOM.projectsList) return;

    const errorTextColor =
        getComputedStyle(document.documentElement).getPropertyValue('--error-text').trim() || '#fca5a5';

    DOM.projectsList.innerHTML = `
        <div style="padding: 10px; color: ${errorTextColor}; display: grid; gap: 10px;">
            <div>${escapeHtml(message)}</div>
            <button type="button" class="btn-secondary" data-action="retry-projects">Retry</button>
        </div>
    `;

    const retryBtn = DOM.projectsList.querySelector('[data-action="retry-projects"]');
    if (retryBtn && typeof onRetry === 'function') {
        retryBtn.addEventListener('click', () => onRetry());
    }
}

function renderFormErrorWithRetry(message, onRetry) {
    if (!DOM.formError) return;

    DOM.formError.style.display = 'block';
    DOM.formError.innerHTML = `
        <div style="display: grid; gap: 10px;">
            <div>${escapeHtml(message)}</div>
            <button type="button" class="btn-secondary" data-action="retry-form-projects">Retry</button>
        </div>
    `;

    const retryBtn = DOM.formError.querySelector('[data-action="retry-form-projects"]');
    if (retryBtn && typeof onRetry === 'function') {
        retryBtn.addEventListener('click', () => onRetry());
    }
}

// ==================== PROJECT FETCHING ====================
// Shared function to fetch projects from server
async function fetchProjectsFromServer() {
    try {
        const res = await fetch('/api/projects');
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP ${res.status}: ${errorText || 'Failed to fetch projects'}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
            throw new Error('Invalid response format: expected array');
        }
        return data;
    } catch (error) {
        console.error('Error fetching projects from server:', error);
        handleError(error, {
            logMessage: 'Error fetching projects from server',
            userMessage: `Failed to fetch projects: ${error.message}`,
            showInUI: false // Let caller handle UI display
        });
        throw error; // Re-throw for caller to handle
    }
}

// Load and display projects in the project selector dropdown
async function fetchProjects() {
    // Ensure DOM element exists
    if (!DOM.projectsList) {
        console.error('projectsList element not found in DOM');
        return;
    }
    
    try {
        projects = await fetchProjectsFromServer(); // Store projects globally
        
        if (!projects || projects.length === 0) {
            throw new Error('No projects available');
        }
        
        DOM.projectsList.innerHTML = ''; // Clear existing
    
        projects.forEach(p => {
            if (!p || !p.id || !p.name) {
                console.warn('Invalid project data:', p);
                return;
            }
            const div = document.createElement('div');
            div.className = 'project-item';
            div.innerHTML = `<span>${p.name}</span>`;
            div.onclick = () => selectProject(p);
            DOM.projectsList.appendChild(div);
        });
        
        // Re-render history to show project names instead of IDs
        renderHistory();
    } catch (error) {
        console.error('Error loading projects in selector:', error);
        handleError(error, {
            logMessage: 'Error loading projects in selector',
            userMessage: `Failed to load projects: ${error.message}`,
            showInUI: false
        });
        renderProjectsListError(`Failed to load projects. ${error?.message || ''}`.trim(), () => fetchProjects());
    }
}

function selectProject(p) {
    selectedProjectId = p.id;
    DOM.selectedProjectText.textContent = p.name;
    DOM.activeProjectName.textContent = p.name.toUpperCase();
    DOM.projectDropdown.style.display = 'none';
}


// Timer control handlers
function handleStartStop() {
    if (!timer.getIsRunning()) {
        if (!selectedProjectId) return alert("Select a project first!");
        timer.start();
    } else {
        timer.pause();
    }
}

function handleReset() {
    if (timer.getElapsedTime() > 0) {
        const duration = timer.stop();
        
        // Create entry with YYYY-MM-DD date format
    const entry = {
            projectId: selectedProjectId,  // Use camelCase
            date: formatDateYYYYMMDD(new Date()),  // YYYY-MM-DD format
        durationMinutes: duration
    };
    
    timeEntries.push(entry);
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries));   
    renderHistory();
}
}


// Project selection handler
function toggleProjectDropdown() {
    DOM.projectDropdown.style.display = DOM.projectDropdown.style.display === 'block' ? 'none' : 'block';
}

// History panel handler
function toggleHistoryPanel() {
    DOM.historySection.style.display = DOM.historySection.style.display === 'none' ? 'block' : 'none';
}

// Helper function to get project name by ID
function getProjectName(projectId) {
    if (!projectId) return 'Unknown Project';
    
    // Convert projectId to number for comparison (handles both string and number IDs)
    const id = typeof projectId === 'string' ? parseInt(projectId, 10) : projectId;
    
    const project = projects.find(p => {
        const pId = typeof p.id === 'string' ? parseInt(p.id, 10) : p.id;
        return pId === id;
    });
    
    return project ? project.name : `Project ${projectId}`;
}

function renderHistory() {
    // Get today's date in YYYY-MM-DD format
    const today = formatDateYYYYMMDD(new Date());
    const todaysData = timeEntries.filter(e => e.date === today);
    
    DOM.entryList.innerHTML = '';
    let total = 0;
    todaysData.forEach(e => {
        total += e.durationMinutes;
        // Use projectId (camelCase) - handle both formats for compatibility
        const projectId = e.projectId || e.projectid;
        const projectName = getProjectName(projectId);
        DOM.entryList.innerHTML += `<li>${projectName}: ${e.durationMinutes} min</li>`;
    });
    DOM.totalTime.textContent = total;
}

// ==================== INITIALIZATION ====================
// Check if page is being served from a server (not file://)
function isServerContext() {
    return window.location.protocol === 'http:' || window.location.protocol === 'https:';
}

// Initialize projects on page load - fetch from server
if (isServerContext()) {
    fetchProjects();
} else {
    console.error('Page must be accessed through the server (http://localhost:3000), not as a file:// URL');
    if (DOM.projectsList) {
        DOM.projectsList.innerHTML = '<div style="padding: 10px; color: #fca5a5;">Please access this page through http://localhost:3000</div>';
    }
}
renderHistory();

// Initialize all event listeners
initializeEventListeners();


// ==================== FORM MANAGEMENT ====================

// Open form function
async function openEntryForm() {
    DOM.entryFormModal.style.display = 'flex';
    
    // clear messages
    DOM.formError.style.display = 'none';
    DOM.formSuccess.style.display = 'none';

    // reset form FIRST
    DOM.entryForm.reset();

    // Set today's date as default in YYYY-MM-DD format
    DOM.formDate.value = formatDateYYYYMMDD(new Date());
    
    // Populate projects (await to ensure they're loaded before user interacts)
    await populateProjectSelect();
}

// Close form function
function closeEntryForm() {
    DOM.entryFormModal.style.display = 'none';
    DOM.entryForm.reset();
    DOM.formError.style.display = 'none';
    DOM.formSuccess.style.display = 'none';
}


// Populate project select function - fetch from server
async function populateProjectSelect() {
    // Ensure the select element exists
    if (!DOM.formProjectId) {
        console.error('formProjectId element not found');
        return;
    }

    try {
        const projectsData = await fetchProjectsFromServer();

        // Validate projects data
        if (!Array.isArray(projectsData) || projectsData.length === 0) {
            throw new Error('No projects available');
        }

        // Clear existing options
        DOM.formProjectId.innerHTML = '<option value="">Select a project...</option>';

        // Store projects globally for name lookup
        projects = projectsData;
        
        // Add projects from server
        projects.forEach(project => {
            if (project && project.id && project.name) {
                const option = document.createElement('option');
                option.value = project.id;
                option.textContent = project.name;
                DOM.formProjectId.appendChild(option);
            }
        });

        // Verify options were added
        if (DOM.formProjectId.options.length <= 1) {
            throw new Error('Failed to populate project options');
        }
    } catch (error) {
        handleError(error, {
            logMessage: 'Error populating project select',
            userMessage: 'Failed to load projects. Please try again later.',
            showInUI: false
        });
        renderFormErrorWithRetry('Failed to load projects. Please try again.', () => populateProjectSelect());
    }
}

// ==================== FORM VALIDATION ====================

// Error styling - get from CSS custom property
function getErrorColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--error-color').trim() || 'rgba(239, 68, 68, 0.5)';
}

const ERROR_BORDER_COLOR = getErrorColor();

// Error styling helper functions
function setFieldError(field) {
    if (field) {
        field.style.borderColor = ERROR_BORDER_COLOR;
    }
}

function clearFieldError(field) {
    if (field) {
        field.style.borderColor = '';
    }
    // Also clear error message if visible
    if (DOM.formError && DOM.formError.style.display === 'block') {
        DOM.formError.style.display = 'none';
    }
}

// Validate project selection
function validateProject(projectId) {
    const errors = [];
    if (!projectId || projectId === '') {
        errors.push({
            message: 'Please select a project',
            field: DOM.formProjectId
        });
    }
    return errors;
}

// Validate date input
// Note: With type="date", the browser ensures YYYY-MM-DD format and valid dates
function validateDate(date) {
    const errors = [];

    if (!date || date.trim() === '') {
        errors.push({
            message: 'Date is required',
            field: DOM.formDate
        });
        return errors;
    }
    
    // Native date input already ensures YYYY-MM-DD format and valid dates
    // Additional validation: check if date is a valid Date object
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        errors.push({
            message: 'Invalid date. Please select a valid date',
            field: DOM.formDate
        });
    }
    
    return errors;
}

// Validate duration input
function validateDuration(durationMinutes) {
    const errors = [];
    
    if (!durationMinutes || durationMinutes.trim() === '') {
        errors.push({
            message: 'Duration is required',
            field: DOM.formDurationMinutes
        });
        return errors;
    }
    
        // Validate duration is a number
       const duration = Number(durationMinutes);
    if (isNaN(duration) || duration <= 0) {
        errors.push({
            message: 'Duration must be a positive number',
            field: DOM.formDurationMinutes
        });
    } else if (!Number.isInteger(duration)) {
        errors.push({
            message: 'Duration must be a whole number',
            field: DOM.formDurationMinutes
        });
    }
    
    return errors;
}

// Main validation function - orchestrates all field validations
function validateEntryForm() {
    // Clear previous errors
    DOM.formError.style.display = 'none';
    DOM.formError.textContent = '';

    // Remove error styling from all fields
    document.querySelectorAll('.form-group input, .form-group select').forEach(field => {
        clearFieldError(field);
    });

    // Collect validation errors from all fields
    const allErrors = [];
    allErrors.push(...validateProject(DOM.formProjectId.value));
    allErrors.push(...validateDate(DOM.formDate.value));
    allErrors.push(...validateDuration(DOM.formDurationMinutes.value));

    // Apply error styling and collect error messages
    const errorMessages = [];
    allErrors.forEach(error => {
        errorMessages.push(error.message);
        if (error.field) {
            setFieldError(error.field);
        }
    });

    // If there are errors, display them and prevent form submission
    if (errorMessages.length > 0) {
        DOM.formError.style.display = 'block';
        DOM.formError.textContent = errorMessages.join(', ');
        return false;
    }

    // If no errors, return true
    return true;
}


// ==================== FORM HELPERS ====================
// Note: clearFieldError() is defined above with error styling helpers

// Helper function to format date as YYYY-MM-DD
function formatDateYYYYMMDD(date) {
    // date is a Date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(CONSTANTS.DATE.MONTH_PADDING, CONSTANTS.DATE.PADDING_CHAR);
    const day = String(date.getDate()).padStart(CONSTANTS.DATE.DAY_PADDING, CONSTANTS.DATE.PADDING_CHAR);
    return `${year}-${month}-${day}`;
}

// ==================== FORM SUBMISSION ====================
// Form submission handler - stores entries in localStorage
function handleFormSubmit(e) {
        e.preventDefault(); // prevent default form submission

        // Validate form
        if (!validateEntryForm()) {
            return; // stop here if form is invalid
        }

    // Get form data (already in YYYY-MM-DD format)
    const formDate = DOM.formDate.value.trim(); // YYYY-MM-DD
    const formProjectIdValue = Number(DOM.formProjectId.value);
    const formDuration = Number(DOM.formDurationMinutes.value);

        // Disable submit button to prevent multiple submissions
    DOM.submitFormBtn.disabled = true;
    DOM.submitFormBtn.textContent = 'Creating entry...';

        // Clear previous messages
    DOM.formError.style.display = 'none';
    DOM.formSuccess.style.display = 'none';

    try {
        // Create entry object (date is already in YYYY-MM-DD format - no conversion!)
        const entry = {
            projectId: formProjectIdValue,
            date: formDate,  // Already YYYY-MM-DD, no conversion needed!
            durationMinutes: formDuration
        };

        // Add to timeEntries array
        timeEntries.push(entry);

        // Save to localStorage (local storage only, as per requirements)
        localStorage.setItem('timeEntries', JSON.stringify(timeEntries));

        // Success!
        DOM.formSuccess.style.display = 'block';
        DOM.formSuccess.textContent = 'Time entry created successfully!';

        // Clear form
        DOM.entryForm.reset();

        // Set default date again (YYYY-MM-DD format)
        DOM.formDate.value = formatDateYYYYMMDD(new Date());

        // Refresh history list immediately
        renderHistory();

        // Close form after delay
            setTimeout(() => {
                closeEntryForm();
        }, CONSTANTS.TIMEOUTS.FORM_CLOSE_DELAY);

        // Re-enable submit button
        DOM.submitFormBtn.disabled = false;
        DOM.submitFormBtn.textContent = 'Create Entry';

    } catch (error) {
        handleError(error, {
            logMessage: 'Error creating time entry',
            userMessage: 'An error occurred while saving the entry. Please try again.',
            showInUI: true,
            uiElement: 'formError',
            fallbackAction: () => {
                DOM.submitFormBtn.disabled = false;
                DOM.submitFormBtn.textContent = 'Create Entry';
            }
        });
    }
}

// ==================== EVENT LISTENERS ====================
// Initialize all event listeners in one centralized location
function initializeEventListeners() {
    // Timer controls
    if (DOM.startStopBtn) {
        DOM.startStopBtn.onclick = handleStartStop;
    }
    
    if (DOM.resetBtn) {
        DOM.resetBtn.onclick = handleReset;
    }
    
    // Project selection
    if (DOM.selectTrigger) {
        DOM.selectTrigger.onclick = toggleProjectDropdown;
    }
    
    // History panel
    if (DOM.historyBtn) {
        DOM.historyBtn.onclick = toggleHistoryPanel;
    }
    
    // Form submission
    if (DOM.entryForm) {
        DOM.entryForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Real-time validation feedback - clear error styling when user starts typing/selecting
    if (DOM.formDate) {
        DOM.formDate.addEventListener('input', () => {
            clearFieldError(DOM.formDate);
        });
    }
    
    if (DOM.formDurationMinutes) {
        DOM.formDurationMinutes.addEventListener('input', () => {
            clearFieldError(DOM.formDurationMinutes);
        });
    }
    
    if (DOM.formProjectId) {
        DOM.formProjectId.addEventListener('change', () => {
            clearFieldError(DOM.formProjectId);
        });
    }
    
    // Form modal controls
    if (DOM.addEntryBtn) {
        DOM.addEntryBtn.addEventListener('click', openEntryForm);
    }
    
    if (DOM.closeFormBtn) {
        DOM.closeFormBtn.addEventListener('click', closeEntryForm);
    }
    
    if (DOM.cancelFormBtn) {
        DOM.cancelFormBtn.addEventListener('click', closeEntryForm);
    }
    
    if (DOM.entryFormModal) {
        DOM.entryFormModal.addEventListener('click', (e) => {
        if (e.target.classList.contains('form-overlay')) {
            closeEntryForm();
        }
    });
    }
}
