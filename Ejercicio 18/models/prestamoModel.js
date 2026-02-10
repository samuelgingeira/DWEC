const db = require('../config/db');

exports.crearPrestamo = (data) => {
  return db.query(
    `INSERT INTO prestamos 
    (libro_id, nombre_prestatario, fecha_prestamo, fecha_devolucion)
    VALUES (?, ?, ?, ?)`,
    data
  );
};

exports.getHistorialLibro = (libro_id) => {
  return db.query(
    'SELECT * FROM prestamos WHERE libro_id = ?',
    [libro_id]
  );
};

exports.getActivoPorLibro = (libro_id) => {
  return db.query(
    'SELECT * FROM prestamos WHERE libro_id = ? AND fecha_entrega IS NULL',
    [libro_id]
  );
};

exports.registrarDevolucion = (libro_id) => {
  return db.query(
    `UPDATE prestamos 
     SET fecha_entrega = CURDATE()
     WHERE libro_id = ? AND fecha_entrega IS NULL`,
    [libro_id]
  );
};

exports.getPorUsuario = (nombre) => {
  return db.query(
    `SELECT l.titulo, l.autor, p.fecha_devolucion
     FROM prestamos p
     JOIN libros l ON p.libro_id = l.id
     WHERE p.nombre_prestatario = ?
     AND p.fecha_entrega IS NULL`,
    [nombre]
  );
};
