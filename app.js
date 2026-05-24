// app.js - v13 (De definitieve versie met Lou, Wesley & Oliver)

const supabaseUrl = 'https://badovrzzxwbkxjgqkxjg.supabase.co'; 
const supabaseKey = 'sb_publishable_qI0tAKHoKqgC1hn_oP6XzA_n3F61CbT'; 
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

let currentUser = '';
let myStickers = {};

// 1. Inloggen
async function selectUser(name) {
    currentUser = name;
    document.getElementById('profile-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
    
    let color = name === 'Lou' ? 'var(--color-jorden)' : (name === 'Wesley' ? 'var(--color-wesley)' : '#10b981');
    document.getElementById('welcome-text').innerHTML = `Album van <br><span style="color: ${color}; font-weight: 900; font-size: 1.8rem;">${currentUser}</span>`;
    
    await loadUserData();
}

function logout() { location.reload(); }

// 2. Data ophalen uit Supabase
async function loadUserData() {
    myStickers = {};
    const response = await supabaseClient.from('user_stickers').select('*').eq('user_name', currentUser);
    if (response.data) response.data.forEach(row => { myStickers[row.sticker_code] = row.amount; });
    renderDashboard();
}

// 3. Dashboard tekenen
function renderDashboard() {
    const container = document.getElementById('countries-container');
    container.innerHTML = '';
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    let totalCount = 0;
    
    collections.forEach(country => {
        if (!country.name.toLowerCase().includes(searchTerm) && !country.prefix.toLowerCase().includes(searchTerm)) return;

        let owned = 0;
        for (let i = 1; i <= country.count; i++) {
            let code = country.prefix === 'FWC' && i === 1 ? '00' : country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
            if (myStickers[code]) owned++;
        }
        totalCount += owned;

        container.innerHTML += `
            <div class="country-card" onclick="openModal('${country.prefix}')">
                <div class="flag-circle" style="background-image: url('${country.flagUrl}');"></div>
                <span class="country-prefix">${country.prefix}</span>
                <div style="font-size:0.7rem; color:#94a3b8;">Pag. ${country.page || '?'}</div>
                <div class="grid-badge" style="background: #4f46e5;">${owned}/${country.count}</div>
            </div>`;
    });
    document.getElementById('total-text').innerText = `${totalCount}/980`;
}

// 4. Snel toevoegen met Toast
async function processQuickAdd() {
    const inputField = document.getElementById('quick-add-input');
    const input = inputField.value.trim().toUpperCase();
    if (!input) return;
    
    const match = input.match(/^([A-Z]{3})\s*(\d{1,2})$/);
    if (!match) return showToast("❌ Gebruik formaat: BEL 4", "error");
    
    let prefix = match[1];
    let num = parseInt(match[2], 10);
    let code = `${prefix} ${num}`;
    let country = collections.find(c => c.prefix === prefix);
    
    if (!country) return showToast("❌ Land niet gevonden", "error");
    
    let newAmount = (myStickers[code] || 0) + 1;
    myStickers[code] = newAmount;
    
    await supabaseClient.from('user_stickers').upsert({ user_name: currentUser, sticker_code: code, amount: newAmount });
    
    let playerName = country.players ? country.players[num-1] : "Speler";
    showToast(`✅ ${code} opgeslagen! (${playerName}) - Pag. ${country.page || '?'}`, "success");
    inputField.value = '';
    renderDashboard();
}

function handleQuickAdd(e) { if(e.key === 'Enter') processQuickAdd(); }

// 5. Toast meldingen
function showToast(msg, type) {
    const toast = document.getElementById('toast');
    toast.innerText = msg; toast.className = `toast show ${type}`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// 6. Modal (Lijst van stickers per land)
function openModal(prefix) {
    const country = collections.find(c => c.prefix === prefix);
    const modal = document.getElementById('modal');
    document.getElementById('modal-title').innerText = `${country.name} (Pag. ${country.page})`;
    modal.style.display = 'block';
    
    const grid = document.getElementById('sticker-grid');
    grid.innerHTML = '';
    for (let i = 1; i <= country.count; i++) {
        let code = country.prefix === 'FWC' && i === 1 ? '00' : country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
        let amount = myStickers[code] || 0;
        grid.innerHTML += `<div class="sticker-box ${amount > 0 ? 'owned' : ''}" onclick="addSticker('${code}')">${code}<span class="badge" style="${amount === 0 ? 'display:none' : ''}">${amount}x</span></div>`;
    }
}
function closeModal() { document.getElementById('modal').style.display = 'none'; }

async function addSticker(code) {
    myStickers[code] = (myStickers[code] || 0) + 1;
    await supabaseClient.from('user_stickers').upsert({ user_name: currentUser, sticker_code: code, amount: myStickers[code] });
    openModal(code.split(' ')[0]); // Refresh modal
    renderDashboard();
}
