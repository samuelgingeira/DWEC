
import {
  agregarLibro,
  obtenerLibros,
  buscarLibro,
  eliminarLibro,
  calcularTotalPaginas,
  ordenarPorPaginas,
  hayLibrosLargos,
  todosSonLibrosCortos
} from './biblioteca.js';

console.group("Ejercicios 3.3 - 3.7 - Biblioteca");


console.log("Colección inicial:", obtenerLibros());


const nuevo = { id: 11, titulo: "Node.js práctico", autor: "Diego Martín", paginas: 270 };
agregarLibro(nuevo);
console.log("Tras agregar libro (id 11):", obtenerLibros());

const busqueda = buscarLibro(4);
console.log("Buscar libro con id 4:", busqueda);

const eliminado = eliminarLibro(2); 
console.log("Libro eliminado:", eliminado);
console.log("Colección tras eliminación:", obtenerLibros());

const totalPaginas = calcularTotalPaginas();
console.log("Total de páginas en la colección:", totalPaginas);

const ordenados = ordenarPorPaginas();
console.log("Libros ordenados por páginas (menor a mayor):", ordenados);

console.log("¿Hay libros con más de 400 páginas?", hayLibrosLargos(400));
console.log("¿Todos tienen menos de 500 páginas?", todosSonLibrosCortos(500));

console.groupEnd();
