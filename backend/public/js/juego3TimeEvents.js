// ============================================
// CONFIGURACIÓN DE TIME EVENTS
// ============================================

const configuracionFormas = {
    tipos: ['circulo', 'cuadrado', 'triangulo', 'estrella'],
    colores: ['#FFD700', '#FF6347', '#4169E1', '#32CD32', '#FF69B4', '#FFA500'],
    tiempoBonus: 3,  // segundos que suma cada forma
    intervaloAparicion: 3000,  // cada cuánto aparece una forma (3 segundos - más rápido)
    duracionVisible: 6000,  // cuánto tiempo está visible antes de desaparecer (más tiempo)
    tamaños: {
        min: 50,
        max: 80
    },
    distanciaCaptura: 80,  // distancia en píxeles para considerar que llegó a la meta
};

// ============================================
// VARIABLES GLOBALES
// ============================================

let intervaloFormas = null;  // Controla la aparición de formas
let formasActivas = [];  // Array de formas actualmente en pantalla
let formasCapturadas = 0;  // Contador de formas capturadas
let puntoMeta = null;  // El punto objetivo donde arrastrar las formas
let formaSiendoArrastrada = null;  // Forma que está siendo arrastrada actualmente
let offsetX = 0;  // Offset del mouse respecto a la forma
let offsetY = 0;

// ============================================
// FUNCIONES PRINCIPALES
// ============================================

/**
 * Inicia el sistema de time events
 * Se ejecuta cuando comienza una nueva pregunta
 */
function iniciarTimeEvents() {
    // Detener eventos anteriores si existen
    detenerTimeEvents();
    
    // Crear el punto meta primero
    crearPuntoMeta();
    
    // Crear la primera forma inmediatamente
    crearFormaAleatoria();
    
    // Iniciar aparición aleatoria de formas
    intervaloFormas = setInterval(() => {
        crearFormaAleatoria();
    }, configuracionFormas.intervaloAparicion);
}

/**
 * Crea el punto meta (objetivo) donde arrastrar las formas
 */
function crearPuntoMeta() {
    // Eliminar meta anterior si existe
    if (puntoMeta && puntoMeta.parentNode) {
        puntoMeta.remove();
    }
    
    const meta = document.createElement('div');
    meta.className = 'punto-meta';
    meta.id = 'punto-meta';
    
    // Estilos del punto meta
    meta.style.position = 'absolute';
    meta.style.width = '100px';
    meta.style.height = '100px';
    meta.style.borderRadius = '50%';
    meta.style.border = '5px dashed #FFD700';
    meta.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
    meta.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 20px rgba(255, 215, 0, 0.3)';
    meta.style.zIndex = '10';
    meta.style.cursor = 'default';
    meta.style.animation = 'pulsoMeta 2s ease-in-out infinite';
    meta.style.pointerEvents = 'none'; // No interfiere con el drag
    
    // Agregar icono de objetivo en el centro
    const icono = document.createElement('div');
    icono.innerHTML = '🎯';
    icono.style.position = 'absolute';
    icono.style.top = '50%';
    icono.style.left = '50%';
    icono.style.transform = 'translate(-50%, -50%)';
    icono.style.fontSize = '40px';
    icono.style.userSelect = 'none';
    meta.appendChild(icono);
    
    // Posicionar aleatoriamente
    posicionarMetaAleatoria(meta);
    
    // Agregar al DOM
    const contenedor = document.querySelector('main');
    contenedor.appendChild(meta);
    puntoMeta = meta;
    
    // Cambiar posición de la meta cada 3 segundos
    setInterval(() => {
        if (puntoMeta && puntoMeta.parentNode) {
            moverMetaSuavemente();
        }
    }, 3000);
}

/**
 * Posiciona la meta en una ubicación aleatoria (cualquier parte de la ventana)
 */
function posicionarMetaAleatoria(meta) {
    const contenedor = document.querySelector('main');
    const rect = contenedor.getBoundingClientRect();
    
    // Márgenes más pequeños para aprovechar toda la ventana
    const margen = 50;
    const margenInferior = 180; // Reducido para que llegue más abajo
    
    // Posición completamente aleatoria en toda la ventana
    const x = obtenerNumeroAleatorio(margen, rect.width - margen - 100);
    const y = obtenerNumeroAleatorio(margen, rect.height - margen - margenInferior);
    
    meta.style.left = x + 'px';
    meta.style.top = y + 'px';
}

/**
 * Mueve la meta suavemente a una nueva posición completamente aleatoria
 */
