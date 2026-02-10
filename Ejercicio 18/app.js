require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();

const logStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'),
  { flags: 'a' }
);
app.use(morgan('combined', { stream: logStream }));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/', require('./routes/libroRoutes'));
app.use('/prestamo', require('./routes/prestamoRoutes'));

app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
