// app.js - Ultimate Edition v8 (Album Title Fix)

const supabaseUrl = 'https://badovrzzxwbkxjgqkxjg.supabase.co'; 
const supabaseKey = 'sb_publishable_qI0tAKHoKqgC1hn_oP6XzA_n3F61CbT'; 
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

let currentUser = '';
let otherUser = '';
let myStickers = {};
let otherUserStickers = {}; 
let showOnlyMissing = false; 

async function selectUser(name) {
    currentUser = name;
    otherUser = currentUser === 'Jorden' ? 'Wesley' : 'Jorden';
    document.getElementById('profile-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
    
    // HIER IS DE FIX: Duidelijk tonen van wie het album is in de juiste kleur!
    let nameColor = currentUser === 'Jorden' ? 'var(--color-jorden)' : 'var(--color-wesley)';
    document.getElementById('welcome-text').innerHTML = `Album van <br><span style="color: ${nameColor}; font-weight: 900; font-size: 1.8rem;">${currentUser}</span>`;
    
    await loadUserData();
}

function logout() {
    currentUser = ''; otherUser = '';
    document.getElementById('profile-section').style.display = 'flex';
    document.getElementById('dashboard-section').style.display = 'none';
}

function toggleFilter() {
    showOnlyMissing = !showOnlyMissing;
    document.getElementById('btn-filter').classList.toggle('active', showOnlyMissing);
    renderDashboard();
}

function filterCountries() {
    renderDashboard();
}

async function loadUserData() {
    myStickers = {}; otherUserStickers = {};
    const [myResponse, otherResponse] = await Promise.all([
        supabaseClient.from('user_stickers').select('*').eq('user_name', currentUser),
        supabaseClient.from('user_stickers').select('*').eq('user_name', otherUser)
    ]);
    if (myResponse.data) myResponse.data.forEach(row => { myStickers[row.sticker_code] = row.amount; });
    if (otherResponse.data) otherResponse.data.forEach(row => { otherUserStickers[row.sticker_code] = row.amount; });
    renderDashboard();
}

function renderDashboard() {
    const container = document.getElementById('countries-container');
    container.innerHTML = '';
    
    const searchInput = document.getElementById('search-bar');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    let totalJorden = 0; let totalWesley = 0;
    
    let groupStats = {};
    collections.forEach(c => {
        if(!groupStats[c.group]) groupStats[c.group] = { total: 0, myCount: 0 };
        groupStats[c.group].total += c.count;
        for (let i = 1; i <= c.count; i++) {
            let code = c.prefix === 'FWC' && i === 1 ? '00' : c.prefix === 'FWC' ? `FWC ${i-1}` : `${c.prefix} ${i}`;
            if (myStickers[code]) groupStats[c.group].myCount++;
        }
    });

    let currentGroup = ''; let cardIndex = 0;

    collections.forEach(country => {
        let countMy = 0; let countOther = 0;
        
        for (let i = 1; i <= country.count; i++) {
            let code = country.prefix === 'FWC' && i === 1 ? '00' : country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
            if (myStickers[code]) countMy++;
            if (otherUserStickers[code]) countOther++;
        }

        let jordenScore = currentUser === 'Jorden' ? countMy : countOther;
        let wesleyScore = currentUser === 'Wesley' ? countMy : countOther;
        totalJorden += jordenScore; totalWesley += wesleyScore;

        const isCompleteMy = countMy === country.count;
        if (showOnlyMissing && isCompleteMy) return;

        const matchesSearch = country.name.toLowerCase().includes(searchTerm) || country.prefix.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return;

        if (country.group !== currentGroup) {
            currentGroup = country.group;
            let gStat = groupStats[currentGroup];
            let isGoldClass = gStat.myCount === gStat.total ? 'gold' : '';
            container.innerHTML += `
                <div class="group-header ${isGoldClass}">
                    <h3>${currentGroup}</h3><span class="group-score">${gStat.myCount}/${gStat.total}</span>
                </div>`;
        }

        const primaryColor = country.colors ? country.colors[0] : '#4f46e5';
        const delay = cardIndex * 0.015; cardIndex++;
        const borderGlow = isCompleteMy ? `border-color: #10b981; box-shadow: 0 0 12px #10b98180;` : `border-color: ${primaryColor}50;`;

        container.innerHTML += `
            <div class="country-card" style="animation-delay: ${delay}s;" onclick="openModal('${country.prefix}')">
                <div class="flag-circle" style="background-image: url('${country.flagUrl}'); ${borderGlow}"></div>
                <span class="country-prefix">${country.prefix}</span>
                <div class="grid-score-row">
                    <div class="grid-badge" style="background: var(--color-jorden);">${jordenScore}</div>
                    <div class="grid-badge" style="background: var(--color-wesley);">${wesleyScore}</div>
                </div>
            </div>`;
    });

    document.getElementById('legend-count-jorden').innerText = totalJorden;
    document.getElementById('legend-count-wesley').innerText = totalWesley;
    let activeTotal = currentUser === 'Jorden' ? totalJorden : totalWesley;
    let totalPercent = (activeTotal / 980) * 100;
    document.getElementById('total-text').innerText = `${activeTotal}/980`;
    document.getElementById('soccer-ball').style.left = `calc(${Math.min(totalPercent, 90)}% - 10px)`;
}

// ==========================================
// TOAST NOTIFICATIES (BEVESTIGING)
// ==========================================
let toastTimeout;
function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.className = `toast show ${type}`;
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// ==========================================
// PAKJES-MODUS (SNEL INVOEREN)
// ==========================================
function handleQuickAdd(event) {
    if (event.key === 'Enter') processQuickAdd();
}

function processQuickAdd() {
    const inputField = document.getElementById('quick-add-input');
    let input = inputField.value.trim().toUpperCase();
    if (!input) return;

    let code = null;
    let num = 0;
    let prefix = '';

    if (input === 'FWC 00' || input === 'FWC00') {
        code = '00'; prefix = 'FWC'; num = 0;
    } else {
        const match = input.match(/^([A-Z]{3})\s*(\d{1,2})$/);
        if (match) {
            prefix = match[1];
            num = parseInt(match[2], 10);
            code = prefix === 'FWC' ? `${prefix} ${num}` : `${prefix} ${num}`;
        }
    }

    if (!code) {
        showToast("❌ Ongeldige code. Gebruik bijv. BEL 4", "error");
        return;
    }

    let country = collections.find(c => c.prefix === prefix);
    if (!country) {
        showToast(`❌ Landcode '${prefix}' bestaat niet.`, "error");
        return;
    }

    let maxNum = prefix === 'FWC' ? 19 : 20; 
    if (code !== '00' && (num < 1 || num > maxNum)) {
        showToast(`❌ ${prefix} stopt bij nummer ${maxNum}.`, "error");
        return;
    }

    let newAmount = (myStickers[code] || 0) + 1;
    myStickers[code] = newAmount;

    syncToSupabase(code, newAmount).then(() => {
        let playerName = "";
        if (prefix === 'FWC') {
            let i = code === '00' ? 1 : num + 1;
            playerName = country.players ? country.players[i-1] : `Speler ${i}`;
        } else {
            playerName = country.players ? country.players[num-1] : (num === 1 ? "Team Logo" : (num === 13 ? "Teamfoto" : `Speler ${num}`));
        }

        showToast(`✅ ${code} opgeslagen! (${playerName})`, "success");
        inputField.value = ''; 
        renderDashboard(); 
        if(navigator.vibrate) navigator.vibrate([40, 40]); 
    });
}

// ==========================================
// MODAL LOGICA
// ==========================================
function openModal(prefix) {
    const countryData = collections.find(c => c.prefix === prefix);
    if (!countryData) return;

    const modal = document.getElementById('modal');
    const primaryColor = countryData.colors ? countryData.colors[0] : '#4f46e5';
    modal.style.background = `linear-gradient(135deg, ${primaryColor}, ${countryData.colors[1] || '#ff005b'})`;
    document.getElementById('flag-inner-circle').style.backgroundImage = `url('${countryData.flagUrl}')`;
    document.getElementById('modal-title').innerText = countryData.name;
    document.getElementById('modal-subtitle-text').innerText = `Tik +1 • Badge -1 • Bolletje = ${otherUser}`;

    modal.style.display = 'block'; 
    const grid = document.getElementById('sticker-grid');
    grid.innerHTML = '';

    for (let i = 1; i <= countryData.count; i++) {
        let code = prefix === 'FWC' && i === 1 ? '00' : prefix === 'FWC' ? `FWC ${i-1}` : `${prefix} ${i}`;
        let amount = myStickers[code] || 0;
        let otherAmt = otherUserStickers[code] || 0; 
        let statusClass = amount > 1 ? 'double' : amount === 1 ? 'owned' : '';
        let displayLabel = prefix === 'FWC' && i === 1 ? `<span class="box-num" style="font-size: 1.8rem;">00</span>` : `<span class="box-prefix">${prefix}</span><span class="box-num">${i}</span>`;
        let playerName = countryData.players ? countryData.players[i-1] : (i === 1 ? "Team Logo" : (i === 13 ? "Teamfoto" : `Speler ${i}`));

        let otherColor = currentUser === 'Jorden' ? 'var(--color-wesley)' : 'var(--color-jorden)';
        let otherIndicator = '';
        if (otherAmt > 0) {
            let dotText = otherAmt > 1 ? `${otherAmt}x` : '✓';
            otherIndicator = `<div class="other-user-dot" style="background: ${otherColor};">${dotText}</div>`;
        }

        grid.innerHTML += `
            <div class="sticker-box ${statusClass}" onclick="addSticker('${code}')" id="box-${code}">
                ${otherIndicator}
                ${displayLabel}
                <div style="font-size: 0.55rem; text-align: center; margin-top: 2px; line-height: 1.1; padding: 0 2px; opacity: 0.9; pointer-events: none;">${playerName}</div>
                <span class="badge" id="badge-${code}" onclick="removeSticker(event, '${code}')" style="${amount === 0 ? 'display: none;' : ''}">${amount}x</span>
            </div>`;
    }
}

function closeModal() { document.getElementById('modal').style.display = 'none'; renderDashboard(); }

async function addSticker(code) {
    let newAmount = (myStickers[code] || 0) + 1;
    myStickers[code] = newAmount; updateStickerUI(code, newAmount);
    if(navigator.vibrate) navigator.vibrate(50); 
    await syncToSupabase(code, newAmount);
}

async function removeSticker(event, code) {
    event.stopPropagation(); 
    let newAmount = (myStickers[code] || 0) - 1;
    if (newAmount < 0) newAmount = 0;
    if (newAmount === 0) delete myStickers[code]; else myStickers[code] = newAmount;
    updateStickerUI(code, newAmount);
    if(navigator.vibrate) navigator.vibrate([30, 50, 30]); 
    await syncToSupabase(code, newAmount);
}

async function syncToSupabase(code, amount) {
    try {
        if (amount === 0) await supabaseClient.from('user_stickers').delete().match({ user_name: currentUser, sticker_code: code });
        else await supabaseClient.from('user_stickers').upsert({ user_name: currentUser, sticker_code: code, amount: amount });
    } catch (err) { console.error("Cloud Error:", err.message); }
}

function updateStickerUI(code, amount) {
    const box = document.getElementById(`box-${code}`);
    const badge = document.getElementById(`badge-${code}`);
    box.className = 'sticker-box';
    if (amount === 1) { box.classList.add('owned'); badge.innerText = `1x`; badge.style.display = 'flex'; }
    else if (amount > 1) { box.classList.add('double'); badge.innerText = `${amount}x`; badge.style.display = 'flex'; }
    else { badge.style.display = 'none'; }
}

function openTradeCenter() {
    let giveToOther = []; let getFromOther = [];
    collections.forEach(country => {
        for (let i = 1; i <= country.count; i++) {
            let code = country.prefix === 'FWC' && i === 1 ? '00' : country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
            let myAmt = myStickers[code] || 0; let otherAmt = otherUserStickers[code] || 0;
            if (myAmt > 1 && otherAmt === 0) giveToOther.push(code);
            if (otherAmt > 1 && myAmt === 0) getFromOther.push(code);
        }
    });

    let html = `
        <div class="trade-block">
            <h3>Geef aan ${otherUser} (${giveToOther.length})</h3>
            <div class="trade-codes">
                ${giveToOther.length === 0 ? '<p style="color: #94a3b8; font-size: 0.9rem;">Geen dubbele die hij/zij nodig heeft.</p>' : ''}
                ${giveToOther.map(c => `<span class="trade-chip give">${c}</span>`).join('')}
            </div>
        </div>
        <div class="trade-block">
            <h3 style="color: var(--color-wesley);">Krijg van ${otherUser} (${getFromOther.length})</h3>
            <div class="trade-codes">
                ${getFromOther.length === 0 ? '<p style="color: #94a3b8; font-size: 0.9rem;">Hij/zij heeft geen dubbele voor jou.</p>' : ''}
                ${getFromOther.map(c => `<span class="trade-chip get">${c}</span>`).join('')}
            </div>
        </div>`;
    document.getElementById('trade-content').innerHTML = html;
    document.getElementById('trade-modal').style.display = 'block';
}

function closeTradeCenter() { document.getElementById('trade-modal').style.display = 'none'; }
