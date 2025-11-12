import axiosWe from "../utils/axiosInstance";
import socket from "../utils/socketsConnection";

export interface Mensagem {
    id: string;
    texto: string;
    remetente: 'usuario' | 'eles';
    hora: string;
}

export interface Conversa {
    id: string;
    bloqueadoStatus: boolean;
    bloqueador: string | null;
    remetente: string;
    statusRemetente: string;
    nome: string;
    ultimaMensagem: string;
    hora: string;
    naoLidas: number;
    avatar: string | null;
    favoritada: boolean;
    mensagens: Mensagem[];
    contadorMensagens: number;
}

export interface MessageSocket {
    author: string;
    message: string;
    room: string;
    type: string;
    idMsg: string;
}

export interface UserStatusSocket {
    status: string;
    socket: string;
    room: string;
};

interface CarregarConversasBackResponse {
    conversas: Conversa[];
    conversaAtual: string;
}
export async function carregarConversasBack(usuario: {tipo: string, nome: string, id: string}, idAtual: string): Promise<CarregarConversasBackResponse>{
    const usuarioTipo = usuario.tipo;
    const usuarioId = usuario.id;

    const response = usuarioTipo === 'candidato' ? await axiosWe('/chats/candidato'): await axiosWe('/chats/empresa');
    const data = response.data;

    const conversas = data.map(chat=>{
        if(!chat.bloqueado) socket.emit('joinRoom', chat.id);
        const ct = {
            id: chat.id,
            bloqueadoStatus: chat.bloqueado,
            bloqueador: chat.bloqueador_tipo,
            remetente: usuarioTipo === 'candidato' ? chat.empresas.id : String(chat.candidatos.id),
            statusRemetente: 'Offline',
            nome: usuarioTipo === 'candidato' ? chat.empresas.nome_fant : chat.candidatos.nome,
            ultimaMensagem: chat.mensagens.toReversed()[0]?.mensagem || '',
            hora: (() => {
                const msg = chat.mensagens.toReversed()[0]?.data_criacao
                if(!msg) return '';
                const horario = new Date(msg);
                const txtData = hojeOntem(horario);
                return `${txtData==='Hoje' ? `${String(horario.getHours()).padStart(2, "0")}:${String(horario.getMinutes()).padStart(2, "0")}` : `${txtData}`}`;
            })(),
            naoLidas: (()=>{
                const naoLidas = chat.mensagens.reduce((ac, msg)=>{
                    if(msg.de !== usuarioTipo && !msg.status){
                        ac++
                    }
                    return ac;
                }, 0);
                return naoLidas;
            })(),
            avatar: usuarioTipo === 'candidato' ? chat.empresas.foto : chat.candidatos.foto,
            favoritada: (usuarioTipo === 'candidato' ? chat.favoritos_chats_cand[0] : chat.favoritos_chats_emp[0]) ? true : false,
            mensagens: chat.mensagens.map(msg=>{
                return {
                    texto: msg.mensagem,
                    remetente: msg.de === usuarioTipo ? 'usuario' : 'eles',
                    hora: (()=>{
                        const horario = new Date(msg.data_criacao);
                        const txtData = hojeOntem(horario);
                        return `${txtData==='Hoje' ? '' : `${txtData} `}${String(horario.getHours()).padStart(2, "0")}:${String(horario.getMinutes()).padStart(2, "0")}`
                    })(),
                    id: msg.id
                }
            }),
            contadorMensagens: chat.mensagens.length
        };
        return ct;
    })
    let conversaAtual = '0';
    if(idAtual) {
        const atual = conversas.find(cvs => cvs.remetente === idAtual)?.id;
        if(!atual){
            try {
                const obj = {
                    empresa: usuarioTipo === 'candidato' ? idAtual : usuarioId,
                    candidato: usuarioTipo === 'candidato' ? usuarioId : idAtual
                }
                const response = await axiosWe.post('/chats', obj).catch((err)=>{
                    console.error(err);
                    return {data:''}
                });
                if(response.data==='') return;
                const chat = response.data;
                
                if(!chat.bloqueado) socket.emit('joinRoom', chat.id);
                conversas.push({
                    id: chat.id,
                    bloqueadoStatus: chat.bloqueado,
                    bloqueador: chat.bloqueador_tipo,
                    remetente: usuarioTipo === 'candidato' ? chat.empresas.id : String(chat.candidatos.id),
                    statusRemetente: 'Offline',
                    nome: usuarioTipo === 'candidato' ? chat.empresas.nome_fant : chat.candidatos.nome,
                    ultimaMensagem: chat.mensagens.toReversed()[0]?.mensagem || '',
                    hora: (() => {
                        const msg = chat.mensagens.toReversed()[0]?.data_criacao
                        if(!msg) return '';
                        const horario = new Date(msg);
                        const txtData = hojeOntem(horario);
                        return `${txtData==='Hoje' ? `${String(horario.getHours()).padStart(2, "0")}:${String(horario.getMinutes()).padStart(2, "0")}` : `${txtData}`}`;
                    })(),
                    naoLidas: (()=>{
                        const naoLidas = chat.mensagens.reduce((ac, msg)=>{
                            if(msg.de !== usuarioTipo && !msg.status){
                                ac++
                            }
                            return ac;
                        }, 0);
                        return naoLidas;
                    })(),
                    avatar: usuarioTipo === 'candidato' ? chat.empresas.foto : chat.candidatos.foto,
                    favoritada: (usuarioTipo === 'candidato' ? chat.favoritos_chats_cand[0] : chat.favoritos_chats_emp[0]) ? true : false,
                    mensagens: chat.mensagens.map(msg=>{
                        return {
                            texto: msg.mensagem,
                            remetente: msg.de === usuarioTipo ? 'usuario' : 'eles',
                            hora: (()=>{
                                const horario = new Date(msg.data_criacao);
                                const txtData = hojeOntem(horario);
                                return `${txtData==='Hoje' ? '' : `${txtData} `}${String(horario.getHours()).padStart(2, "0")}:${String(horario.getMinutes()).padStart(2, "0")}`
                            })(),
                            id: msg.id
                        }
                    }),
                    contadorMensagens: chat.mensagens.length
                })
                conversaAtual = chat.id;
            } catch (erro) {
                console.error(erro)
            }
        } else conversaAtual = atual;
    }
    console.log(conversas, conversaAtual)
    return {conversas, conversaAtual};
}

