// 1. Koppel met Supabase
const supabaseUrl = 'https://JOUW_PROJECT_ID.supabase.co'; // <-- Vul je eigen URL in!
const supabaseKey = 'sb_publishable_qI0tAKHoKqgC1hn_oP6XzA_n3F61...'; // <-- Vul je volledige key in!
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 2. Elementen ophalen
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const authMessage = document.getElementById('auth-message');

// 3. Registreren
async function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        authMessage.innerText = "Fout bij registreren: " + error.message;
    } else {
        authMessage.innerText = "Check je mailbox om je account te bevestigen!";
    }
}

// 4. Inloggen
async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        authMessage.innerText = "Fout bij inloggen: " + error.message;
    } else {
        checkSession(); // Ga naar dashboard
    }
}

// 5. Uitloggen
async function logout() {
    await supabase.auth.signOut();
    checkSession(); // Ga terug naar inlogscherm
}

// 6. Check of gebruiker al is ingelogd
async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        authSection.style.display = 'none';
        dashboardSection.style.display = 'block';
    } else {
        authSection.style.display = 'block';
        dashboardSection.style.display = 'none';
    }
}

// Start de check direct bij het inladen van de pagina
checkSession();
