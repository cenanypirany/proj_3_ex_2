let inSearch = document.querySelector('#search');
let selGenus = document.querySelector('#genus');
let dateFrom = document.querySelector('#date_from');
let dateTo = document.querySelector('#date_to');
let selCountries = document.querySelector('#countries');

let map = L.map('map').setView([20, -0.09], 3);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let markers = L.layerGroup()

function filter() {
    let paramStr = '';
    if (inSearch.value) paramStr += `s=${inSearch.value}&`; 
    if (selGenus.value) paramStr += `genus=${selGenus.value}&`;
    if (dateFrom.value) paramStr += `date_from=${dateFrom.value}&`;
    if (dateTo.value) paramStr += `date_to=${dateTo.value}&`;
    if (selCountries.value) paramStr += `country=${selCountries.value}&`;

    let url = 'http://localhost:5000/api/filter?' + paramStr.slice(0, -1);

    markers.clearLayers()

    fetch(url)
        .then(res => res.json())
        .then(apiData => {
            apiData.data.forEach(sighting => {
                let marker;
    
                if (sighting.family.includes("Cats"))  
                    marker = L.marker(sighting.coords, {icon: orangeIcon});
                else if (sighting.family.includes("Elephants"))
                    marker = L.marker(sighting.coords, {icon: greenIcon});
    
                marker.bindPopup(`<h2>${sighting.name}</h2><h3>${sighting.country}: ${sighting.observation_date}</h3><p><img src="${sighting.image_url}" width=300 /></p>`);

                markers.addLayer(marker)
            })

            map.addLayer(markers)
        })
}

document.querySelector('#btnFilter').addEventListener('click', filter);

function init() {
    fetch('http://localhost:5000/api/countries')
        .then(res => res.json())
        .then(countries => {
            let html = '<option></option>';
            html += countries.map(country => `<option>${country}</option>`);
            selCountries.innerHTML = html;
        })

    filter();
}

init();