document.addEventListener("DOMContentLoaded", () => {
  const profileContainer = document.getElementById("user-profile");
  const editBtn = document.getElementById("edit-btn");
  const saveBtn = document.getElementById("save-btn");
  const messageBox = document.getElementById("message");

  let userData = {};

  const showMessage = (text, type = "success") => {
    messageBox.innerHTML = `<div class="alert alert-${type}" role="alert">${text}</div>`;
    setTimeout(() => (messageBox.innerHTML = ""), 4000);
  };

  const xhrGet = new XMLHttpRequest();
  xhrGet.open("GET", "user_data.json", true);
  xhrGet.onreadystatechange = function () {
    if (xhrGet.readyState === 4 && xhrGet.status === 200) {
      userData = JSON.parse(xhrGet.responseText);
      renderProfile(userData);
    }
  };
  xhrGet.send();

  function renderProfile(data, editable = false) {
    const { personalInfo, address, hobbies } = data;

    profileContainer.innerHTML = `
      <form id="profile-form">
        <div class="mb-3">
          <label class="form-label">Nombre</label>
          <input type="text" class="form-control" name="firstName" value="${personalInfo.firstName}" ${!editable ? "readonly" : ""}>
        </div>
        <div class="mb-3">
          <label class="form-label">Apellidos</label>
          <input type="text" class="form-control" name="lastName" value="${personalInfo.lastName}" ${!editable ? "readonly" : ""}>
        </div>
        <div class="mb-3">
          <label class="form-label">Correo</label>
          <input type="email" class="form-control" name="email" value="${personalInfo.email}" ${!editable ? "readonly" : ""}>
        </div>
        <div class="mb-3">
          <label class="form-label">Teléfono</label>
          <input type="text" class="form-control" name="phone" value="${personalInfo.phone}" ${!editable ? "readonly" : ""}>
        </div>
        <div class="mb-3">
          <label class="form-label">Dirección</label>
          <textarea class="form-control" name="address" rows="2" ${!editable ? "readonly" : ""}>${address.street}, ${address.city}, ${address.zipCode}, ${address.country}</textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Hobbies</label>
          <input type="text" class="form-control" name="hobbies" value="${hobbies.join(", ")}" ${!editable ? "readonly" : ""}>
        </div>
      </form>
    `;
  }

  editBtn.addEventListener("click", () => {
    renderProfile(userData, true);
    editBtn.classList.add("d-none");
    saveBtn.classList.remove("d-none");
  });

  saveBtn.addEventListener("click", () => {
    const form = document.getElementById("profile-form");
    const formData = new FormData(form);

    const updatedData = {
      ...userData,
      personalInfo: {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
      },
      hobbies: formData.get("hobbies").split(",").map(h => h.trim()),
    };

    saveBtn.disabled = true;
    showMessage("Guardando cambios...", "info");

    const xhrPost = new XMLHttpRequest();
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const url = proxy + "https://webhook.site/tu-id-aqui"; // 🔸 Cambia "tu-id-aqui" por el tuyo real

    xhrPost.open("POST", url, true);
    xhrPost.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhrPost.onreadystatechange = function () {
      if (xhrPost.readyState === 4) {
        saveBtn.disabled = false;

        if (xhrPost.status === 200 || xhrPost.status === 201) {
          userData = updatedData;
          renderProfile(userData);
          showMessage("Cambios guardados correctamente.", "success");
          editBtn.classList.remove("d-none");
          saveBtn.classList.add("d-none");
        } else {
          showMessage("Error al guardar los cambios.", "danger");
        }
      }
    };

    xhrPost.send(JSON.stringify(updatedData));
  });
});
