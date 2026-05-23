// app.js - Ultimate Edition (Infinite Doubles, Filter, Trade Center, Soccer Bar)

const supabaseUrl = 'https://badovrzzxwbkxjgqkxjg.supabase.co'; 
const supabaseKey = 'sb_publishable_qI0tAKHoKqgC1hn_oP6XzA_n3F61CbT'; 
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

let currentUser = '';
let otherUser = '';
let myStickers = {};
let otherUserStickers = {}; 
let showOnlyMissing = false; // Filter modus

async function selectUser(name) {
    currentUser = name;
    otherUser = currentUser === 'Jorden' ? 'Wesley' : 'Jorden';
    document.getElementById('profile-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
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

// ==========================================
// RENDER DASHBOARD (MET POULE PROGRESSIE & FILTER)
// ==========================================
function renderDashboard() {
    const container = document.getElementById('countries-container');
    container.innerHTML = '';
    
    let totalJorden = 0;
    let totalWesley = 0;
    
    // Stap 1: Bereken vooraf de Poule totalen voor de Goud-check
    let groupStats = {};
    collections.forEach(c => {
        if(!groupStats[c.group]) groupStats[c.group] = { total: 0, myCount: 0 };
        groupStats[c.group].total += c.count;
        for (let i = 1; i <= c.count; i++) {
            let code = c.prefix === 'FWC' && i === 1 ? '00' : c.prefix === 'FWC' ? `FWC ${i-1}` : `${c.prefix} ${i}`;
            if (myStickers[code]) groupStats[c.group].myCount++;
        }
    });

    let currentGroup = ''; 
    let cardIndex = 0;

    collections.forEach(country => {
        let countMy = 0;
        let countOther = 0;
        
        for (let i = 1; i <= country.count; i++) {
            let code = country.prefix === 'FWC' && i === 1 ? '00' : country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
            if (myStickers[code]) countMy++;
            if (otherUserStickers[code]) countOther++;
        }

        let jordenScore = currentUser === 'Jorden' ? countMy : countOther;
        let wesleyScore = currentUser === 'Wesley' ? countMy : countOther;
        
        totalJorden += jordenScore;
        totalWesley += wesleyScore;

        const isCompleteMy = countMy === country.count;
        
        // Filter Check: verberg land als het vol is én de filter aanstaat
        if (showOnlyMissing && isCompleteMy) return;

        // Teken de Poule Header
        if (country.group !== currentGroup) {
            currentGroup = country.group;
            let gStat = groupStats[currentGroup];
            let isGoldClass = gStat.myCount === gStat.total ? 'gold' : '';
            
            container.innerHTML += `
                <div class="group-header ${isGoldClass}">
                    <h3>${currentGroup}</h3>
                    <span class="group-score">${gStat.myCount}/${gStat.total}</span>
                </div>
            `;
        }

        const primaryColor = country.colors ? country.colors[0] : '#4f46e5';
        const delay = cardIndex * 0.015;
        cardIndex++;

        const borderGlow = isCompleteMy ? `border-color: #10b981; box-shadow: 0 0 12px #10b98180;` : `border-color: ${primaryColor}50;`;

        container.innerHTML += `
            <div class="country-card" style="animation-delay: ${delay}s;" onclick="openModal('${country.prefix}')">
                <div class="flag-circle" style="background-image: url('${country.flagUrl}'); ${borderGlow}"></div>
                <span class="country-prefix">${country.prefix}</span>
                <div class="grid-score-row">
                    <div class="grid-badge" style="background: var(--color-jorden);">${jordenScore}</div>
                    <div class="grid-badge" style="background: var(--color-wesley);">${wesleyScore}</div>
                </div>
            </div>
        `;
    });

    // Update Scores & Voetbalbalk
    document.getElementById('legend-count-jorden').innerText = totalJorden;
    document.getElementById('legend-count-wesley').innerText = totalWesley;

    let activeTotal = currentUser === 'Jorden' ? totalJorden : totalWesley;
    let totalPercent = (activeTotal / 980) * 100;
    
    document.getElementById('total-text').innerText = `${activeTotal}/980`;
    
    // Laat de bal over het scherm rollen (max 90% zodat hij netjes in de goal rolt)
    let ballPos = Math.min(totalPercent, 90);
    document.getElementById('soccer-ball').style.left = `calc(${ballPos}% - 10px)`;
}

// ==========================================
// MODAL & STICKER LOGICA (ONEINDIG & VERWIJDEREN)
// ==========================================
function openModal(prefix) {
    const countryData = collections.find(c => c.prefix === prefix);
    if (!countryData) return;

    const primaryColor = countryData.colors ? countryData.colors[0] : '#4f46e5';
    const accentColor = countryData.colors && countryData.colors[1] ? countryData.colors[1] : '#ff005b';
    
    const modal = document.getElementById('modal');
    modal.style.background = `linear-gradient(135deg, ${primaryColor}, ${accentColor})`;
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
            `<span class="box-num" style="font-size: 1.8rem;">00</span>` : 
            `<span class="box-prefix">${prefix}</span><span class="box-num">${i}</span>`;

        // Let op de onclicks: Kaart = toevoegen. Badge = verwijderen (met event.stopPropagation)
        grid.innerHTML += `
            <div class="sticker-box ${statusClass}" onclick="addSticker('${code}')" id="box-${code}">
                ${displayLabel}
                <span class="badge" id="badge-${code}" onclick="removeSticker(event, '${code}')" style="${amount === 0 ? 'display: none;' : ''}">${amount}x</span>
            </div>
        `;
    }
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    renderDashboard(); 
}

// Toevoegen (Oneindig)
async function addSticker(code) {
    let newAmount = (myStickers[code] || 0) + 1;
    myStickers[code] = newAmount;
    updateStickerUI(code, newAmount);
    
    // Voelbare tik op GSM (als ondersteund)
    if(navigator.vibrate) navigator.vibrate(50); 
    await syncToSupabase(code, newAmount);
}

// Verwijderen (Via de badge)
async function removeSticker(event, code) {
    event.stopPropagation(); // Zorgt dat de addSticker klik niet wordt geactiveerd!
    let newAmount = (myStickers[code] || 0) - 1;
    if (newAmount < 0) newAmount = 0;
    
    if (newAmount === 0) delete myStickers[code];
    else myStickers[code] = newAmount;
    
    updateStickerUI(code, newAmount);
    if(navigator.vibrate) navigator.vibrate([30, 50, 30]); 
    await syncToSupabase(code, newAmount);
}

async function syncToSupabase(code, amount) {
    try {
        if (amount === 0) {
            await supabaseClient.from('user_stickers').delete().match({ user_name: currentUser, sticker_code: code });
        } else {
            await supabaseClient.from('user_stickers').upsert({ user_name: currentUser, sticker_code: code, amount: amount });
        }
    } catch (err) {
        console.error("Cloud Error:", err.message);
    }
}

function updateStickerUI(code, amount) {
    const box = document.getElementById(`box-${code}`);
    const badge = document.getElementById(`badge-${code}`);
    
    box.className = 'sticker-box';
    if (amount === 1) { 
        box.classList.add('owned'); 
        badge.innerText = `1x`; badge.style.display = 'flex'; 
    }
    else if (amount > 1) { 
        box.classList.add('double'); 
        badge.innerText = `${amount}x`; badge.style.display = 'flex'; 
    }
    else { 
        badge.style.display = 'none'; 
    }
}

// ==========================================
// RUILCENTRUM LOGICA
// ==========================================
function openTradeCenter() {
    let giveToOther = [];
    let getFromOther = [];

    collections.forEach(country => {
        for (let i = 1; i <= country.count; i++) {
            let code = country.prefix === 'FWC' && i === 1 ? '00' : country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
            let myAmt = myStickers[code] || 0;
            let otherAmt = otherUserStickers[code] || 0;

            if (myAmt > 1 && otherAmt === 0) giveToOther.push(code);
            if (otherAmt > 1 && myAmt === 0) getFromOther.push(code);
        }
    });

    let html = '';
    
    html += `<div class="trade-block">
                <h3>Geef aan ${otherUser} (${giveToOther.length})</h3>
                <div class="trade-codes">
                    ${giveToOther.length === 0 ? '<p style="color: #94a3b8; font-size: 0.9rem;">Geen dubbele die hij/zij nodig heeft.</p>' : ''}
                    ${giveToOther.map(c => `<span class="trade-chip give">${c}</span>`).join('')}
                </div>
             </div>`;
             
    html += `<div class="trade-block">
                <h3 style="color: var(--color-wesley);">Krijg van ${otherUser} (${getFromOther.length})</h3>
                <div class="trade-codes">
                    ${getFromOther.length === 0 ? '<p style="color: #94a3b8; font-size: 0.9rem;">Hij/zij heeft geen dubbele voor jou.</p>' : ''}
                    ${getFromOther.map(c => `<span class="trade-chip get">${c}</span>`).join('')}
                </div>
             </div>`;

    document.getElementById('trade-content').innerHTML = html;
    document.getElementById('trade-modal').style.display = 'block';
}

function closeTradeCenter() {
    document.getElementById('trade-modal').style.display = 'none';
}
