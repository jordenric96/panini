const supabase = window.supabase.createClient('https://badovrzzxwbkxjgqkxjg.supabase.co', 'sb_publishable_qI0tAKHoKqgC1hn_oP6XzA_n3F61CbT');
let currentUser = ''; let myStickers = {};

async function selectUser(name) {
    currentUser = name;
    document.getElementById('profile-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
    document.getElementById('welcome-text').innerHTML = `Album van <span style="color:#4f46e5">${currentUser}</span>`;
    await loadUserData();
}

function logout() { location.reload(); }

async function loadUserData() {
    myStickers = {};
    const { data } = await supabase.from('user_stickers').select('*').eq('user_name', currentUser);
    if (data) data.forEach(row => { myStickers[row.sticker_code] = row.amount; });
    renderDashboard();
}

function renderDashboard() {
    const container = document.getElementById('countries-container');
    container.innerHTML = '';
    const term = document.getElementById('search-bar').value.toLowerCase();
    let total = 0;
    
    collections.forEach(country => {
        if (!country.name.toLowerCase().includes(term) && !country.prefix.toLowerCase().includes(term)) return;
        let owned = 0;
        for (let i = 1; i <= country.count; i++) {
            let code = country.prefix === 'FWC' && i === 1 ? '00' : country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
            if (myStickers[code]) owned++;
        }
        total += owned;
        container.innerHTML += `
            <div class="country-card" onclick="openModal('${country.prefix}')">
                <div class="flag-circle" style="background-image: url('${country.flagUrl}')"></div>
                <div style="font-size: 0.8rem; font-weight: 800;">${country.prefix}</div>
                <div style="font-size: 0.6rem; color: #94a3b8;">Pag. ${country.page || '?'}</div>
                <div class="grid-badge">${owned}/${country.count}</div>
            </div>`;
    });
    document.getElementById('total-text').innerText = `${total}/980`;
}

function handleQuickAdd(e) { if(e.key === 'Enter') processQuickAdd(); }

async function processQuickAdd() {
    const input = document.getElementById('quick-add-input').value.trim().toUpperCase();
    const match = input.match(/^([A-Z]{3})\s*(\d{1,2})$/);
    if (!match) return showToast("Gebruik formaat: BEL 4", "error");
    
    let [_, prefix, num] = match;
    let code = `${prefix} ${num}`;
    let country = collections.find(c => c.prefix === prefix);
    if (!country) return showToast("Land niet gevonden", "error");
    
    myStickers[code] = (myStickers[code] || 0) + 1;
    await supabase.from('user_stickers').upsert({ user_name: currentUser, sticker_code: code, amount: myStickers[code] });
    
    let playerName = country.players ? country.players[num-1] : "Speler";
    showToast(`✅ ${code} toegevoegd! (${playerName}) - Pag. ${country.page || '?'}`, "success");
    document.getElementById('quick-add-input').value = '';
    renderDashboard();
}

function openModal(prefix) {
    const country = collections.find(c => c.prefix === prefix);
    document.getElementById('modal-title').innerText = `${country.name} (Pag. ${country.page})`;
    document.getElementById('modal').style.display = 'block';
    const grid = document.getElementById('sticker-grid'); grid.innerHTML = '';
    
    for (let i = 1; i <= country.count; i++) {
        let code = country.prefix === 'FWC' && i === 1 ? '00' : country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
        let amt = myStickers[code] || 0;
        grid.innerHTML += `<div class="sticker-box ${amt > 0 ? 'owned' : ''}" onclick="updateSticker('${code}', '${prefix}')">${code}<span class="badge" style="${amt === 0 ? 'display:none' : ''}">${amt}x</span></div>`;
    }
}

async function updateSticker(code, prefix) {
    myStickers[code] = (myStickers[code] || 0) + 1;
    await supabase.from('user_stickers').upsert({ user_name: currentUser, sticker_code: code, amount: myStickers[code] });
    openModal(prefix); renderDashboard();
}

function closeModal() { document.getElementById('modal').style.display = 'none'; }
function showToast(m, t) { const tst = document.getElementById('toast'); tst.innerText = m; tst.className = `toast show ${t}`; setTimeout(() => tst.classList.remove('show'), 3000); }
