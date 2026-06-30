// server/server.js
const tls = require('tls');
const fs = require('fs');
const path = require('path');
const engine = require('./engine');
const lifecycle = require('./lifecycle');
const { ensureCertificates } = require('../admin/certManager');

const PORT = process.env.PORT || 8080;

async function bootstrap() {
    try {
        if (!fs.existsSync(path.join(__dirname, '../data/access.vault'))) {
            console.warn("\n Aviso: access.vault não encontrado. Execute o vaultManager primeiro.");
        }
        // Aguarda a verificação/geração dos certificados
        await ensureCertificates();

        // Agora é seguro ler os arquivos
        const options = {
            key: fs.readFileSync(path.join(__dirname, '../data/certs/server.key')),
            cert: fs.readFileSync(path.join(__dirname, '../data/certs/server.crt')),
        };

        // Inicia o servidor
        const server = tls.createServer(options, (socket) => {
            engine.handleConnection(socket);
        });

        server.listen(PORT, () => {
            console.log(`\n Backlock Server iniciado (TLS) na porta ${PORT}`);
            lifecycle.startIdleTimer();
        });

        server.on('error', (err) => {
            console.error("Erro fatal no servidor:", err);
        });

    } catch (error) {
        console.error("❌ Falha ao iniciar o servidor:", error.message);
        process.exit(1);
    }
}

// Executa a inicialização
bootstrap();