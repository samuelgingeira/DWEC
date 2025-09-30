
const libros = [
  { id: 1, titulo: "Introducción a JavaScript", autor: "Ana Pérez", paginas: 320 },
  { id: 2, titulo: "Historias de la Tierra", autor: "Miguel Santos", paginas: 210 },
  { id: 3, titulo: "Filosofía en 100 páginas", autor: "Laura Méndez", paginas: 96 },
  { id: 4, titulo: "Algoritmos y Estructuras", autor: "Carlos Ruiz", paginas: 480 },
  { id: 5, titulo: "Cocina para todos", autor: "Marta Blanco", paginas: 156 },
  { id: 6, titulo: "Viajes insólitos", autor: "Elena Rojo", paginas: 274 },
  { id: 7, titulo: "Pequeñas historias", autor: "Ricardo Díaz", paginas: 132 },
  { id: 8, titulo: "La ciudad que canta", autor: "Sofía Marín", paginas: 360 },
  { id: 9, titulo: "Diseño y UX", autor: "Paolo Ferrer", paginas: 220 },
  { id: 10, titulo: "Microcuentos", autor: "Vera Costa", paginas: 88 }
];

function agregarLibro(nuevoLibro) {
  libros.push(nuevoLibro);
}

function obtenerLibros() {
  return [...libros];
}

function buscarLibro(id) {
  return libros.find(l => l.id === id) || null;
}

function eliminarLibro(id) {
  const idx = libros.findIndex(l => l.id === id);
  if (idx !== -1) {
    const eliminado = libros.splice(idx, 1)[0];
    return eliminado;
  }
  return null;
}

function calcularTotalPaginas() {
  return libros.reduce((acc, l) => acc + l.paginas, 0);
}

function ordenarPorPaginas() {
  return [...libros].sort((a, b) => a.paginas - b.paginas);
}

function hayLibrosLargos(limitePaginas) {
  return libros.some(l => l.paginas > limitePaginas);
}

function todosSonLibrosCortos(limitePaginas) {
  return libros.every(l => l.paginas < limitePaginas);
}

export {
  agregarLibro,
  obtenerLibros,
  buscarLibro,
  eliminarLibro,
  calcularTotalPaginas,
  ordenarPorPaginas,
  hayLibrosLargos,
  todosSonLibrosCortos
};
