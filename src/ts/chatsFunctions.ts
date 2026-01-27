import axiosWe from "../utils/axiosInstance";
import { mostrarAvisoTopo } from "../utils/globalFunctions";
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

export interface ConversaDesabilitada {
    id: string;
    desabilitador_tipo: string;
    data_desabilitacao: Date;
    remetente: string;
    nome: string;
    ultimaMensagem: string;
    hora: string;
    avatar: string | null;
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

export interface NovaSolicitacaoConversa {
    imagem: string;
    nome: string;
    id: string;
    tipo: string;
}

export interface SolicitacaoConversa {
  id: string;
  usuario_id: string;
  usuario_nome: string;
  usuario_foto: string;
  tipo: 'enviada' | 'recebida';
  status: 'pendente' | 'aceita' | 'recusada';
};

interface CarregarConversasBackResponse {
    conversas: Conversa[];
    conversaAtual: string;
    novaSolicitacao?: NovaSolicitacaoConversa;
    solicitacoes: SolicitacaoConversa[];
}
export async function carregarConversasBack(usuario: {tipo: string, nome: string, id: string}, idAtual: string): Promise<CarregarConversasBackResponse>{
    const usuarioTipo = usuario.tipo;

    const response = usuarioTipo === 'candidato' ? await axiosWe('/custom/chats-candidatos'): await axiosWe('/custom/chats-empresas');
    console.log(response.data)
    const data = response.data.chats;
    const { solicitacoes_chat_p_candidatos, solicitacoes_chat_p_empresas } = response.data;

    const ehCandidato = usuarioTipo === 'candidato';
    let solicitacoes: SolicitacaoConversa[] = solicitacoes_chat_p_candidatos.map(sol=>({
        id: sol.id,
        usuario_id: ehCandidato ? sol.empresas.id : sol.candidatos.id,
        usuario_nome: ehCandidato ? sol.empresas.nome_fant : sol.candidatos.nome,
        usuario_foto: ehCandidato ? sol.empresas.foto : sol.candidatos.foto,
        tipo: ehCandidato ? 'recebida': 'enviada',
        status: 'pendente'
    }));
    solicitacoes = [...solicitacoes, ...(solicitacoes_chat_p_empresas.map(sol=>({
        id: sol.id,
        usuario_id: ehCandidato ? sol.empresas.id : sol.candidatos.id,
        usuario_nome: ehCandidato ? sol.empresas.nome_fant : sol.candidatos.nome,
        usuario_foto: ehCandidato ? sol.empresas.foto : sol.candidatos.foto,
        tipo: ehCandidato ? 'enviada': 'recebida',
        status: 'pendente'
    })))];

    const conversas = data.map(chat=>{
        // if(!chat.bloqueado) socket.emit('joinRoom', chat.id);
        const ct = conversaConstructor(usuarioTipo, chat);
        return ct;
    })
    let conversaAtual = '0';
    let novaSolicitacao: NovaSolicitacaoConversa;

    if(idAtual) {
        const atual = conversas.find(cvs => cvs.remetente === idAtual)?.id;
        if(!atual){
            try {
                const empOuCand =  usuarioTipo === 'candidato' ? 'empresas' : 'candidatos';
                const response = await axiosWe(`/${empOuCand}/single/${idAtual}?use_myid=true`);
                const solicitacao = response.data;
                console.log(solicitacao);

                if(solicitacao.solicitacoes_chat_p_empresas?.length > 0 || solicitacao.solicitacoes_chat_p_candidatos?.length > 0){
                    mostrarAvisoTopo(`Você já possui uma solicitação de conversa para ${solicitacao.nome || solicitacao.nome_fant}.`)
                } else {
                    novaSolicitacao = {
                        imagem: solicitacao.foto,
                        nome: usuarioTipo === 'candidato' ? solicitacao.nome_fant : solicitacao.nome,
                        id: idAtual,
                        tipo: usuarioTipo === 'candidato' ? 'Empresa' : 'Candidato'
                    };
                }
            } catch (erro) {
                console.error(erro)
            }
        } else conversaAtual = atual;
    }
    console.log(conversas, conversaAtual)
    const conversasSorted = [...conversas].sort((a, b) => {
        // Encontra as últimas mensagens com verificação de segurança
        const ultimaMensagemA = a.mensagens.find((msg) => msg.id === a.ultimaMensagemId);
        const ultimaMensagemB = b.mensagens.find((msg) => msg.id === b.ultimaMensagemId);
        
        let dataA: number;
        let dataB: number;
        
        if (ultimaMensagemA) {
            dataA = new Date(ultimaMensagemA.datetime).getTime();
        } else {
            dataA = new Date(a.data_criacao).getTime();
        }
        
        if (ultimaMensagemB) {
            dataB = new Date(ultimaMensagemB.datetime).getTime();
        } else {
            dataB = new Date(b.data_criacao).getTime();
        }
        
        return dataB - dataA;
    });
    return {conversas: conversasSorted, conversaAtual, novaSolicitacao, solicitacoes};
}

export function conversaConstructor(usuarioTipo: string, chat) {
    return {
        id: chat.id,
        bloqueadoStatus: chat.bloqueado,
        bloqueador: chat.bloqueador_tipo,
        remetente: usuarioTipo === 'candidato' ? chat.empresas.id : String(chat.candidatos.id),
        statusRemetente: 'Offline',
        nome: usuarioTipo === 'candidato' ? chat.empresas.nome_fant : chat.candidatos.nome,
        ultimaMensagem: chat.mensagens.toReversed()[0]?.mensagem || '',
        ultimaMensagemId: chat.mensagens.toReversed()[0]?.id,
        data_criacao: chat.data_criacao,
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
                datetime: new Date(msg.data_criacao),
                id: msg.id
            }
        }),
        contadorMensagens: chat.mensagens.length
    }
}

