async function findAll(db) {
  return db('motos').select('*');
}

async function findByModelo(db, modelo) {
  return db('motos')
    .select('*')
    .where({ modelo })
    .first();
}

async function create(db, motoData) {
  await db('motos').insert(motoData);
  return findByModelo(db, motoData.modelo);
}

async function update(db, modeloOriginal, datosActualizados) {
  return db('motos')
    .where({ modelo: modeloOriginal })
    .update(datosActualizados);
}

async function remove(db, modelo) {
  return db('motos')
    .where({ modelo })
    .del();
}

module.exports = {
  findAll,
  findByModelo,
  create,
  update,
  remove
};
