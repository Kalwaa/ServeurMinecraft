const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuration de la requête vers Pterodactyl / FalixNodes
const api = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Authorization': `Bearer ${process.env.API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Route 1 : Récupérer la liste des serveurs
app.get('/api/servers', async (req, res) => {
  try {
    const response = await api.get('/');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des serveurs' });
  }
});

// Route 2 : Obtenir le statut d'un serveur spécifique (RAM, CPU, État)
app.get('/api/servers/:identifier/resources', async (req, res) => {
  try {
    const response = await api.get(`/servers/${req.params.identifier}/resources`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des ressources' });
  }
});

// Route 3 : Envoyer un signal de puissance (start / stop / restart)
app.post('/api/servers/:identifier/power', async (req, res) => {
  const { signal } = req.body; // 'start', 'stop', 'restart', 'kill'

  try {
    const response = await api.post(`/servers/${req.params.identifier}/power`, {
      signal: signal
    });
    // Pterodactyl renvoie généralement un statut 204 (Pas de contenu) en cas de succès
    res.json({ success: true, message: `Signal '${signal}' envoyé avec succès !` });
  } catch (error) {
    console.error('Erreur API Pterodactyl:', error.response ? error.response.data : error.message);
res.status(500).json({ error: 'Erreur lors de l\'envoi de la commande de puissance' });
  }
});

// Route pour obtenir le jeton et l'URL du WebSocket
app.get('/api/servers/:identifier/websockets', async (req, res) => {
  try {
    const response = await api.get(`/servers/${req.params.identifier}/websockets`);
    // Pterodactyl renvoie { data: { token: "...", socket: "wss://..." } }
    res.json(response.data.data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des détails WebSocket' });
  }
});

app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});
