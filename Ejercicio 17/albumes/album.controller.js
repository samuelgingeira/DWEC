const albumModel = require('./album.model');
const artistaModel = require('../artistas/artista.model');

exports.list = (req, res) => {
  const albumes = albumModel.getAll().map(a => ({
    ...a,
    artista: artistaModel.getById(a.artistaId)
  }));

  res.render('albumes/list', { albumes });
};

exports.form = (req, res) => {
  const album = req.params.id ? albumModel.getById(req.params.id) : {};

  res.render('albumes/form', {
    album,
    artistas: artistaModel.getAll(),
    error: null
  });
};

exports.save = (req, res) => {
  const { titulo, anio } = req.body;

  if (!titulo || !anio) {
    return res.render('albumes/form', {
      album: req.body,
      artistas: artistaModel.getAll(),
      error: 'Título y año obligatorios'
    });
  }

  req.body.id
    ? albumModel.update(req.body)
    : albumModel.create(req.body);

  res.redirect('/albumes');
};

exports.delete = (req, res) => {
  albumModel.remove(req.params.id);
  res.redirect('/albumes');
};
