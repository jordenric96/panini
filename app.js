// app.js - Ultimate Girly Edition v31 (Modal Navigation Update)

const supabaseUrl = 'https://badovrzzxwbkxjgqkxjg.supabase.co'; 
const supabaseKey = 'sb_publishable_qI0tAKHoKqgC1hn_oP6XzA_n3F61CbT'; 
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

const users = ['Lou & Noé', 'Wesley', 'Oliver', 'De Stapel'];
const userColors = { 'Lou & Noé': 'var(--color-1)', 'Wesley': 'var(--color-2)', 'Oliver': 'var(--color-3)', 'De Stapel': 'var(--color-4)' };
const dbNames = { 'Lou & Noé': 'Jorden', 'Wesley': 'Wesley', 'Oliver': 'Oliver', 'De Stapel': 'Stapel' };

let currentUser = ''; 
let otherUsers = []; 
let allStickers = { 'Lou & Noé': {}, 'Wesley': {}, 'Oliver': {}, 'De Stapel': {} };
let isBulkRemove = false;
let currentModalPrefix = ''; // Houdt bij welk land open staat

function getRank(score) {
    if (score >= 980) return "Wereldkampioen! 🏆";
    if (score >= 950) return "Hall of Famer 🏛️";
    if (score >= 900) return "Legende 👑";
    if (score >= 850) return "Ballon d'Or ✨";
    if (score >= 800) return "Gouden Schoen 🥇";
    if (score >= 750) return "Topschutter ⚽";
    if (score >= 700) return "Aanvoerder ©️";
    if (score >= 650) return "Spelverdeler 🎯";
    if (score >= 600) return "Publiekslieveling 👏";
    if (score >= 550) return "Sterkhouder 💪";
    if (score >= 500) return "Vaste Waarde 🛡️";
    if (score >= 450) return "Basisspeler 🏃‍♂️";
    if (score >= 400) return "Super-sub ⚡";
    if (score >= 350) return "Invaller 🔄";
    if (score >= 300) return "Bankzitter 🪑";
    if (score >= 250) return "Selectiespeler 📋";
    if (score >= 200) return "Belofte 🌟";
    if (score >= 150) return "Jeugdproduct 👦";
    if (score >= 100) return "Mascotte 🦁";
    if (score >= 50)  return "Ballenjongen 🧢";
    return "Waterdrager 🚰";
}

async function selectUser(name) {
    currentUser = name;
    otherUsers = users.filter(u => u !== name);
    document.getElementById('profile-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
    
    if(currentUser === 'De Stapel') {
        document.getElementById('ranks-card-container').style.display = 'none';
        document.getElementById('welcome-text').innerHTML = `Magazijn van <br><span style="color: var(--color-4); font-weight: 900; font-size: 1.8rem;">📦 ${currentUser}</span>`;
        document.getElementById('btn-distribute').style.display = 'flex';
        document.getElementById('btn-trade').style.display = 'none';
    } else {
        document.getElementById('ranks-card-container').style.display = 'block';
        document.getElementById('welcome-text').innerHTML = `Album van <br><span style="color: ${userColors[currentUser]}; font-weight: 900; font-size: 1.8rem;">${currentUser}</span>`;
        document.getElementById('btn-distribute').style.display = 'none';
        document.getElementById('btn-trade').style.display = 'flex';
    }
    
    await loadUserData();
}

function logout() {
    currentUser = ''; otherUsers = [];
    document.getElementById('profile-section').style.display = 'flex';
    document.getElementById('dashboard-section').style.display = 'none';
}

function filterCountries() { renderDashboard(); }

async function loadUserData() {
    allStickers = { 'Lou & Noé': {}, 'Wesley': {}, 'Oliver': {}, 'De Stapel': {} };
    const promises = users.map(u => supabaseClient.from('user_stickers').select('*').eq('user_name', dbNames[u]));
    const results = await Promise.all(promises);
    users.forEach((u, index) => {
        if (results[index].data) { results[index].data.forEach(row => { allStickers[u][row.sticker_code] = row.amount; }); }
    });
    renderDashboard();
}

function renderDashboard() {
    const container = document.getElementById('countries-container'); container.innerHTML = '';
    const searchTerm = (document.getElementById('search-bar') ? document.getElementById('search-bar').value.toLowerCase() : '');
    
    const donationContainer = document.getElementById('wesley-donation-container');
    if (donationContainer) {
        const expiryTime = new Date(2026, 6, 12, 21, 0, 0).getTime(); 
        if (currentUser === 'Wesley' && Date.now() < expiryTime) {
            donationContainer.style.display = 'block';
        } else {
            donationContainer.style.display = 'none';
        }
    }

    let scores = { 'Lou & Noé': 0, 'Wesley': 0, 'Oliver': 0, 'De Stapel': 0 };
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
        let countTracker = { 'Lou & Noé': 0, 'Wesley': 0, 'Oliver': 0, 'De Stapel': 0 };

        for (let i = 1; i <= country.count; i++) {
            let code = country.prefix === 'FWC' && i === 1 ? '00' : country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
            users.forEach(u => { if (allStickers[u][code]) countTracker[u]++; });
        }
        users.forEach(u => { scores[u] += countTracker[u]; });

        if (!country.name.toLowerCase().includes(searchTerm) && !country.prefix.toLowerCase().includes(searchTerm)) return;

        if (country.group !== currentGroup) {
            currentGroup = country.group; let gStat = groupStats[currentGroup];
            let isGoldClass = gStat.myCount === gStat.total ? 'gold' : '';
            container.innerHTML += `<div class="group-header ${isGoldClass}"><h3>${currentGroup}</h3><span class="group-score">${gStat.myCount}/${gStat.total}</span></div>`;
        }

        const delay = cardIndex * 0.015; cardIndex++;
        const borderGlow = (countTracker[currentUser] === country.count) ? `border-color: var(--color-1); box-shadow: 0 0 12px rgba(229,152,155,0.4);` : `border-color: #f2e1e1;`;
        let pageInfo = country.page ? `<div style="font-size: 0.7rem; font-weight: 800; color: #c4b5b8; margin-top: -2px; margin-bottom: 4px;">Pag. ${country.page}</div>` : '';

        let badgesHTML = '';
        users.forEach(u => { 
            if (u === 'De Stapel' && currentUser !== 'De Stapel') return; 
            badgesHTML += `<div class="grid-badge" style="background: ${userColors[u]};">${countTracker[u]}</div>`; 
        });

        container.innerHTML += `
            <div class="country-card" style="animation-delay: ${delay}s;" onclick="openModal('${country.prefix}')">
                <div class="flag-circle" style="background-image: url('${country.flagUrl}'); ${borderGlow}"></div>
                <span class="country-prefix">${country.prefix}</span>
                ${pageInfo}
                <div class="grid-score-row">${badgesHTML}</div>
            </div>`;
    });

    let ranksHTML = '';
    let sortedUsers = [...users].filter(u => u !== 'De Stapel').sort((a, b) => scores[b] - scores[a]);
    sortedUsers.forEach(u => {
        let rankName = getRank(scores[u]);
        let isMe = u === currentUser ? `font-weight: 900; background: #fff0f0; border: 1px solid #f7dcdb; transform: scale(1.02);` : `font-weight: 800; border: 1px solid transparent;`;
        ranksHTML += `
            <div class="rank-row" style="border-left: 5px solid ${userColors[u]}; ${isMe}">
                <div class="rank-info">
                    <span class="rank-name" style="color: ${userColors[u]};">${u}</span>
                    <span class="rank-title">${rankName}</span>
                </div>
                <div class="rank-score">${scores[u]} <span style="font-size: 0.7rem; color: var(--text-secondary);">/ 980</span></div>
            </div>`;
    });
    document.getElementById('ranks-container').innerHTML = ranksHTML;
}

