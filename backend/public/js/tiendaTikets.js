document.addEventListener('DOMContentLoaded', function () {
			// Selecciona el botón de la tienda por su ID
			const botonTienda = document.getElementById('boton-tienda');

			if (!botonTienda) return; // Si no existe el botón, salir

			// Añade un evento de clic al botón
			botonTienda.addEventListener('click', function (event) {
				// Evita cualquier comportamiento por defecto que pudiera tener el botón
				event.preventDefault();

				// Obtenemos los tiquets del usuario desde el atributo data
				const tiquetsUsuario = parseInt(botonTienda.dataset.tiquets || '0', 10);

				if (tiquetsUsuario < 1) {
					// Si no tiene tiquets, muestra un pop-up
					alert('No tienes suficientes tiquets para entrar a la tienda.');
				} else {
					// Si tiene tiquets, redirige a la ruta de la tienda
					window.location.href = botonTienda.dataset.href;
				}
			});
		});