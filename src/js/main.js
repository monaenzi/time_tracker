let startTime;
let timerInterval;
let isRunning = false;
let selectedProjectId = null;
let timeEntries = JSON.parse(localStorage.getItem('timeEntries')) || [];    
let elapsedTime = 0;


<<<<<<< HEAD
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

// ==================== PROJECT FETCHING ====================
// Shared function to fetch projects from server
async function fetchProjectsFromServer() {
    try {
        const res = await fetch('http://localhost:3000/api/projects');
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
    document.getElementById('selectedProjectText').textContent = p.name;
    document.getElementById('activeProjectName').textContent = p.name.toUpperCase();
    document.getElementById('projectDropdown').style.display = 'none';
}


document.getElementById('startStopBtn').onclick = function() {
    if (!isRunning) {
        if (!selectedProjectId) return alert("Select a project first!");
        startTimer();
    } else {
        pauseTimer();
    }
};

function startTimer() {
    isRunning = true;
    startTime = new Date() - (elapsedTime * 1000);
    document.getElementById('startStopBtn').textContent = '⏹';
    document.getElementById('statusText').textContent = 'Running';
    timerInterval = setInterval(updateUI, 1000);
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    elapsedTime = Math.floor((new Date() - startTime) / 1000);
    
    document.getElementById('startStopBtn').textContent = '▶';
    document.getElementById('statusText').textContent = 'Paused';
}

function stopTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    const endTime = new Date();
    const duration = Math.round(elapsedTime / 60);  

   
    const entry = {
        projectid: selectedProjectId,
        date: new Date().toISOString().split('T')[0],
        durationMinutes: duration
    };
    
    timeEntries.push(entry);
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries));   
    
    elapsedTime = 0;
    document.getElementById('timerDisplay').textContent = '00:00';
    document.getElementById('startStopBtn').textContent = '▶';
    document.getElementById('statusText').textContent = 'Paused';
    renderHistory();
}

function updateUI() {
    const diff = Math.floor((new Date() - startTime) / 1000);
    const m = String(Math.floor(diff / 60)).padStart(2, '0');
    const s = String(diff % 60).padStart(2, '0');
    document.getElementById('timerDisplay').textContent = `${m}:${s}`;  
}


document.getElementById('selectTrigger').onclick = () => {
    const menu = document.getElementById('projectDropdown');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
};

document.getElementById('resetBtn').onclick = function() {
    if (elapsedTime > 0) {
        stopTimer();
    }
};

function renderHistory() {
    const list = document.getElementById('entryList');
    const today = new Date().toISOString().split('T')[0];
    const todaysData = timeEntries.filter(e => e.date === today);
    
    list.innerHTML = '';
    let total = 0;
    todaysData.forEach(e => {
        total += e.durationMinutes;
        list.innerHTML += `<li>Project ${e.projectid}: ${e.durationMinutes} min</li>`;
    });
    document.getElementById('totalTime').textContent = total;
}

fetchProjects();
renderHistory();
