const motosService = require('../services/motos.service'); 

const getAllMotos = async (req, res) => {
  try {
    const db = req.app.db;
    const motos = await motosService.findAll(db);
    res.status(200).json(motos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMotoByModelo = async (req, res) => {
  try {
    const db = req.app.db;
    const { modelo } = req.params;
    const moto = await motosService.findByModelo(db, modelo);
    if (!moto) {
      return res.status(404).json({ message: 'Moto no encontrada' });
    }
    res.status(200).json(moto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMoto = async (req, res) => {
  try {
    const db = req.app.db;
    const nuevaMoto = req.body;
    const created = await motosService.create(db, nuevaMoto);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMoto = async (req, res) => {
  try {
    const db = req.app.db;
    const modeloOriginal = req.params.modelo;
    const datosActualizados = req.body;
    const updated = await motosService.update(db, modeloOriginal, datosActualizados);
    if (!updated) {
      return res.status(404).json({ message: 'Moto no encontrada' });
    }
    res.status(200).json({ message: 'Moto actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMoto = async (req, res) => {
  try {
    const db = req.app.db;
    const { modelo } = req.params;
    const deleted = await motosService.remove(db, modelo);
    if (!deleted) {
      return res.status(404).json({ message: 'Moto no encontrada' });
    }
    res.status(200).json({ message: 'Moto eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMotos,
  getMotoByModelo,
  createMoto,
  updateMoto,
  deleteMoto
};
