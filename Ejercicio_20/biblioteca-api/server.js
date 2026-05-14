require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const autoresRoutes = require('./routes/autores');
const librosRoutes = require('./routes/libros');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB conectada');
})
.catch((error) => {
    console.log(error);
});

app.use('/api/autores', autoresRoutes);
app.use('/api/libros', librosRoutes);

app.get('/', (req, res) => {
    res.send('API Biblioteca funcionando');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en puerto ${PORT}`);
});