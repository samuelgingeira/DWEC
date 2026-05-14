const express = require('express');
const router = express.Router();

const Autor = require('../models/Autor');
const Libro = require('../models/Libro');


router.get('/', async (req, res) => {

    try {

        const filtro = {};

        if (req.query.nacionalidad) {
            filtro.nacionalidad = req.query.nacionalidad;
        }

        const autores = await Autor.find(filtro);

        res.json(autores);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });
    }
});


router.get('/:id', async (req, res) => {

    try {

        const autor = await Autor.findById(req.params.id);

        res.json(autor);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });
    }
});


router.post('/', async (req, res) => {

    try {

        const nuevoAutor = new Autor(req.body);

        const autorGuardado = await nuevoAutor.save();

        res.status(201).json(autorGuardado);

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });
    }
});


router.put('/:id', async (req, res) => {

    try {

        const autorActualizado = await Autor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(autorActualizado);

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });
    }
});


router.delete('/:id', async (req, res) => {

    try {

        await Autor.findByIdAndDelete(req.params.id);

        res.json({
            mensaje: 'Autor eliminado'
        });

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });
    }
});


router.get('/:id/libros', async (req, res) => {

    try {

        const autor = await Autor.findById(req.params.id);

        const libros = await Libro.find({
            autor: autor.referencia
        });

        res.json(libros);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });
    }
});

module.exports = router;