function moverMetaSuavemente() {
    if (!puntoMeta) return;
    
    // Efecto de "teletransporte" rápido
    puntoMeta.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    puntoMeta.style.transform = 'scale(0.7) rotate(180deg)';
    
    setTimeout(() => {
        if (puntoMeta) {
            posicionarMetaAleatoria(puntoMeta);
            puntoMeta.style.transform = 'scale(1) rotate(0deg)';
        }
    }, 150);
    
    setTimeout(() => {
        if (puntoMeta) {
            puntoMeta.style.transition = '';
        }
    }, 450);
}

/**
 * Crea y muestra una forma geométrica aleatoria en pantalla
 */
function crearFormaAleatoria() {
    // 1. Generar propiedades aleatorias
    const tipo = obtenerElementoAleatorio(configuracionFormas.tipos);
    const color = obtenerElementoAleatorio(configuracionFormas.colores);
    const tamaño = obtenerNumeroAleatorio(
        configuracionFormas.tamaños.min, 
        configuracionFormas.tamaños.max
    );
    
    // 2. Crear elemento DOM
    const forma = document.createElement('div');
    forma.className = 'time-event-forma';
    forma.dataset.tipo = tipo;
    forma.dataset.activa = 'true';
    forma.dataset.tamaño = tamaño;
    
    // 3. Aplicar estilos
    aplicarEstiloForma(forma, tipo, color, tamaño);
    
    // 4. Posicionar aleatoriamente (más esparcido)
    posicionarFormaAleatoriaEsparcida(forma);
    
    // 5. Agregar eventos de arrastre
    forma.addEventListener('mousedown', iniciarArrastre);
    forma.addEventListener('touchstart', iniciarArrastre);
    
    // 6. Agregar al DOM y al array de formas activas
    const contenedor = document.querySelector('main');
    if (!contenedor) {
        console.error('No se encontró el contenedor main');
        return;
    }
    
    contenedor.appendChild(forma);
    formasActivas.push(forma);
    
    // 7. Programar auto-destrucción
    const timeoutId = setTimeout(() => {
        eliminarForma(forma, true); // true = desaparecer por timeout
    }, configuracionFormas.duracionVisible);
    
    // Guardar el timeout para poder cancelarlo si se captura antes
    forma.dataset.timeoutId = timeoutId;
    
    // 8. Animación de entrada
    setTimeout(() => {
        if (forma.dataset.activa === 'true') {
            forma.style.opacity = '0.9';
            forma.style.transform = 'scale(1) rotate(0deg)';
        }
    }, 10);
    
    // 9. Animación de pulsación continua
    animarPulsacion(forma);
}

/**
 * Aplica estilos CSS a la forma según su tipo
 */
function aplicarEstiloForma(forma, tipo, color, tamaño) {
    // Estilos base comunes
    forma.style.position = 'absolute';
    forma.style.width = tamaño + 'px';
    forma.style.height = tamaño + 'px';
    forma.style.backgroundColor = color;
    forma.style.cursor = 'grab';
    forma.style.transition = 'all 0.3s ease';
    forma.style.opacity = '0';
    forma.style.transform = 'scale(0.3) rotate(-180deg)';
    forma.style.zIndex = '15';
    forma.style.boxShadow = '0 4px 15px rgba(0,0,0,0.4), 0 0 20px ' + color + '40';
    forma.style.border = '3px solid rgba(255,255,255,0.5)';
    forma.style.userSelect = 'none';
    forma.style.touchAction = 'none';
    
    // Estilos específicos según el tipo
    switch(tipo) {
        case 'circulo':
            forma.style.borderRadius = '50%';
            break;
            
        case 'cuadrado':
            forma.style.borderRadius = '12px';
            break;
            
        case 'triangulo':
            // Usar border-trick para triángulo
            forma.style.width = '0';
            forma.style.height = '0';
            forma.style.backgroundColor = 'transparent';
            forma.style.borderLeft = (tamaño/2) + 'px solid transparent';
            forma.style.borderRight = (tamaño/2) + 'px solid transparent';
            forma.style.borderBottom = tamaño + 'px solid ' + color;
            forma.style.border = 'none';
            forma.style.boxShadow = '0 4px 15px rgba(0,0,0,0.4)';
            break;
            
        case 'estrella':
            // Usar clip-path para estrella
            forma.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
            break;
    }
}

/**
 * Posiciona la forma en una ubicación aleatoria más esparcida
 */
