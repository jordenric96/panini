// app.js - Logic for dual progress & dynamic styling
const supabaseUrl = 'https://badovrzzxwbkxjgqkxjg.supabase.co'; 
const supabaseKey = 'sb_publishable_qI0tAKHoKqgC1hn_oP6XzA...'; // Vul hier jouw volledige key in!
let supabaseClient = null;
let isOfflineFallback = false;
let currentUser = '';
let otherUser = '';
let myStickers = {};
let otherUserStickers = {}; 

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
    otherUser = '';
    document.getElementById('profile-section').style.display = 'flex';
    document.getElementById('dashboard-section').style.display = 'none';
}

// 2. Data inladen voor beide gebruikers
async function loadUserData() {
    myStickers = {};
    otherUserStickers = {};

    if (isOfflineFallback) {
        const myLocalData = localStorage.getItem(`panini_${currentUser}`);
        if (myLocalData) myStickers = JSON.parse(myLocalData);
        
        const otherLocalData = localStorage.getItem(`panini_${otherUser}`);
        if (otherLocalData) otherUserStickers = JSON.parse(otherLocalData);
        
        renderDashboard();
    } else {
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

// 3. Dashboard opbouwen met de zachte vlagkleuren en linkerrand
function renderDashboard() {
    const container = document.getElementById('countries-container');
    container.innerHTML = '';
    let totalOwned = 0;

    collections.forEach(country => {
        let countryOwnedMy = 0;
        let countryOwnedOther = 0;
        
        for (let i = 1; i <= country.count; i++) {
            let code = country.prefix === 'FWC' && i === 1 ? '00' : country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
            
            if (myStickers[code] && myStickers[code] >= 1) { countryOwnedMy++; totalOwned++; }
            if (otherUserStickers[code] && otherUserStickers[code] >= 1) { countryOwnedOther++; }
        }

        let myPercent = Math.round((countryOwnedMy / country.count) * 100);
        let otherPercent = Math.round((countryOwnedOther / country.count) * 100);

        const primaryColor = country.colors ? country.colors[0] : '#4f46e5';
        const accentColor = country.colors && country.colors[1] ? country.colors[1] : '#ff005b';
        
        // Premium Look: 10% opacity achtergrondoverloop met felle dikke linkerrand
        const rowStyle = `
            background: linear-gradient(135deg, ${primaryColor}1A, ${accentColor}1A);
            border-left: 6px solid ${primaryColor};
            border-color: ${primaryColor}33;
        `;

        container.innerHTML += `
            <div class="country-row" style="${rowStyle}" onclick="openModal('${country.prefix}')">
                <div class="country-info">
                    <div class="flag-circle" style="background-image: url('${country.flagUrl}'); border-color: ${primaryColor};"></div>
                    <span class="country-name" style="color: ${primaryColor};">${country.name}</span>
                </div>
                <div class="status-indicators">
                    <div class="user-stat">
                        <span style="color: ${primaryColor}; opacity: 0.9;">${currentUser}:</span>
                        <span style="color: #1e293b;">${countryOwnedMy}/${country.count}</span>
                        <div class="user-perc-fill">
                            <div style="width: ${myPercent}%; background-color: ${primaryColor};"></div>
                        </div>
                    </div>
                    <div class="user-stat">
                        <span style="color: ${accentColor}; opacity: 0.7;">${otherUser}:</span>
                        <span style="color: #64748b;">${countryOwnedOther}/${country.count}</span>
                        <div class="user-perc-fill">
                            <div style="width: ${otherPercent}%; background-color: ${accentColor}; opacity: 0.5;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    let totalPercent = Math.round((totalOwned / 980) * 100);
    document.getElementById('total-progress').style.width = `${totalPercent}%`;
    document.getElementById('total-text').innerText = `${totalOwned} / 980 uniek (${totalPercent}%)`;
}

// 4. Full Screen Pop-up openen met meebewegend kleurenthema
function openModal(prefix) {
    const countryData = collections.find(c => c.prefix === prefix);
    if (!countryData) return;

    const primaryColor = countryData.colors ? countryData.colors[0] : '#4f46e5';
    const accentColor = countryData.colors && countryData.colors[1] ? countryData.colors[1] : '#ff005b';
    
    const modal = document.getElementById('modal');
    modal.style.background = `linear-gradient(135deg, ${primaryColor}, ${accentColor})`;
    document.documentElement.style.setProperty('--wk-primary', primaryColor);
    
    document.getElementById('flag-inner-circle').style.backgroundImage = `url('${countryData.flagUrl}')`;
    document.getElementById('modal-title').innerText = countryData.name;
    
    modal.style.display = 'block'; 
    
    const grid = document.getElementById('sticker-grid');
    grid.innerHTML = '';

    for (let i = 1; i <= countryData.count; i++) {
        let code = prefix === 'FWC' && i === 1 ? '00' : prefix === 'FWC' ? `FWC ${i-1}` : `${prefix} ${i}`;
        let amount = myStickers[code] || 0;
        let statusClass = amount > 1 ? 'double' : amount === 1 ? 'owned' : '';
        
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
    renderDashboard(); 
}

// 5. Sticker toevoegen/aanpassen
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
