const mongoose = require('mongoose');

const SousTacheSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    statut: { type: String, enum: ['à faire', 'en cours', 'terminée'], default: 'à faire' }
});

const CommentaireSchema = new mongoose.Schema({
    auteur: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const TaskSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    description: { type: String },
    statut: { type: String, enum: ['à faire', 'en cours', 'terminée'], default: 'à faire' },
    priorite: { type: String, enum: ['basse', 'moyenne', 'haute'], default: 'moyenne' },
    categorie: { type: String },
    etiquettes: [{ type: String }],
    echeance: { type: Date },
    dateCreation: { type: Date, default: Date.now },
    sousTaches: [SousTacheSchema],
    commentaires: [CommentaireSchema]
});

module.exports = mongoose.model("task", TaskSchema);
