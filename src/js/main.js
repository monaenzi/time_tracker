let startTime;
let timerInterval;
let isRunning = false;
let selectedProjectId = null;
let timeEntries = JSON.parse(localStorage.getItem('timeEntries')) || [];    
let elapsedTime = 0;
let selectedProjectName = '';


// ==================== PROJEKT FUNKTIONEN ====================

async function fetchProjects() {
    const res = await fetch('http://localhost:3000/api/projects');
    const projects = await res.json();
    const list = document.getElementById('projectsList');
    
    list.innerHTML = ''; // Liste leeren
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
    selectedProjectName = p.name;

    document.getElementById('selectedProjectText').textContent = p.name;
    document.getElementById('activeProjectName').textContent = p.name.toUpperCase();
    document.getElementById('projectDropdown').style.display = 'none';
}


// ==================== TIMER FUNKTIONEN ====================

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
    const duration = Math.round(elapsedTime / 60);  

    const entry = {
        projectid: selectedProjectId,
        projectName: selectedProjectName,
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


function openModal() {
    document.getElementById('entryFormModal').style.display = 'flex';
    document.getElementById('formDate').value = new Date().toISOString().split('T')[0];
    populateProjectSelect();
}

function closeModal() {
    document.getElementById('entryFormModal').style.display = 'none';
}

async function populateProjectSelect() {
    const res = await fetch('http://localhost:3000/api/projects');
    const projects = await res.json();
    const select = document.getElementById('formProjectId');
    
    select.innerHTML = '<option value="">Select Project...</option>';
    projects.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.name;
        select.appendChild(opt);
    });
}

function deleteEntry(index) {
    if (confirm("Are you sure you want to delete this entry?")) {
        timeEntries.splice(index, 1);
        localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
        renderHistory();
    }
}

function renderHistory() {
    const list = document.getElementById('entryList');
    const today = new Date().toISOString().split('T')[0];
    const todaysData = timeEntries.filter(e => e.date === today);
    
    list.innerHTML = '';
    let total = 0;
    todaysData.forEach(e => {
        total += e.durationMinutes;
        list.innerHTML += `<li>${e.projectName}: ${e.durationMinutes} min</li>`;
    });
    document.getElementById('totalTime').textContent = total;

    const badge = document.getElementById('historyCount');
    if (badge) badge.textContent = timeEntries.filter(e => e.date === today).length;
}

document.getElementById('startStopBtn').onclick = function() {
    if (!isRunning) {
        if (!selectedProjectId) return alert("Select a project first!");
        startTimer();
    } else {
        pauseTimer();
    }
};

document.getElementById('resetBtn').onclick = function() {
    if (elapsedTime > 0) {
        stopTimer();
    }
};

document.getElementById('selectTrigger').onclick = () => {
    const menu = document.getElementById('projectDropdown');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
};

document.getElementById('historyBtn').onclick = () => {
    const section = document.getElementById('historySection');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
};

const addBtn = document.getElementById('addEntryBtn');
if (addBtn) {
    addBtn.onclick = openModal;
}

document.getElementById('closeFormBtn').onclick = closeModal;
document.getElementById('cancelFormBtn').onclick = closeModal;

document.getElementById('entryForm').onsubmit = function(e) {
    e.preventDefault();

    const select = document.getElementById('formProjectId');
    const selectedOption = select.options[select.selectedIndex];

    const entry = {
        projectid: select.value,
        projectName: selectedOption.textContent,
        date: document.getElementById('formDate').value,
        durationMinutes: parseInt(document.getElementById('formDurationMinutes').value)
    };

    timeEntries.push(entry);
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries));

    renderHistory();
    this.reset();
    closeModal();
};

fetchProjects();
renderHistory();
