// admin/certManager.js
const selfsigned = require('selfsigned');
const fs = require('fs');
const path = require('path');

const CERTS_DIR = path.join(__dirname, '../data/certs');
const KEY_PATH = path.join(CERTS_DIR, 'server.key');
const CRT_PATH = path.join(CERTS_DIR, 'server.crt');

async function ensureCertificates() {
    // Se os certificados já existem, não faz nada
    if (fs.existsSync(KEY_PATH) && fs.existsSync(CRT_PATH)) {
        return;
    }

    console.log("⏳ Certificados não encontrados. Gerando novos certificados locais (isso pode levar alguns segundos)...");

    if (!fs.existsSync(CERTS_DIR)) {
        fs.mkdirSync(CERTS_DIR, { recursive: true });
    }

    const attrs = [{ name: 'commonName', value: 'Backlock_Local' }];
    const options = { days: 365, keySize: 2048 };
    
    // A CORREÇÃO: O await é obrigatório nas versões 2.x do selfsigned
    const pems = await selfsigned.generate(attrs, options);

    fs.writeFileSync(CRT_PATH, pems.cert);
    fs.writeFileSync(KEY_PATH, pems.private);

    console.log("✅ Certificados SSL/TLS gerados com sucesso!");
}

module.exports = { ensureCertificates };