const fs = require('fs');
const path = require('path');
const argon2 = require('argon2');
const readline = require('readline');

const VAULT_PATH = path.join(__dirname, '../data/access.vault');

// 1. Cria o readline normal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

// 2. O GRANDE TRUQUE: Interceptamos o motor de desenho do readline
rl._writeToOutput = function _writeToOutput(stringToWrite) {
    if (rl.stdoutMuted) {
        // Apaga a linha inteira, volta pro início, escreve o prompt e bota * do tamanho da senha em memória
        rl.output.write('\x1B[2K\x1B[200D🔑 Digite a senha: ' + '*'.repeat(rl.line.length));
    } else {
        rl.output.write(stringToWrite);
    }
};

function loadVault() {
    if (!fs.existsSync(VAULT_PATH)) return {};
    return JSON.parse(fs.readFileSync(VAULT_PATH, 'utf-8'));
}

function saveVault(vaultData) {
    const dir = path.dirname(VAULT_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(VAULT_PATH, JSON.stringify(vaultData, null, 2));
    console.log('\n✅ Acesso garantido! Cofre atualizado em data/access.vault\n');
}

console.log('=== ⬛ Backlock Admin Vault ===\n');

rl.question('👤 Digite o nome do novo usuário: ', (username) => {
    if (!username) {
        console.log('❌ O nome não pode ser vazio.');
        process.exit(1);
    }

    // 3. Ativamos a camuflagem antes da pergunta
    rl.stdoutMuted = true;
    
    rl.question('🔑 Digite a senha: ', async (password) => {
        rl.stdoutMuted = false; // Desativa a camuflagem
        console.log(); // Quebra de linha pro layout ficar bonito

        try {
            const vault = loadVault();
            vault[username] = await argon2.hash(password);
            saveVault(vault);
        } catch (error) {
            console.error('❌ Erro:', error.message);
        } finally {
            rl.close();
        }
    });
});