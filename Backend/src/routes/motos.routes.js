const express = require('express');
const router = express.Router();
const motosController = require('../controllers/motos.controller');

// Listar todas las motos
router.get('/', motosController.getAllMotos);

// Obtener moto por modelo
router.get('/:modelo', motosController.getMotoByModelo);

// Crear nueva moto
router.post('/', motosController.createMoto);

// Actualizar moto existente
router.put('/:modelo', motosController.updateMoto);

// Eliminar moto
router.delete('/:modelo', motosController.deleteMoto);

module.exports = router;
