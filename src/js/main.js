let startTime;
let timerInterval;
let isRunning = false;
let selectedProjectId = null;
let timeEntries = JSON.parse(localStorage.getItem('timeEntries')) || [];    
let elapsedTime = 0;


async function fetchProjects() {
    const res = await fetch('http://localhost:3000/api/projects');
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