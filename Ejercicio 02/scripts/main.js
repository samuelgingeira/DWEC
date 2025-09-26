import mostrarPerfil, { crearPerfil, obtenerMayoresDeEdad, calcularPromedioEdad } from "./gestorUsuarios.js";

const usuarios = [
  crearPerfil("Ana", "ana@mail.com", 25),
  crearPerfil("Luis", "luis@mail.com", 17),
  crearPerfil("Carla", "carla@mail.com", 30),
  crearPerfil("Pedro", "pedro@mail.com", 16),
  crearPerfil("Marta", "marta@mail.com", 20),
];

console.log("📋 Lista de usuarios:");
usuarios.forEach(u => console.log(mostrarPerfil(u)));

const mayores = obtenerMayoresDeEdad(usuarios);
console.log("\n👨‍🦱 Usuarios mayores de edad:");
mayores.forEach(u => console.log(mostrarPerfil(u)));

console.log(`\n📊 La edad promedio de los usuarios es: ${calcularPromedioEdad(usuarios)}`);