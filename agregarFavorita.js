const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const mongoURL = process.env.URI;

router.post('/agregarFavorita', async (req, res) => {
  const { userEmail, pelicula } = req.body;
  const client = new MongoClient(mongoURL);

  try {
    await client.connect();
    const dbName = 'cineforumdb';
    const db = client.db(dbName);
    const collection = db.collection('peliculas');

    const existingUser = await collection.findOne({ userEmail });
    if (existingUser) {
      await collection.updateOne(
        { userEmail },
        {
          $addToSet: { favoritas: pelicula }, // $addToSet agrega el elemento solo si no existe
        }
      );

      res.status(200).json({ message: 'Película agregada a favoritas con éxito' });
      console.log("pelicula agregada a favoritos")

    } else {
      // Si el usuario no existe, crea un nuevo documento para él
      const newUserDocument = {
        userEmail: userEmail,
        favoritas: [pelicula], // Crear una nueva matriz con la película
      };

      await collection.insertOne(newUserDocument);

      res.status(200).json({ message: 'Película agregada a favoritas con éxito' });
      console.log("pelicula agregada a favoritos");
    }

  } catch (error) {
    // Manejar errores y enviar una respuesta de error al cliente
    console.error(error);
    res.status(500).json({ error: 'Hubo un problema al agregar la pelicula a favoritos' });
  } finally {
    client.close();
  }
});

module.exports = router;
