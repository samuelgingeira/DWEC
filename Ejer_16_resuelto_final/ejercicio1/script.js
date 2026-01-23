
async function cargarLogs(){
  try{
    const res = await fetch('logs.txt');
    if(!res.ok) throw new Error('No se pudieron cargar los logs');
    const texto = await res.text();
    procesar(texto);
  }catch(e){ console.error(e); }
}

function procesar(texto){
  const filas = texto.split('\n').filter(l => l.trim());
  const tbody = document.getElementById('tabla');
  let total = 0;

  filas.forEach(fila => {
    fila = fila.trim();

    const id = '#' + fila.slice(fila.indexOf('-') + 1, fila.indexOf(' '));
    const usuario = fila.split('USER:')[1].split(' ')[0].toLowerCase();
    const consumoStr = fila.split('Consumo:')[1].split(' ')[1];
    const bytes = Number(consumoStr);
    const mb = bytes / (1024 * 1024);
    total += mb;

    const error = fila.includes('ERROR');

    const tr = document.createElement('tr');
    if(error) tr.classList.add('error');

    tr.innerHTML = `
      <td>${id}</td>
      <td>${usuario}</td>
      <td>${mb.toFixed(2)} MB</td>
      <td><span class="${error?'estado-error':'estado-ok'}">${error?'ERROR':'OK'}</span></td>
    `;

    tbody.appendChild(tr);
  });

  document.getElementById('total').textContent =
    'Consumo Total detectado: ' + total.toFixed(2) + ' MB';
}

cargarLogs();
