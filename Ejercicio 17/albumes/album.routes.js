const express = require('express');
const router = express.Router();
const controller = require('./album.controller');

router.get('/albumes', controller.list);
router.get('/album/form', controller.form);
router.get('/album/form/:id', controller.form);
router.post('/album/save', controller.save);
router.get('/album/delete/:id', controller.delete);

module.exports = router;
