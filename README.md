# MongoDB_TaskManager

Gestionnaire de Tâches

Description

Cette API permet de gérer des tâches via des requêtes HTTP. Les fonctionnalités incluent :

Création de tâches

Consultation des tâches

Mise à jour des tâches

Suppression des tâches

Filtrage des tâches par statut, priorité et recherche par mot-clé

Base URL

http://localhost:5000/tasks

Endpoints

1. Récupérer toutes les tâches

GET /tasks

2. Ajouter une tâche

POST /tasks

3. Modifier une tâche

PUT /tasks/:id

4. Supprimer une tâche

DELETE /tasks/:id

Installer les dépendances

npm install

Lancer le projet

npm run dev

Par défaut, le serveur écoute sur http://localhost:5000.

Technologies utilisées

Node.js

Express.js

MongoDB

JavaScript

Auteur

Développé par Wyrwal Adrien