/*
require('dotenv').config();              // 1. Carga variables de entorno
const express = require('express');      // 2. Importa express
const session = require('express-session');  /////////////////////////////////////////////////
const app = express();                   // 3. Crea app express

app.use(express.json()); /////////////////////////////////////////

const PORT = process.env.PORT || 3000;      // 4. Middleware para leer JSON
const cors = require('cors');
app.use(cors());
app.use(express.json()); // <- necesario para que req.body funcione

const userRoutes = require('./routes/user.routes');

// Middlewares
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes); // 5. Monta las rutas

// Inicia servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`); // 6. Inicia servidor
});
*/

require('dotenv').config();             // 1. Carga variables de entorno
const express = require('express');     // 2. Importa express
const session = require('express-session'); // 3. Importa express-session
const cors = require('cors');
const userRoutes = require('./routes/user.routes');

const app = express();                  // 4. Crea la app de express

// 5. Configura CORS
app.use(cors({
  origin: 'http://localhost:3001', // direccio  de mi frontend
  credentials: true               // Para permitir el uso de cookies/sesiones
}));

// 6. Habilita JSON en requests
app.use(express.json());

// 7. Configura sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'admin', // Cámbiala en producción por una más segura
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true si usas HTTPS, // debe ser false si usas HTTP (no HTTPS)
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2 // 2 horas o 30 minutos (opcional)
  }
}));

// 8. Rutas
app.use('/api/users', userRoutes);

// 9. Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
