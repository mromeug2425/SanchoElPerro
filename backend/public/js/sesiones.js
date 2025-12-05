// Variable global para compartir entre archivos
window.sesionJuegoId = null;
window.sesionJuegoReady = null;

async function ensureSesionJuego() {
    if (!window.sesionJuegoReady) {
        window.sesionJuegoReady = await iniciarSesionJuego();
    }
    return window.sesionJuegoReady;
}

//if (document.readyState === 'loading') {
//    document.addEventListener('DOMContentLoaded', ensureSesionJuego);
//} else {
//    ensureSesionJuego();
//}

// Función para iniciar la sesión de juego
async function iniciarSesionJuego() {
    // Obtener el id_juego desde el atributo data-id-juego del body o cualquier elemento
    const idJuego =
        document.body.getAttribute("data-id-juego") ||
        document
            .querySelector("[data-id-juego]")
            ?.getAttribute("data-id-juego");

    if (!idJuego) {
        console.error(
            "No se encontró el ID del juego en el atributo data-id-juego"
        );
        return;
    }
    const baseUrl = window.BASE_URL || window.location.origin;
    return await fetch(`${baseUrl}/sesion-juego/iniciar`, {
        method: "POST",
        // credentials: 'same-origin',
        headers: {
            "Content-Type": "application/json",
            //'Accept': 'application/json',
            //'X-Requested-With': 'XMLHttpRequest',
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')
                .content,
        },
        body: JSON.stringify({
            id_juego: parseInt(idJuego),
        }),
    })
        .then(async (response) => {
            console.log("Respuesta recibida al iniciar sesión:", response);
            if (!response.ok) {
                console.log("Respuesta no exitosa:", response);
                const text = await response.text();
                console.error(
                    "Error al iniciar sesión (HTTP " + response.status + "):",
                    text
                );
                throw new Error("HTTP " + response.status);
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                window.sesionJuegoId = data.sesion_juego_id;
                console.log("Sesión de juego iniciada:", window.sesionJuegoId);
            } else if (data.error) {
                console.error("Error al iniciar sesión:", data.error);
            }
        })
        .catch((error) => console.error("Error en la petición:", error));
}

// Función para finalizar la sesión de juego
async function finalizarSesionJuego(
    monedasGanadas = 0,
    monedasGastadas = 0,
    ganado = false
) {
    if (!window.sesionJuegoId) {
        console.error("No hay sesión de juego activa");
        return Promise.reject("No hay sesión activa");
    }
    const baseUrl = window.BASE_URL || window.location.origin;
    return await fetch(`${baseUrl}/sesion-juego/finalizar`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')
                .content,
        },
        body: JSON.stringify({
            sesion_juego_id: window.sesionJuegoId,
            monedas_ganadas: monedasGanadas,
            monedas_perdidas: monedasGastadas, // <-- CAMBIO CLAVE
            ganado: ganado,
        }),
    })
        .then(async (response) => {
            if (!response.ok) {
                const text = await response.text();
                console.error(
                    "Error al finalizar sesión (HTTP " + response.status + "):",
                    text
                );
                throw new Error("HTTP " + response.status);
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                console.log(
                    "Sesión de juego finalizada. Duración:",
                    data.duracion,
                    "segundos"
                );
                window.sesionJuegoId = null; // Limpiar la sesión
                return data;
            } else if (data.error) {
                console.error("Error al finalizar sesión:", data.error);
                throw new Error(data.error);
            }
        })
        .catch((error) => {
            console.error("Error en la petición:", error);
            throw error;
        });
}

async function guardarJuego4EnBD(
    challenge,
    playerNumbers,
    playerOperations,
    isCorrect,
    wasTimeout,
    correctNumbers,
    correctOperations
) {
    // Wait for session to be ready if needed
    if (!window.sesionJuegoId && window.sesionJuegoReady) {
        try {
            await window.sesionJuegoReady;
        } catch (e) {
            console.error("Error waiting for session:", e);
        }
    }

    if (!window.sesionJuegoId) {
        console.error("No hay sesión de juego activa para Game 4");
        return;
    }

    // Build opciones string: "num1,num2,...,op1,op2,..."
    const opcionesString =
        challenge.numbers.join(",") + "," + challenge.operations.join(",");

    // Build respuesta_usuario string
    let respuestaUsuario = "";
    if (!wasTimeout && playerNumbers.length > 0) {
        // Format: "num1+num2-num3*num4"
        for (let i = 0; i < playerNumbers.length; i++) {
            respuestaUsuario += playerNumbers[i];
            if (i < playerOperations.length) {
                respuestaUsuario += playerOperations[i];
            }
        }
    }

    // Build respuesta_correcta string
    let respuestaCorrect = "";
    if (correctNumbers && correctNumbers.length > 0) {
        for (let i = 0; i < correctNumbers.length; i++) {
            respuestaCorrect += correctNumbers[i];
            if (i < correctOperations.length) {
                respuestaCorrect += correctOperations[i];
            }
        }
        respuestaCorrect += "=" + challenge.target;
    } else {
        respuestaCorrect = "target=" + challenge.target;
    }

    console.log("Game 4: Guardando respuesta", {
        sesion_juego_id: window.sesionJuegoId,
        acertada: isCorrect,
        respuesta_usuario: respuestaUsuario,
        respuesta_correcta: respuestaCorrect,
        wasTimeout: wasTimeout,
    });

    // Send to backend
    const baseUrl = window.BASE_URL || window.location.origin;
    fetch(`${baseUrl}/sesion-juego/guardar-respuesta`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')
                .content,
        },
        body: JSON.stringify({
            id_sesion_juegos: window.sesionJuegoId,
            id_pregunta: null, // NULL for Game 4
            acertada: isCorrect,
            respuesta_usuario: respuestaUsuario,
            respuesta_correcta: respuestaCorrect,
            opciones: opcionesString,
        }),
    })
        .then(async (response) => {
            if (!response.ok) {
                const text = await response.text();
                console.error(
                    "Error al guardar respuesta Game 4 (HTTP " +
                        response.status +
                        "):",
                    text
                );
                throw new Error("HTTP " + response.status);
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                console.log(
                    "Game 4: Respuesta guardada en BD:",
                    data.respuesta_id
                );
            } else {
                console.error(
                    "Game 4: Error al guardar respuesta:",
                    data.error
                );
            }
        })
        .catch((error) =>
            console.error("Game 4: Error en la petición:", error)
        );
}

// Manejar el cierre inesperado de la página
window.addEventListener("beforeunload", function (e) {
    if (window.sesionJuegoId) {
        // Usar sendBeacon para enviar datos de forma asíncrona antes de cerrar
        const data = JSON.stringify({
            sesion_juego_id: window.sesionJuegoId,
            monedas_ganadas: 0,
            monedas_gastadas: 0,
            ganado: false,
        });

        // sendBeacon es más confiable que fetch para eventos beforeunload
        const blob = new Blob([data], { type: "application/json" });
        navigator.sendBeacon("/sesion-juego/finalizar", blob);
    }
});
