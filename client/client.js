const net = require("net");
const readline = require("readline");

const HOST = "127.0.0.1";
const PORT = 3000;

let client;
let rl;

function start() {
    client = createConnection();
    rl = createTerminal();
    registerEvents();
}

function createConnection() {
    return net.createConnection({
        host: HOST,
        port: PORT
    });
}

function createTerminal() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
}

function registerEvents() {
    client.on("connect", onConnect);
    client.on("data", onData);
    client.on("close", onClose);
    client.on("error", onError);
}

function onConnect() {
    console.log("Conectado ao servidor!");
    
    readMessage();
}

function readMessage(message) {
    rl.question(">> ", (message) => {
        sendMessage(message);

        readMessage();
    });
}


function sendMessage(message) {
    client.write(message);
}

function onData(buffer) {
    console.log(buffer.toString());
}

function onClose() {
    console.log("Servidor desconectado.")
}

function onError(error) {
    console.log(error.message);
}

start();