// Obtener todos los pilotos
async function findAll(db) {
    return db('pilotos').select('*');
  }
  
  // Obtener piloto por ID
  async function findById(db, id) {
    return db('pilotos').where({ id }).first();
  }
  
  // Crear nuevo piloto
  async function create(db, piloto) {
    const [insertedId] = await db('pilotos').insert(piloto);
    return findById(db, insertedId);
  }
  
  // Actualizar piloto
  async function update(db, id, data) {
    return db('pilotos').where({ id }).update(data);
  }
  
  // Eliminar piloto
  async function remove(db, id) {
    return db('pilotos').where({ id }).del();
  }
  
  module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
  };
  