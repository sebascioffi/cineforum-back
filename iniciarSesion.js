const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const bcrypt = require('bcrypt');
const mongoURL = process.env.MONGODB_URI;

router.post('/iniciarSesion', async (req, res) => {
  const { email, password } = req.body;

  // Validar que se hayan proporcionado un email y una contraseña
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }
  const client = new MongoClient(mongoURL);

  try {
    await client.connect();
    const dbName = 'cineforumdb';
    const db = client.db(dbName);
    const collection = db.collection('usuarios');

    // Buscar un usuario con el email y la contraseña proporcionados
    const user = await collection.findOne({ email });

    if (user) {
      // Compara la contraseña ingresada con la contraseña almacenada hasheada
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        res.status(200).json({ message: 'Sesión iniciada con éxito' });
      } else {
        res.status(401).json({ error: 'Credenciales inválidas' });
      }
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    // Manejar errores y enviar una respuesta de error al cliente
    console.error(error);
    res.status(500).json({ error: 'Hubo un problema al iniciar sesión' });
  } finally {
    client.close();
  }
});

module.exports = router;
