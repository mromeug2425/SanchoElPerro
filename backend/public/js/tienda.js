document.addEventListener("DOMContentLoaded", function () {
    const forms = document.querySelectorAll(".mejora-form");

    forms.forEach((form) => {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const idMejora = this.dataset.mejoraId;
            const precio = this.dataset.precio;

            fetch(window.comprarMejoraUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'input[name="_token"]'
                    ).value,
                },
                body: JSON.stringify({
                    id_mejora: idMejora,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        alert(data.message);
                        location.reload();
                    } else {
                        alert(data.message);
                    }
                })
                .catch((error) => {
                    alert("Error al procesar la compra");
                    console.error(error);
                });
        });
    });
});
