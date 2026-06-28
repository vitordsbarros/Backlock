const net = require("net");
const { buffer } = require("stream/consumers");

const HOST = "0.0.0.0";
const PORT = 3000;

let server;

function start() {
    server = createServer();
    registerEvents(server);
    listen(server);
}

function createServer() {
    return net.createServer();
}

function registerEvents(server) {
    server.on("connection", onConnection);
    server.on("error", onError);
    server.on("listening", onListening);
}

function listen(server) {
    server.listen(PORT, HOST);
}

function onListening() {
    console.clear();

    console.log("Servidor iniciado.")
    console.log(`Host: ${HOST}`);
    console.log(`Porta: ${PORT}`);
    console.log();
}

function onConnection(socket) {
    console.log("Novo cliente conectado!");
    console.log(socket.remoteAddress);
    console.log();

    socket.on("data", (buffer) => {
        onMessage(socket, buffer);
    });

    socket.on("close", () => {
        console.log("Cliente desconectado.");
    });

    socket.on("error", (error) => {
        console.log("Erro do socket", error.code);
    })
}

function onMessage(socket, buffer) {
    const message = buffer.toString();

    console.log("Mensagem recebida");
    console.log(`Cliente: ${socket.remoteAddress}`);
    console.log(`Texto: ${message}`);
    console.log()
}

function onError(error) {
    console.log(error.message);
}

start();