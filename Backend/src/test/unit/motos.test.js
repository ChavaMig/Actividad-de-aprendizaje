// Backend/src/test/unit/motos.test.js

const httpMocks = require('node-mocks-http');
const { describe, it, expect, afterEach } = require('@jest/globals');

// Mockeamos el service
jest.mock('../../services/motos.service');
const motosService = require('../../services/motos.service');

// Nuestros datos de prueba
const { mockMotoArray, mockMotoToCreate, mockMotoCreated } =
  require('./mocks/motos');

// Importamos el controller desde src/controller (singular)
const { getMotos, postMoto } = require('../../controller/motos.controller');

afterEach(() => {
  jest.clearAllMocks();
});

describe('motos', () => {
  describe('GET /motos', () => {
    it('should get all motos', async () => {
      motosService.findAll.mockResolvedValue(mockMotoArray);

      const req = httpMocks.createRequest();
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await getMotos(req, res);

      expect(motosService.findAll).toHaveBeenCalledWith(req.app.db);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().length).toBe(mockMotoArray.length);
    });
  });

  describe('POST /motos', () => {
    it('should create a new moto', async () => {
      motosService.create.mockResolvedValue(mockMotoCreated);

      const req = httpMocks.createRequest({ body: mockMotoToCreate });
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await postMoto(req, res);

      expect(motosService.create).toHaveBeenCalledWith(
        req.app.db,
        mockMotoToCreate
      );
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual(mockMotoCreated);
    });

    it('validation should fail because modelo is mandatory', async () => {
      const req = httpMocks.createRequest({
        body: { marca: 'Honda', año: 2019, tipo: 'Naked' }
      });
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await postMoto(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        status: 'bad-request',
        message: 'modelo field is mandatory'
      });
    });

    it('validation should fail because año must be a positive number', async () => {
      const req = httpMocks.createRequest({
        body: { modelo: 'Test', marca: 'Test', año: 0, tipo: 'Test' }
      });
      req.app = { db: {} };
      const res = httpMocks.createResponse();

      await postMoto(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        status: 'bad-request',
        message: 'año must be a positive number'
      });
    });
  });
});
