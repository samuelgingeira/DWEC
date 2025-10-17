const grid = document.getElementById('grid');
const colorPicker = document.getElementById('colorPicker');
const limpiar = document.getElementById('limpiar');

let isDrawing = false;
const rows = 40, cols = 40;

for (let i = 0; i < rows * cols; i++) {
  const cell = document.createElement('div');
  cell.dataset.index = i;
  grid.appendChild(cell);
}

grid.addEventListener('mousedown', (e) => {
  isDrawing = true;
  paint(e.target);
});
document.addEventListener('mouseup', () => isDrawing = false);

grid.addEventListener('mouseover', (e) => {
  if (!isDrawing) return;
  paint(e.target);
});

function paint(target) {
  if (target === grid) return;
  if (!(target instanceof HTMLElement)) return;
  target.style.background = colorPicker.value;
}
grid.addEventListener('touchstart', (e) => {
  isDrawing = true;
  paint(document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY));
  e.preventDefault();
});
grid.addEventListener('touchmove', (e) => {
  paint(document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY));
  e.preventDefault();
});
document.addEventListener('touchend', () => isDrawing = false);

limpiar.addEventListener('click', () => {
  grid.querySelectorAll('div').forEach(d => d.style.background = 'white');
});
