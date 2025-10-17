const palette = document.getElementById('palette');

palette.addEventListener('click', (e) => {
  const swatch = e.target.closest('.swatch');
  if (!swatch) return;
  const color = swatch.dataset.color || getComputedStyle(swatch).backgroundColor;
  document.body.style.background = color;
});
