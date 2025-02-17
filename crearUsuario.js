const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcrypt');

const uri = process.env.URI

// Manejar la creación de usuario
router.post('/crearUsuario', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const dbName = 'cineforumdb';
    const db = client.db(dbName);
    const collection = db.collection('usuarios');

    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'El email ya está en uso' });
    } else {

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        firstName,
        lastName,
        email,
        password: hashedPassword // En un entorno de producción, se debe almacenar una versión segura de la contraseña
      };

      const result = await collection.insertOne(user);
      res.status(200).json({ message: 'Usuario creado con éxito' });
      console.log("usuario creado");
    }

  } catch (error) {
    // Manejar errores y enviar una respuesta de error al cliente
    console.error(error);
    res.status(500).json({ error: 'Hubo un problema al crear el usuario' });
  } finally {
    client.close();
  }
});

module.exports = router;
