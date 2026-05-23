// 7. Data structuur voor de landen
const collectionConfig = [
    { prefix: 'FWC', name: 'FIFA World Cup', count: 20, flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Logo_de_la_Copa_Mundial_de_f%C3%BAtbol_2026.svg/200px-Logo_de_la_Copa_Mundial_de_f%C3%BAtbol_2026.svg.png' },
    { prefix: 'MEX', name: 'Mexico', count: 20, flagUrl: 'https://flagcdn.com/w160/mx.png' },
    { prefix: 'FRA', name: 'Frankrijk', count: 20, flagUrl: 'https://flagcdn.com/w160/fr.png' },
    { prefix: 'POR', name: 'Portugal', count: 20, flagUrl: 'https://flagcdn.com/w160/pt.png' },
    { prefix: 'COL', name: 'Colombia', count: 20, flagUrl: 'https://flagcdn.com/w160/co.png' },
    { prefix: 'COD', name: 'Congo DR', count: 20, flagUrl: 'https://flagcdn.com/w160/cd.png' }
    // Voeg hier later de andere landen toe...
];

const countriesContainer = document.getElementById('countries-container');

// 8. Functie om de lijst te genereren op het scherm
function renderDashboard() {
    countriesContainer.innerHTML = ''; // Maak de container eerst leeg

    collectionConfig.forEach(country => {
        // Maak de hoofdrij aan
        const row = document.createElement('div');
        row.className = 'country-row';
        row.onclick = () => openCountryDetail(country.prefix); // Voor later

        // HTML structuur voor de rij opbouwen
        row.innerHTML = `
            <div class="country-info">
                <div class="flag-circle" style="background-image: url('${country.flagUrl}');"></div>
                <span class="country-name">${country.name}</span>
            </div>
            <div class="stats">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%;"></div> 
                </div>
                <span class="percentage-text">0 / 20 (0%)</span>
            </div>
        `;

        countriesContainer.appendChild(row);
    });
}

// 9. Tijdelijke functie voor als je op een land klikt
function openCountryDetail(prefix) {
    alert(`Binnenkort openen we hier de 20 stickers voor: ${prefix}`);
}
