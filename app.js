// app.js - Ultimate Edition v25 (De Stapel Editie)

const supabaseUrl = 'https://badovrzzxwbkxjgqkxjg.supabase.co'; 
const supabaseKey = 'sb_publishable_qI0tAKHoKqgC1hn_oP6XzA_n3F61CbT'; 
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

const users = ['Lou & Noé', 'Wesley', 'Oliver', 'De Stapel'];
const userColors = { 'Lou & Noé': 'var(--color-1)', 'Wesley': 'var(--color-2)', 'Oliver': 'var(--color-3)', 'De Stapel': 'var(--color-4)' };
const dbNames = { 'Lou & Noé': 'Jorden', 'Wesley': 'Wesley', 'Oliver': 'Oliver', 'De Stapel': 'Stapel' };

let currentUser = ''; 
let otherUsers = []; 
let allStickers = { 'Lou & Noé': {}, 'Wesley': {}, 'Oliver': {}, 'De Stapel': {} };

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
    
    // Verberg het klassement op het dashboard als 'De Stapel' is ingelogd
    if(currentUser === 'De Stapel') {
        document.getElementById('ranks-card-container').style.display = 'none';
        document.getElementById('welcome-text').innerHTML = `Inventaris van <br><span style="color: ${userColors[currentUser]}; font-weight: 900; font-size: 1.8rem;">📦 ${currentUser}</span>`;
    } else {
        document.getElementById('ranks-card-container').style.display = 'block';
        document.getElementById('welcome-text').innerHTML = `Album van <br><span style="color: ${userColors[currentUser]}; font-weight: 900; font-size: 1.8rem;">${currentUser}</span>`;
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
    
    // Wesley's Donatie Knop Logica (Kan na juli 2026 genegeerd worden)
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
        const borderGlow = (countTracker[currentUser] === country.count) ? `border-color: #10b981; box-shadow: 0 0 12px #10b98180;` : `border-color: ${(country.colors ? country.colors[0] : '#4f46e5')}50;`;
        let pageInfo = country.page ? `<div style="font-size: 0.7rem; font-weight: 800; color: #94a3b8; margin-top: -2px; margin-bottom: 4px;">Pag. ${country.page}</div>` : '';

        let badgesHTML = '';
        users.forEach(u => { 
            // We tonen "De Stapel" badges niet op de overzichtskaartjes van anderen, behalve als je De Stapel zelf bent.
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

    // Rangen renderen (EXCLUSIEF De Stapel)
    let ranksHTML = '';
    let sortedUsers = [...users].filter(u => u !== 'De Stapel').sort((a, b) => scores[b] - scores[a]);
    sortedUsers.forEach(u => {
        let rankName = getRank(scores[u]);
        let isMe = u === currentUser ? `font-weight: 900; background: ${userColors[u]}15; border: 1px solid ${userColors[u]}40; transform: scale(1.02);` : `font-weight: 800; border: 1px solid transparent;`;
        ranksHTML += `
            <div class="rank-row" style="border-left: 5px solid ${userColors[u]}; ${isMe}">
                <div class="rank-info">
                    <span class="rank-name" style="color: ${userColors[u]};">${u}</span>
                    <span class="rank-title">${rankName}</span>
                </div>
                <div class="rank-score" style="${u === currentUser ? 'font-weight: 900;' : 'font-weight: 700;'}">${scores[u]} <span style="font-size: 0.7rem; color: var(--text-secondary);">/ 980</span></div>
            </div>`;
    });
    document.getElementById('ranks-container').innerHTML = ranksHTML;
}

let toastTimeout;
function showToast(message, type, colors = null) {
    const toast = document.getElementById('toast');
    toast.innerHTML = message; toast.className = `toast show ${type}`;
    if (colors && colors.length >= 2) { toast.style.background = `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`; } 
    else if (type === 'error') { toast.style.background = '#ef4444'; } 
    else { toast.style.background = 'var(--color-owned)'; }

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { toast.classList.remove('show'); }, 10000);
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
        
        let pageText = country.page ? `<div style="margin-top: 5px; font-size: 0.9rem; opacity: 0.9;">Pagina ${country.page}</div>` : '';
        let statusText = newAmount === 1 ? '🌟 NIEUWE STICKER!' : `🔄 DUBBEL (${newAmount}x)`;

        if (typeof confetti === 'function') {
            if (newAmount === 1) confetti({ particleCount: 150, spread: 80, origin: { y: 0.8 }, colors: country.colors });
            else confetti({ particleCount: 50, spread: 40, origin: { y: 0.8 }, colors: country.colors });
        }

        let msg = `
            <div style="font-size: 1.4rem; font-weight: 900; margin-bottom: 5px;">${code} - ${playerName}</div>
            <div style="font-size: 1.2rem; font-weight: 800; background: rgba(0,0,0,0.2); padding: 5px; border-radius: 8px; display: inline-block;">${statusText}</div>
            ${pageText}
        `;
        showToast(msg, "success", country.colors);
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

// --- INTERACTIEVE DIGITALE LIJSTEN --- //
let currentListTab = 'doubles';

function openListCenter() {
    document.getElementById('list-modal').style.display = 'block';
    setListTab(currentListTab);
}
function closeListCenter() {
    document.getElementById('list-modal').style.display = 'none';
    renderDashboard(); 
}

function setListTab(tab) {
    currentListTab = tab;
    document.querySelectorAll('.list-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    renderListContent();
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
                countryItems.push(`
                    <div class="list-item">
                        <div class="list-item-info">
                            <div class="trade-mini-flag" style="background-image: url('${country.flagUrl}');"></div>
                            <span class="trade-num-badge" style="min-width: 50px;">${code}</span>
                            <span class="trade-player-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${pName}</span>
                        </div>
                        <div class="list-controls">
                            <button class="btn-list-ctrl" onclick="updateStickerFromList('${code}', -1)">-</button>
                            <span class="list-count" id="list-cnt-${code.replace(' ', '-')}">${amt}x</span>
                            <button class="btn-list-ctrl" onclick="updateStickerFromList('${code}', 1)">+</button>
                        </div>
                    </div>
                `);
            }
        }
        if (countryItems.length > 0) {
            html += `<div style="margin: 15px 15px 8px 15px; font-weight: 900; color: var(--text-secondary); text-transform: uppercase; font-size: 0.9rem;">${country.name}</div><div style="padding: 0 15px;">` + countryItems.join('') + `</div>`;
        }
    });
    if (count === 0) { html = `<div style="text-align:center; padding: 40px 20px; color: #94a3b8; font-weight: 800;">Geen stickers in deze lijst...</div>`; }
    document.getElementById('list-content').innerHTML = html;
}

