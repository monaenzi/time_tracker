let startTime;
let timerInterval;
let isRunning = false;
let selectedProjectId = null;
let timeEntries = JSON.parse(localStorage.getItem('timeEntries')) || [];    


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

//--18.01.2026 - NC : Validate entry form ------------------
// ------ Step 3: Client-side Validation ------------------
function validateEntryForm() {
    const projectId = formProjectId.value;
    const date = document.getElementById('formDate').value;
    const durationMinutes = document.getElementById('formDurationMinutes').value;

    // Clear previous errors
    formError.style.display = 'none';
    formError.textContent = '';

    // Remove error styling from all fields
    document.querySelectorAll('.form-group input, .form-group select').forEach(field => {
        field.style.borderColor = '';
    });

    const errors = [];

    // Validate project
    if(!projectId || projectId === '') {
        errors.push('Please select a project');
        formProjectId.style.borderColor = 'rgba(239, 68, 68, 0.5)';
    }

    // Validate date
    if(!date || date.trim() === '') {
        errors.push('Date is required');
        document.getElementById('formDate').style.borderColor = 'rgba(239, 68, 68, 0.5)';
    } else {
        // Validate date format: DD-MM-YYYY
        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
        if (!dateRegex.test(date)) {
            errors.push('Invalid date format. Please use DD-MM-YYYY format (e.g., 15-01-2024)');
            document.getElementById('formDate').style.borderColor = 'rgba(239, 68, 68, 0.5)';
        } else {
            // validate that the date is actually valid (not just format)
            const [day, month, year] = date.split('-').map(Number);
            const dateObj = new Date(year, month - 1, day);

            
            if (dateObj.getDate() !== day || 
                dateObj.getMonth() !== month - 1 
                || dateObj.getFullYear() !== year) {
                errors.push('Invalid date. Please enter a valid date in DD-MM-YYYY format');
                document.getElementById('formDate').style.borderColor = 'rgba(239, 68, 68, 0.5)';
            }
        }
    }

    // Validate duration
    if(!durationMinutes || durationMinutes.trim() === '') {
        errors.push('Duration is required');
        document.getElementById('formDurationMinutes').style.borderColor = 'rgba(239, 68, 68, 0.5)';
    } else {
        // Validate duration is a number
       const duration = Number(durationMinutes);
       if(isNaN(duration) || duration <= 0) {
        errors.push('Duration must be a positive number');
        document.getElementById('formDurationMinutes').style.borderColor = 'rgba(239, 68, 68, 0.5)';
       } else if(!Number.isInteger(duration)) {
        errors.push('Duration must be a whole number');
        document.getElementById('formDurationMinutes').style.borderColor = 'rgba(239, 68, 68, 0.5)';
       }
    }

    // If there are errors, display them and prevent form submission
    if(errors.length > 0) {
        formError.style.display = 'block';
        formError.textContent = errors.join(', ');
        return false;
    }

    // If no errors, return true
    return true;
}


//--18.01.2026 - NC : Helper functions ------------------
function clearFieldErrors(field) {
    field.style.borderColor = '';
    if (formError.style.display === 'block') {
        formError.style.display = 'none';
    }
}

// --18.01.2026 - NC : From submission handler ------------------
// ------ Step 4: Form Submission Handler ------------------
if (entryForm) {
    entryForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // prevent default form submission

        // Validate form
        if (!validateEntryForm()) {
            return; // stop here if form is invalid
        }

        // Submit form data
        const formData = {
            projectId: Number(formProjectId.value),
            date: document.getElementById('formDate').value.trim(),
            durationMinutes: Number(document.getElementById('formDurationMinutes').value)
        };

        // Disable submit button to prevent multiple submissions
        const submitBtn = document.getElementById('submitFormBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating entry...';

        // Clear previous messages
        formError.style.display = 'none';
        formSuccess.style.display = 'none';

        try {
            // send POST request to server
            const response = await fetch('/api/time-entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {

                // server returned an error
                formError.style.display = 'block';
                formError.textContent = data.error || 'Failed to create entry. Please try again later.';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Entry';
                return;
            }

            // server returned a success response
            formSuccess.style.display = 'block';
            formSuccess.textContent = 'Time entry created successfully!';

            // clear form
            entryForm.reset();

            // set default date again
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            document.getElementById('formDate').value = `${day}-${month}-${year}`;

            // close form after 1.5 seconds
            setTimeout(() => {
                closeEntryForm();
                // TODO: NC: Refresh history list here
                // refresh history list 
                // renderHistory();
            }, 1500);

        } catch (error) {
            // network or other unexpected error
            console.error('Error creating time entry:', error);
            formError.style.display = 'block';
            formError.textContent = 'An unexpected error occurred. Please try again later.';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Entry';
        }   
    });
}

// --18.01.2026 - NC : Real-time validation feedback ------------------
// Clear error styling when user starts typing/selecting
const formDate = document.getElementById('formDate');
const formDurationMinutes = document.getElementById('formDurationMinutes');

if (formDate) {
    formDate.addEventListener('input', () => {
        clearFieldErrors(formDate);
    });
}

if (formDurationMinutes) {
    formDurationMinutes.addEventListener('input', () => {
        clearFieldErrors(formDurationMinutes);
    });
}

if (formProjectId) {
    formProjectId.addEventListener('change', () => {
        clearFieldErrors(formProjectId);
    });
}


// --18.01.2026 - NC : Event listeners ------------------
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
