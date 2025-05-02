// Backend/src/route/motos.js

const express = require('express');

const {
  getMotos,
  getMoto,
  postMoto,
  putMoto,
  deleteMoto
} = require('../controller/motos.controller');

const router = express.Router();


router.get('/', getMotos);
router.get('/:modelo', getMoto);
router.post('/', postMoto);
router.put('/:modelo', putMoto);
router.delete('/:modelo', deleteMoto);

module.exports = router;
