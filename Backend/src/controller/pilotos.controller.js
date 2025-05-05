const {
    findAll,
    findById,
    create,
    update,
    remove
  } = require('../services/pilotos.service');
  
  /* GET todos los pilotos */
  const getPilotos = async (req, res) => {
    try {
      const pilotos = await findAll(req.app.db);
      res.status(200).json(pilotos);
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  };
  
  /* GET pilotos */
  const getPiloto = async (req, res) => {
    const { id } = req.params;
    try {
      const piloto = await findById(req.app.db, id);
      if (!piloto) {
        return res.status(404).json({ status: 'not-found', message: 'Piloto no encontrado' });
      }
      res.status(200).json(piloto);
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  };
  
  /* POST pilotos */
  const postPiloto = async (req, res) => {
    const { nombre, nacionalidad, edad, moto_id } = req.body;
  
    if (!nombre || !nacionalidad || typeof edad !== 'number') {
      return res.status(400).json({ status: 'bad-request', message: 'Faltan campos obligatorios' });
    }
  
    try {
      const nuevo = await create(req.app.db, { nombre, nacionalidad, edad, moto_id });
      res.status(201).json(nuevo);
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  };
  
  /* PUT pilotos */
  const putPiloto = async (req, res) => {
    const { id } = req.params;
    const { nombre, nacionalidad, edad, moto_id } = req.body;
  
    try {
      const updated = await update(req.app.db, id, { nombre, nacionalidad, edad, moto_id });
      if (!updated) {
        return res.status(404).json({ status: 'not-found', message: 'Piloto no encontrado' });
      }
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  };
  
  /* DELETE piloto */
  const deletePiloto = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deleted = await remove(req.app.db, id);
      if (!deleted) {
        return res.status(404).json({ status: 'not-found', message: 'Piloto no encontrado' });
      }
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  };
  
  module.exports = {
    getPilotos,
    getPiloto,
    postPiloto,
    putPiloto,
    deletePiloto
  };
  