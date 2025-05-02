
const {
    findAll,
    findByModelo,
    create,
    update,
    remove
  } = require('../services/motos.service');
  
  /* Devuelve el listado de todas las motos */
  const getMotos = async (req, res) => {
    try {
      const motos = await findAll(req.app.db);
      res.status(200).json(motos);
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  };
  
  /* Devuelve una sola moto por su modelo*/
  const getMoto = async (req, res) => {
    const { modelo } = req.params;
  
    if (!modelo) {
      return res.status(400).json({
        status: 'bad-request',
        message: 'modelo parameter is mandatory'
      });
    }
  
    try {
      const moto = await findByModelo(req.app.db, modelo);
      if (!moto) {
        return res.status(404).json({
          status: 'not-found',
          message: 'Moto not found'
        });
      }
      res.status(200).json(moto);
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  };
  
  /* Crea una nueva moto */
  const postMoto = async (req, res) => {
    const { modelo, marca, año, tipo } = req.body;
  
    if (!modelo) {
      return res.status(400).json({
        status: 'bad-request',
        message: 'modelo field is mandatory'
      });
    }
    if (!marca) {
      return res.status(400).json({
        status: 'bad-request',
        message: 'marca field is mandatory'
      });
    }
    if (typeof año !== 'number' || año <= 0) {
      return res.status(400).json({
        status: 'bad-request',
        message: 'año must be a positive number'
      });
    }
    if (!tipo) {
      return res.status(400).json({
        status: 'bad-request',
        message: 'tipo field is mandatory'
      });
    }
  
    try {
      const nueva = { modelo, marca, año, tipo };
      const created = await create(req.app.db, nueva);
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  };
  
  /* Actualiza una moto existente*/
  const putMoto = async (req, res) => {
    const modeloOriginal = req.params.modelo;
    const { modelo: modeloNuevo, marca, año, tipo } = req.body;
  
    if (!modeloOriginal) {
      return res.status(400).json({
        status: 'bad-request',
        message: 'modelo parameter is mandatory'
      });
    }
    if (!modeloNuevo) {
      return res.status(400).json({
        status: 'bad-request',
        message: 'modelo field is mandatory'
      });
    }
  
    try {
      const updatedCount = await update(
        req.app.db,
        modeloOriginal,
        { modelo: modeloNuevo, marca, año, tipo }
      );
      if (!updatedCount) {
        return res.status(404).json({
          status: 'not-found',
          message: 'Moto not found'
        });
      }
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  };
  
  /* Elimina una moto por su modelo*/
  const deleteMoto = async (req, res) => {
    const { modelo } = req.params;
  
    if (!modelo) {
      return res.status(400).json({
        status: 'bad-request',
        message: 'modelo parameter is mandatory'
      });
    }
  
    try {
      const deletedCount = await remove(req.app.db, modelo);
      if (!deletedCount) {
        return res.status(404).json({
          status: 'not-found',
          message: 'Moto not found'
        });
      }
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  };
  
  module.exports = {
    getMotos,
    getMoto,
    postMoto,
    putMoto,
    deleteMoto
  };
  