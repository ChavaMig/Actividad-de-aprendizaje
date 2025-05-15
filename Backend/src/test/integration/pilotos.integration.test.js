const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const { app, db } = require('../../app');

chai.use(chaiHttp);
chai.should();

describe('pilotos', () => {
  before((done) => {
    // Asegurar tabla motos
    db.schema.hasTable('motos')
      .then(exists => {
        if (!exists) {
          return db.schema.createTable('motos', t => {
            t.increments('id').primary();
            t.string('modelo').notNullable().unique();
            t.string('marca').notNullable();
            t.integer('año').notNullable();
            t.string('tipo').notNullable();
          });
        }
      })
      // Asegurar tabla pilotos
      .then(() => db.schema.hasTable('pilotos'))
      .then(exists => {
        if (!exists) {
          return db.schema.createTable('pilotos', t => {
            t.increments('id').primary();
            t.string('nombre').notNullable();
            t.string('nacionalidad').notNullable();
            t.integer('edad').notNullable();
            t.integer('moto_id').unsigned()
              .references('id').inTable('motos')
              .onDelete('CASCADE');
          });
        }
      })
      // Limpiar datos antiguos
      .then(() => db('pilotos').del())
      .then(() => db('motos').del())
      // Insertar una moto y usar su ID
      .then(() => db('motos').insert({ modelo: 'Seed1', marca: 'M1', año: 2000, tipo: 'X' }))
      .then(insertIds => {
        const motoId = insertIds[0];
        //  Insertar pilotos con referencia a esa moto
        return db('pilotos').insert([
          { nombre: 'Marc Marquez', nacionalidad: 'ESP', edad: 30, moto_id: motoId },
          { nombre: 'Valentino Rossi', nacionalidad: 'ITA', edad: 40, moto_id: motoId }
        ]);
      })
      .then(() => done())
      .catch(done);
  });

  describe('GET /pilotos', () => {
    it('should get all pilotos', (done) => {
      chai.request(app)
        .get('/pilotos')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          expect(res.body[0]).to.have.property('nombre', 'P1');
          expect(res.body[1]).to.have.property('nombre', 'P2');
          done();
        });
    });
  });

  describe('POST /pilotos', () => {
    it('should register a new piloto', (done) => {
      // obtener moto existente
      db('motos').first('id').then(({ id }) => {
        chai.request(app)
          .post('/pilotos')
          .send({ nombre: 'P3', nacionalidad: 'N3', edad: 28, moto_id: id })
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.have.property('id');
            expect(res.body).to.have.property('nombre', 'P3');
            done();
          });
      });
    });

    it('validation should fail because nombre is mandatory', (done) => {
      db('motos').first('id').then(({ id }) => {
        chai.request(app)
          .post('/pilotos')
          .send({ nacionalidad: 'N4', edad: 20, moto_id: id })
          .end((err, res) => {
            res.should.have.status(400);
            expect(res.body.status).to.equal('bad-request');
            expect(res.body.message).to.equal('Faltan campos obligatorios');
            done();
          });
      });
    });
  });
});