function posicionarFormaAleatoriaEsparcida(forma) {
    const contenedor = document.querySelector('main');
    const rect = contenedor.getBoundingClientRect();
    
    // Márgenes más reducidos para aprovechar todo el espacio
    const margenHorizontal = 40;
    const margenVertical = 80;
    const margenInferior = 200; // Evitar botones de respuestas
    
    const maxX = rect.width - margenHorizontal - 80;
    const maxY = rect.height - margenVertical - margenInferior;
    
    // Distribuir en zonas para que aparezcan más esparcidas
    const zonas = [
        { minX: margenHorizontal, maxX: rect.width / 3, minY: margenVertical, maxY: maxY / 2 },
        { minX: rect.width / 3, maxX: (rect.width * 2) / 3, minY: margenVertical, maxY: maxY / 2 },
        { minX: (rect.width * 2) / 3, maxX: maxX, minY: margenVertical, maxY: maxY / 2 },
        { minX: margenHorizontal, maxX: rect.width / 3, minY: maxY / 2, maxY: maxY },
        { minX: rect.width / 3, maxX: (rect.width * 2) / 3, minY: maxY / 2, maxY: maxY },
        { minX: (rect.width * 2) / 3, maxX: maxX, minY: maxY / 2, maxY: maxY }
    ];
    
    const zona = obtenerElementoAleatorio(zonas);
    const x = obtenerNumeroAleatorio(zona.minX, zona.maxX);
    const y = obtenerNumeroAleatorio(zona.minY, zona.maxY);
    
    forma.style.left = x + 'px';
    forma.style.top = y + 'px';
}

/**
 * Anima la forma con una pulsación continua
 */
function animarPulsacion(forma) {
    if (!forma || forma.dataset.activa !== 'true') return;
    
    const intervalo = setInterval(() => {
        if (!forma || forma.dataset.activa !== 'true' || !forma.parentNode) {
            clearInterval(intervalo);
            return;
        }
        
        // Animación de escala pulsante
        forma.style.transform = 'scale(1.1) rotate(5deg)';
        setTimeout(() => {
            if (forma && forma.dataset.activa === 'true') {
                forma.style.transform = 'scale(1) rotate(0deg)';
            }
        }, 300);
        
    }, 1500);
    
    // Guardar el intervalo para limpiarlo después
    forma.dataset.intervaloId = intervalo;
}

/**
 * Inicia el arrastre de una forma
 */
function iniciarArrastre(e) {
    e.preventDefault();
    
    const forma = e.target.closest('.time-event-forma');
    if (!forma || forma.dataset.activa !== 'true') return;
    
    formaSiendoArrastrada = forma;
    
    // Calcular offset del mouse respecto a la forma
    const rect = forma.getBoundingClientRect();
    const contenedorRect = document.querySelector('main').getBoundingClientRect();
    
    if (e.type === 'mousedown') {
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    } else if (e.type === 'touchstart') {
        offsetX = e.touches[0].clientX - rect.left;
        offsetY = e.touches[0].clientY - rect.top;
    }
    
    // Cambiar apariencia durante el arrastre
    forma.style.cursor = 'grabbing';
    forma.style.zIndex = '25';
    forma.style.transform = 'scale(1.1) rotate(5deg)';
    forma.style.transition = 'transform 0.1s ease';
    
    // Cancelar animación de pulsación
    if (forma.dataset.intervaloId) {
        clearInterval(forma.dataset.intervaloId);
    }
    
    // Agregar eventos de movimiento y soltar
    document.addEventListener('mousemove', moverForma);
    document.addEventListener('mouseup', soltarForma);
    document.addEventListener('touchmove', moverForma);
    document.addEventListener('touchend', soltarForma);
}

/**
 * Mueve la forma mientras se arrastra
 */
function moverForma(e) {
    if (!formaSiendoArrastrada) return;
    
    e.preventDefault();
    
    const contenedor = document.querySelector('main');
    const contenedorRect = contenedor.getBoundingClientRect();
    
    let clientX, clientY;
    if (e.type === 'mousemove') {
        clientX = e.clientX;
        clientY = e.clientY;
    } else if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }
    
    // Calcular posición relativa al contenedor
    let x = clientX - contenedorRect.left - offsetX;
    let y = clientY - contenedorRect.top - offsetY;
    
    // Limitar a los bordes del contenedor
    const maxX = contenedorRect.width - formaSiendoArrastrada.offsetWidth;
    const maxY = contenedorRect.height - formaSiendoArrastrada.offsetHeight;
    
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));
    
    formaSiendoArrastrada.style.left = x + 'px';
    formaSiendoArrastrada.style.top = y + 'px';
    
    // Verificar proximidad con la meta
    verificarProximidadMeta();
}