async function updateStickerFromList(code, change) {
    let currentAmt = allStickers[currentUser][code] || 0; let newAmt = Math.max(0, currentAmt + change);
    allStickers[currentUser][code] = newAmt; if (newAmt === 0) delete allStickers[currentUser][code];
    let countEl = document.getElementById(`list-cnt-${code.replace(' ', '-')}`); if (countEl) countEl.innerText = `${newAmt}x`;
    if (navigator.vibrate) navigator.vibrate(40);
    if (currentAmt === 0 && change > 0 && typeof confetti === 'function') {
        let prefix = code === '00' ? 'FWC' : code.split(' ')[0]; let country = collections.find(c => c.prefix === prefix);
        if(country) confetti({ particleCount: 100, spread: 60, origin: { y: 0.8 }, colors: country.colors });
    }
    await syncToSupabase(code, newAmt);
}


// --- LIVE OCR SCANNER LOGICA --- //
let isScanning = false; let scannerInterval; let scannerWorker; let lastScannedCode = "";
async function toggleScanner() {
    const container = document.getElementById('scanner-container');
    if (isScanning) {
        isScanning = false; clearInterval(scannerInterval);
        const video = document.getElementById('scanner-video');
        if (video.srcObject) { video.srcObject.getTracks().forEach(track => track.stop()); }
        container.style.display = 'none';
    } else {
        const video = document.getElementById('scanner-video'); const status = document.getElementById('scanner-status');
        container.style.display = 'block'; isScanning = true;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', focusMode: 'continuous' } });
            video.srcObject = stream; status.innerText = "Scanner initialiseren... ⏳";
            if (!scannerWorker) {
                scannerWorker = await Tesseract.createWorker(); await scannerWorker.loadLanguage('eng'); await scannerWorker.initialize('eng');
                await scannerWorker.setParameters({ tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ' });
            }
            status.innerText = "Live: Houd sticker in vak 📷";
            const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
            scannerInterval = setInterval(async () => {
                if (!isScanning) return;
                const vw = video.videoWidth; const vh = video.videoHeight;
                const cropW = vw * 0.5; const cropH = vh * 0.3; const cropX = (vw - cropW) / 2; const cropY = (vh - cropH) / 2;
                canvas.width = cropW; canvas.height = cropH;
                ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
                const { data: { text } } = await scannerWorker.recognize(canvas);
                let cleanText = text.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
                const match = cleanText.match(/([A-Z]{3})\s*(\d{1,2})/);
                if (match) {
                    let prefix = match[1]; let num = parseInt(match[2], 10);
                    let code = prefix === 'FWC' && num === 0 ? '00' : `${prefix} ${num}`;
                    if (code !== lastScannedCode) {
                        let country = collections.find(c => c.prefix === prefix);
                        if (country) {
                            let maxNum = prefix === 'FWC' ? 19 : 20; 
                            if (code === '00' || (num >= 1 && num <= maxNum)) {
                                status.innerText = `Gevonden: ${code} ✅`; lastScannedCode = code;
                                document.getElementById('quick-add-input').value = code; processQuickAdd(); 
                                setTimeout(() => { if(isScanning) status.innerText = "Live: Volgende sticker 📷"; lastScannedCode = ""; }, 3500);
                            }
                        }
                    }
                }
            }, 1000);
        } catch (err) { console.error(err); showToast("❌ Camera toegang geweigerd of fout", "error"); toggleScanner(); }
    }
}

// --- WESLEY'S EASTER EGG: MASS DONATION --- //
async function executeWesleyDonation() {
    let updates = [];
    let totalDonated = 0;
    let louNoeDbName = dbNames['Lou & Noé'];
    let wesleyDbName = dbNames['Wesley'];

    for (let code in allStickers['Wesley']) {
        let amount = allStickers['Wesley'][code];
        if (amount > 1) {
            let donatedAmt = amount - 1;
            totalDonated += donatedAmt;
            allStickers['Wesley'][code] = 1;
            allStickers['Lou & Noé'][code] = (allStickers['Lou & Noé'][code] || 0) + donatedAmt;
            
            updates.push(supabaseClient.from('user_stickers').upsert({ user_name: wesleyDbName, sticker_code: code, amount: 1 }));
            updates.push(supabaseClient.from('user_stickers').upsert({ user_name: louNoeDbName, sticker_code: code, amount: allStickers['Lou & Noé'][code] }));
        }
    }

    if (totalDonated > 0) {
        document.getElementById('wesley-donation-container').style.display = 'none';
        showToast("⏳ Transactie bezig...", "success");
        await Promise.all(updates);
        if (typeof confetti === 'function') { confetti({ particleCount: 400, spread: 120, origin: { y: 0.5 }, colors: ['#4b0082', '#ffffff', '#ffd700'] }); }
        showToast(`💜 COME ON YOU MAUVES! Wesley doneert ${totalDonated} stickers!`, "success", ['#4b0082', '#ffffff']);
        renderDashboard();
    } else {
        showToast("❌ Wesley heeft helaas geen dubbele meer over!", "error");
    }
}

// --- RUIL & STATS LOGICA --- //
async function executeInstantTrade(code, targetUser) {
    let myNewAmt = Math.max((allStickers[currentUser][code] || 0) - 1, 0); 
    let theirNewAmt = (allStickers[targetUser][code] || 0) + 1;
    allStickers[currentUser][code] = myNewAmt; if(myNewAmt === 0) delete allStickers[currentUser][code]; 
    allStickers[targetUser][code] = theirNewAmt;
    if(navigator.vibrate) navigator.vibrate([50, 30, 50]);
    await Promise.all([ supabaseClient.from('user_stickers').upsert({ user_name: dbNames[currentUser], sticker_code: code, amount: myNewAmt }), supabaseClient.from('user_stickers').upsert({ user_name: dbNames[targetUser], sticker_code: code, amount: theirNewAmt }) ]);
    if(myNewAmt === 0) { await supabaseClient.from('user_stickers').delete().match({ user_name: dbNames[currentUser], sticker_code: code }); }
    showToast(`🔄 Sticker overgedragen naar ${targetUser}!`, "success"); openTradeCenter(); renderDashboard();
}

function openTradeCenter() {
    let tradeHTML = '';
    otherUsers.forEach(ou => {
        let give = []; let get = [];
        collections.forEach(country => {
            for (let i = 1; i <= country.count; i++) {
                let code = country.prefix === 'FWC' && i === 1 ? '00' : country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
                let myAmt = allStickers[currentUser][code] || 0; let theirAmt = allStickers[ou][code] || 0;
                let pName = country.players ? country.players[i-1] : `Speler ${i}`;
                let numDisplay = country.prefix === 'FWC' && i === 1 ? "00" : `${i}`;
                let pageStr = country.page ? ` (P.${country.page})` : '';
                
                // SPECIALE REGEL: De Stapel doneert alles wat hij heeft! 
                let canGive = (ou === 'De Stapel') ? (myAmt > 1) : (myAmt > 1 && theirAmt === 0);
                let canGet = (ou === 'De Stapel') ? (theirAmt > 0 && myAmt === 0) : (theirAmt > 1 && myAmt === 0);

                if (canGive) give.push({code: code, flag: country.flagUrl, num: numDisplay, name: pName, page: pageStr});
                if (canGet) get.push({code: code, flag: country.flagUrl, num: numDisplay, name: pName, page: pageStr});
            }
        });
        tradeHTML += `
            <div class="trade-block" style="border-left: 4px solid ${userColors[ou]};">
                <h3 style="color: ${userColors[ou]};">Ruilen met ${ou}</h3>
                <div style="margin-bottom: 16px;"><strong style="font-size: 0.95rem;">Jij zoekt, ${ou} heeft beschikbaar (${get.length}):</strong>
                    <div class="trade-codes" style="margin-top: 8px;">${get.length === 0 ? '<span style="color:#94a3b8; font-size:0.8rem;">Niets wat jij mist...</span>' : get.map(item => `
                        <div class="trade-chip-wrapper">
                            <div class="trade-item-left"><div class="trade-mini-flag" style="background-image: url('${item.flag}');"></div><span class="trade-num-badge">${item.num}</span><span class="trade-player-name">${item.name} <span style="font-size:0.75rem; color:var(--text-secondary);">${item.page}</span></span></div>
                            <span class="trade-status-box get">Jij Mist</span>
                        </div>`).join('')}</div>
                </div>
                <div><strong style="font-size: 0.95rem;">${ou} zoekt, jij hebt dubbel (${give.length}):</strong>
                    <div class="trade-codes" style="margin-top: 8px;">${give.length === 0 ? '<span style="color:#94a3b8; font-size:0.8rem;">Geen dubbele voor ${ou}...</span>' : give.map(item => `
                        <div class="trade-chip-wrapper">
                            <div class="trade-item-left"><div class="trade-mini-flag" style="background-image: url('${item.flag}');"></div><span class="trade-num-badge">${item.num}</span><span class="trade-player-name">${item.name} <span style="font-size:0.75rem; color:var(--text-secondary);">${item.page}</span></span></div>
                            <button class="btn-instant-trade" onclick="executeInstantTrade('${item.code}', '${ou}')">⚡ Ruil</button>
                        </div>`).join('')}</div>
                </div>
            </div>`;
    });
    document.getElementById('trade-content').innerHTML = tradeHTML; document.getElementById('trade-modal').style.display = 'block';
}
function closeTradeCenter() { document.getElementById('trade-modal').style.display = 'none'; }

function openStatsCenter() {
    // Alleen de échte spelers tonen in de statistieken! (De Stapel doet niet mee voor de Trophy's)
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
        poulesHTML += `
            <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px dashed #f1f5f9;">
                <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">${gName} <span style="font-size:0.75rem; color:var(--text-secondary);">(${pData.totalStickers} tot.)</span></div>
                <div class="poule-row"><span style="color: ${userColors[leader]}; font-size:0.85rem;">🥇 ${leader}</span><div class="poule-mini-bar"><div style="height:100%; background:${userColors[leader]}; width:${(leaderScore/pData.totalStickers)*100}%;"></div></div><span>${leaderScore} st. (${leaderPerc}%)</span></div>
            </div>`;
    });
    statsHTML += `<div class="stat-block"><h3>📊 Poule Ranglijst</h3>${poulesHTML}</div>`;
    document.getElementById('stats-content').innerHTML = statsHTML; document.getElementById('stats-modal').style.display = 'block';
}
function closeStatsCenter() { document.getElementById('stats-modal').style.display = 'none'; }

