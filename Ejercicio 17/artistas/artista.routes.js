const express = require('express');
const router = express.Router();
const controller = require('./artista.controller');

router.get('/artistas', controller.list);
router.get('/artista/:id', controller.detail);
router.get('/artista/form', controller.form);
router.get('/artista/form/:id', controller.form);
router.post('/artista/save', controller.save);
router.get('/artista/delete/:id', controller.delete);

module.exports = router;
