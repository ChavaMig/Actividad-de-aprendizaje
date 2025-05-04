// src/app.js

const express = require('express');
const cors = require('cors');
const promClient = require('prom-client');

const { config } = require('./config/configuration');
const {
  httpRequestDurationSeconds,
  httpRequestsTotal,
  inFlightRequests
} = require('./config/metrics');

// Importamos la conexión ya configurada
const db = require('./config/database');

// Rutas
const motosRoutes   = require('./route/motos');
const pilotosRoutes = require('./route/pilotos');

const app = express();

// CORS
const corsOptions = {
  origin: 'http://localhost:1234',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));
app.use(express.json());

// ——— Prometheus metrics ———
promClient.collectDefaultMetrics();
app.use((req, res, next) => {
  inFlightRequests.inc();
  const end = httpRequestDurationSeconds.startTimer();
  const method = req.method;
  const path   = req.route ? req.route.path : req.path;

  res.on('finish', () => {
    const code = res.statusCode;
    end({ method, path, code });
    httpRequestsTotal.inc({ method: method.toLowerCase(), path, code });
    inFlightRequests.dec();
  });

  next();
});

// Métricas expuestas
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// —— Inyectamos la instancia de BD en cada petición ——
app.use((req, res, next) => {
  // Para que tus controllers sigan usando req.app.db:
  req.app.db = db;
  next();
});

// Ruta raíz
app.get('/', (req, res) => {
  res.send('🚀 API de Motos y Pilotos: usa /motos, /pilotos o /metrics');
});

// Montamos rutas
app.use('/motos', motosRoutes);
app.use('/pilotos', pilotosRoutes);

// Arranque del servidor
if (require.main === module) {
  const PORT = process.env.PORT || config.service.port;
  app.listen(PORT, () => {
    console.log(`El backend ha iniciado en el puerto ${PORT}`);
  });
}

module.exports = { app, db };
