// Backend/src/test/integration/motos.integration.test.js

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const { app, db } = require('../../app');

chai.use(chaiHttp);
chai.should();

describe('motos', () => {
  before((done) => {
    db.schema.hasTable('motos')
      .then(exists => {
        if (!exists) {
          return db.schema.createTable('motos', table => {
            table.increments('id').primary();
            table.string('modelo').notNullable().unique();
            table.string('marca').notNullable();
            table.integer('año').notNullable();
            table.string('tipo').notNullable();
          });
        }
      })
      .then(() => db('motos').del())
      .then(() => db('motos').insert([
        { modelo: 'Honda CBR600RR', marca: 'Honda', año: 2000, tipo: 'Deportiva' },
        { modelo: 'Kawashaki Ninja', marca: 'Kawashaki', año: 2001, tipo: 'Deportiva' }
      ]))
      .then(() => done())
      .catch(done);
  });

  describe('GET /motos', () => {
    it('should get all motos', (done) => {
      chai.request(app)
        .get('/motos')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          // Validar que hay exactamente 2 motos
          expect(res.body).to.have.lengthOf(2);
          // Comprobar modelos según seed
          expect(res.body[0]).to.have.property('modelo', 'Honda CBR600RR');
          expect(res.body[1]).to.have.property('modelo', 'Kawashaki Ninja');
          done();
        });
    });
  });

  describe('POST /motos', () => {
    it('should register a new moto', (done) => {
      chai.request(app)
        .post('/motos')
        .send({ modelo: 'NewMoto', marca: 'New', año: 2022, tipo: 'Z' })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('id');
          expect(res.body).to.have.property('modelo', 'NewMoto');
          done();
        });
    });

    it('validation should fail because modelo is mandatory', (done) => {
      chai.request(app)
        .post('/motos')
        .send({ marca: 'NoMod', año: 2022, tipo: 'Z' })
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.status).to.equal('bad-request');
          expect(res.body.message).to.include('modelo');
          done();
        });
    });
  });

  describe('PUT /motos/:modelo', () => {
    it('should update an existing moto', (done) => {
      db('motos').insert({ modelo: 'ToUpd', marca: 'A', año: 2005, tipo: 'A' })
        .then(() => {
          chai.request(app)
            .put('/motos/ToUpd')
            .send({ modelo: 'ToUpd', marca: 'B', año: 2006, tipo: 'B' })
            .end((_, res) => {
              res.should.have.status(204);
              chai.request(app)
                .get('/motos/ToUpd')
                .end((__, r2) => {
                  r2.should.have.status(200);
                  expect(r2.body.marca).to.equal('B');
                  done();
                });
            });
        })
        .catch(done);
    });

    it('should return 404 for non-existent moto', (done) => {
      chai.request(app)
        .put('/motos/NoExiste')
        .send({ modelo: 'NoExiste', marca: 'X', año: 1111, tipo: 'Y' })
        .end((_, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('DELETE /motos/:modelo', () => {
    it('should delete an existing moto', (done) => {
      db('motos').insert({ modelo: 'ToDel', marca: 'X', año: 1999, tipo: 'X' })
        .then(() => {
          chai.request(app)
            .delete('/motos/ToDel')
            .end((_, res) => {
              res.should.have.status(204);
              chai.request(app)
                .get('/motos/ToDel')
                .end((__, r2) => {
                  r2.should.have.status(404);
                  done();
                });
            });
        })
        .catch(done);
    });

    it('should return 404 when deleting non-existent moto', (done) => {
      chai.request(app)
        .delete('/motos/NoExiste')
        .end((_, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});