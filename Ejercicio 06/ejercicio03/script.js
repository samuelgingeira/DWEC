const checkbox = document.getElementById('acepto');
const enviar = document.getElementById('enviar');

checkbox.addEventListener('change', () => {
  enviar.disabled = !checkbox.checked;
});