/**
 * Suelta la forma y verifica si llegó a la meta
 */
function soltarForma(e) {
    if (!formaSiendoArrastrada) return;
    
    e.preventDefault();
    
    // Verificar si está sobre la meta
    const llegóALaMeta = verificarLlegadaMeta();
    
    if (llegóALaMeta) {
        capturarForma(formaSiendoArrastrada);
    } else {
        // Restaurar apariencia si no llegó a la meta
        formaSiendoArrastrada.style.cursor = 'grab';
        formaSiendoArrastrada.style.zIndex = '15';
        formaSiendoArrastrada.style.transform = 'scale(1) rotate(0deg)';
        
        // Reiniciar animación de pulsación
        animarPulsacion(formaSiendoArrastrada);
    }
    
    formaSiendoArrastrada = null;
    
    // Remover eventos
    document.removeEventListener('mousemove', moverForma);
    document.removeEventListener('mouseup', soltarForma);
    document.removeEventListener('touchmove', moverForma);
    document.removeEventListener('touchend', soltarForma);
}

/**
 * Verifica la proximidad de la forma con la meta
 */
function verificarProximidadMeta() {
    if (!formaSiendoArrastrada || !puntoMeta) return;
    
    const distancia = calcularDistancia(formaSiendoArrastrada, puntoMeta);
    
    // Efecto visual cuando está cerca
    if (distancia < configuracionFormas.distanciaCaptura * 1.5) {
        puntoMeta.style.transform = 'scale(1.1)';
        puntoMeta.style.backgroundColor = 'rgba(255, 215, 0, 0.4)';
        formaSiendoArrastrada.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.8)';
    } else {
        puntoMeta.style.transform = 'scale(1)';
        puntoMeta.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
        formaSiendoArrastrada.style.boxShadow = '';
    }
}

/**
 * Verifica si la forma llegó a la meta
 */
function verificarLlegadaMeta() {
    if (!formaSiendoArrastrada || !puntoMeta) return false;
    
    const distancia = calcularDistancia(formaSiendoArrastrada, puntoMeta);
    
    return distancia < configuracionFormas.distanciaCaptura;
}

/**
 * Calcula la distancia entre dos elementos
 */
function calcularDistancia(elem1, elem2) {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();
    
    const centro1X = rect1.left + rect1.width / 2;
    const centro1Y = rect1.top + rect1.height / 2;
    const centro2X = rect2.left + rect2.width / 2;
    const centro2Y = rect2.top + rect2.height / 2;
    
    return Math.sqrt(Math.pow(centro2X - centro1X, 2) + Math.pow(centro2Y - centro1Y, 2));
}

/**
 * Maneja la captura de una forma por el usuario
 */
function capturarForma(forma) {
    // Verificar que la forma sigue activa
    if (forma.dataset.activa !== 'true') return;
    
    // Marcar como inactiva para evitar doble captura
    forma.dataset.activa = 'false';
    
    // Cancelar auto-destrucción
    if (forma.dataset.timeoutId) {
        clearTimeout(forma.dataset.timeoutId);
    }
    
    // Cancelar animación de pulsación
    if (forma.dataset.intervaloId) {
        clearInterval(forma.dataset.intervaloId);
    }
    
    // 1. Añadir tiempo al timer
    tiempoRestante += configuracionFormas.tiempoBonus;
    actualizarDisplayTimer();
    
    // 2. Animar forma hacia el centro de la meta
    animarFormaHaciaMeta(forma);
    
    // 3. Mostrar feedback visual
    mostrarBonusTiempo(forma);
    
    // 4. Reproducir sonido (opcional - si tienes audio)
    reproducirSonidoCaptura();
    
    // 5. Incrementar contador
    formasCapturadas++;
    
    // 6. Efecto de partículas
    crearParticulasCaptura(forma);
    
    // 7. Efecto en la meta
    animarMetaCaptura();
    
    // 8. Eliminar forma
    setTimeout(() => {
        eliminarForma(forma, false);
    }, 400);
}

/**
 * Anima la forma hacia el centro de la meta al capturarla
 */
