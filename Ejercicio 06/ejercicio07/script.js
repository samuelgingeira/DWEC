const tabla = document.getElementById('tablaEditable');

tabla.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');
  if (!td) return;
  if (td.querySelector('input')) return;
  const prev = td.textContent;
  const input = document.createElement('input');
  input.type = 'text';
  input.value = prev.trim();
  td.textContent = '';
  td.appendChild(input);
  input.focus();
  input.select();

  function finish(){
    const newVal = input.value.trim();
    td.removeChild(input);
    td.textContent = newVal;
  }

  input.addEventListener('blur', finish);
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      input.blur();
    } else if (ev.key === 'Escape') {
      input.value = prev;
      input.blur();
    }
  });
});
