document.getElementById('ordenar').addEventListener('click', () => {
  const ul = document.getElementById('lista-desorden');
  const nodeList = ul.querySelectorAll('li');
  const arr = Array.from(nodeList);
  arr.sort((a, b) => a.textContent.trim().localeCompare(b.textContent.trim(), 'es'));
  ul.innerHTML = '';
  arr.forEach(li => ul.appendChild(li));
});
