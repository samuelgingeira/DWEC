const Libro = require('../models/libroModel');
const Prestamo = require('../models/prestamoModel');

exports.index = async (req, res) => {
  const [libros] = await Libro.getAll();
  res.render('index', { libros });
};

exports.prestados = async (req, res) => {
  const [libros] = await Libro.getPrestados();
  res.render('prestados', { libros });
};

exports.vencidos = async (req, res) => {
  const [libros] = await Libro.getVencidos();
  res.render('vencidos', { libros });
};

exports.detalle = async (req, res) => {
  const { id } = req.params;

  const [[libro]] = await Libro.getById(id);
  const [historial] = await Prestamo.getHistorialLibro(id);
  const [[prestamoActivo]] = await Prestamo.getActivoPorLibro(id);

  res.render('libroDetalle', {
    libro,
    historial,
    prestamoActivo
  });
};

exports.prestamosUsuario = async (req, res) => {
  const nombre = req.query.nombre;
  const [prestamos] = await Prestamo.getPorUsuario(nombre);

  res.render('prestamosUsuario', {
    nombre,
    prestamos
  });
};
