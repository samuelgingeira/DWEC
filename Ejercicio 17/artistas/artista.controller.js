const artistaModel = require('./artista.model');
const albumModel = require('../albumes/album.model');

exports.list = (req, res) => {
  res.render('artistas/list', { artistas: artistaModel.getAll() });
};

exports.detail = (req, res) => {
  const artista = artistaModel.getById(req.params.id);
  const albumes = albumModel.getByArtista(req.params.id);
  res.render('artistas/detail', { artista, albumes });
};

exports.form = (req, res) => {
  const artista = req.params.id ? artistaModel.getById(req.params.id) : {};
  res.render('artistas/form', { artista });
};

exports.save = (req, res) => {
  req.body.id
    ? artistaModel.update(req.body)
    : artistaModel.create(req.body);

  res.redirect('/artistas');
};

exports.delete = (req, res) => {
  artistaModel.remove(req.params.id);
  res.redirect('/artistas');
};
