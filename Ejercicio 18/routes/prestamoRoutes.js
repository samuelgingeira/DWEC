const express = require('express');
const router = express.Router();
const controller = require('../controllers/prestamoController');

router.get('/formulario/:libro_id', controller.formulario);
router.post('/nuevo', controller.prestar);
router.post('/devolver/:libro_id', controller.devolver);

module.exports = router;
