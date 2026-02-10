const db = require('../config/db');

exports.getAll = () => {
  return db.query('SELECT * FROM libros');
};

exports.getById = (id) => {
  return db.query('SELECT * FROM libros WHERE id = ?', [id]);
};

exports.updateEstado = (id, estado) => {
  return db.query(
    'UPDATE libros SET estado = ? WHERE id = ?',
    [estado, id]
  );
};

exports.getPrestados = () => {
  return db.query(`
    SELECT l.*, p.nombre_prestatario, p.fecha_devolucion
    FROM libros l
    JOIN prestamos p ON l.id = p.libro_id
    WHERE l.estado = 'Prestado' AND p.fecha_entrega IS NULL
  `);
};

exports.getVencidos = () => {
  return db.query(`
    SELECT l.*, p.nombre_prestatario, p.fecha_devolucion
    FROM libros l
    JOIN prestamos p ON l.id = p.libro_id
    WHERE p.fecha_entrega IS NULL
    AND p.fecha_devolucion < CURDATE()
  `);
};
