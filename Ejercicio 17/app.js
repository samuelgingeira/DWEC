const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const albumRoutes = require('./albumes/album.routes');
const artistaRoutes = require('./artistas/artista.routes');

const app = express();

// Morgan a access.log
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Home
app.get('/', (req, res) => {
  res.render('index');
});

// Rutas
app.use('/', albumRoutes);
app.use('/', artistaRoutes);

// Servidor
app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});