function animarFormaHaciaMeta(forma) {
    if (!puntoMeta) return;
    
    const metaRect = puntoMeta.getBoundingClientRect();
    const contenedorRect = document.querySelector('main').getBoundingClientRect();
    
    const metaCentroX = metaRect.left - contenedorRect.left + metaRect.width / 2;
    const metaCentroY = metaRect.top - contenedorRect.top + metaRect.height / 2;
    
    forma.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    forma.style.left = (metaCentroX - forma.offsetWidth / 2) + 'px';
    forma.style.top = (metaCentroY - forma.offsetHeight / 2) + 'px';
    forma.style.transform = 'scale(0.5) rotate(360deg)';
    forma.style.opacity = '0';
}

/**
 * Anima la meta cuando se captura una forma
 */
function animarMetaCaptura() {
    if (!puntoMeta) return;
    
    puntoMeta.style.transition = 'all 0.3s ease';
    puntoMeta.style.transform = 'scale(1.3)';
    puntoMeta.style.backgroundColor = 'rgba(255, 215, 0, 0.5)';
    puntoMeta.style.boxShadow = '0 0 50px rgba(255, 215, 0, 1)';
    
    setTimeout(() => {
        if (puntoMeta) {
            puntoMeta.style.transform = 'scale(1)';
            puntoMeta.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
            puntoMeta.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 20px rgba(255, 215, 0, 0.3)';
        }
    }, 300);
}

/**
 * Muestra el texto de bonus de tiempo cuando se captura una forma
 */
function mostrarBonusTiempo(forma) {
    const bonus = document.createElement('div');
    bonus.textContent = `+${configuracionFormas.tiempoBonus}s`;
    bonus.className = 'bonus-tiempo';
    
    // Obtener posición de la forma
    const rect = forma.getBoundingClientRect();
    const contenedorRect = document.querySelector('main').getBoundingClientRect();
    
    bonus.style.position = 'absolute';
    bonus.style.left = (rect.left - contenedorRect.left + rect.width / 2) + 'px';
    bonus.style.top = (rect.top - contenedorRect.top) + 'px';
    bonus.style.color = '#FFD700';
    bonus.style.fontSize = '32px';
    bonus.style.fontWeight = 'bold';
    bonus.style.fontFamily = 'Arial, sans-serif';
    bonus.style.zIndex = '25';
    bonus.style.pointerEvents = 'none';
    bonus.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px #FFD700';
    bonus.style.transform = 'translate(-50%, 0)';
    bonus.style.animation = 'floatUp 1.2s ease-out forwards';
    
    document.querySelector('main').appendChild(bonus);
    
    setTimeout(() => {
        if (bonus.parentNode) {
            bonus.remove();
        }
    }, 1200);
}

/**
 * Crea un efecto de partículas cuando se captura una forma
 */
function crearParticulasCaptura(forma) {
    const rect = forma.getBoundingClientRect();
    const contenedorRect = document.querySelector('main').getBoundingClientRect();
    const centerX = rect.left - contenedorRect.left + rect.width / 2;
    const centerY = rect.top - contenedorRect.top + rect.height / 2;
    const color = forma.style.backgroundColor || '#FFD700';
    
    // Crear 8 partículas que se expanden en todas direcciones
    for (let i = 0; i < 8; i++) {
        const particula = document.createElement('div');
        particula.style.position = 'absolute';
        particula.style.left = centerX + 'px';
        particula.style.top = centerY + 'px';
        particula.style.width = '8px';
        particula.style.height = '8px';
        particula.style.backgroundColor = color;
        particula.style.borderRadius = '50%';
        particula.style.zIndex = '20';
        particula.style.pointerEvents = 'none';
        particula.style.boxShadow = '0 0 10px ' + color;
        
        const angulo = (i / 8) * Math.PI * 2;
        const distancia = 60;
        const tx = Math.cos(angulo) * distancia;
        const ty = Math.sin(angulo) * distancia;
        
        particula.style.transition = 'all 0.6s ease-out';
        
        document.querySelector('main').appendChild(particula);
        
        setTimeout(() => {
            particula.style.transform = `translate(${tx}px, ${ty}px)`;
            particula.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            if (particula.parentNode) {
                particula.remove();
            }
        }, 650);
    }
}

/**
 * Reproduce un sonido al capturar (opcional)
 */
function reproducirSonidoCaptura() {
    // Puedes agregar un elemento de audio si tienes un archivo de sonido
    // const audio = new Audio('/sounds/captura.mp3');
    // audio.play();
}

/**
 * Elimina una forma del DOM y del array de formas activas
 */