let toastTimeout;
function showToast(message, type, colors = null) {
    const toast = document.getElementById('toast');
    toast.innerHTML = message; toast.className = `toast show ${type}`;
    if (colors && colors.length >= 2) { toast.style.background = `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`; } 
    else if (type === 'error') { toast.style.background = '#e11d48'; } 
    else { toast.style.background = 'var(--color-1)'; }

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { toast.classList.remove('show'); }, 10000);
}

function handleQuickAdd(event) { if (event.key === 'Enter') processQuickAdd(); }

function toggleBulkMode() {
    isBulkRemove = !isBulkRemove;
    const input = document.getElementById('quick-add-input');
    const bulkBtn = document.getElementById('btn-bulk-mode');
    
    if (isBulkRemove) {
        input.style.borderColor = "#e11d48";
        input.placeholder = "⚡ VERWIJDER (bijv. BEL 1, 13)";
        bulkBtn.style.color = "#e11d48";
        bulkBtn.innerText = "➖";
    } else {
        input.style.borderColor = "#f2e1e1";
        input.placeholder = "⚡ Typ of scan (bijv. BEL 1, 13)";
        bulkBtn.style.color = "var(--color-1)";
        bulkBtn.innerText = "➕";
    }
}

async function processQuickAdd() {
    const inputField = document.getElementById('quick-add-input');
    let input = inputField.value.trim().toUpperCase();
    if (!input) return;

    const match = input.match(/^([A-Z]{3})\s*(.*)$/);
    if (!match) {
        if (input === '00' || input === 'FWC 00' || input === 'FWC00') input = "FWC 00";
        else return showToast("❌ Ongeldige code. Typ bijv: BEL 1, 13", "error");
    }

    let prefix = match ? match[1] : 'FWC';
    let numbersStr = match ? match[2] : '00';

    let country = collections.find(c => c.prefix === prefix);
    if (!country) return showToast(`❌ Landcode '${prefix}' bestaat niet.`, "error");

    let maxNum = prefix === 'FWC' ? 19 : 20; 
    let numbersArray = numbersStr.replace(/,/g, ' ').split(/\s+/).filter(n => n !== '');
    if (numbersArray.length === 0) return showToast("❌ Geen nummers ingevuld. Typ bijv: BEL 1", "error");

    let validCodes = []; let errors = []; let updatesMap = {};

    numbersArray.forEach(numStr => {
        let num = parseInt(numStr, 10);
        let code = null;
        if (prefix === 'FWC' && (numStr === '00' || num === 0)) code = '00';
        else if (!isNaN(num) && num >= 1 && num <= maxNum) code = `${prefix} ${num}`;
        else errors.push(numStr);

        if (code) {
            validCodes.push(code);
            let currentAmt = allStickers[currentUser][code] || 0;
            let newAmt = isBulkRemove ? Math.max(0, currentAmt - 1) : currentAmt + 1;
            allStickers[currentUser][code] = newAmt;
            if (newAmt === 0) delete allStickers[currentUser][code];
            updatesMap[code] = newAmt;
        }
    });

    if (errors.length > 0) showToast(`❌ Genegeerd (bestaan niet): ${errors.join(', ')}`, "error");
    if (validCodes.length === 0) return;

    let promises = Object.keys(updatesMap).map(code => syncToSupabase(code, updatesMap[code]));
    await Promise.all(promises);

    if (typeof confetti === 'function' && !isBulkRemove) {
        let particles = Math.min(300, 100 + (validCodes.length * 20));
        confetti({ particleCount: particles, spread: 100, origin: { y: 0.8 }, colors: country.colors });
    }

    if (!isBulkRemove && validCodes.length === 1) {
        let code = validCodes[0];
        let newAmt = allStickers[currentUser][code];
        let statusText = newAmt === 1 ? '🌟 NIEUWE STICKER!' : `🔄 DUBBEL (${newAmt}x)`;
        let pName = country.players ? country.players[(code==='00'?0:parseInt(code.split(' ')[1])) - (prefix==='FWC'?0:1)] : code;
        
        let msg = `
            <div style="font-size: 1.4rem; font-weight: 900; margin-bottom: 5px;">${code}</div>
            <div style="font-size: 0.8rem; margin-bottom: 8px;">${pName}</div>
            <div style="font-size: 1.1rem; font-weight: 900; background: rgba(0,0,0,0.2); padding: 5px 10px; border-radius: 10px; display: inline-block;">${statusText}</div>
        `;
        showToast(msg, "success", country.colors);
    } else {
        let actionVerb = isBulkRemove ? "VERWIJDERD" : "TOEGEVOEGD";
        let msgBody = validCodes.length === 1 ? `Nummer ${validCodes[0]}` : validCodes.join(', ');
        showToast(`
            <div style="font-size: 1.3rem; font-weight: 900; margin-bottom: 5px;">✅ ${validCodes.length} ${actionVerb}!</div>
            <div style="font-size: 1rem; font-weight: 800; background: rgba(0,0,0,0.2); padding: 5px; border-radius: 8px; display: inline-block;">${msgBody}</div>
        `, "success", country.colors);
    }
    
    inputField.value = ''; 
    renderDashboard();
    if(navigator.vibrate) navigator.vibrate([40, 40]);
}

