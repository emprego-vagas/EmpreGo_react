import { Link, useNavigate } from 'react-router-dom';
import { DadosUsuario, fileDownload, mostrarErroTopo, mostrarSucessoTopo, sendNotification } from '../utils/globalFunctions';
import { useEffect, useRef, useState, type ChangeEvent, type JSX } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUsers, faStar, faGear, faReply, faBriefcase, faLock, faSearch, faEllipsisVertical, faCircleInfo, faXmark, faBan, faTrash, faTrashCan, faChevronUp, faChevronDown, faTimes, faFile, faImage, faCamera, faPaperclip, faPaperPlane, faFileZipper, faDownload, faClock, faCheck, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import {faStar as faStarRegular} from '@fortawesome/free-regular-svg-icons';

import '../css/chat.css';
import genPfp from '../assets/imgs/genPfp.png';
import PDFpng from '../assets/imgs/PDF.png';
import DOCXICONROXO from '../assets/imgs/DOCXICONROXO.png'
import TXTAZUL from '../assets/imgs/TXTAZUL.png'
import { carregarConversasBack, conversaConstructor, enviarMensagem, enviarSolicitacaoConversa, modalActions, validarSeEhArquivo } from '../ts/chatsFunctions';
import { conversaDesabilitadaConstructor, type ConversaDesabilitada, type NovaSolicitacaoConversa, type SolicitacaoConversa } from '../ts/chatsFunctions';
import axiosWe from '../utils/axiosInstance';
import socket from '../utils/socketsConnection';
import Loader from '../components/Loader';
import type { Conversa, Mensagem, MessageSocket, UserStatusSocket } from "../ts/chatsFunctions";
import SinoNotificacoes from '../components/SinoNotificacoes';
import type { NotificationEG } from '../ts/sinoNotificacoesFunctions';

