const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const mongoURL = process.env.URI;

router.delete('/quitarFavorita', async (req, res) => {
  const { userEmail, peliculaId } = req.body; // Obtén el email del usuario y el ID de la película a eliminar
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
          $pull: { favoritas: peliculaId }, // Utiliza $pull para eliminar el elemento del array
        }
      );

      res.status(200).json({ message: 'Película eliminada de favoritas con éxito' });
      console.log('Película eliminada de favoritas');
    } else {
      // Si el usuario no existe, puedes manejarlo de acuerdo a tus necesidades
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    // Manejar errores y enviar una respuesta de error al cliente
    console.error(error);
    res.status(500).json({ error: 'Hubo un problema al eliminar la película de favoritas' });
  } finally {
    client.close();
  }
});

module.exports = router;