// --- NAVIGATIE MODAL LOGICA --- //
function navigateModal(direction) {
    if (!currentModalPrefix) return;
    
    let currentIndex = collections.findIndex(c => c.prefix === currentModalPrefix);
    if (currentIndex === -1) return;

    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = collections.length - 1; 
    if (newIndex >= collections.length) newIndex = 0; 

    if(navigator.vibrate) navigator.vibrate(30);

    openModal(collections[newIndex].prefix);
}

function openModal(prefix) {
    currentModalPrefix = prefix; // Sla op welk land we open hebben
    
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

function closeModal() { document.getElementById('modal').style.display = 'none'; currentModalPrefix = ''; renderDashboard(); }

async function addSticker(code) {
    allStickers[currentUser][code] = (allStickers[currentUser][code] || 0) + 1; 
    let newAmt = allStickers[currentUser][code];
    updateStickerUI(code, newAmt);
    if(navigator.vibrate) navigator.vibrate(50); 
    
    let statusText = newAmt === 1 ? '🌟 NIEUWE STICKER!' : `🔄 DUBBEL (${newAmt}x)`;
    showToast(`${code}: ${statusText}`, "success");
    
    await syncToSupabase(code, newAmt);
}

async function removeSticker(event, code) {
    event.stopPropagation(); 
    allStickers[currentUser][code] = Math.max((allStickers[currentUser][code] || 0) - 1, 0);
    if (allStickers[currentUser][code] === 0) delete allStickers[currentUser][code]; 
    updateStickerUI(code, allStickers[currentUser][code] || 0);
    if(navigator.vibrate) navigator.vibrate([30, 50, 30]); await syncToSupabase(code, allStickers[currentUser][code] || 0);
}

async function syncToSupabase(code, amount, specificUser = null) {
    try {
        let target = specificUser ? specificUser : currentUser;
        let dbName = dbNames[target];
        if (amount === 0) await supabaseClient.from('user_stickers').delete().match({ user_name: dbName, sticker_code: code });
        else await supabaseClient.from('user_stickers').upsert({ user_name: dbName, sticker_code: code, amount: amount });
    } catch (err) { console.error("Cloud Error:", err.message); }
}

function updateStickerUI(code, amount) {
    const box = document.getElementById(`box-${code}`);
    const badge = document.getElementById(`badge-${code}`);
    if(!box || !badge) return;
    box.className = 'sticker-box';
    if (amount === 1) { box.classList.add('owned'); badge.innerText = `1x`; badge.style.display = 'flex'; }
    else if (amount > 1) { box.classList.add('double'); badge.innerText = `${amount}x`; badge.style.display = 'flex'; }
    else { badge.style.display = 'none'; }
}

function openDistributeCenter() {
    let html = '';
    let globalNobody = []; 
    let countryGroups = {};

    collections.forEach(c => {
        countryGroups[c.prefix] = { bothEnough: [], bothConflict: [], lou: [], oli: [] };
    });

    for (let code in allStickers['De Stapel']) {
        let amt = allStickers['De Stapel'][code];
        if (amt > 0) {
            let needsLou = (allStickers['Lou & Noé'][code] || 0) === 0;
            let needsOli = (allStickers['Oliver'][code] || 0) === 0;

            let prefix = code === '00' ? 'FWC' : code.split(' ')[0];
            let num = code === '00' ? 0 : parseInt(code.split(' ')[1]);
            let country = collections.find(c => c.prefix === prefix);
            let pName = "Speler"; let flag = "";
            if (country) {
                flag = country.flagUrl;
                let idx = prefix === 'FWC' ? (code==='00'?0:num) : num - 1;
                pName = country.players ? country.players[idx] : `Speler ${num}`;
            }

            let item = { code, name: pName, flag, amt };

            if (!needsLou && !needsOli) {
                globalNobody.push(item);
            } else if (countryGroups[prefix]) {
                if (needsLou && needsOli) {
                    if (amt >= 2) countryGroups[prefix].bothEnough.push(item);
                    else countryGroups[prefix].bothConflict.push(item);
                }
                else if (needsLou) countryGroups[prefix].lou.push(item);
                else if (needsOli) countryGroups[prefix].oli.push(item);
            }
        }
    }

    const renderItems = (items, type) => {
        if (items.length === 0) return '';
        let res = '<div class="trade-codes" style="margin-bottom: 12px;">';
        items.forEach(item => {
            let btnHTML = '';
            if (type === 'bothEnough') {
                btnHTML = `<button class="btn-instant-trade" style="background: linear-gradient(135deg, var(--color-1), var(--color-3)); width: 100%; padding: 6px;" onclick="claimFromPileBoth('${item.code}')">Aan BEIDEN</button>`;
            } else if (type === 'bothConflict') {
                btnHTML = `<div style="display:flex; gap:5px;"><button class="btn-instant-trade" style="background:var(--color-1);" onclick="claimFromPile('${item.code}', 'Lou & Noé')">L&N</button><button class="btn-instant-trade" style="background:var(--color-3);" onclick="claimFromPile('${item.code}', 'Oliver')">Oli</button></div>`;
            } else if (type === 'lou') {
                btnHTML = `<button class="btn-instant-trade" style="background:var(--color-1);" onclick="claimFromPile('${item.code}', 'Lou & Noé')">Geef L&N</button>`;
            } else if (type === 'oli') {
                btnHTML = `<button class="btn-instant-trade" style="background:var(--color-3);" onclick="claimFromPile('${item.code}', 'Oliver')">Geef Oli</button>`;
            } else {
                btnHTML = `<span class="trade-status-box give">Echte Dubbele</span>`;
            }
            res += `<div class="trade-chip-wrapper" style="margin-bottom: 6px;"><div class="trade-item-left"><div class="trade-mini-flag" style="background-image: url('${item.flag}');"></div><span class="trade-num-badge">${item.code}</span><span class="trade-player-name">${item.name} <span style="font-size:0.7rem; color:var(--text-secondary);">(${item.amt}x in Stapel)</span></span></div>${btnHTML}</div>`;
        });
        res += '</div>';
        return res;
    };

    const renderSubGroup = (title, items, color, type) => {
        if (items.length === 0) return '';
        return `<div style="margin-bottom: 6px;"><strong style="font-size: 0.8rem; color: ${color}; text-transform: uppercase; letter-spacing: 0.5px;">${title} (${items.length})</strong>${renderItems(items, type)}</div>`;
    };

    let hasAnyStickers = false;

    collections.forEach(country => {
        let prefix = country.prefix;
        let group = countryGroups[prefix];
        if (!group) return;

        let totalInCountry = group.bothEnough.length + group.bothConflict.length + group.lou.length + group.oli.length;
        
        if (totalInCountry > 0) {
            hasAnyStickers = true;
            html += `<div class="trade-block" style="border-left: 4px solid var(--color-1); border-color: #f9f0f0;">
                <h3 style="color: var(--color-1); display: flex; align-items: center; gap: 8px; font-size: 1.2rem; margin-bottom: 12px; border-bottom: 1px dashed #f2e1e1; padding-bottom: 6px;">
                    <img src="${country.flagUrl}" style="width: 28px; height: 18px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"> 
                    ${country.name}
                </h3>
                <div style="padding-top: 5px;">`;
            
            html += renderSubGroup('✅ Beiden (Genoeg!)', group.bothEnough, '#10b981', 'bothEnough');
            html += renderSubGroup('⚠️ Beiden (Slechts 1!)', group.bothConflict, '#e11d48', 'bothConflict');
            html += renderSubGroup('Enkel Lou & Noé', group.lou, userColors['Lou & Noé'], 'lou');
            html += renderSubGroup('Enkel Oliver', group.oli, userColors['Oliver'], 'oli');
            
            html += `</div></div>`;
        }
    });

    if (globalNobody.length > 0) {
        hasAnyStickers = true;
        html += `<div class="trade-block" style="border-left: 4px solid #c4b5b8; border-color: #f2e1e1; margin-top: 20px;">
            <h3 style="color: #c4b5b8; font-size: 1.1rem; border-bottom: 1px dashed #f2e1e1; padding-bottom: 6px;">Niemand nodig (Echte Dubbele) (${globalNobody.length})</h3>
            <div style="padding-top: 5px;">
                ${renderItems(globalNobody, 'nobody')}
            </div>
        </div>`;
    }

    if (!hasAnyStickers) html = `<div style="text-align:center; padding: 40px 20px; color: var(--text-secondary); font-weight: 800;">De stapel is leeg! Begin met scannen.</div>`;

    document.getElementById('distribute-content').innerHTML = html; document.getElementById('distribute-modal').style.display = 'block';
}

function closeDistributeCenter() { document.getElementById('distribute-modal').style.display = 'none'; }

async function claimFromPile(code, targetUser) {
    let pileAmt = allStickers['De Stapel'][code];
    if (!pileAmt || pileAmt < 1) return;
    allStickers['De Stapel'][code] -= 1; if (allStickers['De Stapel'][code] === 0) delete allStickers['De Stapel'][code];
    allStickers[targetUser][code] = (allStickers[targetUser][code] || 0) + 1;
    if(navigator.vibrate) navigator.vibrate(40);
    await Promise.all([ syncToSupabase(code, allStickers['De Stapel'][code] || 0, 'De Stapel'), syncToSupabase(code, allStickers[targetUser][code], targetUser) ]);
    let prefix = code === '00' ? 'FWC' : code.split(' ')[0]; let country = collections.find(c => c.prefix === prefix);
    if(typeof confetti === 'function' && country) { confetti({ particleCount: 100, spread: 60, origin: { y: 0.8 }, colors: country.colors }); }
    showToast(`✅ ${code} geplakt bij ${targetUser}!`, "success"); openDistributeCenter(); renderDashboard();
}

async function claimFromPileBoth(code) {
    let pileAmt = allStickers['De Stapel'][code];
    if (!pileAmt || pileAmt < 2) return;
    allStickers['De Stapel'][code] -= 2; if (allStickers['De Stapel'][code] === 0) delete allStickers['De Stapel'][code];
    allStickers['Lou & Noé'][code] = (allStickers['Lou & Noé'][code] || 0) + 1;
    allStickers['Oliver'][code] = (allStickers['Oliver'][code] || 0) + 1;
    
    if(navigator.vibrate) navigator.vibrate([40, 40]);
    await Promise.all([ 
        syncToSupabase(code, allStickers['De Stapel'][code] || 0, 'De Stapel'), 
        syncToSupabase(code, allStickers['Lou & Noé'][code], 'Lou & Noé'),
        syncToSupabase(code, allStickers['Oliver'][code], 'Oliver')
    ]);
    
    let prefix = code === '00' ? 'FWC' : code.split(' ')[0]; let country = collections.find(c => c.prefix === prefix);
    if(typeof confetti === 'function' && country) { confetti({ particleCount: 200, spread: 100, origin: { y: 0.8 }, colors: country.colors }); }
    showToast(`✅ ${code} geplakt bij L&N én Oliver!`, "success"); openDistributeCenter(); renderDashboard();
}

let currentListTab = 'doubles';
function openListCenter() { document.getElementById('list-modal').style.display = 'block'; setListTab(currentListTab); }
function closeListCenter() { document.getElementById('list-modal').style.display = 'none'; renderDashboard(); }
function setListTab(tab) {
    currentListTab = tab; document.querySelectorAll('.list-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active'); renderListContent();
}
function renderListContent() {
    let html = ''; let count = 0;
    collections.forEach(country => {
        let countryItems = [];
        for (let i = 1; i <= country.count; i++) {
            let code = country.prefix === 'FWC' && i === 1 ? '00' : country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
            let amt = allStickers[currentUser][code] || 0; let pName = country.players ? country.players[i-1] : `Speler ${i}`;
            let show = false;
            if (currentListTab === 'doubles' && amt > 1) show = true;
            if (currentListTab === 'owned' && amt > 0) show = true;
            if (currentListTab === 'missing' && amt === 0) show = true;
            if (show) {
                count++;
                countryItems.push(`<div class="list-item"><div class="list-item-info"><div class="trade-mini-flag" style="background-image: url('${country.flagUrl}');"></div><span class="trade-num-badge" style="min-width: 50px;">${code}</span><span class="trade-player-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${pName}</span></div><div class="list-controls"><button class="btn-list-ctrl" onclick="updateStickerFromList('${code}', -1)">-</button><span class="list-count" id="list-cnt-${code.replace(' ', '-')}">${amt}x</span><button class="btn-list-ctrl" onclick="updateStickerFromList('${code}', 1)">+</button></div></div>`);
            }
        }
        if (countryItems.length > 0) { html += `<div style="margin: 15px 15px 8px 15px; font-weight: 900; color: var(--color-1); text-transform: uppercase; font-size: 0.9rem;">${country.name}</div><div style="padding: 0 15px;">` + countryItems.join('') + `</div>`; }
    });
    if (count === 0) { html = `<div style="text-align:center; padding: 40px 20px; color: var(--text-secondary); font-weight: 800;">Geen stickers in deze lijst...</div>`; }
    document.getElementById('list-content').innerHTML = html;
}
async function updateStickerFromList(code, change) {
    let currentAmt = allStickers[currentUser][code] || 0; let newAmt = Math.max(0, currentAmt + change);
    allStickers[currentUser][code] = newAmt; if (newAmt === 0) delete allStickers[currentUser][code];
    let countEl = document.getElementById(`list-cnt-${code.replace(' ', '-')}`); if (countEl) countEl.innerText = `${newAmt}x`;
    if (navigator.vibrate) navigator.vibrate(40);
    if (currentAmt === 0 && change > 0 && typeof confetti === 'function') { let prefix = code === '00' ? 'FWC' : code.split(' ')[0]; let country = collections.find(c => c.prefix === prefix); if(country) confetti({ particleCount: 100, spread: 60, origin: { y: 0.8 }, colors: country.colors }); }
    await syncToSupabase(code, newAmt);
}

let isScanning = false; let scannerInterval; let scannerWorker; let lastScannedCode = "";
async function toggleScanner() {
    const container = document.getElementById('scanner-container');
    if (isScanning) {
        isScanning = false; clearInterval(scannerInterval);
        const video = document.getElementById('scanner-video'); if (video.srcObject) { video.srcObject.getTracks().forEach(track => track.stop()); }
        container.style.display = 'none';
    } else {
        const video = document.getElementById('scanner-video'); const status = document.getElementById('scanner-status');
        container.style.display = 'block'; isScanning = true;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', focusMode: 'continuous' } });
            video.srcObject = stream; status.innerText = "Scanner initialiseren... ⏳";
            if (!scannerWorker) { scannerWorker = await Tesseract.createWorker(); await scannerWorker.loadLanguage('eng'); await scannerWorker.initialize('eng'); await scannerWorker.setParameters({ tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ' }); }
            status.innerText = "Live: Houd sticker in vak 📷";
            const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
            scannerInterval = setInterval(async () => {
                if (!isScanning) return;
                const vw = video.videoWidth; const vh = video.videoHeight;
                const cropW = vw * 0.5; const cropH = vh * 0.3; const cropX = (vw - cropW) / 2; const cropY = (vh - cropH) / 2;
                canvas.width = cropW; canvas.height = cropH; ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
                const { data: { text } } = await scannerWorker.recognize(canvas);
                let cleanText = text.toUpperCase().replace(/[^A-Z0-9\s]/g, ''); const match = cleanText.match(/([A-Z]{3})\s*(\d{1,2})/);
                if (match) {
                    let prefix = match[1]; let num = parseInt(match[2], 10); let code = prefix === 'FWC' && num === 0 ? '00' : `${prefix} ${num}`;
                    if (code !== lastScannedCode) {
                        let country = collections.find(c => c.prefix === prefix);
                        if (country) {
                            let maxNum = prefix === 'FWC' ? 19 : 20; 
                            if (code === '00' || (num >= 1 && num <= maxNum)) {
                                status.innerText = `Gevonden: ${code} ✅`; lastScannedCode = code; document.getElementById('quick-add-input').value = code; processQuickAdd(); 
                                setTimeout(() => { if(isScanning) status.innerText = "Live: Volgende sticker 📷"; lastScannedCode = ""; }, 3500);
                            }
                        }
                    }
                }
            }, 1000);
        } catch (err) { console.error(err); showToast("❌ Camera toegang geweigerd of fout", "error"); toggleScanner(); }
    }
}

async function executeWesleyDonation() {
    let updates = []; let totalDonated = 0; let louNoeDbName = dbNames['Lou & Noé']; let wesleyDbName = dbNames['Wesley'];
    for (let code in allStickers['Wesley']) {
        let amount = allStickers['Wesley'][code];
        if (amount > 1) {
            let donatedAmt = amount - 1; totalDonated += donatedAmt;
            allStickers['Wesley'][code] = 1; allStickers['Lou & Noé'][code] = (allStickers['Lou & Noé'][code] || 0) + donatedAmt;
            updates.push(supabaseClient.from('user_stickers').upsert({ user_name: wesleyDbName, sticker_code: code, amount: 1 }));
            updates.push(supabaseClient.from('user_stickers').upsert({ user_name: louNoeDbName, sticker_code: code, amount: allStickers['Lou & Noé'][code] }));
        }
    }
    if (totalDonated > 0) {
        document.getElementById('wesley-donation-container').style.display = 'none'; showToast("⏳ Transactie bezig...", "success"); await Promise.all(updates);
        if (typeof confetti === 'function') { confetti({ particleCount: 400, spread: 120, origin: { y: 0.5 }, colors: ['#4b0082', '#ffffff', '#ffd700'] }); }
        showToast(`💜 COME ON YOU MAUVES! Wesley doneert ${totalDonated} stickers!`, "success", ['#4b0082', '#ffffff']); renderDashboard();
    } else { showToast("❌ Wesley heeft helaas geen dubbele meer over!", "error"); }
}

async function executeInstantTrade(code, targetUser) {
    let myNewAmt = Math.max((allStickers[currentUser][code] || 0) - 1, 0); let theirNewAmt = (allStickers[targetUser][code] || 0) + 1;
    allStickers[currentUser][code] = myNewAmt; if(myNewAmt === 0) delete allStickers[currentUser][code]; allStickers[targetUser][code] = theirNewAmt;
    if(navigator.vibrate) navigator.vibrate([50, 30, 50]);
    await Promise.all([ syncToSupabase(code, myNewAmt), syncToSupabase(code, theirNewAmt, targetUser) ]);
    showToast(`🔄 Sticker overgedragen naar ${targetUser}!`, "success"); openTradeCenter(); renderDashboard();
}

function openTradeCenter() {
    let tradeHTML = '';
    otherUsers.forEach(ou => {
        if(ou === 'De Stapel') return; 
        let give = []; let get = [];
        collections.forEach(country => {
            for (let i = 1; i <= country.count; i++) {
                let code = country.prefix === 'FWC' && i === 1 ? '00' : country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
                let myAmt = allStickers[currentUser][code] || 0; let theirAmt = allStickers[ou][code] || 0;
                let pName = country.players ? country.players[i-1] : `Speler ${i}`; let numDisplay = country.prefix === 'FWC' && i === 1 ? "00" : `${i}`; let pageStr = country.page ? ` (P.${country.page})` : '';
                if (myAmt > 1 && theirAmt === 0) give.push({code: code, flag: country.flagUrl, num: numDisplay, name: pName, page: pageStr});
                if (theirAmt > 1 && myAmt === 0) get.push({code: code, flag: country.flagUrl, num: numDisplay, name: pName, page: pageStr});
            }
        });
        tradeHTML += `
            <div class="trade-block" style="border-left: 4px solid ${userColors[ou]}; border-color: ${userColors[ou]};"><h3 style="color: ${userColors[ou]};">Ruilen met ${ou}</h3><div style="margin-bottom: 16px;"><strong style="font-size: 0.95rem;">Jij zoekt, ${ou} heeft dubbel (${get.length}):</strong><div class="trade-codes" style="margin-top: 8px;">${get.length === 0 ? '<span style="color:var(--text-secondary); font-size:0.8rem;">Niets wat jij mist...</span>' : get.map(item => `<div class="trade-chip-wrapper"><div class="trade-item-left"><div class="trade-mini-flag" style="background-image: url('${item.flag}');"></div><span class="trade-num-badge">${item.num}</span><span class="trade-player-name">${item.name} <span style="font-size:0.75rem; color:var(--text-secondary);">${item.page}</span></span></div><span class="trade-status-box get">Jij Mist</span></div>`).join('')}</div></div><div><strong style="font-size: 0.95rem;">${ou} zoekt, jij hebt dubbel (${give.length}):</strong><div class="trade-codes" style="margin-top: 8px;">${give.length === 0 ? '<span style="color:var(--text-secondary); font-size:0.8rem;">Geen dubbele voor ${ou}...</span>' : give.map(item => `<div class="trade-chip-wrapper"><div class="trade-item-left"><div class="trade-mini-flag" style="background-image: url('${item.flag}');"></div><span class="trade-num-badge">${item.num}</span><span class="trade-player-name">${item.name} <span style="font-size:0.75rem; color:var(--text-secondary);">${item.page}</span></span></div><button class="btn-instant-trade" onclick="executeInstantTrade('${item.code}', '${ou}')">⚡ Ruil</button></div>`).join('')}</div></div></div>`;
    });
    document.getElementById('trade-content').innerHTML = tradeHTML; document.getElementById('trade-modal').style.display = 'block';
}
function closeTradeCenter() { document.getElementById('trade-modal').style.display = 'none'; }

function openStatsCenter() {
    const realUsers = ['Lou & Noé', 'Wesley', 'Oliver'];
    let statsHTML = ''; let belHTML = '';
    realUsers.forEach(u => {
        let belCount = 0; for(let i=1; i<=20; i++){ if(allStickers[u][`BEL ${i}`]) belCount++; } let perc = (belCount / 20) * 100;
        belHTML += `<div style="font-size: 0.85rem; font-weight: 800; color: ${userColors[u]};">${u} (${belCount}/20)</div><div class="stat-bar-bg"><div class="stat-bar-fill" style="background: ${userColors[u]}; width: ${perc}%;"></div></div>`;
    });
    statsHTML += `<div class="stat-block"><h3>🇧🇪 Rode Duivels Barometer</h3>${belHTML}</div>`;
    let poulesMap = {};
    collections.forEach(c => {
        if(!poulesMap[c.group]) poulesMap[c.group] = { totalStickers: 0, usersOwned: { 'Lou & Noé': 0, 'Wesley': 0, 'Oliver': 0 } };
        poulesMap[c.group].totalStickers += c.count;
        for (let i = 1; i <= c.count; i++) {
            let code = c.prefix === 'FWC' && i === 1 ? '00' : c.prefix === 'FWC' ? `FWC ${i-1}` : `${c.prefix} ${i}`;
            realUsers.forEach(u => { if(allStickers[u][code]) poulesMap[c.group].usersOwned[u]++; });
        }
    });
    let poulesHTML = '';
    Object.keys(poulesMap).forEach(gName => {
        let pData = poulesMap[gName]; let sortedPouleUsers = [...realUsers].sort((a,b) => pData.usersOwned[b] - pData.usersOwned[a]);
        let leader = sortedPouleUsers[0]; let leaderScore = pData.usersOwned[leader]; let leaderPerc = Math.round((leaderScore / pData.totalStickers) * 100);
        poulesHTML += `<div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px dashed #f2e1e1;"><div style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">${gName} <span style="font-size:0.75rem; color:var(--text-secondary);">(${pData.totalStickers} tot.)</span></div><div class="poule-row"><span style="color: ${userColors[leader]}; font-size:0.85rem;">🥇 ${leader}</span><div class="poule-mini-bar"><div style="height:100%; background:${userColors[leader]}; width:${(leaderScore/pData.totalStickers)*100}%;"></div></div><span>${leaderScore} st. (${leaderPerc}%)</span></div></div>`;
    });
    statsHTML += `<div class="stat-block"><h3>📊 Poule Ranglijst</h3>${poulesHTML}</div>`;
    document.getElementById('stats-content').innerHTML = statsHTML; document.getElementById('stats-modal').style.display = 'block';
}
function closeStatsCenter() { document.getElementById('stats-modal').style.display = 'none'; }

function printList() {
    let html = `<div class="print-header"><h2>WK 2026 Ruillijst - ${currentUser}</h2><p>Gegenereerd op ${new Date().toLocaleDateString('nl-BE')}</p></div><div class="print-grid">`;
    let sortedCollections = [...collections].sort((a, b) => a.name.localeCompare(b.name));
    sortedCollections.forEach(country => {
        let missing = []; let doubles = [];
        for (let i = 1; i <= country.count; i++) {
            let code = country.prefix === 'FWC' && i === 1 ? '00' : country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
            let numDisplay = country.prefix === 'FWC' && i === 1 ? '00' : `${i}`; let amt = allStickers[currentUser][code] || 0;
            if (amt === 0) { missing.push(numDisplay); } else if (amt > 1) { for(let d = 0; d < (amt - 1); d++) { doubles.push(numDisplay); } }
        }
        if (missing.length > 0 || doubles.length > 0) {
            html += `<div class="print-country-block"><div class="print-country-title"><img src="${country.flagUrl}" class="print-flag" alt="${country.prefix}"> <strong>${country.name}</strong> <span style="font-size: 0.85rem; color: #64748b;">(${country.prefix})</span></div><div class="print-lists"><div class="print-missing"><strong>Zoekt:</strong> ${missing.length > 0 ? missing.join(', ') : 'Compleet! 🎉'}</div>${doubles.length > 0 ? `<div class="print-doubles"><strong>Dubbel:</strong> ${doubles.join(', ')}</div>` : ''}</div></div>`;
        }
    });
    html += `</div>`; document.getElementById('print-area').innerHTML = html; window.print();
}

// --- NIEUW: FOTO GENERATOR VOOR FACEBOOK (VERSIE 30 - INLINE COMPACT) --- //
async function generateShareImage() {
    if (typeof html2canvas === 'undefined') {
        return showToast("❌ Foto module is nog aan het inladen, probeer opnieuw.", "error");
    }

    showToast("📸 Foto genereren, even geduld...", "success");

    const container = document.getElementById('share-image-container');
    
    let missingChunks = [];
    let doublesChunks = [];
    let hasItems = false;

    let sortedCollections = [...collections].sort((a, b) => a.name.localeCompare(b.name));

    sortedCollections.forEach(country => {
        let missingNums = []; 
        let doublesNums = [];
        
        for (let i = 1; i <= country.count; i++) {
            let code = country.prefix === 'FWC' && i === 1 ? '00' : country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
            let numDisplay = country.prefix === 'FWC' && i === 1 ? '00' : `${i}`; 
            let amt = allStickers[currentUser][code] || 0;
            
            if (amt === 0) { 
                missingNums.push(numDisplay); 
            } else if (amt > 1) { 
                doublesNums.push(amt > 2 ? `${numDisplay}(${amt-1}x)` : numDisplay);
            }
        }
        
        if (missingNums.length > 0) {
            hasItems = true;
            missingChunks.push(`<span class="share-country-chunk"><b>${country.prefix}:</b> ${missingNums.join(', ')}</span>`);
        }
        if (doublesNums.length > 0) {
            hasItems = true;
            doublesChunks.push(`<span class="share-country-chunk"><b>${country.prefix}:</b> ${doublesNums.join(', ')}</span>`);
        }
    });
    
    if (!hasItems) {
        return showToast("❌ Je hebt nog geen stickers om te delen!", "error");
    }

    let html = `
        <div class="share-header">
            <h2 class="share-title">WK 2026 Ruillijst</h2>
            <p class="share-subtitle">Album van ${currentUser} • ${new Date().toLocaleDateString('nl-BE')}</p>
        </div>
    `;
    
    if (missingChunks.length > 0) {
        html += `
            <div class="share-box share-box-missing">
                <h3>❌ MANCO'S (Wij zoeken)</h3>
                <div class="share-text-content">
                    ${missingChunks.join(' <span style="color:#c4b5b8; margin:0 8px; font-weight: 800;">•</span> ')}
                </div>
            </div>
        `;
    }

    if (doublesChunks.length > 0) {
        html += `
            <div class="share-box share-box-doubles">
                <h3>✅ DUBBELS (Wij ruilen)</h3>
                <div class="share-text-content">
                    ${doublesChunks.join(' <span style="color:#c4b5b8; margin:0 8px; font-weight: 800;">•</span> ')}
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;

    setTimeout(async () => {
        try {
            const canvas = await html2canvas(container, {
                scale: 2, 
                backgroundColor: "#fcf9f8" 
            });
            
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            let timestamp = new Date().toISOString().slice(0,10);
            link.download = `Ruillijst_${currentUser.replace(/[^a-z0-9]/gi, '_')}_${timestamp}.png`;
            link.href = imgData;
            link.click(); 
            
            showToast("✅ Foto succesvol gedownload!", "success");
            container.innerHTML = ''; 
        } catch (e) {
            console.error("Canvas Fout: ", e);
            showToast("❌ Fout bij maken van de foto.", "error");
        }
    }, 500);
}
