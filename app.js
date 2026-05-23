// app.js - Volledige logica met dual-progress, Supabase & Full-Screen animaties

// === 1. CONFIGURATIE ===
const supabaseUrl = 'https://badovrzzxwbkxjgqkxjg.supabase.co'; 
const supabaseKey = 'sb_publishable_qI0tAKHoKqgC1hn_oP6XzA...'; // Vul hier je eigen volledige key in!

let supabaseClient = null;
let isOfflineFallback = false;
let currentUser = '';
let otherUser = '';
let myStickers = {};
let otherUserStickers = {}; 

try {
    if (supabaseUrl.includes('JOUW_PROJECT_ID') || supabaseKey.includes('sb_publishable_')) {
        supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
    } else {
        isOfflineFallback = true;
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

// === 3. DATA LADEN ===
async function loadUserData() {
    myStickers = {};
    otherUserStickers = {};

    if (isOfflineFallback) {
        myStickers = JSON.parse(localStorage.getItem(`panini_${currentUser}`) || '{}');
        otherUserStickers = JSON.parse(localStorage.getItem(`panini_${otherUser}`) || '{}');
        renderDashboard();
    } else {
        const [myResponse, otherResponse] = await Promise.all([
            supabaseClient.from('user_stickers').select('*').eq('user_name', currentUser),
            supabaseClient.from('user_stickers').select('*').eq('user_name', otherUser)
        ]);

        if (myResponse.data) myResponse.data.forEach(row => { myStickers[row.sticker_code] = row.amount; });
        if (otherResponse.data) otherResponse.data.forEach(row => { otherUserStickers[row.sticker_code] = row.amount; });
        renderDashboard();
    }
}

// === 4. DASHBOARD RENDEREN ===
function renderDashboard() {
    const container = document.getElementById('countries-container');
    container.innerHTML = '';
    let totalOwned = 0;

    collections.forEach(country => {
        let countryOwnedMy = 0, countryOwnedOther = 0;
        for (let i = 1; i <= country.count; i++) {
            let code = country.prefix === 'FWC' && i === 1 ? '00' : country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
            if (myStickers[code] >= 1) { countryOwnedMy++; totalOwned++; }
            if (otherUserStickers[code] >= 1) countryOwnedOther++;
        }

        const primary = country.colors ? country.colors[0] : '#4f46e5';
        const accent = country.colors ? country.colors[1] : '#ff005b';
        const rowStyle = `background: linear-gradient(135deg, ${primary}1A, ${accent}1A); border-left: 6px solid ${primary};`;

        container.innerHTML += `
            <div class="country-row" style="${rowStyle}" onclick="openModal('${country.prefix}')">
                <div class="country-info">
                    <div class="flag-circle" style="background-image: url('${country.flagUrl}'); border-color: ${primary};"></div>
                    <span class="country-name" style="color: ${primary};">${country.name}</span>
                </div>
                <div class="status-indicators">
                    <div class="user-stat"><span style="color:${primary}">${currentUser}:</span> ${countryOwnedMy}/${country.count}</div>
                    <div class="user-stat"><span style="color:${accent}">${otherUser}:</span> ${countryOwnedOther}/${country.count}</div>
                </div>
            </div>
        `;
    });
    let totalPercent = Math.round((totalOwned / 980) * 100);
    document.getElementById('total-progress').style.width = `${totalPercent}%`;
    document.getElementById('total-text').innerText = `${totalOwned} / 980 uniek (${totalPercent}%)`;
}

// === 5. POP-UP LOGICA ===
function openModal(prefix) {
    const data = collections.find(c => c.prefix === prefix);
    const modal = document.getElementById('modal');
    modal.style.background = `linear-gradient(135deg, ${data.colors[0]}, ${data.colors[1]})`;
    document.getElementById('flag-inner-circle').style.backgroundImage = `url('${data.flagUrl}')`;
    document.getElementById('modal-title').innerText = data.name;
    modal.style.display = 'block';

    const grid = document.getElementById('sticker-grid');
    grid.innerHTML = '';
    for (let i = 1; i <= data.count; i++) {
        let code = prefix === 'FWC' && i === 1 ? '00' : prefix === 'FWC' ? `FWC ${i-1}` : `${prefix} ${i}`;
        let amt = myStickers[code] || 0;
        grid.innerHTML += `
            <div class="sticker-box ${amt==1?'owned':amt>1?'double':''}" onclick="toggleSticker('${code}')" id="box-${code}">
                <span class="box-prefix">${prefix}</span><span class="box-num">${i}</span>
                <span class="badge" id="badge-${code}" style="display:${amt<2?'none':'block'}">+${amt-1}</span>
            </div>
        `;
    }
}

function closeModal() { document.getElementById('modal').style.display = 'none'; renderDashboard(); }

// === 6. STICKER TOGGLE (DATABASE VRIENDELIJK) ===
async function toggleSticker(code) {
    let newAmount = (myStickers[code] || 0) + 1;
    if (newAmount > 2) newAmount = 0; 
    
    if (newAmount === 0) delete myStickers[code];
    else myStickers[code] = newAmount;

    updateStickerUI(code, newAmount);

    if (isOfflineFallback) {
        localStorage.setItem(`panini_${currentUser}`, JSON.stringify(myStickers));
    } else {
        // Eenvoudige opslagmethode
        await supabaseClient.from('user_stickers').upsert({ 
            user_name: currentUser, 
            sticker_code: code, 
            amount: newAmount 
        });
    }
}

function updateStickerUI(code, amt) {
    const box = document.getElementById(`box-${code}`);
    const badge = document.getElementById(`badge-${code}`);
    if(!box) return;
    box.className = `sticker-box ${amt==1?'owned':amt>1?'double':''}`;
    if(badge) { badge.style.display = amt > 1 ? 'block' : 'none'; badge.innerText = `+${amt-1}`; }
}
