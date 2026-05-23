// app.js - Logic for dual progress & dynamic styling
const supabaseUrl = 'https://badovrzzxwbkxjgqkxjg.supabase.co'; 
const supabaseKey = 'sb_publishable_qI0tAKHoKqgC1hn_oP6XzA...'; // Vul hier jouw volledige key in!

let supabaseClient = null;
let isOfflineFallback = false;
let currentUser = '';
let otherUser = '';
let myStickers = {};
let otherUserStickers = {}; // Hier slaan we de data van de andere speler op

// Initialisatie veilig uitvoeren om crashes te voorkomen
try {
    if (supabaseUrl.includes('JOUW_PROJECT_ID') || supabaseKey.includes('sb_publishable_JOUW')) {
        isOfflineFallback = true;
    } else {
        supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
    }
} catch (e) {
    isOfflineFallback = true;
}

if (isOfflineFallback) {
    document.getElementById('fallback-notice').style.display = 'block';
}

// 1. Profiel selecteren
async function selectUser(name) {
    currentUser = name;
    otherUser = currentUser === 'Jorden' ? 'Wesley' : 'Jorden';
    document.getElementById('profile-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
    document.getElementById('welcome-text').innerText = `Album van ${name}`;
    await loadUserData();
}

function logout() {
    currentUser = '';
    document.getElementById('profile-section').style.display = 'flex';
    document.getElementById('dashboard-section').style.display = 'none';
}

// 2. Data ophalen voor BEIDE gebruikers
async function loadUserData() {
    myStickers = {};
    otherUserStickers = {};

    if (isOfflineFallback) {
        // Lokale Fallback voor beide profielen
        const myLocalData = localStorage.getItem(`panini_${currentUser}`);
        if (myLocalData) myStickers = JSON.parse(myLocalData);
        
        const otherLocalData = localStorage.getItem(`panini_${otherUser}`);
        if (otherLocalData) otherUserStickers = JSON.parse(otherLocalData);
        
        renderDashboard();
    } else {
        // Haal data op van Supabase voor BEIDE gebruikers tegelijk
        const [myResponse, otherResponse] = await Promise.all([
            supabaseClient.from('user_stickers').select('*').eq('user_name', currentUser),
            supabaseClient.from('user_stickers').select('*').eq('user_name', otherUser)
        ]);

        if (myResponse.data) {
            myResponse.data.forEach(row => { myStickers[row.sticker_code] = row.amount; });
        }
        if (otherResponse.data) {
            otherResponse.data.forEach(row => { otherUserStickers[row.sticker_code] = row.amount; });
        }
        renderDashboard();
    }
}

// 3. Hoofdscherm Tekenen met dubbele progressie en nieuwe styling
function renderDashboard() {
    const container = document.getElementById('countries-container');
    container.innerHTML = '';
    let totalOwned = 0;

    collections.forEach(country => {
        let countryOwnedMy = 0;
        let countryOwnedOther = 0;
        
        // Bereken progressie voor beide gebruikers
        for (let i = 1; i <= country.count; i++) {
            let code = country.prefix === 'FWC' && i === 1 ? '00' : country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
            
            if (myStickers[code]) { countryOwnedMy++; totalOwned++; }
            if (otherUserStickers[code]) { countryOwnedOther++; }
        }

        let myPercent = Math.round((countryOwnedMy / country.count) * 100);
        let otherPercent = Math.round((countryOwnedOther / country.count) * 100);

        container.innerHTML += `
            <div class="country-row" onclick="openModal('${country.prefix}')">
                <div class="country-info">
                    <div class="flag-circle" style="background-image: url('${country.flagUrl}');"></div>
                    <span class="country-name">${country.name}</span>
                </div>
                <div class="status-indicators">
                    <div class="user-stat">
                        <span style="color: var(--wk-primary);">${currentUser}:</span>
                        <span>${countryOwnedMy}/${country.count}</span>
                        <div class="user-perc-fill">
                            <div style="width: ${myPercent}%; background-color: var(--wk-primary);"></div>
                        </div>
                    </div>
                    <div class="user-stat">
                        <span style="color: var(--wk-accent); opacity: 0.8;">${otherUser}:</span>
                        <span>${countryOwnedOther}/${country.count}</span>
                        <div class="user-perc-fill">
                            <div style="width: ${otherPercent}%; background-color: var(--wk-accent);"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    // Totaal updaten
    let totalPercent = Math.round((totalOwned / 980) * 100);
    document.getElementById('total-progress').style.width = `${totalPercent}%`;
    document.getElementById('total-text').innerText = `${totalOwned} / 980 uniek (${totalPercent}%)`;
}

// 4. Grid pop-up openen met DYNAMISCHE STYLING
function openModal(prefix) {
    const countryData = collections.find(c => c.prefix === prefix);
    if (!countryData) return;

    // Pas de dynamic styling toe op basis van de kleuren van het land (countries.js)
    const primaryColor = countryData.colors ? countryData.colors[0] : '#4f46e5';
    const accentColor = countryData.colors && countryData.colors[1] ? countryData.colors[1] : '#ff005b';
    
    // Update de CSS variabelen van het detailvenster
    const modalContent = document.querySelector('.modal-content');
    modalContent.style.setProperty('--border-color', `${primaryColor}aa`);
    
    // Update de cirkel indicator
    document.getElementById('modal-title').style.color = primaryColor;
    document.getElementById('flag-ring-1').style.borderColor = primaryColor;
    document.getElementById('flag-ring-2').style.borderColor = accentColor;
    document.getElementById('flag-inner-circle').style.backgroundImage = `url('${countryData.flagUrl}')`;
    
    // Zorg dat de sticker-box hover de themakleur volgt
    modalContent.style.setProperty('--wk-primary', primaryColor);

    document.getElementById('modal').style.display = 'flex';
    document.getElementById('modal-title').innerText = countryData.name;
    
    const grid = document.getElementById('sticker-grid');
    grid.innerHTML = '';

    for (let i = 1; i <= countryData.count; i++) {
        let code = prefix === 'FWC' && i === 1 ? '00' : prefix === 'FWC' ? `FWC ${i-1}` : `${prefix} ${i}`;
        
        let amount = myStickers[code] || 0;
        let statusClass = amount > 1 ? 'double' : amount === 1 ? 'owned' : '';
        
        // Label format: 'BEL 1' of '00'
        let displayLabel = prefix === 'FWC' && i === 1 ? 
            `<span class="box-num" style="font-size: 1.5rem; font-weight: 800;">00</span>` : 
            `<span class="box-prefix">${prefix}</span><span class="box-num">${i}</span>`;

        grid.innerHTML += `
            <div class="sticker-box ${statusClass}" onclick="toggleSticker('${code}')" id="box-${code}">
                ${displayLabel}
                <span class="badge" id="badge-${code}">${amount > 1 ? `(${amount}x)` : ''}</span>
            </div>
        `;
    }
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    renderDashboard(); 
}

// 5. Opslaan bij klik
async function toggleSticker(code) {
    let currentAmount = myStickers[code] || 0;
    let newAmount = currentAmount + 1;
    if (newAmount > 2) newAmount = 0; 

    if (newAmount === 0) delete myStickers[code];
    else myStickers[code] = newAmount;

    updateStickerUI(code, newAmount);

    if (isOfflineFallback) {
        localStorage.setItem(`panini_${currentUser}`, JSON.stringify(myStickers));
    } else {
        if (newAmount === 0) {
            await supabaseClient.from('user_stickers').delete().match({ user_name: currentUser, sticker_code: code });
        } else {
            await supabaseClient.from('user_stickers').upsert({ user_name: currentUser, sticker_code: code, amount: newAmount });
        }
    }
}

function updateStickerUI(code, amount) {
    const box = document.getElementById(`box-${code}`);
    const badge = document.getElementById(`badge-${code}`);
    
    box.className = 'sticker-box';
    if (amount === 1) { box.classList.add('owned'); badge.innerText = ''; }
    else if (amount > 1) { box.classList.add('double'); badge.innerText = `(${amount}x)`; }
    else { badge.innerText = ''; }
}
