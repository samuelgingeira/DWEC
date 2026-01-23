
function crearFecha(valor){
  return new Date(valor);
}

fetch('eventos.json')
.then(r => r.json())
.then(eventos => {
  eventos.sort((a,b) => new Date(a.fecha) - new Date(b.fecha));
  const cont = document.getElementById('eventos');

  eventos.forEach(ev => {
    const fecha = crearFecha(ev.fecha);

    const card = document.createElement('div');
    card.className = 'card';

    const h3 = document.createElement('h3');
    h3.textContent = ev.nombre;

    const p = document.createElement('p');
    p.textContent = 'Fecha: ' + fecha.toLocaleDateString();

    const contador = document.createElement('div');
    contador.className = 'contador';

    const input = document.createElement('input');
    input.type = 'number';
    input.placeholder = 'Días a sumar';

    const btn = document.createElement('button');
    btn.textContent = 'Posponer';
    btn.onclick = () => fecha.setDate(fecha.getDate() + Number(input.value || 0));

    card.append(h3, p, contador, input, btn);
    cont.appendChild(card);

    setInterval(() => {
      const diff = fecha - Date.now();
      if(diff <= 0){
        contador.textContent = 'FINALIZADO';
        contador.className = 'finalizado';
        return;
      }
      const s = Math.floor(diff/1000)%60;
      const m = Math.floor(diff/60000)%60;
      const h = Math.floor(diff/3600000)%24;
      const d = Math.floor(diff/86400000);
      contador.textContent = `${d}d ${h}h ${m}m ${s}s`;
    }, 1000);
  });
});
