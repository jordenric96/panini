// --- LIVE OCR SCANNER LOGICA (Versie 19) --- //
let isScanning = false;
let scannerInterval;
let scannerWorker;
let lastScannedCode = "";

async function toggleScanner() {
    const container = document.getElementById('scanner-container');
    if (isScanning) {
        // Stop Scanner
        isScanning = false;
        clearInterval(scannerInterval);
        const video = document.getElementById('scanner-video');
        if (video.srcObject) { video.srcObject.getTracks().forEach(track => track.stop()); }
        container.style.display = 'none';
    } else {
        // Start Scanner
        const video = document.getElementById('scanner-video');
        const status = document.getElementById('scanner-status');
        container.style.display = 'block';
        isScanning = true;

        try {
            // Vraag camera permissie (gebruik de achterste camera)
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            video.srcObject = stream;
            status.innerText = "Scanner initialiseren... ⏳";

            // Laad Tesseract OCR in op de achtergrond
            if (!scannerWorker) {
                scannerWorker = await Tesseract.createWorker();
                await scannerWorker.loadLanguage('eng');
                await scannerWorker.initialize('eng');
                // Forceer OCR om enkel hoofdletters en cijfers te zoeken (verhoogt precisie en snelheid)
                await scannerWorker.setParameters({
                    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ',
                });
            }

            status.innerText = "Live: Houd sticker in vak 📷";
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Scan elke 1.5 seconden een frame van de video
            scannerInterval = setInterval(async () => {
                if (!isScanning) return;
                
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // OCR Herkenning
                const { data: { text } } = await scannerWorker.recognize(canvas);
                
                // Zoek met Regex naar patronen zoals "BEL 4", "MEX 12", "FWC 00"
                const match = text.match(/([A-Z]{3})\s*(\d{1,2})/);
                if (match) {
                    let prefix = match[1];
                    let num = parseInt(match[2], 10);
                    let code = prefix === 'FWC' && num === 0 ? '00' : `${prefix} ${num}`;
                    
                    // Dubbel-scan preventie en validatie
                    if (code !== lastScannedCode) {
                        let country = collections.find(c => c.prefix === prefix);
                        if (country) {
                            let maxNum = prefix === 'FWC' ? 19 : 20; 
                            if (code === '00' || (num >= 1 && num <= maxNum)) {
                                
                                // Succes!
                                status.innerText = `Gevonden: ${code} ✅`;
                                lastScannedCode = code;
                                
                                // Vul de balk in en druk automatisch op de knop!
                                document.getElementById('quick-add-input').value = code;
                                processQuickAdd(); 
                                
                                // Cooldown van 3.5 seconden voor je een volgende sticker kunt scannen
                                setTimeout(() => { 
                                    if(isScanning) status.innerText = "Live: Volgende sticker 📷"; 
                                    lastScannedCode = ""; 
                                }, 3500);
                            }
                        }
                    }
                }
            }, 1500);

        } catch (err) {
            console.error(err);
            showToast("❌ Camera toegang geweigerd of fout", "error");
            toggleScanner(); // Zet weer uit
        }
    }
}
