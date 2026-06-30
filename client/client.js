const readline = require('readline');
const network = require('./network');

async function startClient() {
    const { default: chalk } = await import('chalk');
    const { default: boxen } = await import('boxen');
    const figlet = require('figlet');

    console.clear();
    console.log(
        chalk.whiteBright(
            figlet.textSync('Backlock', { font: 'alligator2', horizontalLayout: 'full' })
        )
    );
    console.log(boxen(chalk.gray('STE - Secure Terminal Environment'), {
        padding: 1,
        borderStyle: 'classic',
        borderColor: 'white'
    }));

    // Cria o readline normal
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true
    });

    // Intercepta o desenho
    rl._writeToOutput = function _writeToOutput(stringToWrite) {
        if (rl.stdoutMuted) {
            rl.output.write('\x1B[2K\x1B[200D' + chalk.white('Senha: ') + '*'.repeat(rl.line.length));
        } else {
            rl.output.write(stringToWrite);
        }
    };

    console.log(chalk.yellow('--- Configuração de Conexão ---'));

    rl.question(chalk.white('Host [localhost]: '), (host) => {
        host = host || 'localhost';
        rl.question(chalk.white('Porta [8080]: '), (port) => {
            port = port || '8080';
            rl.question(chalk.white('Usuário: '), (username) => {

                // Ativa a camuflagem
                rl.stdoutMuted = true;

                rl.question(chalk.white('Senha: '), (password) => {
                    rl.stdoutMuted = false; // Desativa
                    console.log();

                    network.connect({ host, port, username, password, rl, chalk });
                });
            });
        });
    });
}

startClient();