function eliminarForma(forma, porTimeout = false) {
    if (!forma) return;
    
    // Marcar como inactiva
    forma.dataset.activa = 'false';
    
    // Si desaparece por timeout, hacer animación de desvanecimiento
    if (porTimeout) {
        forma.style.transition = 'all 0.5s ease-out';
        forma.style.opacity = '0';
        forma.style.transform = 'scale(0.3) rotate(180deg)';
    }
    
    // Cancelar timers e intervalos
    if (forma.dataset.timeoutId) {
        clearTimeout(forma.dataset.timeoutId);
    }
    if (forma.dataset.intervaloId) {
        clearInterval(forma.dataset.intervaloId);
    }
    
    // Remover del array
    const index = formasActivas.indexOf(forma);
    if (index > -1) {
        formasActivas.splice(index, 1);
    }
    
    // Remover del DOM
    setTimeout(() => {
        if (forma && forma.parentNode) {
            forma.remove();
        }
    }, porTimeout ? 500 : 0);
}

/**
 * Detiene todos los time events
 * Se ejecuta cuando se responde o se acaba el tiempo
 */
function detenerTimeEvents() {
    // Detener creación de nuevas formas
    if (intervaloFormas) {
        clearInterval(intervaloFormas);
        intervaloFormas = null;
    }
    
    // Eliminar la meta
    if (puntoMeta && puntoMeta.parentNode) {
        puntoMeta.style.transition = 'all 0.3s ease-out';
        puntoMeta.style.opacity = '0';
        puntoMeta.style.transform = 'scale(0)';
        setTimeout(() => {
            if (puntoMeta && puntoMeta.parentNode) {
                puntoMeta.remove();
            }
            puntoMeta = null;
        }, 300);
    }
    
    // Limpiar eventos de arrastre si hay algo siendo arrastrado
    if (formaSiendoArrastrada) {
        document.removeEventListener('mousemove', moverForma);
        document.removeEventListener('mouseup', soltarForma);
        document.removeEventListener('touchmove', moverForma);
        document.removeEventListener('touchend', soltarForma);
        formaSiendoArrastrada = null;
    }
    
    // Eliminar todas las formas activas con animación
    formasActivas.forEach((forma, index) => {
        setTimeout(() => {
            if (forma && forma.parentNode) {
                forma.style.transition = 'all 0.3s ease-out';
                forma.style.opacity = '0';
                forma.style.transform = 'scale(0)';
                
                setTimeout(() => {
                    eliminarForma(forma, false);
                }, 300);
            }
        }, index * 50); // Pequeño delay entre cada una para efecto cascada
    });
    
    formasActivas = [];
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Retorna un elemento aleatorio de un array
 */
function obtenerElementoAleatorio(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Retorna un número aleatorio entre min y max (inclusive)
 */
function obtenerNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Obtiene estadísticas de las formas capturadas
 */
function obtenerEstadisticasTimeEvents() {
    return {
        formasCapturadas: formasCapturadas,
        formasActivas: formasActivas.length,
        tiempoGanado: formasCapturadas * configuracionFormas.tiempoBonus
    };
}

/**
 * Reinicia el contador de formas capturadas
 */
function reiniciarContadorFormas() {
    formasCapturadas = 0;
}

// ============================================
// CSS DINÁMICO
// ============================================

// Inyectar estilos CSS en el documento
const estilosTimeEvents = document.createElement('style');
estilosTimeEvents.textContent = `
    @keyframes floatUp {
        0% {
            transform: translate(-50%, 0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -80px) scale(1.3);
            opacity: 0;
        }
    }
    
    @keyframes pulsoMeta {
        0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.6), inset 0 0 20px rgba(255, 215, 0, 0.3);
        }
        50% {
            transform: scale(1.05);
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.8), inset 0 0 25px rgba(255, 215, 0, 0.4);
        }
    }
    
    .time-event-forma:hover {
        transform: scale(1.1) !important;
        filter: brightness(1.2) saturate(1.2);
    }
    
    .time-event-forma:active {
        cursor: grabbing !important;
    }
    
    .bonus-tiempo {
        user-select: none;
        -webkit-user-select: none;
    }
    
    .punto-meta {
        transition: transform 0.2s ease, background-color 0.2s ease;
    }
`;

// Agregar los estilos al documento cuando se carga el script
if (document.head) {
    document.head.appendChild(estilosTimeEvents);
} else {
    document.addEventListener('DOMContentLoaded', () => {
        document.head.appendChild(estilosTimeEvents);
    });
}

console.log('✅ Sistema de Time Events cargado correctamente');