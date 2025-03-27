const API_URL = 'http://localhost:5000/tasks'; // Changez si nécessaire

// Sélection des éléments HTML
const taskForm = document.getElementById('task-form');
const tasksList = document.getElementById('tasks-list');
const filterStatut = document.getElementById('filter-statut');
const filterPriorite = document.getElementById('filter-priorite');
const searchInput = document.getElementById('search');
const applyFiltersButton = document.getElementById('apply-filters');

// Fonction pour récupérer et afficher les tâches
const fetchTasks = async (filters = {}) => {
    try {
        let query = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_URL}?${query}`);
        const tasks = await response.json();

        tasksList.innerHTML = ''; // Clear previous list
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <h3>${task.titre}</h3>
                <p>${task.description}</p>
                <p><strong>Statut:</strong> ${task.statut} | <strong>Priorité:</strong> ${task.priorite}</p>
                <p><strong>Échéance:</strong> ${new Date(task.echeance).toLocaleString()}</p>
                <button onclick="deleteTask('${task._id}')">Supprimer</button>
                <button onclick="showEditForm('${task._id}')">Modifier</button> <!-- Ajout du bouton Modifier -->
            `;
            tasksList.appendChild(li);
        });
    } catch (err) {
        console.error('Erreur lors de la récupération des tâches', err);
    }
};

// Fonction pour ajouter une nouvelle tâche
const addTask = async (event) => {
    event.preventDefault();

    // Récupérer les valeurs du formulaire, y compris le statut et la priorité
    const newTask = {
        titre: document.getElementById('titre').value,
        description: document.getElementById('description').value,
        echeance: document.getElementById('echeance').value,
        priorite: document.getElementById('priorite').value, // Récupérer la priorité
        statut: document.getElementById('statut').value // Récupérer le statut
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask),
        });

        const task = await response.json();
        fetchTasks(); // Rafraîchir la liste après ajout
    } catch (err) {
        console.error('Erreur lors de l\'ajout de la tâche', err);
    }
};


// Fonction pour afficher le formulaire d'édition avec les informations de la tâche
const showEditForm = async (taskId) => {
    // Récupérer les données de la tâche depuis l'API
    const response = await fetch(`${API_URL}/${taskId}`);
    const task = await response.json();

    // Pré-remplir le formulaire avec les données actuelles de la tâche
    document.getElementById('edit-titre').value = task.titre;
    document.getElementById('edit-description').value = task.description;
    document.getElementById('edit-echeance').value = task.echeance ? new Date(task.echeance).toISOString().slice(0, 16) : '';
    document.getElementById('edit-priorite').value = task.priorite;
    document.getElementById('edit-statut').value = task.statut;

    // Afficher le formulaire
    document.querySelector('.edit-task-form').style.display = 'block';

    // Ajouter un événement de soumission du formulaire
    document.getElementById('edit-task-form').onsubmit = (event) => {
        event.preventDefault();
        updateTask(taskId);
    };
};

// Fonction pour mettre à jour une tâche
const updateTask = async (taskId) => {
    const updatedTask = {
        titre: document.getElementById('edit-titre').value,
        description: document.getElementById('edit-description').value,
        echeance: document.getElementById('edit-echeance').value,
        priorite: document.getElementById('edit-priorite').value,
        statut: document.getElementById('edit-statut').value,
    };

    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask),
        });

        const task = await response.json();
        alert('Tâche mise à jour avec succès');
        fetchTasks();  // Rafraîchir la liste des tâches
        document.querySelector('.edit-task-form').style.display = 'none'; // Masquer le formulaire
    } catch (err) {
        console.error('Erreur lors de la mise à jour de la tâche', err);
    }
};

// Fonction pour supprimer une tâche
const deleteTask = async (taskId) => {
    try {
        await fetch(`${API_URL}/${taskId}`, {
            method: 'DELETE',
        });
        fetchTasks(); // Rafraîchir la liste après suppression
    } catch (err) {
        console.error('Erreur lors de la suppression de la tâche', err);
    }
};

// Appliquer les filtres
const applyFilters = () => {
    const filters = {
        statut: filterStatut.value,
        priorite: filterPriorite.value,
        q: searchInput.value,
    };
    fetchTasks(filters);
};

// Écouter l'envoi du formulaire
taskForm.addEventListener('submit', addTask);

// Écouter l'application des filtres
applyFiltersButton.addEventListener('click', applyFilters);

// Initialiser la liste des tâches
fetchTasks();