export default function Chats() {
    const navigate = useNavigate();
    const [usuario] = useState(DadosUsuario.getUsuario(true));
    if(!usuario) {
        setTimeout(()=>{
            navigate('/')
        }, 3000)
    };
    const [carregando, setCarregando] = useState(true);

    useEffect(()=>{
        if(!usuario) return;
        const params = new URLSearchParams(window.location.search)
        const id = params.get('id');
        
        async function carregarConversas() {
            try {
                const conversasInit = await carregarConversasBack(usuario, id);
                setDadosConversas(conversasInit.conversas);
                setNovaSolicitacao(conversasInit.novaSolicitacao||null);
                setSolicitacoes(conversasInit.solicitacoes);
                setContadorFavoritos(conversasInit.conversas.reduce(
                    (acc, dado) => {
                        if (dado.favoritada) acc++;
                        return acc;
                    }, 0)
                );

                if (conversasInit.conversaAtual && conversasInit.conversaAtual !== '0') {
                    setTimeout(() => {
                        setConversaAtualId(conversasInit.conversaAtual);
                    }, 300);
                } else {
                    setConversaAtualId('0');
                }

                socket.emit('joinChats', (res)=>{
                    if (res.status==='error'){
                        socket.emit('joinChats', (res)=>{
                            if (res.status==='error'){
                                mostrarErroTopo('Erro ao entrar nas conversas, tente recarregar a página.')
                            } else {
                                setCarregando(false);
                            }
                        })
                    } else {
                        setCarregando(false);
                    }
                })
            } catch (erro) {
                console.error("Erro ao carregar conversas:", erro);
            }
        }
        carregarConversas();
        const intervalId = setInterval(()=>{
            socket.emit('refreshStatus');
        }, 5000);

        const receivedMessage = async(message: MessageSocket)=>{
            if (message.type === usuario.tipo) return;

            const agora = new Date();
            const hora = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;
            const messageFormat: Mensagem = { texto: message.message, remetente: 'eles', hora, id: message.idMsg };

            setDadosConversas(prev => {
                const conversaExiste = prev.some(c => c.id === message.room);
                if (!conversaExiste) return prev;

                const novasConversas = prev.map(conversa =>
                    conversa.id === message.room
                        ? {
                            ...conversa,
                            mensagens: [...conversa.mensagens, messageFormat],
                            contadorMensagens: conversa.mensagens.length + 1,
                            ultimaMensagem: message.message,
                            naoLidas:
                                conversaAtualIdRef.current === message.room
                                    ? 0
                                    : conversa.naoLidas + 1,
                        }
                        : conversa
                );

                const conversaMensagem = novasConversas.find(con=>con.id===message.room);
                const outrasConversas = novasConversas.filter(con=>con.id!==message.room);
                const novasConversasSorted = [conversaMensagem, ...outrasConversas];

                if (conversaAtualIdRef.current === message.room) {
                    const container = messagesContainerRef.current;
                    setTimeout(() => {
                        container.scrollTop = container.scrollHeight;
                    }, 50);
                    axiosWe.patch(`/mensagens/vizualizar/${message.room}`).catch(console.error);
                }

                return novasConversasSorted;
            });
        }
        const userStatus = (user: UserStatusSocket)=>{
            if(user.socket===socket.id) return;
            
            setDadosConversas(prev => {
                const conversaExiste = prev.some(c => c.id === user.room);
                if (!conversaExiste) return prev;

                return prev.map(conversa =>
                    conversa.id === user.room
                        ? {
                            ...conversa,
                            statusRemetente: user.status,
                            bloqueadoStatus: user.status === 'Online' ? false : conversa.bloqueadoStatus,
                            bloqueador: user.status === 'Online' ? null : conversa.bloqueador
                        }
                        : conversa
                );
            });
        }

        function receivedNotification(notif: NotificationEG){
            console.log(notif)
            if(!notif.object) return;
            const object = notif.object;
            if(notif.tipo==='Solicitação de Conversa'){
                if(object.action==='criar'){
                    const {id, user_id, user_name, user_image} = object as {
                        id: string;
                        user_id: string;
                        user_name: string;
                        user_image: string;
                    };
                    if(!id) return;
                    setSolicitacoes(prev=> [
                        {
                            id: id,
                            usuario_id: user_id,
                            usuario_nome: user_name,
                            usuario_foto: user_image,
                            tipo: 'recebida',
                            status: 'pendente'
                        },
                        ...prev
                    ])
                }
                if(object.action==='recusar'||object.action==='cancelar'){
                    const { id } = object as { id: string };
                    setSolicitacoes(prev => prev.filter(sol => 
                        sol.id !== id
                    ));
                }
                if(object.action==='aceitar'){
                    const {id, user_id, user_name, user_image, newChatId} = object as {
                        id: string;
                        user_id: string;
                        user_name: string;
                        user_image: string;
                        newChatId: string;
                    };
                    setSolicitacoes(prev => prev.filter(sol => 
                        sol.id !== id
                    ));
                    const novaConversa = {
                        id: newChatId,
                        bloqueadoStatus: false,
                        bloqueador: null,
                        remetente: user_id,
                        statusRemetente: 'Offline',
                        nome: user_name,
                        ultimaMensagem: '',
                        hora: '',
                        naoLidas: 0,
                        avatar: user_image,
                        favoritada: false,
                        mensagens: [],
                        contadorMensagens: 0
                    };
                    setTimeout(()=>{
                        setDadosConversas(prev=>[novaConversa, ...prev]);
                        socket.emit('joinChat', newChatId, callback=>{
                            if(callback.status==='error') {
                                mostrarErroTopo(callback.message);
                            }
                        });
                    }, 500)
                }
            } else if(notif.tipo==='Conversa'){
                if(object.action==='deletar'){
                    if(conversaAtualIdRef.current===object.id) setConversaAtualId('0');
                    setDadosConversas(prev=>prev.filter(c=>c.id!==object.id));
                };
            }
            
        }

        socket.on('receivedMessage', receivedMessage);
        socket.on('userStatus', userStatus);
        socket.on('receivedNotification', receivedNotification);
      
        return () => {
            clearInterval(intervalId);
            socket.off('receivedMessage', receivedMessage);
            socket.off('userStatus', userStatus);
            socket.off('receivedNotification', receivedNotification);
        };
    }, [usuario]);

    const [contadorFavoritos, setContadorFavoritos] = useState(0);
    const [conversaAtualId, setConversaAtualId] = useState('0');
    const [dadosConversas, setDadosConversas] = useState<Conversa[]>([]);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const [mostrarAttachmentMenu, setMostrarAttachmentMenu] = useState(false);
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const [modalAction, setModalAction] = useState({status: false, mensagem: '', action: '', valor: '', chatId: ''});
    const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
    const [fileData, setFileData] = useState({name: '', size: '', tipo: ''});
    const inputDocRef = useRef<HTMLInputElement | null>(null);
    const inputImgRef = useRef<HTMLInputElement | null>(null);
    const inputCamRef = useRef<HTMLInputElement | null>(null);
    const [mensagemEnvio, setMensagemEnvio] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const btnEnviarRef = useRef<HTMLButtonElement | null>(null);
    const receberEmailRef = useRef<HTMLInputElement | null>(null);
    const [receberEmail, setReceberEmail] = useState(true);
    const [quantidadeReceber, setQuantidadeReceber] = useState(100);
    const [novaSolicitacao, setNovaSolicitacao] = useState<NovaSolicitacaoConversa|null>(null);
    const [enviandoSolicitacao, setEnviandoSolicitacao] = useState(false);

    const conversaAtualIdRef = useRef(conversaAtualId);
    useEffect(() => {
        conversaAtualIdRef.current = conversaAtualId;
    }, [conversaAtualId]);

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>, tipo: string): void=>{
        setMostrarAttachmentMenu(false);
        const target = e.target;
        const arquivo = target.files[0];
        if (arquivo && arquivo.size > 5 * 1024 * 1024) {
            mostrarErroTopo("O arquivo deve ter no máximo 5MB.");
            target.value = "";
            return;
        }
        setFileData({name: arquivo.name, size: `${(arquivo.size / 1024).toFixed(2)} KB`, tipo})
        setMostrarModalConfirmacao(true);
    }

    const handleChangeMsg = (e: ChangeEvent<HTMLTextAreaElement>)=>{
        const target = e.target;
        setMensagemEnvio(target.value);
        target.style.height = 'auto';
        target.style.height = `${target.scrollHeight}px`;
    };

    function transformarLinksEmAnchors(mensagem: string): JSX.Element {
        // Regex para identificar links com protocolo e domínios sem protocolo
        const regex = /(https?:\/\/[^\s]+)|(\b(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?\b)/g;
        const partes = mensagem.split(regex);

        return (
            <>
            {partes.map((parte, i) => {
                if (!parte) return null;
                
                // Verifica se é um link com protocolo
                if (/^https?:\/\/[^\s]+$/.test(parte)) {
                    return (
                        <a
                            key={i}
                            href={parte}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline hover:text-blue-600"
                        >
                            {parte}
                        </a>
                    );
                }
                // Verifica se é um domínio sem protocolo
                else if (/^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?$/.test(parte)) {
                    return (
                        <a
                            key={i}
                            href={`https://${parte}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline hover:text-blue-600"
                        >
                            {parte}
                        </a>
                    );
                }
                // Texto normal
                else {
                    return parte;
                }
            })}
            </>
        );
    }

    const [mostrarSolicitacoes, setMostrarSolicitacoes] = useState(false);
  
    // Dados de exemplo
    const [solicitacoes, setSolicitacoes] = useState<SolicitacaoConversa[]>([
        {
            id: '1',
            usuario_id: 'emp-123',
            usuario_nome: 'Tech Solutions LTDA',
            usuario_foto: '/images/empresa1.jpg',
            tipo: 'recebida',
            status: 'pendente'
        },
        {
            id: '2',
            usuario_id: 'cand-456',
            usuario_nome: 'João Silva',
            usuario_foto: '/images/candidato1.jpg',
            tipo: 'enviada',
            status: 'pendente'
        },
        {
            id: '3',
            usuario_id: 'emp-789',
            usuario_nome: 'Startup Inovação',
            usuario_foto: '/images/empresa2.jpg',
            tipo: 'recebida',
            status: 'pendente'
        },
        {
            id: '4',
            usuario_id: 'cand-101',
            usuario_nome: 'Maria Santos',
            usuario_foto: '/images/candidato2.jpg',
            tipo: 'enviada',
            status: 'pendente'
        }
    ]);

    const aceitarSolicitacao = async(id: string, destinatarioid: string) => {
        setSolicitacoes(prev => prev.map(sol => 
        sol.id === id ? { ...sol, status: 'aceita' } : sol
        ));
        try {
            const response = await axiosWe.post('/chats', {solicitacaoId: id});
            const novaConversa: Conversa = conversaConstructor(usuario.tipo, response.data);
            setDadosConversas([novaConversa, ...dadosConversas]);
            socket.emit('joinChat', novaConversa.id, callback=>{
                if(callback.status==='error') {
                    mostrarErroTopo(callback.message);
                }
            });
            const recipientType = usuario.tipo === 'candidato' ? 'empresa' : 'candidato'
            sendNotification({id: destinatarioid, type: recipientType}, {
                solicitacao_conversa: {
                    action: 'aceitar',
                    newChatId: novaConversa.id,
                    id
                }
            })
        } catch (erro) {
            console.error('Erro ao aceitar solicitação:',erro)
        }
    };

    const recusarSolicitacao = async(id: string, destinatarioid: string) => {
        setSolicitacoes(prev => prev.map(sol => 
        sol.id === id ? { ...sol, status: 'recusada' } : sol
        ));
        try {
            if(usuario.tipo==='candidato') await axiosWe.delete(`/candidatos/conversa/remover/${id}`);
            else await axiosWe.delete(`/empresas/conversa/remover/${id}`);
            const recipientType = usuario.tipo === 'candidato' ? 'empresa' : 'candidato'
            sendNotification({id: destinatarioid, type: recipientType}, {
                solicitacao_conversa: {
                    action: 'recusar',
                    id
                }
            })
        } catch (erro) {
            console.error('Erro ao recusar solicitação:',erro)
        }
    };

    const cancelarSolicitacao = async(id: string, destinatarioid: string) => {
        setSolicitacoes(prev => prev.filter(sol => sol.id !== id));
        try {
            if(usuario.tipo==='candidato') await axiosWe.delete(`/empresas/conversa/remover/${id}`);
            else await axiosWe.delete(`/candidatos/conversa/remover/${id}`);
            const recipientType = usuario.tipo === 'candidato' ? 'empresa' : 'candidato'
            sendNotification({id: destinatarioid, type: recipientType}, {
                solicitacao_conversa: {
                    action: 'cancelar',
                    id
                }
            })
        } catch (erro) {
            console.error('Erro ao cancelar solicitação:',erro)
        }
    };

    // Filtrar solicitações
    const solicitacoesRecebidas = solicitacoes.filter(sol => sol.tipo === 'recebida' && sol.status === 'pendente');
    const solicitacoesEnviadas = solicitacoes.filter(sol => sol.tipo === 'enviada' && sol.status === 'pendente');

    const [sessaoAtual, setSessaoAtual] = useState('Todas');

    const [desabilitadasData, setDesabilitadasData] = useState<{
        loading: boolean;
        searched: boolean;
        chats: ConversaDesabilitada[]
    }>({loading: false, searched: false, chats: []});

    useEffect(() => {
        if (conversaAtualId !== '0' && messagesContainerRef.current) {
            
            if(sessaoAtual==='Todas'){
                textareaRef.current.focus();
                
                const container = messagesContainerRef.current;
                container.scrollTop = container.scrollHeight;
                setTimeout(() => {
                    container.scrollTop = container.scrollHeight;
                }, 50);
                
                setDadosConversas(prev => {
                    const conversaExiste = prev.some(c => c.id === conversaAtualId);
                    if (!conversaExiste) return prev;

                    return prev.map(conversa => {
                        if(conversa.id === conversaAtualId) {
                            if(conversa.naoLidas>0) axiosWe.patch(`/mensagens/vizualizar/${conversaAtualId}`).catch(console.error);
                            return {...conversa, naoLidas: 0 };
                        } else {
                            return conversa;
                        }
                    });
                });
            }
            
            setMostrarMenu(false)
            setMostrarAttachmentMenu(false);
        }
    }, [conversaAtualId, sessaoAtual]);

    if(carregando) return (<Loader />);

    return (
        <div className="bg-dark-900 text-white h-screen flex overflow-hidden">
            <aside className="w-16 bg-dark-800 border-r border-gray-800 flex flex-col h-full items-center py-4">
                {/* <!-- Foto de perfil do usuário --> */}
                <Link to={`/perfil/${usuario.tipo}`} className="relative mb-8" title='Perfil do Usuário'>
                    <img src={usuario.foto==='/assets/imgs/genPfp.png'?genPfp:usuario.foto} alt="Foto de perfil do usuário" id="FotoDePerfil"
                        className="w-8 h-8 object-cover rounded-full cursor-pointer" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800"
                        id="bolaSemMexer"></div>
                </Link>

                {/* <!-- Ícones de navegação --> */}
                <nav className="flex-1 flex flex-col space-y-8 items-center" title='Início'>
                    <Link to="/" className="sidebar-icon text-gray-400 hover:text-white transition-colors">
                        <FontAwesomeIcon icon={faHouse} className='text-xl' />
                    </Link>
                    <div className="relative">
                    {/* Ícone para abrir/fechar */}
                    <div 
                        className="sidebar-icon text-gray-400 hover:text-white transition-colors cursor-pointer" 
                        title='Solicitações de Conversa'
                        onClick={() => setMostrarSolicitacoes(!mostrarSolicitacoes)}
                    >
                        <FontAwesomeIcon icon={faUsers} className='text-xl' />
                        
                        {/* Badge de notificação */}
                        {solicitacoesRecebidas.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {solicitacoesRecebidas.length}
                        </span>
                        )}
                    </div>

                    {/* Modal de Solicitações - CORRIGIDO PARA ABRIR À DIREITA */}
                    {mostrarSolicitacoes && (
                        <div className="absolute left-full top-0 ml-2 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                        <div className="p-4 border-b border-gray-700">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <FontAwesomeIcon icon={faUsers} />
                            Solicitações de Conversa
                            </h3>
                        </div>

                        {/* Solicitações Recebidas */}
                        {solicitacoesRecebidas.length > 0 && (
                            <div className="p-4 border-b border-gray-700">
                            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                                <FontAwesomeIcon icon={faClock} className="text-blue-400" />
                                Recebidas ({solicitacoesRecebidas.length})
                            </h4>
                            
                            <div className="space-y-3">
                                {solicitacoesRecebidas.map(solicitacao => (
                                <div key={solicitacao.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                    <div className="flex items-center gap-3">
                                    <img 
                                        src={solicitacao.usuario_foto === '/assets/imgs/genPfp.png' ? genPfp : solicitacao.usuario_foto} 
                                        alt={solicitacao.usuario_nome}
                                        className="w-10 h-10 rounded-full object-cover"
                                        onError={(e) => {
                                        (e.target as HTMLImageElement).src = genPfp;
                                        }}
                                    />
                                    <div>
                                        <p className="text-white text-sm font-medium">{solicitacao.usuario_nome}</p>
                                        <p className="text-gray-400 text-xs">Quer conversar com você</p>
                                    </div>
                                    </div>
                                    
                                    <div className="flex gap-1">
                                    <button
                                        onClick={() => aceitarSolicitacao(solicitacao.id, solicitacao.usuario_id)}
                                        className="p-2 text-green-400 hover:bg-green-400 hover:text-white rounded transition-colors"
                                        title="Aceitar"
                                    >
                                        <FontAwesomeIcon icon={faCheck} />
                                    </button>
                                    <button
                                        onClick={() => recusarSolicitacao(solicitacao.id, solicitacao.usuario_id)}
                                        className="p-2 text-red-400 hover:bg-red-400 hover:text-white rounded transition-colors"
                                        title="Recusar"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                    </div>
                                </div>
                                ))}
                            </div>
                            </div>
                        )}

                        {/* Solicitações Enviadas */}
                        {solicitacoesEnviadas.length > 0 && (
                            <div className="p-4">
                            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                                <FontAwesomeIcon icon={faClock} className="text-yellow-400" />
                                Enviadas ({solicitacoesEnviadas.length})
                            </h4>
                            
                            <div className="space-y-3">
                                {solicitacoesEnviadas.map(solicitacao => (
                                <div key={solicitacao.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                    <div className="flex items-center gap-3">
                                    <img 
                                        src={solicitacao.usuario_foto === '/assets/imgs/genPfp.png' ? genPfp : solicitacao.usuario_foto} 
                                        alt={solicitacao.usuario_nome}
                                        className="w-10 h-10 rounded-full object-cover"
                                        onError={(e) => {
                                        (e.target as HTMLImageElement).src = genPfp;
                                        }}
                                    />
                                    <div>
                                        <p className="text-white text-sm font-medium">{solicitacao.usuario_nome}</p>
                                        <p className="text-gray-400 text-xs">Aguardando resposta</p>
                                    </div>
                                    </div>
                                    
                                    <button
                                    onClick={() => cancelarSolicitacao(solicitacao.id, solicitacao.usuario_id)}
                                    className="p-2 text-red-400 hover:bg-red-400 hover:text-white rounded transition-colors"
                                    title="Cancelar solicitação"
                                    >
                                    <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                                ))}
                            </div>
                            </div>
                        )}

                        {/* Mensagem quando não há solicitações */}
                        {solicitacoesRecebidas.length === 0 && solicitacoesEnviadas.length === 0 && (
                            <div className="p-8 text-center">
                            <FontAwesomeIcon icon={faUsers} className="text-gray-500 text-3xl mb-2" />
                            <p className="text-gray-400 text-sm">Nenhuma solicitação de conversa</p>
                            </div>
                        )}
                        </div>
                    )}

                    {/* Overlay para fechar ao clicar fora - POSICIONAMENTO CORRETO */}
                    {mostrarSolicitacoes && (
                        <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setMostrarSolicitacoes(false)}
                        />
                    )}
                    </div>
                    <SinoNotificacoes />
                    <Link to={`/perfil/${usuario.tipo}`} className="sidebar-icon text-gray-400 hover:text-white transition-colors">
                        <FontAwesomeIcon icon={faStar} className='text-xl' />
                    </Link>
                </nav>

                {/* <!-- Configurações e voltar --> */}
                <div className="mt-auto flex flex-col space-y-6 items-center">
                    <Link to="#" className="sidebar-icon text-gray-400 hover:text-white transition-colors">
                        <FontAwesomeIcon icon={faGear} className='text-xl' />
                    </Link>
                    <Link to="/" className="sidebar-icon text-gray-400 hover:text-white transition-colors">
                        <FontAwesomeIcon icon={faReply} className='text-xl' />
                    </Link>
                </div>
            </aside>

            {/* // <!-- conversas (1 pra N) --> */}
            <aside className="w-80 bg-dark-800 border-r border-gray-800 flex flex-col h-full">
                <div className="p-4 border-b border-gray-800">
                    <h2 className="text-lg font-semibold">Conversas</h2>
                    <div className="flex gap-2">
                        <button className={`mt-2 text-white px-2 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-all hover:scale-105 flex-shrink-0 ${sessaoAtual==='Todas' ? 'bg-primary-500 hover:bg-primary-700' : 'bg-dark-500 hover:bg-dark-400'}`}
                            onClick={()=>{
                                setSessaoAtual('Todas');
                                setConversaAtualId('0');
                            }}>
                            Todas
                        </button>
                        <button className={`mt-2 text-white px-2 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-all hover:scale-105 flex-shrink-0 ${sessaoAtual==='Desabilitadas' ? 'bg-primary-500 hover:bg-primary-700' : 'bg-dark-500 hover:bg-dark-400'}`}
                            onClick={async()=>{
                                setSessaoAtual('Desabilitadas');
                                setConversaAtualId('0');
                                if(!desabilitadasData.searched){
                                    setDesabilitadasData(prev=>({...prev, loading: true}));
                                    try {
                                        const response = await axiosWe(`/chats/${usuario.tipo}/disabled`);
                                        const chats = response.data;
                                        setDesabilitadasData({loading: false, searched: true, chats: chats.map(chat=>
                                            conversaDesabilitadaConstructor(usuario.tipo, chat)
                                        )})
                                    } catch (erro) {
                                        console.error("Erro ao carregar conversas desabilitadas:",erro);
                                        setDesabilitadasData({loading: false, searched: true, chats: []});
                                    }
                                }
                            }}>
                            Desabilitadas
                        </button>
                    </div>
                </div>
                
                {/* <!-- Lista das conversas --> */}
                {sessaoAtual==='Todas'? (
                    <div className="flex-1 overflow-y-auto custom-scrollbar" id="conversations-list">
                        {contadorFavoritos>0 && <div className="px-4 py-2 text-xs text-gray-500 uppercase font-semibold">Favoritadas: {contadorFavoritos}</div>}
                        {dadosConversas.filter(con=>con.favoritada).length>0 && dadosConversas.filter(con=>con.favoritada).map(conversa=>(
                            <div className={`flex items-center p-3 hover:bg-gray-700 cursor-pointer transition-colors mb-1 rounded-lg ${conversaAtualId===conversa.id?'bg-gray-700':''}`} key={conversa.id} onClick={()=>{setConversaAtualId(conversa.id)}}>

                                <div className="flex items-center w-full">
                                    <div className="relative w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold shrink-0">
                                        <img
                                            src={conversa.avatar === '/assets/imgs/genPfp.png' ? genPfp : conversa.avatar}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                        {conversa.statusRemetente === 'Online' && <span className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full`}></span>}
                                    </div>
                                    <div className="ml-3 flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-semibold truncate">{conversa.nome}</h3>
                                            <span className="text-xs text-gray-400 ml-2">{conversa.hora}</span>
                                        </div>
                                        {(() => {
                                            const arquivo = validarSeEhArquivo(conversa.ultimaMensagem);

                                            if (!arquivo.eh) return <p className="text-sm text-gray-400 truncate">{conversa.ultimaMensagem}</p>;

                                            if (arquivo.tipo === 'raw') return <p className="text-sm text-gray-400 truncate">{arquivo.nomeExib}</p>;

                                            return <p className="text-sm text-gray-400 truncate">Foto📷</p>;
                                        })()}
                                    </div>
                                    {conversa.naoLidas > 0 && (
                                        <div className="ml-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {conversa.naoLidas}
                                        </div>
                                    )}
                                    <button className={`ml-2 botao-favorito p-1 rounded-full cursor-pointer ${conversa.favoritada ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-300'}`} 
                                        data-id={conversa.id} onClick={async()=>{
                                            console.log("Favoritar clicado");
                                            if(conversa.favoritada){
                                                setDadosConversas(prev=>{
                                                    return prev.map(con=>
                                                        con.id === conversa.id ?
                                                        {...con, favoritada: false} 
                                                        : con
                                                    )
                                                })
                                                const valorAtual = contadorFavoritos;
                                                setContadorFavoritos(valorAtual - 1);
                                                try {
                                                    await axiosWe.delete(`/favoritos/chat/${conversa.id}`);
                                                } catch (erro) {
                                                    console.error(erro);
                                                    setDadosConversas(prev=>{
                                                        return prev.map(con=>
                                                            con.id === conversa.id ?
                                                            {...con, favoritada: true} 
                                                            : con
                                                        )
                                                    })
                                                    setContadorFavoritos(valorAtual);
                                                }
                                            } else {
                                                if (contadorFavoritos >= 3) {
                                                    mostrarErroTopo('Você só pode favoritar no máximo 3 conversas.');
                                                    return;
                                                }
                                                setDadosConversas(prev=>{
                                                    return prev.map(con=>
                                                        con.id === conversa.id ?
                                                        {...con, favoritada: true} 
                                                        : con
                                                    )
                                                })
                                                const valorAtual = contadorFavoritos;
                                                setContadorFavoritos(valorAtual + 1);
                                                try {
                                                    await axiosWe.post('/favoritos/chat', {chatId: conversa.id});
                                                } catch (erro) {
                                                    console.error(erro);
                                                    setDadosConversas(prev=>{
                                                        return prev.map(con=>
                                                            con.id === conversa.id ?
                                                            {...con, favoritada: false} 
                                                            : con
                                                        )
                                                    })
                                                    setContadorFavoritos(valorAtual);
                                                }
                                            }
                                        }}>
                                        <FontAwesomeIcon icon={conversa.favoritada?faStar : faStarRegular} />
                                    </button>
                                </div>

                            </div>
                        ))}
                        {/* <!-- As conversas serão inseridas aqui via JavaScript (O código todo está lá) --> */}
                        <div className="px-4 py-2 text-xs text-gray-500 uppercase font-semibold">Conversas</div>
                        {dadosConversas.filter(con=>!con.favoritada).length>0 && dadosConversas.filter(con=>!con.favoritada).map(conversa=>(
                            <div className={`flex items-center p-3 hover:bg-gray-700 cursor-pointer transition-colors mb-1 rounded-lg ${conversaAtualId===conversa.id?'bg-gray-700':''}`} key={conversa.id} onClick={()=>{setConversaAtualId(conversa.id)}}>

                                <div className="flex items-center w-full">
                                    <div className="relative w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold shrink-0">
                                        <img
                                            src={conversa.avatar === '/assets/imgs/genPfp.png' ? genPfp : conversa.avatar}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                        {conversa.statusRemetente === 'Online' && <span className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full`}></span>}
                                    </div>
                                    <div className="ml-3 flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-semibold truncate">{conversa.nome}</h3>
                                            <span className="text-xs text-gray-400 ml-2">{conversa.hora}</span>
                                        </div>
                                        {(() => {
                                            const arquivo = validarSeEhArquivo(conversa.ultimaMensagem);

                                            if (!arquivo.eh) return <p className="text-sm text-gray-400 truncate">{conversa.ultimaMensagem}</p>;

                                            if (arquivo.tipo === 'raw') return <p className="text-sm text-gray-400 truncate">{arquivo.nomeExib}</p>;

                                            return <p className="text-sm text-gray-400 truncate">Foto📷</p>;
                                        })()}
                                    </div>
                                    {conversa.naoLidas > 0 && (
                                        <div className="ml-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {conversa.naoLidas}
                                        </div>
                                    )}
                                    <button className={`ml-2 botao-favorito p-1 rounded-full cursor-pointer ${conversa.favoritada ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-300'}`} 
                                        data-id={conversa.id} onClick={async()=>{
                                            if(conversa.favoritada){
                                                setDadosConversas(prev=>{
                                                    return prev.map(con=>
                                                        con.id === conversa.id ?
                                                        {...con, favoritada: false} 
                                                        : con
                                                    )
                                                })
                                                const valorAtual = contadorFavoritos;
                                                setContadorFavoritos(valorAtual - 1);
                                                try {
                                                    await axiosWe.delete(`/favoritos/chat/${conversa.id}`);
                                                } catch (erro) {
                                                    console.error(erro);
                                                    setDadosConversas(prev=>{
                                                        return prev.map(con=>
                                                            con.id === conversa.id ?
                                                            {...con, favoritada: true} 
                                                            : con
                                                        )
                                                    })
                                                    setContadorFavoritos(valorAtual);
                                                }
                                            } else {
                                                if (contadorFavoritos >= 3) {
                                                    mostrarErroTopo('Você só pode favoritar no máximo 3 conversas.');
                                                    return;
                                                }
                                                setDadosConversas(prev=>{
                                                    return prev.map(con=>
                                                        con.id === conversa.id ?
                                                        {...con, favoritada: true} 
                                                        : con
                                                    )
                                                })
                                                const valorAtual = contadorFavoritos;
                                                setContadorFavoritos(valorAtual + 1);
                                                try {
                                                    await axiosWe.post('/favoritos/chat', {chatId: conversa.id});
                                                } catch (erro) {
                                                    console.error(erro);
                                                    setDadosConversas(prev=>{
                                                        return prev.map(con=>
                                                            con.id === conversa.id ?
                                                            {...con, favoritada: false} 
                                                            : con
                                                        )
                                                    });
                                                    setContadorFavoritos(valorAtual);
                                                }
                                            }
                                        }}>
                                        <FontAwesomeIcon icon={conversa.favoritada?faStar : faStarRegular} />
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                ):(
                    <>
                    {desabilitadasData.loading ? (
                        <div className="carregando-empresas flex justify-center items-center py-12">
                            <div className="flex flex-col items-center gap-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-twitch-purple"></div>
                                <p className="text-gray-400">Carregando Conversas Desabilitadas...</p>
                            </div>
                        </div>
                    ):(
                        <>
                        <div className="px-4 py-2 text-xs text-gray-500 uppercase font-semibold">Desabilitadas</div>
                        {desabilitadasData.chats.length>0 ? desabilitadasData.chats.map(conversa=>(
                            <div className={`flex items-center p-3 hover:bg-gray-700 cursor-pointer transition-colors mb-1 rounded-lg ${conversaAtualId===conversa.id?'bg-gray-700':''}`} key={conversa.id} onClick={()=>{setConversaAtualId(conversa.id)}}>

                                <div className="flex items-center w-full">
                                    <div className="relative w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold shrink-0">
                                        <img
                                            src={conversa.avatar === '/assets/imgs/genPfp.png' ? genPfp : conversa.avatar}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                    <div className="ml-3 flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-semibold truncate">{conversa.nome}</h3>
                                            <span className="text-xs text-gray-400 ml-2">{conversa.hora}</span>
                                        </div>
                                        {(() => {
                                            const arquivo = validarSeEhArquivo(conversa.ultimaMensagem);

                                            if (!arquivo.eh) return <p className="text-sm text-gray-400 truncate">{conversa.ultimaMensagem}</p>;

                                            if (arquivo.tipo === 'raw') return <p className="text-sm text-gray-400 truncate">{arquivo.nomeExib}</p>;

                                            return <p className="text-sm text-gray-400 truncate">Foto📷</p>;
                                        })()}
                                    </div>
                                </div>

                            </div>
                        )):(
                            <div className="flex flex-col items-center gap-4 mt-2">
                                <i className="bx bx-search text-4xl text-gray-400"></i>
                                <p className="text-gray-500 text-center">Você não possui nenhuma conversa desabilitada.</p>
                            </div>
                        )}
                        </>
                    )}
                    
                    </>
                )}
                

            </aside>
        
            {/* // <!-- início do chat principal (1 pra 1)--> */}
            <main className="flex-1 flex flex-col h-full bg-dark-900 relative">
                {/* <!-- Tela de boas-vindas --> */}
                {conversaAtualId==='0' && (
                    <div id="TelaBoasVindas"
                        className="absolute inset-0 flex flex-col items-center justify-center text-center bg-dark-900 z-10">


                        <h1 className="text-3xl font-bold text-primary-500 mb-4">Bem-vindo ao Chat</h1>
                        <p className="text-lg text-gray-400 mb-8 max-w-xl">
                            Conecte-se facilmente com empresas e candidatos em um só lugar.
                            Nosso chat foi desenvolvido para facilitar o processo de contratação,
                            garantindo uma comunicação rápida, clara e segura.
                        </p>

                        <div className="download-card bg-dark-800 rounded-xl p-6 mb-8 text-left w-96 shadow-md">
                            <h2 className="text-xl font-semibold text-white mb-4 justify-center text-center items-center">
                                <FontAwesomeIcon icon={faBriefcase} className='mr-3 text-primary-500' />
                                Como funciona
                            </h2>
                            <p className="text-gray-400 mb-4">
                                <span id="conversaText">• Converse diretamente com empresas ou candidatos.</span> <br/>
                                • Organize oportunidades e contatos em um só espaço. <br/>
                                • Todas as mensagens são protegidas com criptografia.
                            </p>

                        </div>

                        <p className="text-sm text-gray-500">
                            <FontAwesomeIcon icon={faLock} className='mr-1' />
                            Suas conversas no EmpreGo são privadas e seguras.
                        </p>

                    </div>
                )}
                

                {/* <!-- estrutura do header da conversa (1 pra 1)--> */}
                {(conversaAtualId!=='0' && sessaoAtual==='Todas') && (()=>{
                    const conversa = dadosConversas.find(con=>con.id===conversaAtualId);
                    return (
                        <>
                            <header className="bg-dark-800 px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div
                                        className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                                        <img src={conversa.avatar==='/assets/imgs/genPfp.png'?genPfp:conversa.avatar} id="current-chat-avatar"
                                            className="w-full h-full object-cover rounded-full"/>
                                    </div>
                                    <div>
                                        <h2 className="font-semibold" id="current-chat-name">{conversa.nome}</h2>
                                        <p className="text-sm text-gray-400 flex items-center">
                                            <span className={conversa.statusRemetente === 'Online' ? "w-2 h-2 rounded-full bg-green-500 mr-2" : "w-2 h-2 rounded-full bg-red-500 mr-2"} id="bolaStatus"></span>
                                            <span id="current-chat-status">{conversa.statusRemetente}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button id="search-toggle" className="p-2 rounded-full w-12 h-12 hover:bg-gray-700 transition-colors"
                                        aria-label="Pesquisar conversa">
                                        <FontAwesomeIcon icon={faSearch} />
                                    </button>

                                    <div className="relative">
                                        <button id="menu-toggle" className="p-2 rounded-full hover:bg-gray-700 w-12 h-12 transition-colors cursor-pointer"
                                            aria-label="Menu" onClick={()=>{setMostrarMenu((p)=>!p)}}>
                                            <FontAwesomeIcon icon={faEllipsisVertical} />
                                        </button>
                                        {/* <!-- Dropdown Menu --> */}
                                        {mostrarMenu && 
                                            <div id="menu-dropdown"
                                                className="absolute right-0 mt-2 w-64 bg-dark-800 shadow-lg rounded-lg overflow-hidden border border-gray-700 z-50">
                                                <ul className="py-2 text-sm text-gray-200">
                                                    <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center space-x-2">
                                                        <FontAwesomeIcon icon={faCircleInfo} className='text-gray-400' />
                                                        <span>Dados do contato</span>
                                                    </li>
                                                    <li id="fecharBtn"
                                                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center space-x-2"
                                                        onClick={()=>{
                                                            setMostrarMenu(false);
                                                            setConversaAtualId('0');
                                                        }} >
                                                        <FontAwesomeIcon icon={faXmark} className='text-gray-400'/>
                                                        <span>Fechar conversa</span>
                                                    </li>

                                                    <hr className="border-gray-700 my-2"/>

                                                    <li id="bloquearBtn"
                                                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center space-x-2"
                                                        onClick={()=>{
                                                            setMostrarMenu(false);
                                                            const txt = conversa.bloqueadoStatus && conversa.bloqueador === usuario.tipo ? 'Desbloquear' : 'Bloquear';
                                                            const val = !conversa.bloqueadoStatus ? 'true' : 'false';
                                                            setModalAction({status: true, mensagem: `Tem certeza que deseja ${txt} ${conversa.nome}?`, action: 'block', valor: val, chatId: conversa.id})
                                                        }}>
                                                        <FontAwesomeIcon icon={faBan} className='text-gray-400' />
                                                        <span id="bloquearTxt">{conversa.bloqueadoStatus && conversa.bloqueador === usuario.tipo ? 'Desbloquear' : 'Bloquear'}</span>
                                                    </li>
                                                    <li id="limparBtn"
                                                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center space-x-2"
                                                        onClick={()=>{
                                                            setMostrarMenu(false);
                                                            if(conversa.mensagens.length===0) return mostrarErroTopo(`A conversa com ${conversa.nome} já está vazia!`);
                                                            setModalAction({status: true, mensagem: `Tem certeza que deseja limpar a conversa com ${conversa.nome} (Esta ação ocultará para você todas as mensagens desta conversa)?`, action: 'clean', valor: '', chatId: conversa.id})
                                                        }}>
                                                        <FontAwesomeIcon icon={faTrash} className='text-gray-400' />
                                                        <span id="limparTxt">Limpar conversa</span>
                                                    </li>
                                                    <li id="apagarBtn"
                                                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center space-x-2"
                                                        onClick={()=>{
                                                            setMostrarMenu(false);
                                                            setModalAction({status: true, mensagem: `Tem certeza que deseja apagar a conversa com ${conversa.nome} (Esta ação é irreversível e apagará completamente esta conversa)?`, action: 'remove', valor: '', chatId: conversa.id})
                                                        }}>
                                                        <FontAwesomeIcon icon={faTrashCan} className='text-gray-400' />
                                                        <span id="apagarTxt">Apagar conversa</span>
                                                    </li>
                                                    <li id="salvarBtn"
                                                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center space-x-2" aria-label="Salvar conversa"
                                                        onClick={()=>{
                                                            setMostrarMenu(false);
                                                            setModalAction({status: true, mensagem: `Tem certeza que deseja salvar a conversa com ${conversa.nome}?`, action: 'save', valor: '', chatId: conversa.id})
                                                        }}>
                                                        <FontAwesomeIcon icon={faFloppyDisk} className='text-gray-400' />
                                                        <span id="apagarTxt">Salvar conversa</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        }
                                    </div>

                                </div>
                            </header>

                            {/* <!-- Barra de pesquisa (inicialmente oculta, (melhorar o estilo!!!!)) --> */}
                            <div id="search-bar" className="bg-dark-800 p-3 border-b border-gray-800 hidden">
                                <div className="flex items-center">
                                    <input type="text" id="search-input" placeholder="Pesquisar nesta conversa..."
                                        className="flex-1 bg-dark-700 text-white rounded-lg px-4 py-2 outline-none"/>
                                    <button id="search-prev" className="ml-2 p-2 rounded-full hover:bg-gray-700 transition-colors"
                                        aria-label="Resultado anterior">
                                        <FontAwesomeIcon icon={faChevronUp} />
                                    </button>
                                    <button id="search-next" className="ml-2 p-2 rounded-full hover:bg-gray-700 transition-colors"
                                        aria-label="Próximo resultado">
                                        <FontAwesomeIcon icon={faChevronDown} />
                                    </button>
                                    <button id="search-close" className="ml-2 p-2 rounded-full hover:bg-gray-700 transition-colors"
                                        aria-label="Fechar pesquisa">
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                            </div>

                            {/* <!-- Área das mensagens --> */}
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-dark-900 bg-opacity-50" id="messages-container" ref={messagesContainerRef}>
                                {/* <!-- As mensagens serão inseridas aqui via JavaScript --> */}
                                {conversa.mensagens.map(msg=>{
                                        const ehUsuario = msg.remetente === 'usuario';
                                        const ehArquivo = validarSeEhArquivo(msg.texto);
                                        return (
                                            <div className={`mb-2 flex ${ehUsuario ? 'justify-end' : 'justify-start'} fade-in`} key={msg.id}>
                                                {(()=>{
                                                    if(!ehArquivo.eh){
                                                        return (
                                                            <div className={`max-w-md px-3 py-2 text-sm shadow-md
                                                                ${ehUsuario
                                                                    ? 'bg-purple-900 text-white rounded-2xl rounded-br-sm'
                                                                    : 'bg-gray-700 text-gray-100 rounded-2xl rounded-bl-sm'}`}>
                                                                
                                                                <div className="flex justify-between items-start gap-3">
                                                                    <p className="whitespace-pre-wrap break-words flex-1 min-w-0">
                                                                        {transformarLinksEmAnchors(msg.texto)}
                                                                    </p>
                                                                    <span className="text-[10px] opacity-80 flex-shrink-0 mt-0.5">{msg.hora}</span>
                                                                </div>
                                                            </div>
                                                        )
                                                    } else if(ehArquivo.tipo==='raw'){                                                        
                                                        return (
                                                            <div className={`mensagem-arquivo ${ehUsuario ?
                                                                'bg-purple-900' :
                                                                'bg-dark-800' 
                                                            } rounded-xl p-3 flex items-center justify-between w-100 shadow-md my-2`}>
                                                                <div className="flex items-center gap-3">
                                                                    {(()=>{
                                                                        switch(ehArquivo.extensao) {
                                                                            case('PDF'):
                                                                                return (<img src={PDFpng} className="w-10 h-10 object-contain"></img>);
                                                                            case('DOCX'):
                                                                            case('DOC'):
                                                                                return (<img src={DOCXICONROXO} className="w-10 h-10 object-contain"></img>);
                                                                            case('TXT'):
                                                                                return (<img src={TXTAZUL} className="w-10 h-10 object-contain"></img>);
                                                                            case('ZIP'):
                                                                            case('RAR'):
                                                                            default:
                                                                                return (<FontAwesomeIcon icon={faFileZipper} className='text-yellow-400 text-3xl' />)
                                                                        }
                                                                    })()}
                                                                    <div>
                                                                        <p className="text-white font-semibold text-sm truncate">{ehArquivo.nomeExib}</p>
                                                                        <p className="text-gray-400 text-xs">{`${ehArquivo.extensao} • ${ehArquivo.size}`}</p>
                                                                    </div>
                                                                </div>
                                                                <button className="download-btn text-gray-300 hover:text-white">
                                                                    <FontAwesomeIcon icon={faDownload} className='text-lg' onClick={()=>{fileDownload(ehArquivo.url, 'raw')}}/>
                                                                </button>
                                                            </div>
                                                        )
                                                    } else if (ehArquivo.tipo==='img') {
                                                        return (
                                                            <div className="mensagem-imagem bg-dark-800 rounded-xl p-2 w-64 shadow-md my-2">
                                                                <img src={ehArquivo.url} alt="Imagem enviada"
                                                                    className="rounded-lg w-full h-auto object-cover mb-2"/>
                                                                <div className="flex justify-between text-xs text-gray-400">
                                                                    <span>{`Foto • ${ehArquivo.size}`}</span>
                                                                    <button className="text-primary-500 hover:underline skibibaixar cursor-pointer" onClick={()=>{fileDownload(ehArquivo.url, 'img')}}>Baixar</button>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })()}
                                            </div>
                                        )
                                    }
                                )}
                            </div>

                            {/* <!-- Menu de anexos --> */}
                            {mostrarAttachmentMenu && (
                                <div id="attachment-menu"
                                    className="absolute bottom-24 left-4 bg-[#1e1e1e] rounded-xl p-2 w-56 z-50 shadow-lg">
                                    <ul className="space-y-2">
                                        <li id="btn-documento" className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a2a] cursor-pointer"
                                        onClick={()=>inputDocRef.current.click()}>
                                            <FontAwesomeIcon icon={faFile} className='text-purple-400 text-xl'/>
                                            <span className="text-gray-200">Documento</span>
                                        </li>
                                        <li id="btn-fotos" className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a2a] cursor-pointer"
                                        onClick={()=>inputImgRef.current.click()}>
                                            <FontAwesomeIcon icon={faImage} className='text-blue-400 text-xl'/>
                                            <span className="text-gray-200">Fotos</span>
                                        </li>
                                        <li id="btn-camera" className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a2a] cursor-pointer"
                                        onClick={()=>inputCamRef.current.click()}>
                                            <FontAwesomeIcon icon={faCamera} className='text-pink-500 text-xl'/>
                                            <span className="text-gray-200">Câmera</span>
                                        </li>
                                    </ul>
                                </div>
                            )}

                            <input type="file" id="input-documento" className="hidden" accept=".pdf,.doc,.docx,.txt,.zip" ref={inputDocRef} onChange={(e)=>handleFileInput(e, 'documento')}/>
                            <input type="file" id="input-fotos" className="hidden" accept=".jpg,.jpeg,.png,.webp" ref={inputImgRef} onChange={(e)=>handleFileInput(e, 'foto')}/>
                            <input type="file" id="input-camera" accept="image/*" capture="environment" className="hidden" ref={inputCamRef} onChange={(e)=>handleFileInput(e, 'camera')}/>

                            {/* <!-- Modal de confirmação --> */}
                            {mostrarModalConfirmacao && (
                                <div id="modalConfirmacao"
                                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                                    <div className="bg-dark-800 rounded-xl p-6 w-full max-w-md">
                                        <h3 className="text-lg font-semibold mb-4 text-center"><strong>Enviar arquivo?</strong></h3>
                                        <div className="bg-dark-700 rounded-xl p-3 mb-4 flex items-start">
                                            <span 
                                                id="modal-file-name" 
                                                className="text-white font-semibold break-words flex-1 line-clamp-2"
                                            >
                                                {fileData.name}
                                            </span>
                                            <span id="modal-file-size" className="text-gray-400 ml-2 flex-shrink-0">
                                                {fileData.size}
                                            </span>
                                        </div>
                                        <div className="flex justify-center space-x-3">
                                            <button id="btnCancelarEnvio" onClick={()=>{
                                                inputDocRef.current.value = '';
                                                inputImgRef.current.value = '';
                                                inputCamRef.current.value = '';
                                                setFileData({name: '', size: '', tipo: ''});
                                                setMostrarModalConfirmacao(false);
                                            }}
                                                className="px-4 py-2 rounded-lg bg-dark-600 text-gray-300 hover:bg-dark-500 transition-colors cursor-pointer">Cancelar</button>
                                            <button id="btnConfirmarEnvio" onClick={async(e)=>{
                                                e.currentTarget.disabled = true;
                                                const fileDataTipo = fileData.tipo;
                                                const arquivoSelecionado = fileDataTipo === 'documento' ? inputDocRef.current.files[0] : fileDataTipo === 'foto' ? inputImgRef.current.files[0] : inputCamRef.current.files[0];
                                                const formData = new FormData();
                                                formData.append('file', arquivoSelecionado);
                                                formData.append('autor', usuario.nome);
                                                formData.append('chat', conversa.id);
                                                formData.append('de', usuario.tipo);
                                                try {
                                                    const response = await axiosWe.post(`/mensagens/upload${fileData.tipo!=='documento'?'/image':''}`, formData);
                                                    const {newFile, idFile} = response.data;
                                                    const agora = new Date();
                                                    const hora = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;

                                                    socket.emit('sendMessage', {
                                                        author: usuario.nome,
                                                        message: newFile,
                                                        room: conversaAtualId,
                                                        type: usuario.tipo,
                                                        idMsg: idFile
                                                    });
                                                    
                                                    setDadosConversas(prev=>{
                                                        const conversasAtualizadas = prev.map(con=>
                                                            con.id === conversa.id ?
                                                            {...con, mensagens: [...con.mensagens, {texto: newFile, remetente: 'usuario', hora: hora, id: idFile} as Mensagem],
                                                            ultimaMensagem: newFile, hora: hora, contadorMensagens: con.contadorMensagens + 1}
                                                            : con
                                                        );
                                                        const conversaAtual = conversasAtualizadas.find(con=>con.id === conversa.id);
                                                        const outrasConversas = conversasAtualizadas.filter(con => con.id !== conversa.id);

                                                        return [conversaAtual, ...outrasConversas]
                                                    });
                                                } catch (erro) {
                                                    console.error(erro);
                                                } finally {
                                                    setFileData({name: '', size: '', tipo: ''});
                                                    setMostrarModalConfirmacao(false);
                                                    e.currentTarget.disabled = false;
                                                }
                                            }}
                                                className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors cursor-pointer">Confirmar</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-dark-800 p-4 border-t border-gray-800">
                                <div className="flex items-end space-x-3">
                                    <button id="attach-button" className="p-2 rounded-full w-12 h-12 hover:bg-gray-700 transition-colors mb-2 cursor-pointer"
                                        aria-label="Anexar arquivo" onClick={()=>setMostrarAttachmentMenu(a=>!a)}>
                                        <FontAwesomeIcon icon={faPaperclip} className='text-gray-400'/>
                                    </button>


                                    <div className="flex-1 bg-dark-700 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary-500">
                                        <textarea id="message-input"
                                            className="w-full bg-transparent border-0 outline-none text-white message-input py-2"
                                            placeholder="Digite sua mensagem..." rows={1} maxLength={500} onClick={()=>{setMostrarAttachmentMenu(false);setMostrarMenu(false)}}
                                            ref={textareaRef} value={mensagemEnvio} onChange={(e)=>handleChangeMsg(e)} onKeyDown={(e)=>{
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();

                                                    if (mensagemEnvio.trim() === "") return;

                                                    btnEnviarRef.current.click();
                                                }
                                            }}
                                        >
                                        </textarea>
                                    </div>

                                    <button id="send-button" ref={btnEnviarRef}
                                        className="bg-primary-500 text-white p-3 w-12 h-12 rounded-full hover:bg-primary-600 transition-colors mb-2 cursor-pointer"
                                        aria-label="Enviar mensagem" onClick={async()=>{
                                            setMostrarAttachmentMenu(false);
                                            setMostrarMenu(false);
                                            setMensagemEnvio("");
                                            if (mensagemEnvio.trim() !== "") {
                                                if(conversa.bloqueadoStatus) {
                                                    textareaRef.current.style.height = "auto";
                                                    mostrarErroTopo('Você não pode mandar mensagem para este chat, pois ele está bloqueado.')
                                                    return;
                                                }
                                                const msge = await enviarMensagem(mensagemEnvio, usuario, conversaAtualId);
                                                const el = textareaRef.current;
                                                if (el) el.style.height = "auto";
                                                if(msge.success){
                                                    setDadosConversas(prev=>{
                                                        const conversasAtualizadas = prev.map(con=>
                                                            con.id === conversa.id ?
                                                            {...con, mensagens: [...con.mensagens, {texto: msge.texto, remetente: 'usuario', hora: msge.hora, id: msge.id} as Mensagem],
                                                            ultimaMensagem: msge.texto, hora: msge.hora, contadorMensagens: con.contadorMensagens + 1}
                                                            : con
                                                        );
                                                        const conversaAtual = conversasAtualizadas.find(con=>con.id === conversa.id);
                                                        const outrasConversas = conversasAtualizadas.filter(con => con.id !== conversa.id);

                                                        return [conversaAtual, ...outrasConversas]
                                                    });
                                                    const container = messagesContainerRef.current;
                                                    setTimeout(() => {
                                                        container.scrollTop = container.scrollHeight;
                                                    }, 50);
                                                }
                                            }
                                        }}>
                                        <FontAwesomeIcon icon={faPaperPlane} className='text-gray-400'/>
                                    </button>
                                </div>

                                <div className="flex justify-between items-center mt-2 text-xs text-gray-500 px-2">
                                    <span>Pressione Enter para enviar</span>
                                    <span id="message-counter">{conversa.contadorMensagens} mensagens nesta conversa</span>
                                </div>
                            </div>

                            
                        </>
                    )}
                )()}

                {(conversaAtualId!=='0' && sessaoAtual==='Desabilitadas') && (()=>{
                    const conversa = desabilitadasData.chats.find(con=>con.id===conversaAtualId);
                    return (
                        <>
                            <header className="bg-dark-800 px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div
                                        className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                                        <img src={conversa.avatar==='/assets/imgs/genPfp.png'?genPfp:conversa.avatar} id="current-chat-avatar"
                                            className="w-full h-full object-cover rounded-full"/>
                                    </div>
                                    <div>
                                        <h2 className="font-semibold" id="current-chat-name">{conversa.nome}</h2>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    
                                    <button className="p-2 rounded-full w-12 h-12 hover:bg-gray-700 transition-colors"
                                        aria-label="Deletar completamente a conversa" onClick={()=>setModalAction({status: true, mensagem: `Tem certeza que deseja deletar completamente a conversa com ${conversa.nome}?`, action: 'delete', valor: '', chatId: conversa.id})}>
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </button>
                                    <button id="search-toggle" className="p-2 rounded-full w-12 h-12 hover:bg-gray-700 transition-colors"
                                        aria-label="Pesquisar na conversa">
                                        <FontAwesomeIcon icon={faSearch} />
                                    </button>
                                    

                                    <div className="relative">
                                        <button id="menu-toggle" className="p-2 rounded-full hover:bg-gray-700 w-12 h-12 transition-colors cursor-pointer"
                                            aria-label="Menu" onClick={()=>{setMostrarMenu((p)=>!p)}}>
                                            <FontAwesomeIcon icon={faEllipsisVertical} />
                                        </button>
                                        {/* <!-- Dropdown Menu --> */}
                                        {mostrarMenu && 
                                            <div id="menu-dropdown"
                                                className="absolute right-0 mt-2 w-64 bg-dark-800 shadow-lg rounded-lg overflow-hidden border border-gray-700 z-50">
                                                <ul className="py-2 text-sm text-gray-200">
                                                    <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center space-x-2">
                                                        <FontAwesomeIcon icon={faCircleInfo} className='text-gray-400' />
                                                        <span>Dados do contato</span>
                                                    </li>
                                                    <li id="fecharBtn"
                                                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center space-x-2"
                                                        onClick={()=>{
                                                            setMostrarMenu(false);
                                                            setConversaAtualId('0');
                                                        }} >
                                                        <FontAwesomeIcon icon={faXmark} className='text-gray-400'/>
                                                        <span>Fechar conversa</span>
                                                    </li>

                                                    <hr className="border-gray-700 my-2"/>

                                                    <li id="apagarBtn"
                                                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center space-x-2"
                                                        onClick={()=>{
                                                            setMostrarMenu(false);
                                                            setModalAction({status: true, mensagem: `Tem certeza que deseja deletar completamente a conversa com ${conversa.nome}?`, action: 'delete', valor: '', chatId: conversa.id});
                                                        }}>
                                                        <FontAwesomeIcon icon={faTrashCan} className='text-gray-400' />
                                                        <span id="apagarTxt">Deletar conversa</span>
                                                    </li>
                                                    <li id="salvarBtn"
                                                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center space-x-2" aria-label="Salvar conversa"
                                                        onClick={()=>{
                                                            setMostrarMenu(false);
                                                            setModalAction({status: true, mensagem: `Tem certeza que deseja salvar a conversa com ${conversa.nome}?`, action: 'save', valor: '', chatId: conversa.id})
                                                        }}>
                                                        <FontAwesomeIcon icon={faFloppyDisk} className='text-gray-400' />
                                                        <span id="apagarTxt">Salvar conversa</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        }
                                    </div>

                                </div>
                            </header>

                            {/* <!-- Barra de pesquisa (inicialmente oculta, (melhorar o estilo!!!!)) --> */}
                            <div id="search-bar" className="bg-dark-800 p-3 border-b border-gray-800 hidden">
                                <div className="flex items-center">
                                    <input type="text" id="search-input" placeholder="Pesquisar nesta conversa..."
                                        className="flex-1 bg-dark-700 text-white rounded-lg px-4 py-2 outline-none"/>
                                    <button id="search-prev" className="ml-2 p-2 rounded-full hover:bg-gray-700 transition-colors"
                                        aria-label="Resultado anterior">
                                        <FontAwesomeIcon icon={faChevronUp} />
                                    </button>
                                    <button id="search-next" className="ml-2 p-2 rounded-full hover:bg-gray-700 transition-colors"
                                        aria-label="Próximo resultado">
                                        <FontAwesomeIcon icon={faChevronDown} />
                                    </button>
                                    <button id="search-close" className="ml-2 p-2 rounded-full hover:bg-gray-700 transition-colors"
                                        aria-label="Fechar pesquisa">
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                            </div>

                            {/* <!-- Área das mensagens --> */}
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-dark-900 bg-opacity-50" id="messages-container" ref={messagesContainerRef}>
                                {/* <!-- As mensagens serão inseridas aqui via JavaScript --> */}
                                {conversa.mensagens.map(msg=>{
                                        const ehUsuario = msg.remetente === 'usuario';
                                        const ehArquivo = validarSeEhArquivo(msg.texto);
                                        return (
                                            <div className={`mb-2 flex ${ehUsuario ? 'justify-end' : 'justify-start'} fade-in`} key={msg.id}>
                                                {(()=>{
                                                    if(!ehArquivo.eh){
                                                        return (
                                                            <div className={`max-w-md px-3 py-2 text-sm shadow-md
                                                                ${ehUsuario
                                                                    ? 'bg-purple-900 text-white rounded-2xl rounded-br-sm'
                                                                    : 'bg-gray-700 text-gray-100 rounded-2xl rounded-bl-sm'}`}>
                                                                
                                                                <div className="flex justify-between items-start gap-3">
                                                                    <p className="whitespace-pre-wrap break-words flex-1 min-w-0">
                                                                        {transformarLinksEmAnchors(msg.texto)}
                                                                    </p>
                                                                    <span className="text-[10px] opacity-80 flex-shrink-0 mt-0.5">{msg.hora}</span>
                                                                </div>
                                                            </div>
                                                        )
                                                    } else if(ehArquivo.tipo==='raw'){                                                        
                                                        return (
                                                            <div className={`mensagem-arquivo ${ehUsuario ?
                                                                'bg-purple-900' :
                                                                'bg-dark-800' 
                                                            } rounded-xl p-3 flex items-center justify-between w-100 shadow-md my-2`}>
                                                                <div className="flex items-center gap-3">
                                                                    {(()=>{
                                                                        switch(ehArquivo.extensao) {
                                                                            case('PDF'):
                                                                                return (<img src={PDFpng} className="w-10 h-10 object-contain"></img>);
                                                                            case('DOCX'):
                                                                            case('DOC'):
                                                                                return (<img src={DOCXICONROXO} className="w-10 h-10 object-contain"></img>);
                                                                            case('TXT'):
                                                                                return (<img src={TXTAZUL} className="w-10 h-10 object-contain"></img>);
                                                                            case('ZIP'):
                                                                            case('RAR'):
                                                                            default:
                                                                                return (<FontAwesomeIcon icon={faFileZipper} className='text-yellow-400 text-3xl' />)
                                                                        }
                                                                    })()}
                                                                    <div>
                                                                        <p className="text-white font-semibold text-sm truncate">{ehArquivo.nomeExib}</p>
                                                                        <p className="text-gray-400 text-xs">{`${ehArquivo.extensao} • ${ehArquivo.size}`}</p>
                                                                    </div>
                                                                </div>
                                                                <button className="download-btn text-gray-300 hover:text-white">
                                                                    <FontAwesomeIcon icon={faDownload} className='text-lg' onClick={()=>{fileDownload(ehArquivo.url, 'raw')}}/>
                                                                </button>
                                                            </div>
                                                        )
                                                    } else if (ehArquivo.tipo==='img') {
                                                        return (
                                                            <div className="mensagem-imagem bg-dark-800 rounded-xl p-2 w-64 shadow-md my-2">
                                                                <img src={ehArquivo.url} alt="Imagem enviada"
                                                                    className="rounded-lg w-full h-auto object-cover mb-2"/>
                                                                <div className="flex justify-between text-xs text-gray-400">
                                                                    <span>{`Foto • ${ehArquivo.size}`}</span>
                                                                    <button className="text-primary-500 hover:underline skibibaixar cursor-pointer" onClick={()=>{fileDownload(ehArquivo.url, 'img')}}>Baixar</button>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })()}
                                            </div>
                                        )
                                    }
                                )}
                            </div>
                            <div className="bg-dark-800 p-4 border-t border-gray-800 pointer-events-none opacity-60">
                                <div className="flex items-end space-x-3">
                                    <button id="attach-button" className="p-2 rounded-full w-12 h-12 hover:bg-gray-700 transition-colors mb-2 cursor-pointer"
                                        aria-label="Anexar arquivo">
                                        <FontAwesomeIcon icon={faPaperclip} className='text-gray-400'/>
                                    </button>


                                    <div className="flex-1 bg-dark-700 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary-500">
                                        <textarea id="message-input"
                                            className="w-full bg-transparent border-0 outline-none text-white message-input py-2"
                                            placeholder="Digite sua mensagem..." rows={1} maxLength={500} >
                                        </textarea>
                                    </div>

                                    <button id="send-button" ref={btnEnviarRef}
                                        className="bg-primary-500 text-white p-3 w-12 h-12 rounded-full hover:bg-primary-600 transition-colors mb-2 cursor-pointer"
                                        aria-label="Enviar mensagem" >
                                        <FontAwesomeIcon icon={faPaperPlane} className='text-gray-400'/>
                                    </button>
                                </div>

                                <div className="flex justify-between items-center mt-2 text-xs text-gray-500 px-2">
                                    <span>Pressione Enter para enviar</span>
                                    <span id="message-counter">{conversa.contadorMensagens} mensagens nesta conversa</span>
                                </div>
                            </div>
                        </>
                    )}
                )()}

                {modalAction.status && (
                    <div id="modalDelete" className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                        <div id="modalDelete-content" className="bg-dark-800 rounded-xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4 text-center"><strong>{modalAction.mensagem}</strong></h3>
                            {(modalAction.action === 'remove' || modalAction.action === 'save') && (
                                <div className="space-y-4 mb-6">
                                    {/* Checkbox para receber email */}
                                    {modalAction.action === 'remove' && (
                                        <div className="flex items-center space-x-3 p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors">
                                            <input 
                                                id='receberEmail'
                                                type="checkbox" 
                                                ref={receberEmailRef}
                                                checked={receberEmail} 
                                                onChange={(e) => setReceberEmail(e.target.checked)}
                                                className="w-4 h-4 text-blue-600 bg-dark-600 border-dark-500 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                                            />
                                            <label 
                                                htmlFor="receberEmail" 
                                                className="text-gray-300 cursor-pointer select-none"
                                            >
                                                Receber uma cópia do chat por email?
                                            </label>
                                        </div>
                                    )}
                                    

                                    {/* Input para quantidade de mensagens */}
                                    {((modalAction.action === 'remove' && receberEmail) || modalAction.action === 'save') && (
                                        <div className="p-3 bg-dark-700 rounded-lg space-y-2 animate-fadeIn">
                                            <label 
                                                htmlFor="quantidadeReceber" 
                                                className="block text-sm font-medium text-gray-300"
                                            >
                                                Quantidade máxima de mensagens para receber
                                            </label>
                                            <input 
                                                id='quantidadeReceber'
                                                type="number" 
                                                value={quantidadeReceber} 
                                                onChange={(e) => {
                                                    const val = e.target.valueAsNumber;

                                                    if (val < 1) return setQuantidadeReceber(1);
                                                    if (val > 1000) return setQuantidadeReceber(1000);

                                                    setQuantidadeReceber(val);
                                                }}
                                                min={1}
                                                max={1000}
                                                className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Ex: 50"
                                            />
                                            <p className="text-xs text-gray-400">
                                                Digite quantas mensagens você deseja receber por email
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="flex justify-center space-x-3">
                                <button id="btnCancelarDel" className="px-4 py-2 rounded-lg bg-dark-600 text-gray-300 hover:bg-dark-500 transition-colors cursor-pointer" onClick={()=>{
                                    setModalAction({status: false, mensagem: '', action: '', valor: '', chatId: ''});
                                    setQuantidadeReceber(100);
                                    setReceberEmail(true);
                                }}>Cancelar</button>
                                <button id="btnConfirmarDel" className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer" onClick={async()=>{
                                    const {action, valor, chatId} = modalAction;
                                    setModalAction({status: false, mensagem: '', action: '', valor: '', chatId: ''})
                                    const actionRes = await modalActions(action, chatId, valor, {receberEmail, quantidadeReceber});
                                    if(actionRes.success) {
                                        switch (action) {
                                            case 'block': {
                                                setDadosConversas(prev=> {
                                                    return prev.map((con)=>
                                                        con.id === chatId ?
                                                        {...con, bloqueadoStatus: valor==='true'?true:false, bloqueador: valor==='true'?usuario.tipo:con.bloqueador, statusRemetente: valor==='true'?'Offline':con.statusRemetente}
                                                        : con
                                                    )
                                                });
                                                if(valor==='true') socket.emit('leaveRoom', chatId);
                                                else socket.emit('joinChat', chatId, callback=>{
                                                    if(callback.status==='error') {
                                                        mostrarErroTopo(callback.message);
                                                    }
                                                });
                                                break;
                                            }
                                            case 'clean': {
                                                setDadosConversas(prev=> {
                                                    return prev.map((con)=>
                                                        con.id === chatId ?
                                                        {...con, mensagens: [], ultimaMensagem: '', hora: ''}
                                                        : con
                                                    )
                                                });
                                                break;
                                            }
                                            case 'remove': {
                                                const chatToRemove = dadosConversas.find(c=>c.id===chatId);
                                                if(receberEmail) mostrarSucessoTopo('Email com as mensagens da conversa enviado com sucesso!');
                                                if(chatToRemove?.favoritada) setContadorFavoritos(e=>e-1);
                                                setDadosConversas(prev=> {
                                                    return prev.filter((con)=>
                                                        con.id !== chatId 
                                                    )
                                                });
                                                setConversaAtualId('0');
                                                const recipientType = usuario.tipo === 'candidato' ? 'empresa' : 'candidato';
                                                sendNotification({id: chatToRemove.remetente, type: recipientType}, {
                                                    conversa: {
                                                        action: 'deletar',
                                                        id: chatId
                                                    }
                                                });
                                                socket.emit('leaveRoom', chatId);
                                                break;
                                            }               
                                            case 'save': {
                                                mostrarSucessoTopo('Email com as mensagens da conversa enviado com sucesso!');
                                                break;
                                            }
                                            case 'delete': {
                                                setDesabilitadasData(prev=> 
                                                    ({
                                                        ...prev, 
                                                        chats: prev.chats.filter((con)=> con.id !== chatId)
                                                    })
                                                );
                                                setConversaAtualId('0');
                                                break;
                                            }
                                            default:
                                                break;
                                        }
                                    }
                                }}>Confirmar</button>
                            </div>
                        </div>
                    </div>
                )}
                {novaSolicitacao && (
                    <div id="modalSolicitacaoConversa"
                        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                        <div className="bg-dark-800 rounded-xl p-6 w-full max-w-md mx-4">
                            <h3 className="text-lg font-semibold mb-4 text-center">
                                <strong>Solicitar conversa?</strong>
                            </h3>
                            
                            {/* Informações da empresa */}
                            <div className="bg-dark-700 rounded-xl p-4 mb-4 flex items-center">
                                <img 
                                    src={novaSolicitacao.imagem === '/assets/imgs/genPfp.png' ? genPfp : novaSolicitacao.imagem} 
                                    alt={novaSolicitacao.nome}
                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                    onError={(e) => {
                                        e.currentTarget.src = genPfp;
                                    }}
                                />
                                <div className="flex-1">
                                    <span className="text-white font-semibold block">
                                        {novaSolicitacao.nome}
                                    </span>
                                    <span className="text-gray-400 text-sm block">
                                        {novaSolicitacao.tipo}
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-300 text-center mb-6 text-sm">
                                Deseja enviar uma solicitação de conversa para {novaSolicitacao.tipo==='Empresa'?'esta empresa':'este candidato'}?
                            </p>

                            <div className="flex justify-center space-x-3">
                                <button 
                                    id="btnCancelarSolicitacao"
                                    className="px-4 py-2 rounded-lg bg-dark-600 text-gray-300 hover:bg-dark-500 transition-colors cursor-pointer"
                                    onClick={() => setNovaSolicitacao(null)}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    id="btnConfirmarSolicitacao" disabled={enviandoSolicitacao}
                                    className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors cursor-pointer"
                                    onClick={async() => {
                                        setEnviandoSolicitacao(true);
                                        const enviou = await enviarSolicitacaoConversa(usuario.tipo, novaSolicitacao.id);
                                        if(enviou.foi) {
                                            mostrarSucessoTopo('Solicitação de conversa enviada com sucesso!');
                                            const recipientType = novaSolicitacao.tipo.toLowerCase() as 'empresa'|'candidato';
                                            sendNotification({id: novaSolicitacao.id, type: recipientType}, {
                                                solicitacao_conversa: {
                                                    action: 'criar',
                                                    id: enviou.solicitacaoId!
                                                }
                                            })
                                            setSolicitacoes([{
                                                id: enviou.solicitacaoId!,
                                                usuario_id: novaSolicitacao.id,
                                                usuario_nome: novaSolicitacao.nome,
                                                usuario_foto: novaSolicitacao.imagem,
                                                tipo: 'enviada',
                                                status: 'pendente'
                                            }, ...solicitacoes]);
                                        };
                                        setNovaSolicitacao(null);
                                    }}
                                >
                                    {enviandoSolicitacao?'Enviando...':'Confirmar'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}