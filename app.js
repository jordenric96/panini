// app.js - Ultimate Edition v13 (3 Profielen, Paginanummers & Advanced Trade Center)

const supabaseUrl = 'https://badovrzzxwbkxjgqkxjg.supabase.co'; 
const supabaseKey = 'sb_publishable_qI0tAKHoKqgC1hn_oP6XzA_n3F61CbT'; 
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

const users = ['Lou & Noé', 'Wesley', 'Oliver'];
const userColors = { 'Lou & Noé': 'var(--color-1)', 'Wesley': 'var(--color-2)', 'Oliver': 'var(--color-3)' };

// TRUC: Koppel 'Lou & Noé' intern aan de oude 'Jorden' database sleutel, zo ben je geen 62 stickers kwijt!
const dbNames = { 'Lou & Noé': 'Jorden', 'Wesley': 'Wesley', 'Oliver': 'Oliver' };

let currentUser = ''; 
let otherUsers = []; 
let allStickers = { 'Lou & Noé': {}, 'Wesley': {}, 'Oliver': {} };
let showOnlyMissing = false; 

async function selectUser(name) {
    currentUser = name;
    otherUsers = users.filter(u => u !== name);
    
    document.getElementById('profile-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
    
    document.getElementById('welcome-text').innerHTML = `Album van <br><span style="color: ${userColors[currentUser]}; font-weight: 900; font-size: 1.8rem;">${currentUser}</span>`;
    
    await loadUserData();
}

function logout() {
    currentUser = ''; otherUsers = [];
    document.getElementById('profile-section').style.display = 'flex';
    document.getElementById('dashboard-section').style.display = 'none';
}

function toggleFilter() { showOnlyMissing = !showOnlyMissing; document.getElementById('btn-filter').classList.toggle('active', showOnlyMissing); renderDashboard(); }
function filterCountries() { renderDashboard(); }

async function loadUserData() {
    allStickers = { 'Lou & Noé': {}, 'Wesley': {}, 'Oliver': {} };
    
    // Haal de data voor ALLE DRIE de spelers tegelijk op
    const promises = users.map(u => supabaseClient.from('user_stickers').select('*').eq('user_name', dbNames[u]));
    const results = await Promise.all(promises);
    
    users.forEach((u, index) => {
        if (results[index].data) {
            results[index].data.forEach(row => { allStickers[u][row.sticker_code] = row.amount; });
        }
    });
    renderDashboard();
}

function renderDashboard() {
    const container = document.getElementById('countries-container'); container.innerHTML = '';
    const searchTerm = (document.getElementById('search-bar') ? document.getElementById('search-bar').value.toLowerCase() : '');
    
    let scores = { 'Lou & Noé': 0, 'Wesley': 0, 'Oliver': 0 };
    
    let groupStats = {};
    collections.forEach(c => {
        if(!groupStats[c.group]) groupStats[c.group] = { total: 0, myCount: 0 };
        groupStats[c.group].total += c.count;
        for (let i = 1; i <= c.count; i++) {
            let code = c.prefix === 'FWC' && i === 1 ? '00' : c.prefix === 'FWC' ? `FWC ${i-1}` : `${c.prefix} ${i}`;
            if (allStickers[currentUser][code]) groupStats[c.group].myCount++;
        }
    });

    let currentGroup = ''; let cardIndex = 0;
    collections.forEach(country => {
        let countTracker = { 'Lou & Noé': 0, 'Wesley': 0, 'Oliver': 0 };
        
        for (let i = 1; i <= country.count; i++) {
            let code = country.prefix === 'FWC' && i === 1 ? '00' : country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
            users.forEach(u => { if (allStickers[u][code]) countTracker[u]++; });
        }

        users.forEach(u => { scores[u] += countTracker[u]; });

        if (showOnlyMissing && countTracker[currentUser] === country.count) return;
        if (!country.name.toLowerCase().includes(searchTerm) && !country.prefix.toLowerCase().includes(searchTerm)) return;

        if (country.group !== currentGroup) {
            currentGroup = country.group; let gStat = groupStats[currentGroup];
            let isGoldClass = gStat.myCount === gStat.total ? 'gold' : '';
            container.innerHTML += `<div class="group-header ${isGoldClass}"><h3>${currentGroup}</h3><span class="group-score">${gStat.myCount}/${gStat.total}</span></div>`;
        }

        const delay = cardIndex * 0.015; cardIndex++;
        const borderGlow = (countTracker[currentUser] === country.count) ? `border-color: #10b981; box-shadow: 0 0 12px #10b98180;` : `border-color: ${(country.colors ? country.colors[0] : '#4f46e5')}50;`;
        
        let pageInfo = country.page ? `<div style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; margin-top: -2px; margin-bottom: 4px;">Pag. ${country.page}</div>` : '';

        // Bouw de 3 score-badges voor onder het landkaartje
        let badgesHTML = '';
        users.forEach(u => { badgesHTML += `<div class="grid-badge" style="background: ${userColors[u]};">${countTracker[u]}</div>`; });

        container.innerHTML += `
            <div class="country-card" style="animation-delay: ${delay}s;" onclick="openModal('${country.prefix}')">
                <div class="flag-circle" style="background-image: url('${country.flagUrl}'); ${borderGlow}"></div>
                <span class="country-prefix">${country.prefix}</span>
                ${pageInfo}
                <div class="grid-score-row">${badgesHTML}</div>
            </div>`;
    });

    // Update de Legende dynamisch voor 3 personen
    let legendHTML = '';
    users.forEach(u => { legendHTML += `<div class="legend-item"><div class="legend-dot" style="background: ${userColors[u]};"></div><span>${u} (${scores[u]})</span></div>`; });
    document.getElementById('legend-container').innerHTML = legendHTML;

    document.getElementById('total-text').innerText = `${scores[currentUser]}/980`;
    document.getElementById('total-text').style.color = userColors[currentUser];
    document.getElementById('soccer-ball').style.left = `calc(${Math.min((scores[currentUser] / 980) * 100, 90)}% - 10px)`;
}

let toastTimeout;
function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.innerText = message; toast.className = `toast show ${type}`;
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { toast.classList.remove('show'); }, 4000);
}

