// client/chat.js
const readline = require('readline');

function setupChat(socket, username, rl, chalk) {
    console.log(chalk.gray('Você está no chat. Digite sua mensagem. Comandos disponíveis: /clear, /exit'));
    
    // Configura o prefixo de quem está digitando
    rl.setPrompt(chalk.whiteBright(`${username} > `));
    rl.prompt();

    rl.on('line', (line) => {
        const input = line.trim();
        
        // Se deu enter vazio, só recarrega a linha
        if (!input) {
            rl.prompt();
            return;
        }

        // Sistema de comandos locais
        if (input.startsWith('/')) {
            if (input === '/exit') {
                socket.end();
            } else if (input === '/clear') {
                console.clear();
                console.log(chalk.gray('Histórico limpo.'));
            } else if (input === '/shutdown') {
                // Manda comando de morte para o servidor
                socket.write(JSON.stringify({ type: 'COMMAND', command: '/shutdown' }) + '\n');
            } else {
                console.log(chalk.red('Comando desconhecido.'));
            }
        } else {
            // Envia a mensagem pro servidor
            socket.write(JSON.stringify({ type: 'MESSAGE', content: input }) + '\n');
            
            // Um truque de interface: apaga a linha que você acabou de digitar 
            // no formato padrão e reescreve bonitinho
            readline.moveCursor(process.stdout, 0, -1);
            readline.clearLine(process.stdout, 0);
            console.log(chalk.greenBright(`[Você]: `) + chalk.white(input));
        }
        
        rl.prompt();
    });
}

module.exports = { setupChat };