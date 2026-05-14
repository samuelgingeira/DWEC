const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({

    referencia: String,

    titulo: {
        type: String,
        required: true
    },

    genero: String,

    anyoPublicacion: Number,

    autor: {
        type: String,
        required: true
    },

    imagenUrl: String

});

module.exports = mongoose.model('Libro', libroSchema);