import { fetchMeteo } from "./meteoApi.js";

document.addEventListener("DOMContentLoaded", function() {
    function agregarLugaresTabla(favoritos) {
        const tbody = document.querySelector("#tabla-lugares tbody");

        favoritos.forEach(function(favorite) {
            fetchMeteo({lat: favorite.lat, lon: favorite.lon})
                .then(response => response.json())
                .then(data => {
                    const temperaturaActual = data.current.temperature_2m + "°C";

                    const fila = document.createElement("tr");

                    fila.innerHTML = `
                        <td>${favorite.name}</td>
                        <td>${temperaturaActual}</td>
                        <td>
                            <button class="btn btn-danger btn-sm btn-eliminar" data-id="${favorite.id}">Eliminar</button>
                        </td>
                    `;

                    tbody.appendChild(fila);
                })
                .catch(error => console.error('Error fetching temperature:', error));
        });
    }

    function actualizarTabla() {
        const tbody = document.querySelector("#tabla-lugares tbody");
        tbody.innerHTML = "";
        fetch('favorito_gestion.php') 
            .then(response => response.json()) 
            .then(data => {
                agregarLugaresTabla(data);
            })
            .catch(error => console.error('Error fetching favorite places:', error));
    }

    actualizarTabla();

    document.querySelector("#tabla-lugares tbody").addEventListener("click", function(event) {
        if (event.target.classList.contains("btn-eliminar")) {
            const id = event.target.getAttribute("data-id");
            const confirmacion = confirm(`Are you sure you want to delete the favorite place?`);
            if (confirmacion) {
                fetch('favorito_gestion.php?id=' + id, {
                    method: 'DELETE'
                })
                .then(response => response.text())
                .then(message => {
                    alert(message);
                    if (message === "Favorite place deleted successfully") {
                        window.location.reload(); 
                        actualizarTabla();

                    }
                })
                .catch(error => console.error('Error deleting favorite place:', error));
            }
        }
    });
});
