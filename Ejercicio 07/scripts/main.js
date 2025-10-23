document.addEventListener('DOMContentLoaded', () => {
    console.log('%cDocumento listo.', 'color: green; font-size: 16px; font-weight: bold;');
    console.log('%cSoluciones ejemplo para los 5 ejercicios (pegue esto en scripts/main.js).', 'color: blue; font-size: 14px;');

    // Ejercicio 1 y 4
    const container = document.querySelector('#boxes') || document.body;

    container.addEventListener('click', (e) => {
        const caja = e.target.closest('.box');
        if (!caja) return; 

        caja.classList.toggle('highlight');

        console.log('Click en caja:', caja);
        console.log('event.target:', e.target);
        console.log('event.currentTarget (listener):', e.currentTarget);
    });

    container.addEventListener('dblclick', (e) => {
        const caja = e.target.closest('.box');
        if (!caja) return;

        const prev = caja.textContent.trim();
        caja.textContent = `¡Doble click! (antes: "${prev.slice(0,40)}")`;

        e.stopPropagation();

        console.log('Doble click en caja — texto cambiado.', caja);
    });

    // Ejercicio 2
    const testLink = document.getElementById('test-link');
    if (testLink) {
        testLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Se pulsó el enlace #test-link. href =', testLink.href);
            console.log('Texto del enlace:', testLink.textContent.trim());
        });
    } else {
        console.log('No se encontró #test-link en la página (si existe, añade un elemento con id="test-link").');
    }

    // Ejercicio 3
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const data = new FormData(form);
            const nombre = (data.get('nombre') || '').trim();
            const email = (data.get('email') || '').trim();

            const errores = [];
            if (!nombre) errores.push('El nombre es obligatorio.');
            if (!email) errores.push('El email es obligatorio.');
            else if (!/^\S+@\S+\.\S+$/.test(email)) errores.push('El email no tiene formato válido.');

            if (errores.length) {
                console.warn('Errores de validación:', errores);
            } else {
                console.log('Formulario válido. Datos recibidos: ', { nombre, email });
            }
        });
    } else {
        console.log('No se detectó un formulario en la página. Añade un <form name="..."> para probar la validación.');
    }


    // Ejercicio 5
    const backBtn = document.getElementById('back-to-top');
    if (backBtn) {
        const toggleBackBtn = () => {
            if (window.scrollY > 300) backBtn.classList.remove('hidden');
            else backBtn.classList.add('hidden');
        };
        window.addEventListener('scroll', toggleBackBtn);
        toggleBackBtn(); 

        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    } else {
        console.log('No se encontró #back-to-top. Si existe en el HTML, este script la controlará.');
    }

    const requestNotificationPermissionAndShow = async () => {
        if (!('Notification' in window)) {
            console.log('La API de Notificaciones no está disponible en este navegador.');
            return;
        }
        if (Notification.permission === 'granted') {
            new Notification('Notificación de prueba', { body: '¡Permiso ya concedido!' });
        } else if (Notification.permission !== 'denied') {
            try {
                const permission = await Notification.requestPermission();
                console.log('Permiso de notificaciones:', permission);
                if (permission === 'granted') {
                    new Notification('Notificación de prueba', { body: 'Gracias por activar las notificaciones.' });
                } else {
                    console.log('El usuario no permitió notificaciones.');
                }
            } catch (err) {
                console.error('Error al solicitar permiso de notificaciones:', err);
            }
        } else {
            console.log('Las notificaciones están bloqueadas por el usuario (denied).');
        }
    };

    window.__ejerciciosHelpers = {
        requestNotificationPermissionAndShow,
    };

    console.log('%cHelpers expuestos: window.__ejerciciosHelpers.requestNotificationPermissionAndShow()', 'color: purple;');
});
