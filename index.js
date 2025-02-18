const express = require('express');
const app = express();
const port = 8080; // El puerto en el que se ejecutará tu servidor
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.URI

const corsOptions = {
  origin: "*", // Permite todas las solicitudes desde cualquier origen
  optionsSuccessStatus: 200, // Opcional, define el código de estado para las solicitudes pre-vuelo
};

app.use(cors(corsOptions));



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend funcionando');
});

// Rutas de ejemplo
app.get('/ping', (req, res) => {
  res.status(200).send('Servidor en funcionamiento'); // Responder con un estado 200 OK
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
  console.log(`El servidor está corriendo :${port}`);
});

