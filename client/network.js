// client/network.js
const tls = require('tls');
const readline = require('readline');
const { setupChat } = require('./chat');

async function connect({ host, port, username, password, rl, chalk }) {
    const { default: ora } = await import('ora');
    const spinner = ora('Estabelecendo túnel criptografado...').start();

    // Configuração do TLS para o cliente
    const options = {
        rejectUnauthorized: false // Aceita nosso certificado self-signed local
    };

    const socket = tls.connect(port, host, options, () => {
        spinner.text = 'Autenticando credenciais...';

        // Envia o pacote de login para o servidor
        const loginPacket = { type: 'LOGIN', username, password };
        socket.write(JSON.stringify(loginPacket) + '\n');
    });

    socket.on('data', (data) => {
        // Separa mensagens caso venham grudadas (comum em streams TCP/TLS)
        const packets = data.toString().trim().split('\n');

        for (let rawPacket of packets) {
            if (!rawPacket) continue;

            try {
                const packet = JSON.parse(rawPacket);

                // Tratamento de Login
                if (packet.type === 'LOGIN_SUCCESS') {
                    spinner.succeed(chalk.green('Acesso concedido! Entrando na sala...\n'));
                    setupChat(socket, username, rl, chalk);
                }
                else if (packet.type === 'LOGIN_FAIL') {
                    spinner.fail(chalk.red('Acesso negado: ' + packet.message));
                    process.exit(1);
                }

                // Avisos do Servidor (ex: alguém entrou/saiu)
                else if (packet.type === 'SERVER_MESSAGE') {
                    readline.clearLine(process.stdout, 0); // Apaga a linha atual
                    readline.cursorTo(process.stdout, 0);  // Volta o cursor pro início
                    console.log(chalk.yellow(`[SERVIDOR] ${packet.content}`));
                    rl.prompt(); // Redesenha o prompt limpo
                }

                // Mensagens de outros usuários
                else if (packet.type === 'MESSAGE') {
                    readline.clearLine(process.stdout, 0);
                    readline.cursorTo(process.stdout, 0);
                    console.log(chalk.blue(`[${packet.sender}]: `) + chalk.white(packet.content));
                    rl.prompt();
                }
            } catch (e) {
                // Ignora JSONs quebrados para não derrubar o cliente
            }
        }
    });

    socket.on('end', () => {
        console.log(chalk.red('\n[-] A conexão com o servidor foi encerrada.'));
        process.exit(0);
    });

    socket.on('error', (err) => {
        spinner.fail(chalk.red(`Erro de conexão: ${err.message}`));
        process.exit(1);
    });
}

module.exports = { connect };