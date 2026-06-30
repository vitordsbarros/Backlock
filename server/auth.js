const fs = require('fs');
const path = require('path');
const argon2 = require('argon2');

const VAULT_PATH = path.join(__dirname, '../data/access.vault');

async function authenticateUser(username, password) {
    try {
        if (!fs.existsSync(VAULT_PATH)) {
            console.error("Cofre não encontrado!");
            return false;
        }

        const vaultData = fs.readFileSync(VAULT_PATH, 'utf-8');
        const users = JSON.parse(vaultData);

        if (!users[username]) return false;

        return await argon2.verify(users[username], password);
    } catch (error) {
        console.error("Erro na autenticação:", error.message);
        return false;
    }
}

module.exports = { authenticateUser };