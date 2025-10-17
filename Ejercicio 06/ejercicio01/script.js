const mostrarBtn = document.getElementById('mostrarModal');
const backdrop = document.getElementById('backdrop');
const cerrarBtn = document.getElementById('cerrar');
const cerrarX = document.getElementById('cerrarX');

function abrirModal(){
  backdrop.classList.remove('hidden');
  // set focus to modal for accessibility
  document.getElementById('modal').focus?.();
}
function cerrarModal(){
  backdrop.classList.add('hidden');
  mostrarBtn.focus();
}

mostrarBtn.addEventListener('click', abrirModal);
cerrarBtn.addEventListener('click', cerrarModal);
cerrarX.addEventListener('click', cerrarModal);

// cerrar con Esc y clic fuera del modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !backdrop.classList.contains('hidden')) cerrarModal();
});
backdrop.addEventListener('click', (e) => {
  if (e.target === backdrop) cerrarModal();
});
