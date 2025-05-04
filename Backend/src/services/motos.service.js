/**
 * Obtener todas las motos
 * @param {Knex} db
 * @returns {Promise<Array>}
 */
async function findAll(db) {
  return db('motos').select('*');
}

/**
 * Busca una moto por su modelo
 * @param {Knex} db
 * @param {string} modelo
 * @returns {Promise<Object|null>}
 */
async function findByModelo(db, modelo) {
  return db('motos')
    .select('*')
    .where({ modelo })
    .first();
}

/**
 * Crea una nueva moto y devuelve la moto creada
 * @param {Knex} db
 * @param {Object} motoData
 * @returns {Promise<Object>}
 */
async function create(db, motoData) {
  await db('motos').insert(motoData);
  return findByModelo(db, motoData.modelo);
}

/**
 * Actualiza una moto existente por su modelo original
 * @param {Knex} db
 * @param {string} modeloOriginal
 * @param {Object} datosActualizados
 * @returns {Promise<number>} número de filas afectadas
 */
async function update(db, modeloOriginal, datosActualizados) {
  return db('motos')
    .where({ modelo: modeloOriginal })
    .update(datosActualizados);
}

/**
 * Elimina una moto por su modelo
 * @param {Knex} db
 * @param {string} modelo
 * @returns {Promise<number>} número de filas eliminadas
 */
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
