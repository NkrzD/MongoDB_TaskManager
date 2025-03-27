require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connecté"))
  .catch(err => console.error(err));

// Import des routes
const taskRoutes = require('./routes/taskRoutes');
app.use('/tasks', taskRoutes);

// Route de test
app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API Gestionnaire de tâches !");
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
