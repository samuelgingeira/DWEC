const playlist = [
  { titulo: "Luz de Otoño", artista: "Aurora Norte", duracion: 210 },
  { titulo: "Ritmo de Calle", artista: "Los Molinos", duracion: 175 },
  { titulo: "Sol y Sal", artista: "Marta y el Mar", duracion: 142 },
  { titulo: "Noches de Jazz", artista: "Trío Lunático", duracion: 305 },
  { titulo: "Café en Lisboa", artista: "Alma Verde", duracion: 198 },
  { titulo: "Bajo la Lluvia", artista: "Sergio Kant", duracion: 119 },
  { titulo: "Camino a Casa", artista: "Dúo Albor", duracion: 260 },
  { titulo: "Eco Urbano", artista: "BeatCity", duracion: 88 },
  { titulo: "Memoria", artista: "Violeta", duracion: 184 },
  { titulo: "Horizonte", artista: "Los Errantes", duracion: 230 }
];

console.group("Ejercicio 3.2 - Filtrando canciones largas");
const cancionesLargas = playlist.filter(c => c.duracion > 180);

const mensajes = cancionesLargas.map(c => 
  `La canción '${c.titulo}' de ${c.artista} dura ${c.duracion} segundos.`
);

console.log("Canciones > 180s:", cancionesLargas);
console.log("Mensajes:", mensajes);
console.groupEnd();
