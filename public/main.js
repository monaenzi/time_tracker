let startTime;
let timerInterval;
let isRunning = false;
let selectedProjectId = null;
let timeEntries = JSON.parse(localStorage.getItem('timeEntries')) || [];    


async function fetchProjects() {
    const res = await fetch('projects.json');
    const projects = await res.json();
    const list = document.getElementById('projectsList');
    
    projects.forEach(p => {
        const div = document.createElement('div');
        div.className = 'project-item';
        div.innerHTML = `<span>${p.name}</span>`;
        div.onclick = () => selectProject(p);
        list.appendChild(div);
    });
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
        stopTimer();
    }
};

function startTimer() {
    isRunning = true;
    startTime = new Date();
    document.getElementById('startStopBtn').textContent = '⏹';
    document.getElementById('statusText').textContent = 'Running';
    timerInterval = setInterval(updateUI, 1000);
}

function stopTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 60000); 

   
    const entry = {
        projectid: selectedProjectId,
        date: new Date().toISOString().split('T')[0],
        durationMinutes: duration
    };
    
    timeEntries.push(entry);
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries));   
    
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

// Toggle history panel visibility
document.getElementById('historyBtn').onclick = () => {
    const historySection = document.getElementById('historySection');
    historySection.style.display = historySection.style.display === 'none' ? 'block' : 'none';
};

function renderHistory() {
    const list = document.getElementById('entryList');
    const today = new Date().toISOString().split('T')[0];
    const todaysData = timeEntries.filter(e => e.date === today);
    
    list.innerHTML = '';
    let total = 0;
    todaysData.forEach(e => {
        total += e.durationMinutes;
        list.innerHTML += `<li>Project ${e.projectId}: ${e.durationMinutes} min</li>`;
    });
    document.getElementById('totalTime').textContent = total;
}

fetchProjects();
renderHistory();



// 18.01.2026 - NC: Create entry form ui ------------------

// Get form elements
const addEntryBtn = document.getElementById('addEntryBtn');
const entryFormModal = document.getElementById('entryFormModal');
const closeFormBtn = document.getElementById('closeFormBtn');
const cancelFormBtn = document.getElementById('cancelFormBtn');
const entryForm = document.getElementById('entryForm');
const formProjectId = document.getElementById('formProjectId');
const formError = document.getElementById('formError');
const formSuccess = document.getElementById('formSuccess');

// Open form function
function openEntryForm() {
    entryFormModal.style.display = 'flex';
    populateProjectSelect();

    // clear messages
    formError.style.display = 'none';
    formSuccess.style.display = 'none';

    // reset form FIRST
    entryForm.reset();


    // Set today's date as default
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    document.getElementById('formDate').value = `${day}-${month}-${year}`;
}

// Close form function
function closeEntryForm() {
    entryFormModal.style.display = 'none';
    entryForm.reset();
    formError.style.display = 'none';
    formSuccess.style.display = 'none';
}


// Populate project select function
async function populateProjectSelect() {
    try {
        const res = await fetch('projects.json');
        const projects = await res.json();

        // Clear existing options
        formProjectId.innerHTML = '<option value="">Select a project...</option>';

        // Add projects
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            formProjectId.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating project select:', error);
        formError.style.display = 'block';
        formError.textContent = 'Failed to load projects. Please try again later.';
    }
}

// event listeners
if (addEntryBtn) {
    addEntryBtn.addEventListener('click', openEntryForm);
}

if (closeFormBtn) {
    closeFormBtn.addEventListener('click', closeEntryForm);
}

if (cancelFormBtn) {
    cancelFormBtn.addEventListener('click', closeEntryForm);
}

if (entryFormModal) {
    entryFormModal.addEventListener('click', (e) => {
        if (e.target.classList.contains('form-overlay')) {
            closeEntryForm();
        }
    });
}
