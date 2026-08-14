require('dotenv').config();
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

app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});
