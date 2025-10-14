const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

document.getElementById('generar').addEventListener('click', () => {
  const n = parseInt(document.getElementById('num').value, 10) || 0;
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = ''; 
  const frag = document.createDocumentFragment();
  for (let i = 0; i < n; i++) {
    const p = document.createElement('p');
    p.textContent = lorem;
    frag.appendChild(p);
  }

  resultado.appendChild(frag);
});
