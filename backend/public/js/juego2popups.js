// FUNCIONES DE LOS POPUPS

function mostrarPopup(titulo, mensaje, esCorrecto) {
    const popup = document.getElementById("popup-resultado");
    const popupContenido = document.getElementById("popup-contenido");
    const popupTitulo = document.getElementById("popup-titulo");
    const popupMensaje = document.getElementById("popup-mensaje");

    if (esCorrecto) {
        popupContenido.style.borderColor = "#7545f8ff";
        popupTitulo.style.color = "#7545f8ff";
        popupTitulo.textContent = titulo;
    } else {
        popupContenido.style.borderColor = "#f78708ff";
        popupTitulo.style.color = "#f78708ff";
        popupTitulo.textContent = titulo;
    }

    popupMensaje.textContent = mensaje;
    popupMensaje.style.color = "#4b5563";

    popup.classList.remove("hidden");
    popupContenido.style.transform = "scale(1)";
}

function cerrarPopup() {
    const popup = document.getElementById("popup-resultado");
    const popupContenido = document.getElementById("popup-contenido");

    popupContenido.style.transform = "scale(0.95)";
    
    setTimeout(function() {
        popup.classList.add("hidden");
        
        // Mover camello
        moverCamello();
        
        // Esperar a que termine la animación del camello 
        setTimeout(function() {
            // Mover jugador si acertó la pregunta
            if (respuestaEsCorrecto) {
                moverJugador();
            }
            
            // Esperar a que termine la animación del jugador 
            setTimeout(function() {
                const ganador = verificarGanador();
                
                if (ganador === "camello") {
                    deshabilitarBotones();
                    mostrarPantallaDerrota();
                } else if (ganador === "player") {
                    mostrarPopup(
                        "¡VICTORIA !",
                        "¡Has llegado a la meta! ¡Ganaste!",
                        true
                    );
                    deshabilitarBotones();
                } else {
                    siguientePregunta();
                }
            }, 600);
        }, 600);
    }, 200);
}

function mostrarPantallaDerrota() {
    // Crear la capa oscura en la pantalla donde pasara el camello moving
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 bg-black opacity-50 z-40";
    document.body.appendChild(overlay);

    
    const container = document.createElement("div");
    container.id = "camello-moving-container";
    container.className =
        "fixed inset-0 flex items-center justify-center z-50 overflow-hidden";
    document.body.appendChild(container);

    
    const camelImg = document.createElement("img");
    camelImg.src = "/img/personajes/camello/camel_moving.png";
    camelImg.alt = "Camello Moving";
    camelImg.style.cssText = `
        width: 400px;
        height: auto;
        animation: camelMovingAnimation 5s ease-in-out forwards;
    `;

    container.appendChild(camelImg);

    // se espera 5 segundos que dura la animacion y se reinicia el juego
    setTimeout(function() {
        overlay.remove();
        container.remove();
        reiniciarJuego();
    }, 5000);
}
