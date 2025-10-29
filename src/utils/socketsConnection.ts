import { io } from 'socket.io-client';

// * Conexão com os WebSockets
const hostName = window.location.hostname;
const server = hostName.includes('localhost') ? 'http://localhost:3001' : 'https://www.emprego-vagas.com.br';

var socket = io(server, {
    withCredentials: true,
    transports: ["websocket"]
});

export default socket;