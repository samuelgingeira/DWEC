const pages = {
  inicio: '<h1>Página de Inicio</h1><p>Bienvenido a nuestra web.</p>',
  productos: '<h1>Productos</h1><p>Descubre nuestra gama de productos...</p>',
  contacto: '<h1>Contacto</h1><p>Contacta con nosotros...</p>'
};

const main = document.querySelector('main');
const navLinks = document.querySelectorAll('nav a');

function renderPage(route, push = true) {
  main.innerHTML = pages[route] || '<h1>404</h1><p>Página no encontrada</p>';

  navLinks.forEach(link =>
    link.classList.toggle("active", link.dataset.route === route)
  );

  if (push) {
    history.pushState({ route }, null, '/' + route);
  }
}

navLinks.forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    const route = link.dataset.route;
    renderPage(route);
  });
});

window.addEventListener("popstate", event => {
  const route = event.state?.route || "inicio";
  renderPage(route, false);
});

function init() {
  const route = window.location.pathname.replace("/", "") || "inicio";
  history.replaceState({ route }, null, '/' + route);
  renderPage(route, false);
}

init();
