// Sistema de posicionamiento de mejoras por nombre
// Puedes controlar cada mejora específicamente usando su nombre de archivo

const posicionesMejoras = {
    'casa.png': {
        top: '70%',
        left: '10%',
        width: '350px',
        zIndex: 2
    },
    'duplex.png': {
        top: '5%',
        right: '62%',
        width: '300px',
        zIndex: 1
    },
    'estatua_dorada.png': {
        bottom: '5%',
        left: '50%',
        width: '100px',
        zIndex: 3
    },
    'helicoptero.png': {
        top: '15%',
        right: '25%',
        width: '130px',
        zIndex: 4
    },
    'perro.png': {
        bottom: '0%',
        right: '50%',
        width: '110px',
        zIndex: 5
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const imagenes = document.querySelectorAll('.mejora-img');

    imagenes.forEach(img => {
        const src = img.getAttribute('src');
        const nombreArchivo = src.split('/').pop();
        const estaComprada = img.getAttribute('data-comprada') === 'true';

        // Si no está comprada, ocultar
        if (!estaComprada) {
            img.style.display = 'none';
            return;
        }

        // Si está comprada, aplicar posición
        if (posicionesMejoras[nombreArchivo]) {
            const posicion = posicionesMejoras[nombreArchivo];
            Object.assign(img.style, posicion);
            console.log(`Posicionando ${nombreArchivo}:`, posicion);
        }
    });
});