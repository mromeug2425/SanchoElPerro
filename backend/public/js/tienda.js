// TIENDA - Lógica de compra de mejoras

// Función para comprar mejora
function comprarMejora(idMejora) {
    console.log('💰 Intentando comprar mejora con ID:', idMejora);
    
    // Confirmar la compra
    if (!confirm('¿Estás seguro de que quieres comprar esta mejora?')) {
        return;
    }
    
    // Obtener el token CSRF
    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    
    if (!csrfToken) {
        alert('Error: Token CSRF no encontrado');
        return;
    }
    
    // Hacer la petición POST para comprar
    fetch('/tienda/comprar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken.content,
            'Accept': 'application/json'
        },
        body: JSON.stringify({ 
            mejora_id: idMejora,
            nivel: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`✅ ${data.message}\n\nMejora: ${data.mejora}\nPrecio: ${data.precio_pagado} monedas\nMonedas restantes: ${data.monedas_restantes}`);
            location.reload();
        } else {
            alert(`❌ ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Error al comprar:', error);
        alert('Error al procesar la compra. Inténtalo de nuevo.');
    });
}
