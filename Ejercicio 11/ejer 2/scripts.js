document.addEventListener("DOMContentLoaded", () => {
  const commentsList = document.getElementById("comments-list");
  const form = document.getElementById("comment-form");
  const authorInput = document.getElementById("author");
  const commentInput = document.getElementById("commentText");
  const messageBox = document.getElementById("message");

  let comments = [];

  const showMessage = (text, type = "success") => {
    messageBox.innerHTML = `<div class="alert alert-${type}" role="alert">${text}</div>`;
    setTimeout(() => (messageBox.innerHTML = ""), 3000);
  };

  const xhrGet = new XMLHttpRequest();
  xhrGet.open("GET", "comments_initial.json", true);
  xhrGet.onreadystatechange = function () {
    if (xhrGet.readyState === 4 && xhrGet.status === 200) {
      comments = JSON.parse(xhrGet.responseText);
      renderComments();
    }
  };
  xhrGet.send();

  function renderComments() {
    commentsList.innerHTML = "";
    comments.forEach(c => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.innerHTML = `
        <strong>${c.author}</strong> 
        <small class="text-muted float-end">${new Date(c.timestamp).toLocaleString()}</small>
        <p class="mb-0">${c.commentText}</p>
      `;
      commentsList.prepend(li);
    });
  }

  form.addEventListener("submit", e => {
    e.preventDefault();

    const newComment = {
      author: authorInput.value.trim(),
      commentText: commentInput.value.trim(),
      timestamp: new Date().toISOString()
    };

    if (!newComment.author || !newComment.commentText) {
      showMessage("Por favor, completa todos los campos.", "warning");
      return;
    }

    showMessage("Enviando comentario...", "info");

    const xhrPost = new XMLHttpRequest();
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const url = proxy + "https://webhook.site/tu-id-aqui"; // Cambia "tu-id-aqui" por tu ID de Webhook.site

    xhrPost.open("POST", url, true);
    xhrPost.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhrPost.onreadystatechange = function () {
      if (xhrPost.readyState === 4) {
        if (xhrPost.status === 200 || xhrPost.status === 201) {
          comments.push(newComment);
          renderComments();
          form.reset();
          showMessage("Comentario enviado con éxito.", "success");
        } else {
          showMessage("Error al enviar el comentario.", "danger");
        }
      }
    };

    xhrPost.send(JSON.stringify(newComment));
  });
});
