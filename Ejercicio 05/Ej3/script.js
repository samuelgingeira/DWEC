function generarInformeDeValidacion() {
  const nombreInput = document.getElementById('nombre');
  const emailInput = document.getElementById('email');
  const informe = document.getElementById('informe-errores');

  const nombre = nombreInput.value.trim();
  const email = emailInput.value.trim();

  informe.innerHTML = '';

  let errores = [];

  if (nombre.length <= 3) {
    errores.push('El nombre debe tener más de 3 caracteres.');
  }
  if (!email.includes('@')) {
    errores.push('El email debe contener un @.');
  }

  if (errores.length > 0) {
    errores.forEach(msg => {
      const p = document.createElement('p');
      p.textContent = msg;
      informe.appendChild(p);
    });
  } else {
    const p = document.createElement('p');
    p.textContent = 'Formulario válido';
    p.classList.add('valido');
    informe.appendChild(p);
  }
}