// --- ALFABETISCHE PRINT LOGICA --- //
function printList() {
    let html = `<div class="print-header"><h2>WK 2026 Ruillijst - ${currentUser}</h2><p>Gegenereerd op ${new Date().toLocaleDateString('nl-BE')}</p></div><div class="print-grid">`;
    let sortedCollections = [...collections].sort((a, b) => a.name.localeCompare(b.name));
    sortedCollections.forEach(country => {
        let missing = []; let doubles = [];
        for (let i = 1; i <= country.count; i++) {
            let code = country.prefix === 'FWC' && i === 1 ? '00' : country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
            let numDisplay = country.prefix === 'FWC' && i === 1 ? '00' : `${i}`; 
            let amt = allStickers[currentUser][code] || 0;
            if (amt === 0) { 
                missing.push(numDisplay); 
            } else if (amt > 1) { 
                for(let d = 0; d < (amt - 1); d++) { doubles.push(numDisplay); }
            }
        }
        if (missing.length > 0 || doubles.length > 0) {
            html += `<div class="print-country-block"><div class="print-country-title"><img src="${country.flagUrl}" class="print-flag" alt="${country.prefix}"> <strong>${country.name}</strong> <span style="font-size: 0.85rem; color: #64748b;">(${country.prefix})</span></div><div class="print-lists"><div class="print-missing"><strong>Zoekt:</strong> ${missing.length > 0 ? missing.join(', ') : 'Compleet! 🎉'}</div>${doubles.length > 0 ? `<div class="print-doubles"><strong>Dubbel:</strong> ${doubles.join(', ')}</div>` : ''}</div></div>`;
        }
    });
    html += `</div>`; document.getElementById('print-area').innerHTML = html; window.print();
}
