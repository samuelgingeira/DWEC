const cont = document.getElementById('contenedor');
const drag = document.getElementById('arrastrable');

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

drag.addEventListener('mousedown', (e) => {
  isDragging = true;
  drag.classList.add('dragging');
  const rect = drag.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const contRect = cont.getBoundingClientRect();
  let x = e.clientX - contRect.left - offsetX;
  let y = e.clientY - contRect.top - offsetY;
  // limit inside container
  x = Math.max(0, Math.min(x, contRect.width - drag.offsetWidth));
  y = Math.max(0, Math.min(y, contRect.height - drag.offsetHeight));
  drag.style.left = x + 'px';
  drag.style.top = y + 'px';
});

document.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  drag.classList.remove('dragging');
});

drag.addEventListener('touchstart', (e) => {
  const t = e.touches[0];
  isDragging = true;
  const rect = drag.getBoundingClientRect();
  const contRect = cont.getBoundingClientRect();
  offsetX = t.clientX - rect.left;
  offsetY = t.clientY - rect.top;
  e.preventDefault();
});
document.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const t = e.touches[0];
  const contRect = cont.getBoundingClientRect();
  let x = t.clientX - contRect.left - offsetX;
  let y = t.clientY - contRect.top - offsetY;
  x = Math.max(0, Math.min(x, contRect.width - drag.offsetWidth));
  y = Math.max(0, Math.min(y, contRect.height - drag.offsetHeight));
  drag.style.left = x + 'px';
  drag.style.top = y + 'px';
});
document.addEventListener('touchend', () => { isDragging = false; });
