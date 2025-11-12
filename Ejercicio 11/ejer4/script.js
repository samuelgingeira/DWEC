document.addEventListener("DOMContentLoaded", () => {
  const userWidget = document.getElementById("user-widget");
  const postsWidget = document.getElementById("posts-widget");
  const spinner = document.getElementById("loading-spinner");
  const messageBox = document.getElementById("message");

  const showMessage = (text, type = "danger") => {
    messageBox.innerHTML = `<div class="alert alert-${type}" role="alert">${text}</div>`;
  };

  const userUrl = "https://jsonplaceholder.typicode.com/users/1";
  const postsUrl = "https://jsonplaceholder.typicode.com/posts?userId=1";

  spinner.style.display = "block";

  Promise.allSettled([
    fetch(userUrl).then(res => res.ok ? res.json() : Promise.reject("Error usuario")),
    fetch(postsUrl).then(res => res.ok ? res.json() : Promise.reject("Error posts"))
  ])
  .then(results => {
    spinner.style.display = "none";

    const [userResult, postsResult] = results;

    if (userResult.status === "fulfilled") {
      const user = userResult.value;
      userWidget.innerHTML = `
        <h5 class="card-title text-primary mb-3">👤 Usuario</h5>
        <p><strong>Nombre:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Compañía:</strong> ${user.company.name}</p>
        <p><strong>Ciudad:</strong> ${user.address.city}</p>
        <p><strong>Teléfono:</strong> ${user.phone}</p>
      `;
    } else {
      userWidget.innerHTML = `
        <div class="alert alert-danger" role="alert">
          ❌ No se pudo cargar la información del usuario.
        </div>`;
    }

    if (postsResult.status === "fulfilled") {
      const posts = postsResult.value.slice(0, 3);
      let postsHTML = `
        <h5 class="card-title text-primary mb-3">📰 Últimos Posts</h5>
      `;

      posts.forEach(p => {
        postsHTML += `
          <div class="mb-3 border-bottom pb-2">
            <h6 class="fw-bold">${p.title}</h6>
            <p class="mb-0">${p.body}</p>
          </div>
        `;
      });

      postsWidget.innerHTML = postsHTML;
    } else {
      postsWidget.innerHTML = `
        <div class="alert alert-warning" role="alert">
          ⚠️ No se pudieron cargar los posts del usuario.
        </div>`;
    }

    if (userResult.status === "rejected" && postsResult.status === "rejected") {
      showMessage("Error al cargar los datos del usuario y sus publicaciones.", "danger");
    }
  })
  .catch(error => {
    spinner.style.display = "none";
    showMessage("Error inesperado al cargar la información.", "danger");
    console.error(error);
  });
});
