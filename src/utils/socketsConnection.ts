import { io } from 'socket.io-client';

// * Conexão com os WebSockets
const hostName = window.location.hostname;
const server = hostName.includes('localhost') ? 'http://localhost:2923' : 'https://api.emprego-vagas.com.br';

const socket = io(server, {
    withCredentials: true,
    transports: ['websocket']
});

// ! Ainda em desenvolvimento, pode ignorar por enquanto
socket.on('yourSocketKey', (opa)=>{
    console.log(opa)
})

export default socket;