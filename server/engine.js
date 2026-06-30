const { authenticateUser } = require('./auth');
const lifecycle = require('./lifecycle');
const { v4: uuidv4 } = require('uuid');

const connectedClients = new Map();

function broadcast(packet, senderId = null) {
    const payload = JSON.stringify(packet) + '\n';
    
    for (const [id, client] of connectedClients.entries()) {
        if (id !== senderId) {
            client.socket.write(payload);
        }
    }
}

function disconnectAll() {
    for (const [id, client] of connectedClients.entries()) {
        client.socket.end();
    }
    connectedClients.clear();
}

async function handleConnection(socket) {
    const clientId = uuidv4();
    let isAuthenticated = false;
    let username = "Anônimo";

    lifecycle.onClientConnect();

    socket.on('data', async (data) => {
        try {
            const packet = JSON.parse(data.toString().trim());

            if (packet.type === 'LOGIN') {
                const normalizedUsername = packet.username.trim().toLowerCase();
                
                const isValid = await authenticateUser(normalizedUsername, packet.password);
                
                if (isValid) {
                    isAuthenticated = true;
                    username = normalizedUsername; // Define o nome normalizado
                    connectedClients.set(clientId, { socket, username });
                    
                    socket.write(JSON.stringify({ type: 'LOGIN_SUCCESS', message: 'Acesso concedido.' }) + '\n');
                    broadcast({ type: 'SERVER_MESSAGE', content: `${username} entrou na sala.` }, clientId);
                    console.log(`[+] ${username} conectou-se.`);
                } else {
                    socket.write(JSON.stringify({ type: 'LOGIN_FAIL', message: 'Credenciais inválidas.' }) + '\n');
                    socket.end();
                }
                return;
            }

            if (!isAuthenticated) return;

            if (packet.type === 'MESSAGE') {
                broadcast({ 
                    type: 'MESSAGE', 
                    sender: username, 
                    content: packet.content, 
                    timestamp: new Date().toISOString() 
                }, clientId);
            }

            if (packet.type === 'COMMAND' && packet.command === '/shutdown') {
                lifecycle.forceShutdown(module.exports);
            }

        } catch (err) {
            // Ignora JSONs malformados para não derrubar o servidor
        }
    });

    socket.on('close', () => {
        if (isAuthenticated) {
            connectedClients.delete(clientId);
            broadcast({ type: 'SERVER_MESSAGE', content: `${username} saiu da sala.` });
            console.log(`[-] ${username} saiu.`);
        }
        lifecycle.onClientDisconnect();
    });

    socket.on('error', () => {
        socket.destroy();
    });
}

module.exports = { handleConnection, broadcast, disconnectAll };