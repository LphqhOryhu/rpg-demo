const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');

require('dotenv').config(); // Charger les variables d'environnement

const app = express();
const PORT = 3000;

// Vérification de la clé API OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('La clé API OpenAI est manquante. Vérifiez votre fichier .env.');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint: Récupérer les données du joueur
app.get('/api/player', (req, res) => {
  try {
    const playerData = require('./data/player.json');
    res.json(playerData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données du joueur:', error.message);
    res.status(500).json({ error: 'Impossible de récupérer les données du joueur.' });
  }
});

// Endpoint: Mettre à jour les données du joueur
app.post('/api/player', (req, res) => {
  const playerData = req.body;

  if (!playerData || !playerData.etat_joueur || !playerData.historique) {
    return res.status(400).json({ error: 'Données du joueur invalides.' });
  }

  fs.writeFile('./data/player.json', JSON.stringify(playerData, null, 2), (err) => {
    if (err) {
      console.error('Erreur lors de la mise à jour des données du joueur:', err.message);
      res.status(500).json({ error: 'Impossible de mettre à jour les données du joueur.' });
    } else {
      res.json({ message: 'Données mises à jour avec succès.' });
    }
  });
});

// Endpoint: Récupérer les événements d’un chapitre
app.get('/api/chapters/:id', (req, res) => {
  const chapterId = parseInt(req.params.id, 10);

  try {
    const chapters = require('./data/chapters.json').chapters;
    const chapter = chapters.find((c) => c.id === chapterId);

    if (!chapter) {
      return res.status(404).json({ error: 'Chapitre introuvable.' });
    }

    res.json(chapter);
  } catch (error) {
    console.error('Erreur lors de la récupération du chapitre:', error.message);
    res.status(500).json({ error: 'Impossible de récupérer le chapitre.' });
  }
});

// Endpoint: Ajouter un événement dans un chapitre
app.post('/api/chapters/:id', (req, res) => {
  const chapterId = parseInt(req.params.id, 10);
  const { event } = req.body;

  if (!event) {
    return res.status(400).json({ error: 'Événement manquant.' });
  }

  try {
    const chaptersData = require('./data/chapters.json');
    const chapter = chaptersData.chapters.find((c) => c.id === chapterId);

    if (!chapter) {
      return res.status(404).json({ error: 'Chapitre introuvable.' });
    }

    chapter.evenements.push(event);
    fs.writeFile('./data/chapters.json', JSON.stringify(chaptersData, null, 2), (err) => {
      if (err) {
        console.error('Erreur lors de la mise à jour du chapitre:', err.message);
        res.status(500).json({ error: 'Impossible de mettre à jour le chapitre.' });
      } else {
        res.json({ message: 'Événement ajouté avec succès.' });
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du chapitre:', error.message);
    res.status(500).json({ error: 'Impossible de mettre à jour le chapitre.' });
  }
});

// Endpoint: Relayer les messages à l'API OpenAI
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message manquant.' });
  }

  try {
    // Charger l'état du joueur
    const playerData = require('./data/player.json');

    // Créer un prompt avec l'état du joueur
    const prompt = `
Tu es un maître de jeu de RPG. Voici l'état actuel du joueur :
Santé : ${playerData.etat_joueur.santé}, Énergie : ${playerData.etat_joueur.énergie}, Mana : ${playerData.etat_joueur.mana}, Inventaire : ${playerData.etat_joueur.inventaire.join(', ')}.
Historique : ${playerData.historique.join(', ')}

Action : ${message}
    `;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Erreur avec l\'API OpenAI :', error.response?.data || error.message);
    res.status(500).json({ error: 'Erreur lors de la communication avec OpenAI.' });
  }
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
