// src/app.js

const express = require('express');
const cors = require('cors');
const knex = require('knex');

// Configuración y métricas
const { config } = require('./config/configuration');
const promClient = require('prom-client');
const {
  httpRequestDurationSeconds,
  httpRequestsTotal,
  inFlightRequests
} = require('./config/metrics');

// Rutas
const motosRoutes = require('./route/motos');

const app = express();
app.use(cors());
app.use(express.json());

// ——— Prometheus metrics ———
promClient.collectDefaultMetrics();
app.use((req, res, next) => {
  inFlightRequests.inc();
  const end = httpRequestDurationSeconds.startTimer();
  const method = req.method;
  const path = req.route ? req.route.path : req.path;

  res.on('finish', () => {
    const code = res.statusCode;
    end({ method, path, code });
    httpRequestsTotal.inc({ method: method.toLowerCase(), path, code });
    inFlightRequests.dec();
  });

  next();
});

// Endpoint para métricas
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// ——— Inicialización de la base de datos ———
const db = knex({
  client: config.db.client,
  connection:
    config.db.client === 'sqlite3'
      ? { filename: config.db.filename }
      : {
          host:     config.db.host,
          user:     config.db.user,
          password: config.db.password,
          database: config.db.database
        },
  useNullAsDefault: config.db.client === 'sqlite3'
});

// ——— Inyectar db en cada petición ———
app.use((req, res, next) => {
  req.app = { db };
  next();
});

// ——— Ruta raíz de bienvenida ———
app.get('/', (req, res) => {
  res.send('🚀 API de Motos: usa /motos o /metrics');
});

// ——— Montaje de rutas de motos ———
app.use('/motos', motosRoutes);

// ——— Arranque del servidor sólo si se ejecuta directamente ———
if (require.main === module) {
  const PORT = process.env.PORT || config.service.port;
  app.listen(PORT, () => {
    console.log(`El backend ha iniciado en el puerto ${PORT}`);
  });
}

// Export para tests
module.exports = { app, db };
