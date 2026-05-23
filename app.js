// app.js - Applicatielogica met Live Database & Lokale Fallback
const supabaseUrl = 'https://badovrzzxwbkxjgqkxjg.supabase.co';
const supabaseKey = 'sb_publishable_qI0tAKHoKqgC1hn_oP6XzA_n3F61CbT'; 
// We noemen het 'supabaseClient' om conflicten met de browser te vermijden!
let supabaseClient = null;
let isOfflineFallback = false;
let currentUser = '';
let myStickers = {}; 

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
    document.getElementById('profile-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
    document.getElementById('welcome-text').innerText = `Collectie van ${name}`;
    await loadUserData();
}

function logout() {
    currentUser = '';
    document.getElementById('profile-section').style.display = 'flex';
    document.getElementById('dashboard-section').style.display = 'none';
}

// 2. Data ophalen 
async function loadUserData() {
    myStickers = {};
    
    if (isOfflineFallback) {
        const localData = localStorage.getItem(`panini_${currentUser}`);
        if (localData) myStickers = JSON.parse(localData);
        renderDashboard();
    } else {
        const { data, error } = await supabaseClient
            .from('user_stickers')
            .select('*')
            .eq('user_name', currentUser);

        if (data) {
            data.forEach(row => { myStickers[row.sticker_code] = row.amount; });
        }
        renderDashboard();
    }
}

// 3. Hoofdscherm opbouwen
function renderDashboard() {
    const container = document.getElementById('countries-container');
    container.innerHTML = '';
    let totalOwned = 0;

    collections.forEach(country => {
        let countryOwned = 0;
        
        for (let i = 1; i <= country.count; i++) {
            let code = country.prefix === 'FWC' && i === 1 ? '00' : 
                       country.prefix === 'FWC' ? `FWC ${i-1}` : `${country.prefix} ${i}`;
            
            if (myStickers[code] && myStickers[code] >= 1) {
                countryOwned++;
                totalOwned++;
            }
        }

        let percent = Math.round((countryOwned / country.count) * 100);

        container.innerHTML += `
            <div class="country-row" onclick="openModal('${country.prefix}', '${country.name}', ${country.count})">
                <div class="country-info">
                    <div class="flag-circle" style="background-image: url('${country.flagUrl}');"></div>
                    <span class="country-name">${country.name}</span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar"><div class="progress-fill" style="width: ${percent}%;"></div></div>
                    <span class="percentage-text">${countryOwned}/${country.count} (${percent}%)</span>
                </div>
            </div>
        `;
    });

    let totalPercent = Math.round((totalOwned / 980) * 100);
    document.getElementById('total-progress').style.width = `${totalPercent}%`;
    document.getElementById('total-text').innerText = `${totalOwned} / 980 unieke stickers verzameld (${totalPercent}%)`;
}

// 4. Grid pop-up openen
function openModal(prefix, name, count) {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('modal-title').innerText = name;
    
    const grid = document.getElementById('sticker-grid');
    grid.innerHTML = '';

    for (let i = 1; i <= count; i++) {
        let code = prefix === 'FWC' && i === 1 ? '00' : 
                   prefix === 'FWC' ? `FWC ${i-1}` : `${prefix} ${i}`;
        
        let amount = myStickers[code] || 0;
        let statusClass = amount > 1 ? 'double' : amount === 1 ? 'owned' : '';
        let displayNum = code.includes(' ') ? code.split(' ')[1] : code;

        grid.innerHTML += `
            <div class="sticker-box ${statusClass}" onclick="toggleSticker('${code}')" id="box-${code}">
                ${displayNum}
                <span class="badge" id="badge-${code}">${amount > 1 ? `+${amount-1}` : ''}</span>
            </div>
        `;
    }
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    renderDashboard();
}

// 5. Sticker mutatie opslaan
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
        badge.innerText = '';
    } else if (amount > 1) {
        box.classList.add('double');
        badge.innerText = `+${amount-1}`;
    } else {
        badge.innerText = '';
    }
}