interface EnviarMensagemResponse {
    success: boolean,
    texto?: string;
    remetente?: string;
    hora?: string;
    id?: string;
}
export async function enviarMensagem(mensagem: string, usuario:{id: string, nome: string, tipo: string, nivel: string, foto: string}, conversaAtualId: string): Promise<EnviarMensagemResponse> {
    try {
        const response = await axiosWe.post('/mensagens', {
                autor: usuario.nome,
                mensagem,
                chat: conversaAtualId,
                de: usuario.tipo
            })
        const agora = new Date();
        const hora = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;
        const novaMensagem = { success: true, texto: mensagem, remetente: 'usuario', hora, id: response.data.idMsg };
        const messageObject = {
            author: usuario.nome,
            message: mensagem,
            room: conversaAtualId,
            type: usuario.tipo,
            idMsg: response.data.idMsg
        };
        socket.emit('sendMessage', messageObject);
        return novaMensagem;
    } catch (erro) {
        console.error(erro);
        return { success: false };
    }
}

interface ModalActionsResponse {
    success: boolean;
}
export async function modalActions(action: string, id: string, valor?: string): Promise<ModalActionsResponse> {
    switch (action) {
        case 'block': {
            try {
                const status = valor === 'true' ? true : false;
                await axiosWe.patch(`/chats/block/${id}`, { bloqueado: status});
                return {success: true}
            } catch (erro) {
                console.error(erro);
                return {success: false}
            }
        }
        case 'clean': {
            try {
                await axiosWe.delete(`/mensagens/limpar/${id}`);
                return {success: true};
            } catch (erro) {
                console.error(erro);
                return {success: false};
            }
        }
        case 'remove': {
            try {
                await axiosWe.delete(`/chats/${id}`);
                return {success: true};
            } catch (erro) {
                console.error(erro);
                return {success: false};
            }
        }
        default:
            break;
    }
}

function hojeOntem(data: Date){
    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);

    // zera horas pra comparar só a parte da data
    const normalizar = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const dataNormalizada = normalizar(data);
    const hojeNormalizada = normalizar(hoje);
    const ontemNormalizada = normalizar(ontem);

    if (dataNormalizada.getTime() === hojeNormalizada.getTime()) {
        return "Hoje";
    } else if (dataNormalizada.getTime() === ontemNormalizada.getTime()) {
        return "Ontem";
    } else {
        return `${data.getDate().toString().padStart(2, '0')}/${data.getMonth().toString().padStart(2, '0')}/${data.getFullYear()}`
    }
}

interface ValidarSeEhArquivoResponse {
    url?: string;
    size?: string; 
    filename?: string;
    extensao?: string;
    nomeExib?: string;
    tipo?: string;
    eh: boolean;
}
export function validarSeEhArquivo(texto: string): ValidarSeEhArquivoResponse{
    const textoSplited = texto.split('|');
    if(textoSplited.length !== 5) return {eh: false};
    const [prefixo, url, size, nomeExib, sufixo] = textoSplited;
    let tipo = '';
    if(prefixo==='NewSendFile' && sufixo==='fileNew' && size.endsWith('KB') && url.startsWith('https://res.cloudinary.com/ddbfifdxd/raw/upload/')){
        tipo = 'raw';
    } else if(prefixo==='NewSendImage' && sufixo==='imageNew' && size.endsWith('KB') && url.startsWith('https://res.cloudinary.com/ddbfifdxd/image/upload/')){
        tipo = 'img';
    } else return {eh: false};
    const filename = url.split('/').pop();
    const extensao = filename.split('.').pop().toUpperCase();
    return {url, size, filename, extensao, nomeExib, tipo, eh: true};
}

export function transformarLinksEmAnchors(mensagem: string): string{
    const regex = /(https?:\/\/[^\s]+)/g;
    return mensagem.replace(regex, '<a href="$1" target="_blank" class="text-blue-400 underline hover:text-blue-600">$1</a>');
}