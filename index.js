const express = require('express');
const app = express();
const port = process.env.PORT || 8080; // El puerto en el que se ejecutará tu servidor
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((error) => {
    console.error('Error al conectar a la basee de datos:', error);
  });

app.use(express.json());

// Rutas de ejemplo
app.get('/', (req, res) => {
  res.send('¡Hola, mundo! corriendo en el puerto'+ port);
});

const creacionUsuario = require('./crearUsuario');
app.use('/api', creacionUsuario);

const inicioSesion = require("./iniciarSesion");
app.use('/api', inicioSesion);

const agregacionFavoritas = require("./agregarFavorita");
app.use('/api', agregacionFavoritas);

const obtencionFavoritas = require("./obtenerFavoritas");
app.use('/api', obtencionFavoritas);

const eliminacionFavorita = require("./quitarFavorita");
app.use('/api', eliminacionFavorita);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`El servidor está corriendo en http://localhost:${port}`);
});

