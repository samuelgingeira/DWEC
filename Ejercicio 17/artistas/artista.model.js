let artistas = require('../artistas.json');

function getAll() {
  return artistas;
}

function getById(id) {
  return artistas.find(a => a.id == id);
}

function create(artista) {
  artista.id = artistas.length + 1;
  artistas.push(artista);
}

function update(artista) {
  const index = artistas.findIndex(a => a.id == artista.id);
  artistas[index] = artista;
}

function remove(id) {
  artistas = artistas.filter(a => a.id != id);
}

module.exports = { getAll, getById, create, update, remove };
