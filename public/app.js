async function loadProjects() {
    try {
        const response = await fetch('public/projects.json'); // 
        const projects = await response.json();
        const select = document.getElementById('projectSelect');
        
        projects.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = p.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading projects:", error);
    }
}

loadProjects();