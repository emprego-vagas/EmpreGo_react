import { io } from 'socket.io-client';

// * Conexão com os WebSockets
const hostName = window.location.hostname;
const server = hostName.includes('localhost') ? 'http://localhost:3002' : 'https://api.emprego-vagas.com.br';

const socket = io(server, {
    withCredentials: true,
    transports: ["websocket"]
});

export default socket;