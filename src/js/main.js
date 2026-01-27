let startTime;
let timerInterval;
let isRunning = false;
let selectedProjectId = null;
let timeEntries = JSON.parse(localStorage.getItem('timeEntries')) || [];
let elapsedTime = 0;
let selectedProjectName = '';
let currentEditIndex = null;

// ==================== PROJEKT FUNKTIONEN ====================

async function fetchProjects() {
    try {
        const res = await fetch('http://localhost:3000/api/projects');
        if (!res.ok) {
            throw new Error(`HTTP Error! Status: ${res.status}`)
        }

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
    } catch (error) {
        console.error('Error while loading project data:', error);
    }

}

function selectProject(p) {
    selectedProjectId = p.id;
    selectedProjectName = p.name;

    document.getElementById('selectedProjectText').textContent = p.name;
    document.getElementById('activeProjectName').textContent = p.name.toUpperCase();
    document.getElementById('projectDropdown').style.display = 'none';
    renderHistory();
}


// ==================== TIMER FUNKTIONEN ====================

function startTimer() {
    isRunning = true;
    startTime = new Date() - (elapsedTime * 1000);
    document.getElementById('startStopBtn').textContent = '⏸︎';
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
    const now = new Date();
    const startedAt = new Date(now.getTime() - (elapsedTime * 1000));
    const formatTime = (date) =>
        date.getHours().toString().padStart(2, '0') + ":" +
        date.getMinutes().toString().padStart(2, '0');
    const duration = Math.round(elapsedTime / 60);

    const entry = {
        projectid: selectedProjectId,
        projectName: selectedProjectName,
        date: new Date().toISOString().split('T')[0],
        startTime: formatTime(startedAt),
        endTime: formatTime(now),
        durationMinutes: duration,
        notes: ''
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

function calculateMinutes(start, end) {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    let diff = (endH * 60 + endM) - (startH * 60 + startM);

    if (diff < 0) diff += 24 * 60;

    return diff;
}

function isFuture(dateStr, timeStr) {
    const now = new Date();
    const entryDateTime = new Date(`${dateStr}T${timeStr}`);
    return entryDateTime > now;
}


function openModal() {
    document.getElementById('entryFormModal').style.display = 'flex';
    document.getElementById('formDate').value = new Date().toISOString().split('T')[0];
    populateProjectSelect();
}

function closeModal() {
    document.getElementById('entryFormModal').style.display = 'none';

    const form = document.getElementById('entryForm');
    if (form) {
        form.reset();
    }
    
    const errorEl = document.getElementById('formError');
    if (errorEl) {
        errorEl.style.display = 'none';
    }
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


function resetAllEntries() {

    if (!selectedProjectId) {
        alert("Please select a project first");
        return;
    }

    const confirmation = confirm(`Are you sure you want to delete all entries for the project "${selectedProjectName}"?`);

    if (confirmation) {
        timeEntries = timeEntries.filter(e => e.projectid != selectedProjectId);

        localStorage.setItem('timeEntries', JSON.stringify(timeEntries));

        renderHistory();

        alert(`All entries for "${selectedProjectName}" have been deleted.`);
    }
}

const resetAllBtn = document.getElementById('resetAllEntriesBtn');
if (resetAllBtn) {
    resetAllBtn.onclick = resetAllEntries;
}


function isOverlapping(date, startTime, endTime, ignoreIndex = null){
    for (let i = 0; i < timeEntries.length; i++) {
        if(ignoreIndex !== null && i === ignoreIndex) continue;
        const existing = timeEntries[i];

        if (existing.date === date) {
            if (startTime < existing.endTime && endTime > existing.startTime) {
                return true; 
            }
        }
    }
    return false; 
}



function deleteEntry(index) {
    if (confirm("Are you sure you want to delete this entry?")) {
        timeEntries.splice(index, 1);
        localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
        renderHistory();
    }
}

// function openDetailModal(entry) {
//     document.getElementById('detailProjectName').textContent = entry.projectName || "Project Details";
//     document.getElementById('detailDate').textContent = entry.date;
//     document.getElementById('detailStartTime').textContent = entry.startTime || "--:--";
//     document.getElementById('detailEndTime').textContent = entry.endTime || "--:--";
//     document.getElementById('detailDuration').textContent = entry.durationMinutes;
    
//     const notesDisplay = document.getElementById('detailNotes');
//     notesDisplay.textContent = entry.notes || "No notes for this entry.";
    
//     document.getElementById('detailModal').style.display = 'flex';

//     const body = document.querySelector('#detailModal .detail-body');
//     if (body) body.scrollTop = 0;
// }

function openDetailModal(entry, index) {
    currentEditIndex = index;
    document.getElementById('detailProjectName').textContent = entry.projectName;
    document.getElementById('editDate').value = entry.date;
    document.getElementById('editStartTime').value = entry.startTime;
    document.getElementById('editEndTime').value = entry.endTime;
    document.getElementById('editNotes').value = entry.notes || "";
    document.getElementById('detailModal').style.display = 'flex';
}

function saveEntryEdits() {
    const newStart = document.getElementById('editStartTime').value;
    const newEnd = document.getElementById('editEndTime').value;
    const newDate = document.getElementById('editDate').value;
    const errorEl = document.getElementById('editError');

    if (newStart >= newEnd) {
        document.getElementById('editError').textContent = "Error: End time must be after start time!";
        document.getElementById('editError').style.display = 'block';
        return;
    }

    if(isOverlapping(newDate, newStart, newEnd, currentEditIndex)){
        errorEl.textContent = "Error: This update overlaps with another entry!";
        errorEl.style.display = 'block';
        return;
    }


    const newDuration = calculateMinutes(newStart, newEnd);
    let dayTotal = 0;
    const currentEntry = timeEntries[currentEditIndex];

    for (let i = 0; i < timeEntries.length; i++) {
        if (i !== currentEditIndex && 
            timeEntries[i].projectid == currentEntry.projectid && 
            timeEntries[i].date === newDate) {
            dayTotal += timeEntries[i].durationMinutes;
        }
    }

    if (dayTotal + newDuration > 600) {
        const remaining = 600 - dayTotal;
        errorEl.textContent = `Limit reached! You already have ${dayTotal} min on this day. You can only set this entry to max ${remaining} min.`;
        errorEl.style.display = 'block';
        return;
    }


    const entry = timeEntries[currentEditIndex];
    entry.date = document.getElementById('editDate').value;
    entry.startTime = newStart;
    entry.endTime = newEnd;
    entry.notes = document.getElementById('editNotes').value;
    entry.durationMinutes = calculateMinutes(newStart, newEnd); 

    localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
    renderHistory(); 
    closeDetailModal();
}

document.getElementById('saveEditBtn').onclick = saveEntryEdits;

function closeDetailModal() {
    document.getElementById('detailModal').style.display = 'none';
}

document.getElementById('closeDetailBtn').onclick = closeDetailModal;
document.getElementById('closeDetailBottomBtn').onclick = closeDetailModal;
document.getElementById('detailOverlay').onclick = closeDetailModal;


function renderHistory(filterToday = false) {
    const list = document.getElementById('entryList');
    const totalElement = document.getElementById('totalTime');

    if (!selectedProjectId) {
        list.innerHTML = '<li>Please select a project to view entries.</li>';
        totalElement.textContent = '0';
        return;
    }

    let filteredData = timeEntries.filter(e => e.projectid == selectedProjectId);

    if (filterToday) {
        const today = new Date().toISOString().split('T')[0];
        filteredData = filteredData.filter(e => e.date === today);
    }

    filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));

    list.innerHTML = '';
    let total = 0;

    if (filteredData.length === 0) {
        list.innerHTML = '<li>No entries found for this project.</li>';
    } else {
        filteredData.forEach((e) => {
            total += e.durationMinutes;

            const li = document.createElement('li');
            li.className = 'entry-item';
            li.innerHTML = `
                <div class="entry-row" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <div class="entry-main-content" style="flex-grow: 1; cursor: pointer;">
                        <span class="entry-date">${e.date}</span>
                        <span class="entry-info">
                            <strong>${e.projectName || `Project ${e.projectid}`}</strong>: ${e.durationMinutes} min
                        </span>
                    </div>
                    <button class="delete-btn" data-testid="delete-btn" style="margin-left: 10px;">✕</button>
                </div>
            `;

            // li.querySelector('.entry-main-content').onclick = () => openDetailModal(e);

            li.querySelector('.entry-main-content').onclick = () => {
                const originalIndex = timeEntries.indexOf(e);
                openDetailModal(e, originalIndex);
            };
            li.querySelector('.delete-btn').onclick = () => {
                event.stopPropagation();
                const originalIndex = timeEntries.indexOf(e);
                deleteEntry(originalIndex);
            };
            list.appendChild(li);
        });
    }

    totalElement.textContent = total;

    const badge = document.getElementById('historyCount');
    if (badge) badge.textContent = filteredData.length;
}

document.getElementById('startStopBtn').onclick = function () {
    if (!isRunning) {
        if (!selectedProjectId) return alert("Select a project first!");
        startTimer();
    } else {
        pauseTimer();
    }
};

document.getElementById('resetBtn').onclick = function () {
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

document.getElementById('entryForm').onsubmit = function (e) {
    e.preventDefault();

    const select = document.getElementById('formProjectId');
    const selectedOption = select.options[select.selectedIndex];
    const date = document.getElementById('formDate').value;
    const startTimeVal = document.getElementById('formStartTime').value;
    const endTimeVal = document.getElementById('formEndTime').value;
    const notes = document.getElementById('formNotes').value;

    const errorEl = document.getElementById('formError');
    if (errorEl) errorEl.style.display = 'none';

    const now = new Date();
    const entryDateTime = new Date(`${date}T${endTimeVal}`);

    if (entryDateTime > now) {
        if (errorEl) {
            errorEl.textContent = "Error: You can't track time in the future!";
            errorEl.style.display = 'block';
        } else {
            alert("Error: You can't track time in the future!");
        }
        return;
    }

    if (startTimeVal >= endTimeVal) {
        const msg = "Error: End time must be after start time on the same day!";
        if (errorEl) {
            errorEl.textContent = msg;
            errorEl.style.display = 'block';
        } else {
            alert(msg);
        }
        return;
    }


    if (isOverlapping(date, startTimeVal, endTimeVal)) {
        const msg = "Error: This time slot overlaps with an existing entry!";
        if (errorEl) {
            errorEl.textContent = msg;
            errorEl.style.display = 'block';
        } else {
            alert(msg);
        }
        return; 
    }



    const duration = calculateMinutes(startTimeVal, endTimeVal);



    let currentTotal = 0;
    for (let i = 0; i < timeEntries.length; i++) {
        if (timeEntries[i].projectid == select.value && timeEntries[i].date === date) {
            currentTotal += timeEntries[i].durationMinutes;
        }
    }

    
    if (currentTotal + duration > 600) {
        const remaining = 600 - currentTotal;
        const msg = `Limit reached! You have already recorded ${currentTotal} min on ${date}. You can only add ${remaining > 0 ? remaining : 0} more minutes (Max 600 per day).`;
        
        if (errorEl) {
            errorEl.textContent = msg;
            errorEl.style.display = 'block';
        } else {
            alert(msg);
        }
        return; 
    }



    const entry = {
        projectid: select.value,
        projectName: selectedOption.textContent,
        date: date,
        startTime: startTimeVal,
        endTime: endTimeVal,
        durationMinutes: duration,
        notes: notes
    };

    timeEntries.push(entry);
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries));

    renderHistory();
    this.reset();
    closeModal();
};

function deleteEntryFromModal() {
    if (currentEditIndex !== null) {
        if (confirm("Are you sure you want to delete this entry?")) {
            timeEntries.splice(currentEditIndex, 1);
            
            localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
            
            renderHistory();
            closeDetailModal();
            
            currentEditIndex = null;
        }
    }
}

const deleteBtnModal = document.getElementById('deleteEntryBtn');
if (deleteBtnModal) {
    deleteBtnModal.onclick = deleteEntryFromModal;
}

fetchProjects();
renderHistory();

// ==================== THEME SWITCHER ====================

function switchTheme() {
    const themeSwitchbtn = document.getElementById('theme-btn');
    themeSwitchbtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
    })
}

switchTheme();