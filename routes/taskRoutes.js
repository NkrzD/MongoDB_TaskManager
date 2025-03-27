const express = require('express');
const Task = require('../models/task');

const router = express.Router();

// Récupérer toutes les tâches avec filtres et tri
router.get('/', async (req, res) => {
    try {
        const { statut, priorite, categorie, etiquette, avant, apres, q, tri, ordre } = req.query;
        let filtre = {};

        // Filtrage
        if (statut) filtre.statut = statut;
        if (priorite) filtre.priorite = priorite;
        if (categorie) filtre.categorie = categorie;
        if (etiquette) filtre.etiquettes = { $in: [etiquette] };
        if (avant) filtre.echeance = { ...filtre.echeance, $lte: new Date(avant) };
        if (apres) filtre.echeance = { ...filtre.echeance, $gte: new Date(apres) };
        if (q) filtre.$or = [{ titre: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }];

        // Tri
        let triOptions = {};
        if (tri) {
            const ordreTri = ordre === 'desc' ? -1 : 1;
            if (tri === 'echeance') triOptions.echeance = ordreTri;
            if (tri === 'priorite') triOptions.priorite = ordreTri;
            if (tri === 'dateCreation') triOptions.dateCreation = ordreTri;
        }

        const tasks = await Task.find(filtre).sort(triOptions);
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Récupérer une tâche par ID
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Ajouter une tâche
router.post('/', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//Ajouter une sous tache
router.post('/:id/sous-taches', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Tâche non trouvée" });

        task.sousTaches.push(req.body);
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//ajouter un commentaire
router.post('/:id/commentaires', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Tâche non trouvée" });

        task.commentaires.push(req.body);
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//Modifier une tâche
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask) return res.status(404).json({ message: "Tâche non trouvée" });
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//modifier une sous tâche
router.put('/:taskId/sous-taches/:sousTacheId', async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ message: "Tâche non trouvée" });

        const sousTache = task.sousTaches.id(req.params.sousTacheId);
        if (!sousTache) return res.status(404).json({ message: "Sous-tâche non trouvée" });

        Object.assign(sousTache, req.body);
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//Supprimer une tâche
router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ message: "Tâche non trouvée" });
        res.json({ message: "Tâche supprimée avec succès" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//supprimer une sous tache
router.delete('/:taskId/sous-taches/:sousTacheId', async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ message: "Tâche non trouvée" });

        task.sousTaches = task.sousTaches.filter(st => st._id.toString() !== req.params.sousTacheId);
        await task.save();
        res.json({ message: "Sous-tâche supprimée" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//supprimer un commentaire
router.delete('/:taskId/commentaires/:commentaireId', async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ message: "Tâche non trouvée" });

        task.commentaires = task.commentaires.filter(c => c._id.toString() !== req.params.commentaireId);
        await task.save();
        res.json({ message: "Commentaire supprimé" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;