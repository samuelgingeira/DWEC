let albumes = require('../albumes.json');

function getAll() {
  return albumes;
}

function getById(id) {
  return albumes.find(a => a.id == id);
}

function getByArtista(id) {
  return albumes.filter(a => a.artistaId == id);
}

function create(album) {
  album.id = albumes.length + 1;
  albumes.push(album);
}

function update(album) {
  const index = albumes.findIndex(a => a.id == album.id);
  albumes[index] = album;
}

function remove(id) {
  albumes = albumes.filter(a => a.id != id);
}

module.exports = { getAll, getById, getByArtista, create, update, remove };
