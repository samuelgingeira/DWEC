const Libro = require('../models/libroModel');
const Prestamo = require('../models/prestamoModel');

exports.formulario = (req, res) => {
  res.render('formularioPrestamo', {
    libro_id: req.params.libro_id
  });
};

exports.prestar = async (req, res) => {
  const { libro_id, nombre, fecha_devolucion } = req.body;

  await Prestamo.crearPrestamo([
    libro_id,
    nombre,
    new Date(),
    fecha_devolucion
  ]);

  await Libro.updateEstado(libro_id, 'Prestado');
  res.redirect(`/libro/${libro_id}`);
};

exports.devolver = async (req, res) => {
  const { libro_id } = req.params;

  await Prestamo.registrarDevolucion(libro_id);
  await Libro.updateEstado(libro_id, 'Disponible');

  res.redirect(`/libro/${libro_id}`);
};