function handleQuickAdd(event) { if (event.key === 'Enter') processQuickAdd(); }

function processQuickAdd() {
    const inputField = document.getElementById('quick-add-input');
    let input = inputField.value.trim().toUpperCase();
    if (!input) return;

    let code = null; let num = 0; let prefix = '';
    if (input === 'FWC 00' || input === 'FWC00') { code = '00'; prefix = 'FWC'; num = 0; } 
    else {
        const match = input.match(/^([A-Z]{3})\s*(\d{1,2})$/);
        if (match) { prefix = match[1]; num = parseInt(match[2], 10); code = `${prefix} ${num}`; }
    }

    if (!code) return showToast("❌ Ongeldige code. Gebruik bijv. BEL 4", "error");
    let country = collections.find(c => c.prefix === prefix);
    if (!country) return showToast(`❌ Landcode '${prefix}' bestaat niet.`, "error");

    let maxNum = prefix === 'FWC' ? 19 : 20; 
    if (code !== '00' && (num < 1 || num > maxNum)) return showToast(`❌ ${prefix} stopt bij nummer ${maxNum}.`, "error");

    let newAmount = (allStickers[currentUser][code] || 0) + 1;
    allStickers[currentUser][code] = newAmount;

    syncToSupabase(code, newAmount).then(() => {
        let playerName = "";
        if (prefix === 'FWC') { let i = code === '00' ? 1 : num + 1; playerName = country.players ? country.players[i-1] : `Speler ${i}`; } 
        else { playerName = country.players ? country.players[num-1] : (num === 1 ? "Team Logo" : (num === 13 ? "Teamfoto" : `Speler ${num}`)); }
        
        // Pagina erin verwerkt!
        let pageText = country.page ? ` (Pag. ${country.page})` : '';
        showToast(`✅ ${code} opgeslagen! (${playerName})${pageText}`, "success");
        inputField.value = ''; renderDashboard(); 
        if(navigator.vibrate) navigator.vibrate([40, 40]); 
    });
}

