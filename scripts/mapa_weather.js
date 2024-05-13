import { fetchMeteo } from "./meteoApi.js";

var map = L.map('map').setView([0, 0], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function agregarMarcadores(favoritos) {
    if (favoritos.length > 0) {
        const primerFavorito = favoritos[0]; 
        const latitud = primerFavorito.lat;
        const longitud = primerFavorito.lon;

        map.setView([latitud, longitud], 13);

        favoritos.forEach(function(favorite) {
            fetchMeteo({lat: favorite.lat, lon: favorite.lon})
                .then(response => response.json())
                .then(data => {
                    const temperaturaActual = data.current.temperature_2m + "°C";

                    L.marker([favorite.lat, favorite.lon]).addTo(map) 
                        .bindPopup(`<b>${favorite.name}</b><br>Temperature: ${temperaturaActual}`) 
                        .openPopup();
                })
                .catch(error => console.error('Error fetching temperature:', error));
        });
    }
}

fetch('mapa_favorits.php') 
    .then(response => response.json()) 
    .then(data => {
        agregarMarcadores(data);
    })
    .catch(error => console.error('Error fetching favorite places:', error));
