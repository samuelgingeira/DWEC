document.addEventListener("DOMContentLoaded", () => {

  const titulo = document.getElementById("doc-titulo");
  const fecha = document.getElementById("doc-fecha");
  const imagen = document.getElementById("doc-imagen");
  const descripcion = document.getElementById("doc-descripcion");
  const btnAnt = document.getElementById("btn-anterior");
  const btnSig = document.getElementById("btn-siguiente");
  const btnUlt = document.getElementById("btn-ultimo");
  const historial = document.getElementById("historial");
  const erroresDiv = document.getElementById("errores");

  let currentFile = "documento_ultimo.xml";

  function cargarDocumento(xmlFile) {
    erroresDiv.innerHTML = "";

    const xhr = new XMLHttpRequest();
    xhr.open("GET", xmlFile);
    xhr.responseType = "document";
    xhr.overrideMimeType("application/xml");

    xhr.onload = () => {
      if (xhr.status === 200) {
        const doc = xhr.responseXML;

        const tituloDoc = doc.querySelector("titulo").textContent;
        const fechaDoc = doc.querySelector("fecha").textContent;
        const imgSrc = doc.querySelector("imagen").textContent;
        const desc = doc.querySelector("descripcion").textContent;
        const sig = doc.querySelector("siguiente").textContent;
        const ant = doc.querySelector("anterior").textContent;

        currentFile = xmlFile;

        titulo.textContent = tituloDoc;
        fecha.textContent = fechaDoc;
        imagen.src = imgSrc;
        descripcion.textContent = desc;

        btnSig.disabled = (sig === "null");
        btnAnt.disabled = (ant === "null");

        btnSig.onclick = () => cargarDocumento(sig);
        btnAnt.onclick = () => cargarDocumento(ant);

        btnUlt.onclick = () => cargarDocumento("documento_ultimo.xml");

        agregarHistorial(tituloDoc, fechaDoc, xmlFile);

      } else {
        erroresDiv.innerHTML = `<div class="alert alert-danger">Error ${xhr.status}: No se pudo cargar ${xmlFile}</div>`;
      }
    };

    xhr.onerror = () => {
      erroresDiv.innerHTML = `<div class="alert alert-danger">Error al cargar el archivo.</div>`;
    };

    xhr.send();
  }

  function agregarHistorial(titulo, fecha, archivo) {
    const item = document.createElement("li");
    item.className = "list-group-item list-group-item-action";
    item.textContent = `${titulo} (${fecha})`;
    item.dataset.file = archivo;

    item.addEventListener("click", () => {
      cargarDocumento(item.dataset.file);
    });

    historial.appendChild(item);
  }

  cargarDocumento(currentFile);
});
