const express = require('express');
const {
  getPilotos,
  getPiloto,
  postPiloto,
  putPiloto,
  deletePiloto
} = require('../controller/pilotos.controller');

const router = express.Router();

router.get('/', getPilotos);
router.get('/:id', getPiloto);
router.post('/', postPiloto);
router.put('/:id', putPiloto);
router.delete('/:id', deletePiloto);

module.exports = router;
