const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const mongoURL = process.env.URI;

router.get('/obtenerFavoritas', async (req, res) => {
  const { userEmail } = req.query; // Cambia req.body a req.query para obtener el email como parámetro de consulta
  const client = new MongoClient(mongoURL);

  try {
    await client.connect();
    const dbName = 'cineforumdb';
    const db = client.db(dbName);
    const peliculasCollection = db.collection('peliculas'); // Colección de películas favoritas

    // Busca el documento del usuario por su email
    const userDocument = await peliculasCollection.findOne({ userEmail });

    if (!userDocument) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Obtén los IDs de películas favoritas del usuario
    const movieIds = userDocument.favoritas || [];

    res.status(200).json({ favoritas: movieIds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las películas favoritas' });
  } finally {
    client.close();
  }
});

module.exports = router;
