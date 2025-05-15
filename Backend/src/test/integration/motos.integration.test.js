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
        { modelo: 'Kawasaki Ninja ZX-6R', marca: 'Kawasaki', año: 2001, tipo: 'Deportiva' }
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
          expect(res.body).to.have.lengthOf(2);
          expect(res.body[0]).to.have.property('modelo', 'Honda CBR600RR');
          expect(res.body[1]).to.have.property('modelo', 'Kawasaki Ninja ZX-6R');
          done();
        });
    });
  });

  describe('POST /motos', () => {
    it('should register a new moto', (done) => {
      chai.request(app)
        .post('/motos')
        .send({ modelo: 'Yamaha YZF-R6', marca: 'Yamaha', año: 2022, tipo: 'Deportiva' })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('id');
          expect(res.body).to.have.property('modelo', 'Yamaha YZF-R6');
          done();
        });
    });

    it('validation should fail because modelo is mandatory', (done) => {
      chai.request(app)
        .post('/motos')
        .send({ marca: 'Suzuki', año: 2022, tipo: 'Deportiva' })
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
      db('motos').insert({ modelo: 'Aprilia RSV4', marca: 'Aprilia', año: 2005, tipo: 'Deportiva' })
        .then(() => {
          chai.request(app)
            .put('/motos/Aprilia RSV4')
            .send({ modelo: 'Aprilia RSV4', marca: 'Aprilia', año: 2006, tipo: 'Superbike' })
            .end((_, res) => {
              res.should.have.status(204);
              chai.request(app)
                .get('/motos/Aprilia RSV4')
                .end((__, r2) => {
                  r2.should.have.status(200);
                  expect(r2.body.marca).to.equal('Aprilia');
                  expect(r2.body.tipo).to.equal('Superbike');
                  done();
                });
            });
        })
        .catch(done);
    });

    it('should return 404 for non-existent moto', (done) => {
      chai.request(app)
        .put('/motos/NonExistentModel')
        .send({ modelo: 'NonExistentModel', marca: 'X', año: 1111, tipo: 'Y' })
        .end((_, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('DELETE /motos/:modelo', () => {
    it('should delete an existing moto', (done) => {
      db('motos').insert({ modelo: 'KTM 1290 Super Duke R', marca: 'KTM', año: 1999, tipo: 'Naked' })
        .then(() => {
          chai.request(app)
            .delete('/motos/KTM 1290 Super Duke R')
            .end((_, res) => {
              res.should.have.status(204);
              chai.request(app)
                .get('/motos/KTM 1290 Super Duke R')
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
        .delete('/motos/NonExistentModel')
        .end((_, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});
