// app.js - Applicatielogica met Live Database & Trade Engine
const supabaseUrl = 'https://badovrzzxwbkxjgqkxjg.supabase.co'; 
const supabaseKey = 'PLAK_HIER_JOUW_KEY'; 

let supabaseClient = null;
let isOfflineFallback = false;
let currentUser = '';
let myStickers = {}; 

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

async function selectUser(name) {
    currentUser = name;
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

async function loadUserData() {
    myStickers = {};
    if (isOfflineFallback) {
        const localData = localStorage.getItem(`panini_${currentUser}`);
        if (localData) myStickers = JSON.parse(localData);
        renderDashboard();
    } else {
        const { data } = await supabaseClient.from('user_stickers').select('*').eq('user_name', currentUser);
        if (data) data.forEach(row => { myStickers[row.sticker_code] = row.amount; });
        renderDashboard();
    }
}

function renderDashboard() {
    const container = document.getElementById('countries-container');
    container.innerHTML = '';
    let totalOwned = 0;

    collections.forEach(country => {
        let countryOwned = 0;
        for (let i = 1; i <= country.count; i++) {
            let code = country.prefix === 'FWC' && i === 1 ? '00' : country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
            if (myStickers[code] && myStickers[code] >= 1) { countryOwned++; totalOwned++; }
        }
        let percent = Math.round((countryOwned / country.count) * 100);

        container.innerHTML += `
            <div class="country-row" onclick="openModal('${country.prefix}', '${country.name}', ${country.count})">
                <div class="country-info">
                    <div class="flag-circle" style="background-image: url('${country.flagUrl}');"></div>
                    <span class="country-name">${country.name}</span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar"><div class="progress-fill" style="width: ${percent}%;"></div></div>
                    <span class="percentage-text">${countryOwned}/${country.count}</span>
                </div>
            </div>
        `;
    });

    let totalPercent = Math.round((totalOwned / 980) * 100);
    document.getElementById('total-progress').style.width = `${totalPercent}%`;
    document.getElementById('total-text').innerText = `${totalOwned} / 980 (${totalPercent}%)`;
}

function openModal(prefix, name, count) {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('modal-title').innerText = name;
    const grid = document.getElementById('sticker-grid');
    grid.innerHTML = '';

    for (let i = 1; i <= count; i++) {
        let code = prefix === 'FWC' && i === 1 ? '00' : prefix === 'FWC' ? `FWC ${i-1}` : `${prefix} ${i}`;
        let amount = myStickers[code] || 0;
        let statusClass = amount > 1 ? 'double' : amount === 1 ? 'owned' : '';
        let displayNum = code.includes(' ') ? code.split(' ')[1] : code;

        grid.innerHTML += `
            <div class="sticker-box ${statusClass}" onclick="toggleSticker('${code}')" id="box-${code}">
                ${displayNum}
                <span class="badge" id="badge-${code}">${amount > 1 ? `+${amount-1}` : ''}</span>
            </div>
        `;
    }
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    renderDashboard();
}

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
        if (newAmount === 0) await supabaseClient.from('user_stickers').delete().match({ user_name: currentUser, sticker_code: code });
        else await supabaseClient.from('user_stickers').upsert({ user_name: currentUser, sticker_code: code, amount: newAmount });
    }
}

function updateStickerUI(code, amount) {
    const box = document.getElementById(`box-${code}`);
    const badge = document.getElementById(`badge-${code}`);
    box.className = 'sticker-box';
    if (amount === 1) { box.classList.add('owned'); badge.innerText = ''; }
    else if (amount > 1) { box.classList.add('double'); badge.innerText = `+${amount-1}`; }
    else { badge.innerText = ''; }
}

// === NIEUW: DE RUIL ENGINE ===
async function openTradeCenter() {
    document.getElementById('trade-modal').style.display = 'flex';
    const otherUser = currentUser === 'Jorden' ? 'Wesley' : 'Jorden';
    
    document.getElementById('trade-other-name-1').innerText = otherUser;
    document.getElementById('trade-other-name-2').innerText = otherUser;
    
    let otherStickers = {};

    // Haal de data van de andere speler op
    if (isOfflineFallback) {
        const localData = localStorage.getItem(`panini_${otherUser}`);
        if (localData) otherStickers = JSON.parse(localData);
    } else {
        const { data } = await supabaseClient.from('user_stickers').select('*').eq('user_name', otherUser);
        if (data) data.forEach(row => { otherStickers[row.sticker_code] = row.amount; });
    }

    // Bereken matches
    let iCanGive = [];
    let iCanGet = [];

    // Wat kan IK geven? (Mijn dubbelen die hij NIET heeft)
    for (let code in myStickers) {
        if (myStickers[code] > 1 && (!otherStickers[code] || otherStickers[code] === 0)) {
            iCanGive.push(code);
        }
    }

    // Wat kan HIJ geven? (Zijn dubbelen die ik NIET heb)
    for (let code in otherStickers) {
        if (otherStickers[code] > 1 && (!myStickers[code] || myStickers[code] === 0)) {
            iCanGet.push(code);
        }
    }

    // Zet het op het scherm
    document.getElementById('badges-i-give').innerHTML = iCanGive.length > 0 
        ? iCanGive.map(c => `<span class="trade-badge">${c}</span>`).join('') 
        : "<span style='color: #94a3b8; font-size: 0.85rem;'>Je hebt helaas niks wat hij nog zoekt.</span>";

    document.getElementById('badges-i-get').innerHTML = iCanGet.length > 0 
        ? iCanGet.map(c => `<span class="trade-badge" style="border-color: #10b981; color: #10b981;">${c}</span>`).join('') 
        : "<span style='color: #94a3b8; font-size: 0.85rem;'>Hij heeft helaas niks wat jij nog zoekt.</span>";
}

function closeTradeCenter() {
    document.getElementById('trade-modal').style.display = 'none';
}
