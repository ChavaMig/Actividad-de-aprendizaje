// Backend/src/test/integration/motos.integration.test.js

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const { app, db } = require('../../app');

describe('Motos API Integration', () => {
  before(async () => {
    // Deja la tabla limpia
    await db('motos').del();
  });

  describe('GET /motos', () => {
    it('should return empty array initially', async () => {
      const res = await chai.request(app).get('/motos');
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array').that.is.empty;
    });
  });

  describe('POST /motos', () => {
    it('should create a new moto and return it (201)', async () => {
      const nueva = { modelo: 'TestMoto', marca: 'Test', año: 2025, tipo: 'TestType' };
      const res = await chai.request(app)
        .post('/motos')
        .send(nueva);
      expect(res).to.have.status(201);
      expect(res.body).to.include(nueva);
    });

    it('should return 400 on missing required field', async () => {
      const bad = { marca: 'NoModelo', año: 2025, tipo: 'X' };
      const res = await chai.request(app)
        .post('/motos')
        .send(bad);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('status', 'bad-request');
      expect(res.body).to.have.property('message').that.includes('modelo');
    });
  });

  describe('PUT /motos/:modelo', () => {
    it('should update an existing moto (204)', async () => {
      const updated = { modelo: 'TestMoto', marca: 'Updated', año: 2026, tipo: 'X' };
      const res = await chai.request(app)
        .put('/motos/TestMoto')
        .send(updated);
      expect(res).to.have.status(204);

      const get = await chai.request(app).get('/motos/TestMoto');
      expect(get).to.have.status(200);
      expect(get.body.marca).to.equal('Updated');
    });

    it('should return 404 for non-existent moto', async () => {
      const res = await chai.request(app)
        .put('/motos/NoExiste')
        .send({ modelo: 'NoExiste', marca: 'X', año: 1111, tipo: 'Y' });
      expect(res).to.have.status(404);
    });
  });

  describe('DELETE /motos/:modelo', () => {
    it('should delete an existing moto (204)', async () => {
      const res = await chai.request(app).delete('/motos/TestMoto');
      expect(res).to.have.status(204);

      await chai.request(app)
        .get('/motos/TestMoto')
        .then(r => expect(r).to.have.status(404));
    });

    it('should return 404 when deleting non-existent moto', async () => {
      const res = await chai.request(app).delete('/motos/NoExiste');
      expect(res).to.have.status(404);
    });
  });
});
