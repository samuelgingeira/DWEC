const input = document.getElementById('buscar');
const items = Array.from(document.querySelectorAll('#lista li'));

input.addEventListener('input', () => {
  const q = input.value.trim().toLowerCase();
  items.forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
});
