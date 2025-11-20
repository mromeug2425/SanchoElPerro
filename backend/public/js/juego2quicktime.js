// VARIABLES DEl QTE 
let qteActivo = false;
let qteFlechasRestantes = 0;
let flechaActual = null;
let imagenOriginalPlayer = null;
let qteTimerActual = 0;
let qteTimerInterval = null;
let audioMLG = null;  

//  FUNCIONES DE QTE 
function iniciarQTE() {
    // Cambiar la imagen del jugador a la imagen que hace un truco
    const contenedorPlayer = document.getElementById("contenedor-player");
    const imagenPlayer = contenedorPlayer.querySelector("img");
    if (imagenPlayer) {
        imagenOriginalPlayer = imagenPlayer.src;
        imagenPlayer.src = "/img/personajes/player/personajeskate.png";
    }
    
    
    audioMLG = new Audio("/audio/juegos/juego2/MLG.mp3");
    audioMLG.volume = 1;  
    
    
    audioMLG.addEventListener("canplay", function() {
        audioMLG.currentTime = 0;  // Empieza desde el principio
        setTimeout(function() {
            audioMLG.play();
            console.log("Audio MLG reproduciendo desde el principio...");
        }, 100);
    }, {once: true});  
    
    
    audioMLG.addEventListener("error", function(e) {
        console.error("Error al cargar audio MLG:", e);
        console.error("Código de error:", audioMLG.error);
    });
    
    qteActivo = true;
    qteFlechasRestantes = 6;
    
    // Crear un elemento para mostrar la flechita
    const qteContainer = document.createElement("div");
    qteContainer.id = "qte-container";
    qteContainer.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 100; text-align: center;";
    document.body.appendChild(qteContainer);
    
    // agregamos un contenedor al temporizador del qte 
    const timerDiv = document.createElement("div");
    timerDiv.className = "qte-timer";
    timerDiv.style.cssText = "font-size: 20px; color: #ff6b6b; margin-top: 15px; font-weight: bold;";
    qteContainer.appendChild(timerDiv);
    
    mostrarSiguienteFlechaQTE();
}

function mostrarSiguienteFlechaQTE() {
    const flechas = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    const textosFlechas = {
        "ArrowUp": "↑ ARRIBA",
        "ArrowDown": "↓ ABAJO",
        "ArrowLeft": "← IZQUIERDA",
        "ArrowRight": "→ DERECHA"
    };
    
    // Selecciona una flecha random
    flechaActual = flechas[Math.floor(Math.random() * flechas.length)];
    
    // Mostrar la flecha en pantalla
    const qteContainer = document.getElementById("qte-container");
    qteContainer.innerHTML = "<div style='font-size: 48px; color: white; text-shadow: 2px 2px 4px black; font-weight: bold;'>" + textosFlechas[flechaActual] + "</div>";
    qteContainer.innerHTML += "<div style='font-size: 24px; color: #ff9100ff; margin-top: 10px;'>Flechas restantes: " + qteFlechasRestantes + "</div>";
    
    // Inicia el timer para cada flechita (3 segundos)
    qteTimerActual = 3;
    actualizarDisplayTimerQTE();
    
    if (qteTimerInterval) {
        clearInterval(qteTimerInterval);
    }
    
    qteTimerInterval = setInterval(function() {
        qteTimerActual--;
        actualizarDisplayTimerQTE();
        
        if (qteTimerActual <= 0) {
            clearInterval(qteTimerInterval);
            // Se acabó el tiempo de la flecha
            fallarQTE();
        }
    }, 1000);
}

function actualizarDisplayTimerQTE() {
    const qteContainer = document.getElementById("qte-container");
    if (qteContainer) {
        const timerDiv = qteContainer.querySelector(".qte-timer");
        if (timerDiv) {
            timerDiv.textContent = "Tiempo: " + qteTimerActual + "s";
        }
    }
}

