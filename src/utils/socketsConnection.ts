import { io } from 'socket.io-client';

// * Conexão com os WebSockets
const hostName = window.location.hostname;
const server = hostName.includes('localhost') ? 'http://localhost:3002' : 'https://emprego-backend.onrender.com'; // ! Esse dominío é do Render, ficara nele temporariamente

const socket = io(server, {
    withCredentials: true,
    transports: ["websocket"]
});

export default socket;