// Backend/src/test/unit/motos.test.js

const httpMocks = require('node-mocks-http');
const { describe, it, expect, afterEach } = require('@jest/globals');

// Mockeamos el service
jest.mock('../../services/motos.service');
const motosService = require('../../services/motos.service');

// Datos de prueba
const {
  mockMotoArray,
  mockMotoToCreate,
  mockMotoCreated
} = require('./mocks/motos');

// Importamos el controller completo
const {
  getMotos,
  getMoto,
  postMoto,
  putMoto,
  deleteMoto
} = require('../../controller/motos.controller');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Motos Controller (unit)', () => {
  describe('GET /motos', () => {
    it('should return empty array initially', async () => {
      motosService.findAll.mockResolvedValue([]);
      const req = httpMocks.createRequest();
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await getMotos(req, res);

      expect(motosService.findAll).toHaveBeenCalledWith(req.app.db);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual([]);
    });
  });

  describe('GET /motos/:modelo', () => {
    it('should 200 and return one moto if exists', async () => {
      motosService.findByModelo.mockResolvedValue(mockMotoArray[0]);
      const req = httpMocks.createRequest({ params: { modelo: 'Yamaha R1' } });
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await getMoto(req, res);

      expect(motosService.findByModelo).toHaveBeenCalledWith(req.app.db, 'Yamaha R1');
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockMotoArray[0]);
    });

    it('should 404 if moto not found', async () => {
      motosService.findByModelo.mockResolvedValue(null);
      const req = httpMocks.createRequest({ params: { modelo: 'NoExiste' } });
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await getMoto(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toHaveProperty('status', 'not-found');
    });
  });

  describe('POST /motos', () => {
    it('should create a new moto', async () => {
      motosService.create.mockResolvedValue(mockMotoCreated);
      const req = httpMocks.createRequest({ body: mockMotoToCreate });
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await postMoto(req, res);

      expect(motosService.create).toHaveBeenCalledWith(req.app.db, mockMotoToCreate);
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual(mockMotoCreated);
    });

    it('should return 400 on missing required field', async () => {
      const req = httpMocks.createRequest({ body: { marca: 'NoModelo', año: 2025, tipo: 'X' } });
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await postMoto(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        status: 'bad-request',
        message: 'modelo field is mandatory'
      });
    });
  });

  describe('PUT /motos/:modelo', () => {
    it('should 204 on successful update', async () => {
      motosService.update.mockResolvedValue(1);
      const req = httpMocks.createRequest({
        params: { modelo: 'Yamaha R1' },
        body: mockMotoToCreate
      });
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await putMoto(req, res);

      expect(motosService.update).toHaveBeenCalledWith(req.app.db, 'Yamaha R1', mockMotoToCreate);
      expect(res.statusCode).toBe(204);
    });

    it('should 404 if no rows updated', async () => {
      motosService.update.mockResolvedValue(0);
      const req = httpMocks.createRequest({
        params: { modelo: 'NoExiste' },
        body: mockMotoToCreate
      });
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await putMoto(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toHaveProperty('status', 'not-found');
    });
  });

  describe('DELETE /motos/:modelo', () => {
    it('should 204 on successful delete', async () => {
      motosService.remove.mockResolvedValue(1);
      const req = httpMocks.createRequest({ params: { modelo: 'Yamaha R1' } });
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await deleteMoto(req, res);

      expect(motosService.remove).toHaveBeenCalledWith(req.app.db, 'Yamaha R1');
      expect(res.statusCode).toBe(204);
    });

    it('should 404 if nothing deleted', async () => {
      motosService.remove.mockResolvedValue(0);
      const req = httpMocks.createRequest({ params: { modelo: 'NoExiste' } });
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await deleteMoto(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toHaveProperty('status', 'not-found');
    });
  });
});
