const express = require('express');
const router = express.Router();
const controller = require('../controllers/libroController');

router.get('/', controller.index);
router.get('/prestados', controller.prestados);
router.get('/vencidos', controller.vencidos);
router.get('/libro/:id', controller.detalle);
router.get('/prestamos/usuario', controller.prestamosUsuario);

module.exports = router;
