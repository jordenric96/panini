// app.js - Logic for dual progress & dynamic styling
const supabaseUrl = 'https://badovrzzxwbkxjgqkxjg.supabase.co'; 
const supabaseKey = 'sb_publishable_qI0tAKHoKqgC1hn_oP6XzA...'; // Vul hier jouw volledige key in!
let supabaseClient = null;
let isOfflineFallback = false;
let currentUser = '';
let otherUser = '';
let myStickers = {};
let otherUserStickers = {}; 

// Initialisatie: we vangen fouten op zodat de app altijd blijft werken (offline modus)
try {
    if (supabaseUrl.includes('JOUW_PROJECT_ID') || supabaseKey.includes('PLAK_HIER')) {
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

// === 2. PROFIEL & NAVIGATIE ===
async function selectUser(name) {
    currentUser = name;
    otherUser = currentUser === 'Jorden' ? 'Wesley' : 'Jorden'; // Wie is de tegenstander?
    
    document.getElementById('profile-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
    document.getElementById('welcome-text').innerText = `Album van ${name}`;
    
    await loadUserData();
}

function logout() {
    currentUser = '';
    otherUser = '';
    document.getElementById('profile-section').style.display = 'flex';
    document.getElementById('dashboard-section').style.display = 'none';
}

// === 3. DATA OPHALEN ===
async function loadUserData() {
    myStickers = {};
    otherUserStickers = {};

    if (isOfflineFallback) {
        // Lokale Browser Opslag (Fallback)
        const myLocalData = localStorage.getItem(`panini_${currentUser}`);
        if (myLocalData) myStickers = JSON.parse(myLocalData);
        
        const otherLocalData = localStorage.getItem(`panini_${otherUser}`);
        if (otherLocalData) otherUserStickers = JSON.parse(otherLocalData);
        
        renderDashboard();
    } else {
        // Haal data op van Supabase voor BEIDE spelers tegelijk!
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

// === 4. DASHBOARD OPBOUWEN (Met dubbele progressiebalken) ===
function renderDashboard() {
    const container = document.getElementById('countries-container');
    container.innerHTML = '';
    let totalOwned = 0;

    // Loop door alle landen in countries.js
    collections.forEach(country => {
        let countryOwnedMy = 0;
        let countryOwnedOther = 0;
        
        // Tel de stickers voor dit specifieke land
        for (let i = 1; i <= country.count; i++) {
            let code = country.prefix === 'FWC' && i === 1 ? '00' : 
                       country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
            
            if (myStickers[code] && myStickers[code] >= 1) { 
                countryOwnedMy++; 
                totalOwned++; 
            }
            if (otherUserStickers[code] && otherUserStickers[code] >= 1) { 
                countryOwnedOther++; 
            }
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

    // Totale progressie balk bovenaan updaten
    let totalPercent = Math.round((totalOwned / 980) * 100);
    document.getElementById('total-progress').style.width = `${totalPercent}%`;
    document.getElementById('total-text').innerText = `${totalOwned} / 980 uniek (${totalPercent}%)`;
}

// === 5. FULL-SCREEN DETAIL POP-UP ===
function openModal(prefix) {
    const countryData = collections.find(c => c.prefix === prefix);
    if (!countryData) return;

    // Haal de kleuren uit countries.js, of gebruik standaard WK kleuren
    const primaryColor = countryData.colors ? countryData.colors[0] : '#4f46e5';
    const accentColor = countryData.colors && countryData.colors[1] ? countryData.colors[1] : '#ff005b';
    
    // Kleur het hele scherm in!
    const modal = document.getElementById('modal');
    modal.style.background = `linear-gradient(135deg, ${primaryColor}, ${accentColor})`;
    document.documentElement.style.setProperty('--wk-primary', primaryColor);
    
    // Vlag in header updaten
    document.getElementById('flag-inner-circle').style.backgroundImage = `url('${countryData.flagUrl}')`;
    document.getElementById('modal-title').innerText = countryData.name;
    
    // Toon modal
    modal.style.display = 'block'; 
    
    const grid = document.getElementById('sticker-grid');
    grid.innerHTML = '';

    // Bouw de 20 Panini-kaarten
    for (let i = 1; i <= countryData.count; i++) {
        let code = prefix === 'FWC' && i === 1 ? '00' : 
                   prefix === 'FWC' ? `FWC ${i-1}` : `${prefix} ${i}`;
        
        let amount = myStickers[code] || 0;
        let statusClass = amount > 1 ? 'double' : amount === 1 ? 'owned' : '';
        
        // Zorg dat de speciale FWC 00 sticker mooi wordt weergegeven
        let displayLabel = prefix === 'FWC' && i === 1 ? 
            `<span class="box-num" style="font-size: 2rem;">00</span>` : 
            `<span class="box-prefix">${prefix}</span><span class="box-num">${i}</span>`;

        grid.innerHTML += `
            <div class="sticker-box ${statusClass}" onclick="toggleSticker('${code}')" id="box-${code}">
                ${displayLabel}
                <span class="badge" id="badge-${code}" style="${amount < 2 ? 'display: none;' : ''}">+${amount-1}</span>
            </div>
        `;
    }
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    renderDashboard(); // Herbereken procenten als je terugkeert
}

// === 6. STICKERS AANTIKKEN (Opslaan & Animaties) ===
async function toggleSticker(code) {
    let currentAmount = myStickers[code] || 0;
    let newAmount = currentAmount + 1;
    
    // Rotatiecyclus: Leeg (0) -> Heb ik (1) -> Dubbel (2+) -> Wis (0)
    if (newAmount > 2) newAmount = 0; 

    // Update de lokale lijst
    if (newAmount === 0) delete myStickers[code];
    else myStickers[code] = newAmount;

    // Pas direct de visuele UI van de sticker aan
    updateStickerUI(code, newAmount);

    // Sla op naar de database
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
    
    // Reset klassen
    box.className = 'sticker-box';
    
    if (amount === 1) { 
        box.classList.add('owned'); 
        badge.style.display = 'none'; 
    }
    else if (amount > 1) { 
        box.classList.add('double'); 
        badge.innerText = `+${amount-1}`; 
        badge.style.display = 'block'; 
    }
    else { 
        badge.style.display = 'none'; 
    }
}
