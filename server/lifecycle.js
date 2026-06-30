const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutos por padrão
let idleTimer = null;
let activeConnections = 0;

function startIdleTimer() {
    clearTimeout(idleTimer);

    const envTimeout = parseInt(process.env.IDLE_TIMEOUT, 10);
    
    // Trava de segurança: só aceita o valor do .env se for um número E for maior que 10.000 (10 segundos)
    const timeoutValue = (!isNaN(envTimeout) && envTimeout >= 10000) ? envTimeout : IDLE_TIMEOUT_MS;

    idleTimer = setTimeout(() => {
        console.log("Tempo limite atingido. Servidor vazio. Desligando...");
        process.exit(0);
    }, timeoutValue);
}

function onClientConnect() {
    activeConnections++;
    clearTimeout(idleTimer);
}

function onClientDisconnect() {
    activeConnections--;
    if (activeConnections <= 0) {
        activeConnections = 0;
        console.log("Servidor vazio. Iniciando contagem para desligamento automático...");
        startIdleTimer();
    }
}

function forceShutdown(engine) {
    console.log("Encerramento forçado via comando.");
    engine.broadcast({ type: 'SERVER_MESSAGE', content: 'O servidor será desligado imediatamente.' });
    engine.disconnectAll();
    process.exit(0);
}

module.exports = { startIdleTimer, onClientConnect, onClientDisconnect, forceShutdown };