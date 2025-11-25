// Variable global para compartir entre archivos
window.sesionJuegoId = null;

// Al cargar la página del juego
window.addEventListener('load', function () {
    iniciarSesionJuego();
});

// Función para iniciar la sesión de juego
function iniciarSesionJuego() {
    // Obtener el id_juego desde el atributo data-id-juego del body o cualquier elemento
    const idJuego = document.body.getAttribute('data-id-juego') || document.querySelector('[data-id-juego]')?.getAttribute('data-id-juego');

    if (!idJuego) {
        console.error('No se encontró el ID del juego en el atributo data-id-juego');
        return;
    }

    fetch('/sesion-juego/iniciar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({
            id_juego: parseInt(idJuego)
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.sesionJuegoId = data.sesion_juego_id;
                console.log('Sesión de juego iniciada:', window.sesionJuegoId);
            } else if (data.error) {
                console.error('Error al iniciar sesión:', data.error);
            }
        })
        .catch(error => console.error('Error en la petición:', error));
}

// Función para finalizar la sesión de juego
function finalizarSesionJuego(monedasGanadas = 0, monedasGastadas = 0, ganado = false) {
    if (!window.sesionJuegoId) {
        console.error('No hay sesión de juego activa');
        return Promise.reject('No hay sesión activa');
    }

    return fetch('/sesion-juego/finalizar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({
            sesion_juego_id: window.sesionJuegoId,
            monedas_ganadas: monedasGanadas,
            monedas_gastadas: monedasGastadas,
            ganado: ganado
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Sesión de juego finalizada. Duración:', data.duracion, 'segundos');
                window.sesionJuegoId = null; // Limpiar la sesión
                return data;
            } else if (data.error) {
                console.error('Error al finalizar sesión:', data.error);
                throw new Error(data.error);
            }
        })
        .catch(error => {
            console.error('Error en la petición:', error);
            throw error;
        });
}

// Manejar el cierre inesperado de la página
window.addEventListener('beforeunload', function (e) {
    if (window.sesionJuegoId) {
        // Usar sendBeacon para enviar datos de forma asíncrona antes de cerrar
        const data = JSON.stringify({
            sesion_juego_id: window.sesionJuegoId,
            monedas_ganadas: 0,
            monedas_gastadas: 0,
            ganado: false
        });

        // sendBeacon es más confiable que fetch para eventos beforeunload
        const blob = new Blob([data], { type: 'application/json' });
        navigator.sendBeacon('/sesion-juego/finalizar', blob);
    }
});

// Llamar a finalizarSesionJuego() cuando termine el juego
// Ejemplo: finalizarSesionJuego(100, 50, true);
