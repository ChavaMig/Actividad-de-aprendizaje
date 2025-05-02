'use strict';
const promClient = require('prom-client');

const httpRequestDurationSeconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'path', 'code'],
});

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'How many HTTP requests processed, partitioned by status code, method, and HTTP path',
  labelNames: ['method', 'path', 'code'],
});

const inFlightRequests = new promClient.Gauge({
  name: 'http_requests_in_flight',
  help: 'Current number of in-flight HTTP requests',
});

module.exports = {
  httpRequestDurationSeconds,
  httpRequestsTotal,
  inFlightRequests,
};
