import { io } from 'socket.io-client';

// * Conexão com os WebSockets
const hostName = window.location.hostname;
const server = hostName.includes('localhost') ? 'http://localhost:2923' : 'https://api.emprego-vagas.com.br';

const socket = io(server, {
    withCredentials: true,
    transports: ['websocket']
});

// ! Ainda em desenvolvimento, pode ignorar por enquanto
// socket.on('you-are-connected', (res: {socketKey: string|null})=>{
//     if(res.socketKey){
//         localStorage.setItem('socketKey', res.socketKey);
//     } else{
//         localStorage.removeItem('socketKey');
//     }
// })

export const socketAuthEmit = (event: string, success: ()=>void, error: ()=>void, ...args)=>{
    // * Tenta emitir o evento
    socket.emit(event, ...args, (res)=>{
        // * Se deu erro vai ler a causa do erro
        if(res.status==='success') success();
        else {
            // * Verifica se é pra tentar reconectar
            if(res.message!=='try-reconnect') error();
            else {
                // * Listenner único para o evento emitido depois de se conectar
                socket.once('you-are-connected', (res2)=>{
                    // * Verifica se conseguiu criar a nova sessão
                    if(!res2.authenticated) error();
                    else {
                        // * Se conseguiu emite o evento de novo
                        socket.emit(event, ...args, (res3)=>{
                            // * Se deu erro de novo desiste
                            if(res3.status==='success') success();
                            else error();
                        })
                    }
                });
                // * Disconecta e conecta de novo pra pedir uma nova sessão e consequente o 'you-are-connected' vai ser emitido
                socket.disconnect();
                socket.connect();
            }
        }
    });
}

export default socket;