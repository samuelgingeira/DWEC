
const empleados = [
  { id: 1, nombre: "Ana Gómez", departamento: "RRHH", salario: 30000 },
  { id: 2, nombre: "Luis Herrera", departamento: "Desarrollo", salario: 42000 },
  { id: 3, nombre: "María Ruiz", departamento: "Marketing", salario: 35000 },
  { id: 4, nombre: "Javier López", departamento: "Desarrollo", salario: 48000 },
  { id: 5, nombre: "Sofía Jiménez", departamento: "Ventas", salario: 29000 },
  { id: 6, nombre: "Carlos Mendoza", departamento: "Soporte", salario: 28000 },
  { id: 7, nombre: "Lucía Blanco", departamento: "Marketing", salario: 37000 },
  { id: 8, nombre: "Pedro Salas", departamento: "Desarrollo", salario: 51000 }
];

function agregarEmpleado(empleado) {
  empleados.push(empleado);
}

function eliminarEmpleado(id) {
  const idx = empleados.findIndex(e => e.id === id);
  if (idx !== -1) {
    return empleados.splice(idx, 1)[0];
  }
  return null;
}

function buscarPorDepartamento(departamento) {
  return empleados.filter(e => e.departamento === departamento);
}

function calcularSalarioPromedio() {
  if (empleados.length === 0) return 0;
  const total = empleados.reduce((acc, e) => acc + e.salario, 0);
  return total / empleados.length;
}

function obtenerEmpleadosOrdenadosPorSalario() {
  
  return [...empleados].sort((a, b) => b.salario - a.salario);
}


export {
  agregarEmpleado,
  eliminarEmpleado,
  buscarPorDepartamento,
  calcularSalarioPromedio,
  obtenerEmpleadosOrdenadosPorSalario
};