function openModal(prefix) {
    const countryData = collections.find(c => c.prefix === prefix);
    if (!countryData) return;

    const modal = document.getElementById('modal');
    modal.style.background = `linear-gradient(135deg, ${countryData.colors ? countryData.colors[0] : '#4f46e5'}, ${countryData.colors ? (countryData.colors[1] || '#ff005b') : '#ff005b'})`;
    document.getElementById('flag-inner-circle').style.backgroundImage = `url('${countryData.flagUrl}')`;
    document.getElementById('modal-title').innerText = countryData.name;
    
    let pageInfo = countryData.page ? ` • Pag. ${countryData.page}` : '';
    document.getElementById('modal-subtitle-text').innerText = `Tik +1 • Badge -1${pageInfo}`;

    modal.style.display = 'block'; 
    const grid = document.getElementById('sticker-grid');
    grid.innerHTML = '';

    for (let i = 1; i <= countryData.count; i++) {
        let code = prefix === 'FWC' && i === 1 ? '00' : prefix === 'FWC' ? `FWC ${i-1}` : `${prefix} ${i}`;
        let amount = allStickers[currentUser][code] || 0; 
        let statusClass = amount > 1 ? 'double' : amount === 1 ? 'owned' : '';
        let displayLabel = prefix === 'FWC' && i === 1 ? `<span class="box-num" style="font-size: 1.8rem;">00</span>` : `<span class="box-prefix">${prefix}</span><span class="box-num">${i}</span>`;
        let playerName = countryData.players ? countryData.players[i-1] : (i === 1 ? "Team Logo" : (i === 13 ? "Teamfoto" : `Speler ${i}`));

        // Meerdere bolletjes tonen als meerdere anderen hem hebben
        let dotsHTML = '';
        otherUsers.forEach(ou => {
            let theirAmt = allStickers[ou][code] || 0;
            if (theirAmt > 0) {
                let dotText = theirAmt > 1 ? `${theirAmt}x` : '✓';
                dotsHTML += `<div class="other-dot" style="background: ${userColors[ou]};">${dotText}</div>`;
            }
        });
        let otherIndicator = dotsHTML !== '' ? `<div class="dots-container">${dotsHTML}</div>` : '';

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
    allStickers[currentUser][code] = (allStickers[currentUser][code] || 0) + 1; updateStickerUI(code, allStickers[currentUser][code]);
    if(navigator.vibrate) navigator.vibrate(50); await syncToSupabase(code, allStickers[currentUser][code]);
}
async function removeSticker(event, code) {
    event.stopPropagation(); 
    allStickers[currentUser][code] = Math.max((allStickers[currentUser][code] || 0) - 1, 0);
    if (allStickers[currentUser][code] === 0) delete allStickers[currentUser][code]; 
    updateStickerUI(code, allStickers[currentUser][code] || 0);
    if(navigator.vibrate) navigator.vibrate([30, 50, 30]); await syncToSupabase(code, allStickers[currentUser][code] || 0);
}
async function syncToSupabase(code, amount) {
    try {
        let dbName = dbNames[currentUser];
        if (amount === 0) await supabaseClient.from('user_stickers').delete().match({ user_name: dbName, sticker_code: code });
        else await supabaseClient.from('user_stickers').upsert({ user_name: dbName, sticker_code: code, amount: amount });
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
    let tradeHTML = '';

    // Loop over de andere twee spelers om te zien of we kunnen ruilen!
    otherUsers.forEach(ou => {
        let give = []; let get = [];
        
        collections.forEach(country => {
            for (let i = 1; i <= country.count; i++) {
                let code = country.prefix === 'FWC' && i === 1 ? '00' : country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
                let myAmt = allStickers[currentUser][code] || 0; 
                let theirAmt = allStickers[ou][code] || 0;
                
                let pageStr = country.page ? ` (Pag.${country.page})` : '';

                if (myAmt > 1 && theirAmt === 0) give.push(code + pageStr);
                if (theirAmt > 1 && myAmt === 0) get.push(code + pageStr);
            }
        });

        tradeHTML += `
            <div class="trade-block" style="border-left: 4px solid ${userColors[ou]};">
                <h3 style="color: ${userColors[ou]};">Ruilen met ${ou}</h3>
                
                <div style="margin-bottom: 12px;">
                    <strong style="font-size: 0.9rem;">Jij zoekt, ${ou} heeft dubbel (${get.length}):</strong>
                    <div class="trade-codes" style="margin-top: 6px;">
                        ${get.length === 0 ? '<span style="color:#94a3b8; font-size:0.8rem;">Niets wat jij mist...</span>' : get.map(c => `<span class="trade-chip get">${c}</span>`).join('')}
                    </div>
                </div>

                <div>
                    <strong style="font-size: 0.9rem;">${ou} zoekt, jij hebt dubbel (${give.length}):</strong>
                    <div class="trade-codes" style="margin-top: 6px;">
                        ${give.length === 0 ? '<span style="color:#94a3b8; font-size:0.8rem;">Geen dubbele voor ${ou}...</span>' : give.map(c => `<span class="trade-chip give">${c}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    });

    document.getElementById('trade-content').innerHTML = tradeHTML;
    document.getElementById('trade-modal').style.display = 'block';
}

function closeTradeCenter() { document.getElementById('trade-modal').style.display = 'none'; }
