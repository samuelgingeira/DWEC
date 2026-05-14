const express = require('express');
const router = express.Router();

const Libro = require('../models/Libro');


router.get('/', async (req, res) => {

    try {

        let consulta = Libro.find();

        if (req.query.sort === 'titulo') {

            consulta = consulta.sort({
                titulo: 1
            });
        }

        const libros = await consulta;

        res.json(libros);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });
    }
});


// GET libro por ID
router.get('/:id', async (req, res) => {

    try {

        const libro = await Libro.findById(req.params.id);

        res.json(libro);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });
    }
});


router.post('/', async (req, res) => {

    try {

        const nuevoLibro = new Libro(req.body);

        const libroGuardado = await nuevoLibro.save();

        res.status(201).json(libroGuardado);

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });
    }
});


router.put('/:id', async (req, res) => {

    try {

        const libroActualizado = await Libro.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(libroActualizado);

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });
    }
});


router.delete('/:id', async (req, res) => {

    try {

        await Libro.findByIdAndDelete(req.params.id);

        res.json({
            mensaje: 'Libro eliminado'
        });

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });
    }
});

module.exports = router;