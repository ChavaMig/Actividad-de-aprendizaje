const httpMocks = require('node-mocks-http');
const { describe, it, expect, afterEach } = require('@jest/globals');

// Mock del service
jest.mock('../../services/pilotos.service');
const pilotosService = require('../../services/pilotos.service');

// Datos de prueba
const {
  mockPilotoArray,
  mockPilotoToCreate,
  mockPilotoCreated
} = require('./mocks/pilotos');

// Importa el controller 
const {
  getPilotos,
  getPiloto,
  postPiloto,
  putPiloto,
  deletePiloto
} = require('../../controller/pilotos.controller');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Pilotos Controller (unit)', () => {
  describe('GET /pilotos', () => {
    it('should get all pilotos', async () => {
      pilotosService.findAll.mockResolvedValue(mockPilotoArray);
      const req = httpMocks.createRequest();
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await getPilotos(req, res);

      expect(pilotosService.findAll).toHaveBeenCalledWith(req.app.db);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().length).toBe(mockPilotoArray.length);
    });
  });

  describe('POST /pilotos', () => {
    it('should create a new piloto', async () => {
      pilotosService.create.mockResolvedValue(mockPilotoCreated);
      const req = httpMocks.createRequest({ body: mockPilotoToCreate });
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await postPiloto(req, res);

      expect(pilotosService.create).toHaveBeenCalledWith(req.app.db, mockPilotoToCreate);
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual(mockPilotoCreated);
    });

    it('validation should fail because nombre is mandatory', async () => {
      const req = httpMocks.createRequest({
        body: { nacionalidad: 'Italia', edad: 26, moto_id: 1 }
      });
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await postPiloto(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        status: 'bad-request',
        message: 'Faltan campos obligatorios'
      });
    });
  });

  describe('GET /pilotos/:id', () => {
    it('should return one piloto if exists', async () => {
      pilotosService.findById.mockResolvedValue(mockPilotoArray[0]);
      const req = httpMocks.createRequest({ params: { id: '1' } });
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await getPiloto(req, res);

      expect(pilotosService.findById).toHaveBeenCalledWith(req.app.db, '1');
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockPilotoArray[0]);
    });

    it('should 404 if piloto not found', async () => {
      pilotosService.findById.mockResolvedValue(null);
      const req = httpMocks.createRequest({ params: { id: '999' } });
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await getPiloto(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toHaveProperty('status', 'not-found');
    });

    it('should 404 if id param is missing', async () => {
      const req = httpMocks.createRequest({ params: {} });
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await getPiloto(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toHaveProperty('status', 'not-found');
    });
  });

  describe('PUT /pilotos/:id', () => {
    it('should update an existing piloto (204)', async () => {
      pilotosService.update.mockResolvedValue(1);
      const req = httpMocks.createRequest({
        params: { id: '1' },
        body: { nombre: 'Nuevo', nacionalidad: 'X', edad: 40, moto_id: 2 }
      });
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await putPiloto(req, res);

      expect(pilotosService.update).toHaveBeenCalledWith(
        req.app.db,
        '1',
        { nombre: 'Nuevo', nacionalidad: 'X', edad: 40, moto_id: 2 }
      );
      expect(res.statusCode).toBe(204);
    });

    it('should return 404 when updating non-existent piloto', async () => {
      pilotosService.update.mockResolvedValue(0);
      const req = httpMocks.createRequest({
        params: { id: '999' },
        body: { nombre: 'X', nacionalidad: 'Y', edad: 20, moto_id: 1 }
      });
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await putPiloto(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toHaveProperty('status', 'not-found');
    });
  });

  describe('DELETE /pilotos/:id', () => {
    it('should delete an existing piloto (204)', async () => {
      pilotosService.remove.mockResolvedValue(1);
      const req = httpMocks.createRequest({ params: { id: '1' } });
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await deletePiloto(req, res);

      expect(pilotosService.remove).toHaveBeenCalledWith(req.app.db, '1');
      expect(res.statusCode).toBe(204);
    });

    it('should return 404 when deleting non-existent piloto', async () => {
      pilotosService.remove.mockResolvedValue(0);
      const req = httpMocks.createRequest({ params: { id: '999' } });
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await deletePiloto(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toHaveProperty('status', 'not-found');
    });
  });
});
