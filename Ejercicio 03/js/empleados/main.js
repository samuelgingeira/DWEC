import {
  agregarEmpleado,
  eliminarEmpleado,
  buscarPorDepartamento,
  calcularSalarioPromedio,
  obtenerEmpleadosOrdenadosPorSalario
} from './empleados.js';

console.group("Ejercicio 3.8 - Gestión de empleados");


console.log("Empleados iniciales:", obtenerEmpleadosOrdenadosPorSalario());


agregarEmpleado({ id: 9, nombre: "Inés Campos", departamento: "RRHH", salario: 31000 });
agregarEmpleado({ id: 10, nombre: "Raúl Pinto", departamento: "Soporte", salario: 29500 });

console.log("Tras añadir empleados:", obtenerEmpleadosOrdenadosPorSalario());


console.log("Empleados en Desarrollo:", buscarPorDepartamento("Desarrollo"));
console.log("Empleados en Marketing:", buscarPorDepartamento("Marketing"));


console.log("Salario promedio:", calcularSalarioPromedio());


console.log("Ordenados por salario (mayor->menor):", obtenerEmpleadosOrdenadosPorSalario());


const eliminado = eliminarEmpleado(5); 
console.log("Eliminado:", eliminado);
console.log("Empleados tras eliminación:", obtenerEmpleadosOrdenadosPorSalario());

console.groupEnd();