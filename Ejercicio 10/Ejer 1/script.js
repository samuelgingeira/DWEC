
document.addEventListener('DOMContentLoaded', () => {
  const soporteDiv = document.getElementById('soporte-vital');
  const selectItem = document.getElementById('select-item');
  const detalleItem = document.getElementById('detalle-item');
  const resultadoDiv = document.getElementById('resultado-autonomia');
  const mensajesDiv = document.getElementById('mensajes');
  const inputCantidad = document.getElementById('input-cantidad');
  const btnCalcular = document.getElementById('btn-calcular');

  let inventarioData = [];  

  function cargarXML(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'document'; 
      xhr.overrideMimeType('application/xml');
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.responseXML);
        } else {
          reject({status: xhr.status, url});
        }
      };
      xhr.onerror = () => reject({status: xhr.status || 0, url});
      xhr.send();
    });
  }

  cargarXML('soporte_vital.xml')
    .then(xml => {
      const medicion = xml.querySelector('medicion');
      if (!medicion) {
        soporteDiv.innerHTML = '<div class="text-warning">No se encontraron mediciones en soporte_vital.xml</div>';
        return;
      }
      const ox = medicion.querySelector('oxigeno')?.textContent ?? 'N/A';
      const temp = medicion.querySelector('temperatura')?.textContent ?? 'N/A';
      const pres = medicion.querySelector('presion')?.textContent ?? 'N/A';
      const ts = medicion.getAttribute('timestamp') ?? '';

      soporteDiv.innerHTML = `
        <h5>Última medición ${ts}</h5>
        <ul class="list-unstyled mb-0">
          <li><strong>Oxígeno:</strong> ${ox}%</li>
          <li><strong>Temperatura:</strong> ${temp} °C</li>
          <li><strong>Presión:</strong> ${pres} hPa</li>
        </ul>
      `;
    })
    .catch(err => {
      if (err.status === 404) {
        soporteDiv.innerHTML = `<div class="alert alert-danger mb-0">Error 404: soporte_vital.xml no encontrado.</div>`;
      } else {
        soporteDiv.innerHTML = `<div class="alert alert-danger mb-0">Error al cargar soporte_vital.xml (status: ${err.status})</div>`;
      }
    });

  cargarXML('inventario.xml')
    .then(xml => {
      const items = Array.from(xml.querySelectorAll('item'));
      if (items.length === 0) {
        selectItem.innerHTML = `<option value="">No hay ítems</option>`;
        return;
      }
      selectItem.innerHTML = `<option value="">-- Selecciona un ítem --</option>`;

      inventarioData = items.map(itemEl => {
        const id = itemEl.getAttribute('id') ?? '';
        const unidad = itemEl.getAttribute('unidad') ?? '';
        const nombre = itemEl.querySelector('nombre')?.textContent ?? 'Sin nombre';
        const cantidad = parseFloat(itemEl.querySelector('cantidad')?.textContent ?? '0');
        const consumo = parseFloat(itemEl.querySelector('consumo')?.textContent ?? '0');
        const option = document.createElement('option');
        option.value = id;
        option.textContent = `${nombre} (${id})`;
        selectItem.appendChild(option);
        return {id, nombre, unidad, cantidad, consumo};
      });
    })
    .catch(err => {
      if (err.status === 404) {
        selectItem.innerHTML = `<option value="">Error: inventario.xml no encontrado (404)</option>`;
        mensajesDiv.innerHTML += `<div class="alert alert-danger">inventario.xml no encontrado. Revise el archivo.</div>`;
        selectItem.disabled = true;
        btnCalcular.disabled = true;
      } else {
        mensajesDiv.innerHTML += `<div class="alert alert-danger">Error al cargar inventario.xml (status: ${err.status})</div>`;
      }
    });

  selectItem.addEventListener('change', () => {
    detalleItem.innerHTML = '';
    resultadoDiv.innerHTML = '';
    const selectedId = selectItem.value;
    if (!selectedId) {
      detalleItem.innerHTML = '';
      return;
    }
    const item = inventarioData.find(i => i.id === selectedId);
    if (!item) {
      detalleItem.innerHTML = `<div class="text-warning">Ítem no encontrado en inventario.</div>`;
      return;
    }
    detalleItem.innerHTML = `<p><strong>${item.nombre}</strong> — Disponible: ${item.cantidad} ${item.unidad}</p>`;
  });

  btnCalcular.addEventListener('click', () => {
    resultadoDiv.innerHTML = '';
    mensajesDiv.innerHTML = '';

    if (inventarioData.length === 0) {
      mensajesDiv.innerHTML = `<div class="alert alert-warning">No hay datos de inventario para calcular.</div>`;
      return;
    }

    const crewSize = 4;

    const chosenId = selectItem.value;

    const itemsToCalc = chosenId ? inventarioData.filter(i => i.id === chosenId) : inventarioData;

    const results = itemsToCalc.map(item => {
      const cantidadDisponible = parseFloat(inputCantidad.value) || item.cantidad;
      const consumoPorPersonaPorDia = item.consumo || 0;

      let dias = null;
      if (consumoPorPersonaPorDia > 0) {
        const consumoTotalDiario = consumoPorPersonaPorDia * crewSize;
        dias = Math.floor(cantidadDisponible / consumoTotalDiario);
      }
      return {item, cantidadDisponible, dias};
    });

    const ul = document.createElement('ul');
    ul.className = 'list-group';
    results.forEach(r => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      if (r.dias === null) {
        li.innerHTML = `<strong>${r.item.nombre}:</strong> No se puede calcular (consumo diario por persona no definido).`;
      } else {
        li.innerHTML = `<strong>${r.item.nombre}:</strong> Autonomía: <span class="fw-bold">${r.dias} días</span> (para ${crewSize} personas) — Basado en ${r.cantidadDisponible} ${r.item.unidad} y consumo ${r.item.consumo} ${r.item.unidad}/persona/día.`;
      }
      ul.appendChild(li);
    });
    resultadoDiv.appendChild(ul);
  });

});
