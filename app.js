// app.js - 100% Cloud Engine met Poule Headers

const supabaseUrl = 'https://badovrzzxwbkxjgqkxjg.supabase.co'; 
const supabaseKey = 'sb_publishable_qI0tAKHoKqgC1hn_oP6XzA_n3F61CbT'; 
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

let currentUser = '';
let otherUser = '';
let myStickers = {};
let otherUserStickers = {}; 

async function selectUser(name) {
    currentUser = name;
    otherUser = currentUser === 'Jorden' ? 'Wesley' : 'Jorden';
    document.getElementById('profile-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
    document.getElementById('welcome-text').innerText = `Album van ${name}`;
    await loadUserData();
}

function logout() {
    currentUser = ''; otherUser = '';
    document.getElementById('profile-section').style.display = 'flex';
    document.getElementById('dashboard-section').style.display = 'none';
}

async function loadUserData() {
    myStickers = {}; otherUserStickers = {};

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

// ==========================================
// 4. DE GRID OPBOUW (NU MET POULES)
// ==========================================
function renderDashboard() {
    const container = document.getElementById('countries-container');
    container.innerHTML = '';
    
    let totalJorden = 0;
    let totalWesley = 0;
    
    let currentGroup = ''; // Houdt bij in welke poule we momenteel zitten

    collections.forEach((country, index) => {
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

        const primaryColor = country.colors ? country.colors[0] : '#4f46e5';
        const delay = index * 0.015;

        // Als we bij een nieuw land zijn met een andere Poule, tekenen we de Header!
        if (country.group !== currentGroup) {
            currentGroup = country.group;
            container.innerHTML += `
                <div class="group-header">
                    <h3>${currentGroup}</h3>
                </div>
            `;
        }

        const isCompleteMy = countMy === country.count;
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

    document.getElementById('legend-count-jorden').innerText = totalJorden;
    document.getElementById('legend-count-wesley').innerText = totalWesley;

    let activeTotal = currentUser === 'Jorden' ? totalJorden : totalWesley;
    let totalPercent = Math.round((activeTotal / 980) * 100);
    document.getElementById('total-progress').style.width = `${totalPercent}%`;
}

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

async function toggleSticker(code) {
    let currentAmount = myStickers[code] || 0;
    let newAmount = currentAmount + 1;
    if (newAmount > 2) newAmount = 0; 

    if (newAmount === 0) delete myStickers[code];
    else myStickers[code] = newAmount;
    updateStickerUI(code, newAmount);

    try {
        if (newAmount === 0) {
            await supabaseClient.from('user_stickers').delete().match({ user_name: currentUser, sticker_code: code });
        } else {
            await supabaseClient.from('user_stickers').upsert({ user_name: currentUser, sticker_code: code, amount: newAmount });
        }
    } catch (err) {
        console.error("Fout bij opslaan in de cloud:", err.message);
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