function procesarTeclaBTE(event) {
    if (!qteActivo) return;
    
    const teclaPrimera = event.key;
    
    if (teclaPrimera === flechaActual) {
        
        console.log("¡Flecha correcta presionada!");
        
        
        if (qteTimerInterval) {
            clearInterval(qteTimerInterval);
        }
        
        qteFlechasRestantes--;
        
        
        animarSkateSegunFlecha(flechaActual);
        
        if (qteFlechasRestantes > 0) {
            // Esperar un poco y mostrar siguiente flecha
            setTimeout(function() {
                mostrarSiguienteFlechaQTE();
            }, 300);
        } else {
            
            finalizarQTE();
        }
    }
}

function animarSkateSegunFlecha(flecha) {
    const contenedorPlayer = document.getElementById("contenedor-player");
    const imagenPlayer = contenedorPlayer.querySelector("img");
    if (!imagenPlayer) return;
    
    // Determinar dirección del giro según la flecha... todas giran igual en este caso :)
    let rotacionFinal = 0;
    
    if (flecha === "ArrowUp") {
        rotacionFinal = 360; 
    } else if (flecha === "ArrowDown") {
        rotacionFinal = -360; 
    } else if (flecha === "ArrowLeft") {
        rotacionFinal = -360; 
    } else if (flecha === "ArrowRight") {
        rotacionFinal = 360; 
    }
    
    // Aplicamos la  animación de giro completo
    imagenPlayer.style.transition = "transform 0.6s ease-in-out";
    imagenPlayer.style.transform = "rotate(" + rotacionFinal + "deg)";
    
    // Volver a la posicion original  
    setTimeout(function() {
        imagenPlayer.style.transition = "none";
        imagenPlayer.style.transform = "rotate(0deg)";
    }, 600);
}

function fallarQTE() {
    console.log("¡QTE fallido! Se acabó el tiempo.");
    qteActivo = false;
    
    // Detener el audio MLG
    if (audioMLG) {
        audioMLG.pause();
        audioMLG = null;
    }
    
    if (qteTimerInterval) {
        clearInterval(qteTimerInterval);
    }
    
    // Restaurar imagen original del jugador
    const contenedorPlayer = document.getElementById("contenedor-player");
    const imagenPlayer = contenedorPlayer.querySelector("img");
    if (imagenPlayer && imagenOriginalPlayer) {
        imagenPlayer.src = imagenOriginalPlayer;
    }
    
    // quita el container del QTE
    const qteContainer = document.getElementById("qte-container");
    if (qteContainer) {
        qteContainer.remove();
    }
    
    // El jugador no se mueve si falla
    // Simplemente sigue el juego normal 
    setTimeout(function() {
        mostrarPregunta(preguntaActual + 1);
    }, 600);
}

function finalizarQTE() {
    console.log("¡QTE Completado!");
    qteActivo = false;
    
    // Detener el audio MLG
    if (audioMLG) {
        audioMLG.pause();
        audioMLG = null;
    }
    
    if (qteTimerInterval) {
        clearInterval(qteTimerInterval);
    }
    
    // Restaurar imagen original del jugador
    const contenedorPlayer = document.getElementById("contenedor-player");
    const imagenPlayer = contenedorPlayer.querySelector("img");
    if (imagenPlayer && imagenOriginalPlayer) {
        imagenPlayer.src = imagenOriginalPlayer;
    }
    
    // quitar el container del QTE
    const qteContainer = document.getElementById("qte-container");
    if (qteContainer) {
        qteContainer.remove();
    }
    
    // La recompensa del jugador es que avanza 2 casillas
    posicionJugador += 2;
    if (posicionJugador > casillasTotal) {
        posicionJugador = casillasTotal;
    }
    const contenedorPlayerEl = document.getElementById("contenedor-player");
    contenedorPlayerEl.style.transition = "transform 0.6s ease-in-out";
    actualizarPosicion("player", posicionJugador);
    
    
    preguntaActual += 2;
    if (preguntaActual >= preguntas.length) {
        preguntaActual = preguntas.length - 1;
    }
    
    
    setTimeout(function() {
        mostrarPregunta(preguntaActual);
    }, 600);
}