export function conversaDesabilitadaConstructor(usuarioTipo: string, chat): ConversaDesabilitada{
    return {
        id: chat.id,
        desabilitador_tipo: chat.desabilitador_tipo,
        data_desabilitacao: new Date(chat.data_desabilitacao),
        remetente: usuarioTipo === 'candidato' ? chat.empresas.id : chat.candidatos.id,
        nome: usuarioTipo === 'candidato' ? chat.empresas.nome_fant : chat.candidatos.nome,
        ultimaMensagem: chat.mensagens.toReversed()[0]?.mensagem || '',
        hora: (() => {
            const msg = chat.mensagens.toReversed()[0]?.data_criacao
            if(!msg) return '';
            const horario = new Date(msg);
            const txtData = hojeOntem(horario);
            return `${txtData==='Hoje' ? `${String(horario.getHours()).padStart(2, "0")}:${String(horario.getMinutes()).padStart(2, "0")}` : `${txtData}`}`;
        })(),
        avatar: usuarioTipo === 'candidato' ? chat.empresas.foto : chat.candidatos.foto,
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
    }
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

interface RemoveOptions {
    receberEmail: boolean;
    quantidadeReceber?: number;
}
interface ModalActionsResponse {
    success: boolean;
}
export async function modalActions(action: string, id: string, valor?: string, removeOptions?: RemoveOptions): Promise<ModalActionsResponse> {
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
                await axiosWe.patch(`/chats/disable/${id}`, {
                    receberMensagens: removeOptions.receberEmail,
                    quantidadeReceber: removeOptions.quantidadeReceber
                });
                return {success: true};
            } catch (erro) {
                console.error(erro);
                return {success: false};
            }
        }
        case 'save':
            try {
                await axiosWe.post(`/chats/save/${id}`, {quantidade: removeOptions.quantidadeReceber})
                return {success: true};
            } catch (erro) {
                console.error(erro);
                return {success: false};
            }
        case 'delete':
            try {
                await axiosWe.delete(`/chats/${id}`);
                return {success: true};
            } catch (erro) {
                console.error(erro);
                return {success: false};
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
        return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth()+1).toString().padStart(2, '0')}/${data.getFullYear()}`
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

export async function enviarSolicitacaoConversa(userTipo: 'candidato'|'empresa', paraId: string): Promise<{foi: boolean, solicitacaoId?: string}> {
    try {
        const response = userTipo === 'candidato' ? await axiosWe.post(`empresas/conversa/solicitar`, {idEmp: paraId}) : await axiosWe.post(`candidatos/conversa/solicitar`, {idCand: paraId});
        console.log(response.data);
        return {foi: true, solicitacaoId: response.data.solicitacaoId};
    } catch (erro) {
        console.error('Erro ao enviar solicitação de conversa:', erro);
        return {foi: false};
    }
}