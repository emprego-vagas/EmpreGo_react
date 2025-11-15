import { Link, useNavigate } from 'react-router-dom';
import { DadosUsuario, fileDownload, mostrarErroTopo } from '../utils/globalFunctions';
import { useEffect, useRef, useState, type ChangeEvent, type JSX } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUsers, faBell, faStar, faGear, faReply, faBriefcase, faLock, faSearch, faEllipsisVertical, faCircleInfo, faXmark, faBan, faTrash, faTrashCan, faChevronUp, faChevronDown, faTimes, faFile, faImage, faCamera, faPaperclip, faPaperPlane, faFileZipper, faDownload } from '@fortawesome/free-solid-svg-icons';
import {faStar as faStarRegular} from '@fortawesome/free-regular-svg-icons';

import '../css/chat.css';
import genPfp from '../assets/imgs/genPfp.png';
import PDFpng from '../assets/imgs/PDF.png';
import DOCXICONROXO from '../assets/imgs/DOCXICONROXO.png'
import TXTAZUL from '../assets/imgs/TXTAZUL.png'
import { carregarConversasBack, enviarMensagem, modalActions, validarSeEhArquivo } from '../ts/chatsFunctions';
import axiosWe from '../utils/axiosInstance';
import socket from '../utils/socketsConnection';
import Loader from '../components/Loader';
import type { Conversa, Mensagem, MessageSocket, UserStatusSocket } from "../ts/chatsFunctions";

export default function Chats2() {
    const navigate = useNavigate();
    const [usuario] = useState(DadosUsuario.getUsuario(true));
    if(!usuario) {
        setTimeout(()=>{
            navigate('/')
        }, 3000)
    };
    const [carregando, setCarregando] = useState(false);

    useEffect(()=>{
        if(!usuario) return;
        const params = new URLSearchParams(window.location.search)
        const id = params.get('id');
        
        async function carregarConversas() {
            try {
                const conversasInit = await carregarConversasBack(usuario, id);
                setDadosConversas(conversasInit.conversas);
                setConversaAtualId(conversasInit.conversaAtual);
                setContadorFavoritos(conversasInit.conversas.reduce(
                    (acc, dado) => {
                        if (dado.favoritada) acc++;
                        return acc;
                    }, 0)
                );
                setCarregando(true);
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
                            bloqueadoStatus: false,
                            bloqueador: null
                        }
                        : conversa
                );
            });
        }

        socket.on('receivedMessage', receivedMessage);
        socket.on('userStatus', userStatus);

        return () => {
            clearInterval(intervalId);
            socket.off('receivedMessage', receivedMessage);
            socket.off('userStatus', userStatus);
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
    const [mensagemEnvio, setMensagemEnvio] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const btnEnviarRef = useRef<HTMLButtonElement | null>(null);

    const conversaAtualIdRef = useRef(conversaAtualId);
    useEffect(() => {
        conversaAtualIdRef.current = conversaAtualId;
    }, [conversaAtualId]);

    useEffect(() => {
        if (conversaAtualId !== '0' && messagesContainerRef.current) {
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
            setMostrarMenu(false)
            setMostrarAttachmentMenu(false);
        }
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

    if(!carregando) return (<Loader />);

    return (
        <div className="bg-dark-900 text-white h-screen flex overflow-hidden">
            <aside className="w-16 bg-dark-800 border-r border-gray-800 flex flex-col h-full items-center py-4">
                {/* <!-- Foto de perfil do usuário --> */}
                <Link to={`/perfil/${usuario.tipo}`} className="relative mb-8">
                    <img src={usuario.foto==='/assets/imgs/genPfp.png'?genPfp:usuario.foto} alt="Foto de perfil do usuário" id="FotoDePerfil"
                        className="w-8 h-8 object-cover rounded-full cursor-pointer" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800"
                        id="bolaSemMexer"></div>
                </Link>

                {/* <!-- Ícones de navegação --> */}
                <nav className="flex-1 flex flex-col space-y-8 items-center">
                    <Link to="/" className="sidebar-icon text-gray-400 hover:text-white transition-colors">
                        <FontAwesomeIcon icon={faHouse} className='text-xl' />
                    </Link>
                    <Link to="#" className="sidebar-icon text-gray-400 hover:text-white transition-colors">
                        <FontAwesomeIcon icon={faUsers} className='text-xl' />
                    </Link>
                    <Link to="#" className="sidebar-icon text-gray-400 hover:text-white transition-colors">
                        <FontAwesomeIcon icon={faBell} className='text-xl' />
                        <span className="notification-badge">3</span>
                    </Link>
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
                </div>

                {/* <!-- Lista das conversas --> */}
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
                                        if(conversa.favoritada){
                                            setDadosConversas(prev=>{
                                                return prev.map(con=>
                                                    con.id === conversa.id ?
                                                    {...con, favoritada: false} 
                                                    : con
                                                )
                                            })
                                            setContadorFavoritos(e=>e-1);
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
                                                setContadorFavoritos(e=>e+1);
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
                                            setContadorFavoritos(e=>e+1);
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
                                                setContadorFavoritos(e=>e-1);
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
                                            setContadorFavoritos(e=>e-1);
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
                                                setContadorFavoritos(e=>e+1);
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
                                            setContadorFavoritos(e=>e+1);
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
                                                setContadorFavoritos(e=>e+1);
                                            }
                                        }
                                    }}>
                                    <FontAwesomeIcon icon={conversa.favoritada?faStar : faStarRegular} />
                                </button>
                            </div>

                        </div>
                    ))}
                </div>

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
                {(conversaAtualId!=='0') && (()=>{
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
                                                            <div className={`max-w-md px-3 py-2 text-sm shadow-md flex items-end gap-2
                                                                ${ehUsuario
                                                                        ? 'bg-purple-900 text-white rounded-2xl rounded-br-sm'
                                                                        : 'bg-gray-700 text-gray-100 rounded-2xl rounded-bl-sm'}`}>
                                                                
                                                                <p className="whitespace-pre-wrap wrap-break-word">{transformarLinksEmAnchors(msg.texto)}</p>
                                                                <span className="text-[10px] opacity-80">{msg.hora}</span>
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
                                            ref={textareaRef} value={mensagemEnvio} onChange={(e)=>handleChangeMsg(e)} onKeyDown={async(e)=>{
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

                            {modalAction.status && (
                                <div id="modalDelete" className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                                    <div id="modalDelete-content" className="bg-dark-800 rounded-xl p-6 w-full max-w-md">
                                        <h3 className="text-lg font-semibold mb-4 text-center"><strong>{modalAction.mensagem}</strong></h3>
                                        <div className="flex justify-center space-x-3">
                                            <button id="btnCancelarDel" className="px-4 py-2 rounded-lg bg-dark-600 text-gray-300 hover:bg-dark-500 transition-colors cursor-pointer" onClick={()=>setModalAction({status: false, mensagem: '', action: '', valor: '', chatId: ''})}>Cancelar</button>
                                            <button id="btnConfirmarDel" className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer" onClick={async()=>{
                                                const {action, valor, chatId} = modalAction;
                                                setModalAction({status: false, mensagem: '', action: '', valor: '', chatId: ''})
                                                const actionRes = await modalActions(action, chatId, valor);
                                                if(actionRes.success) {
                                                    switch (action) {
                                                        case 'block': {
                                                            setDadosConversas(prev=> {
                                                                return prev.map((con)=>
                                                                    con.id === chatId ?
                                                                    {...con, bloqueadoStatus: valor==='true'?true:false, bloqueador: valor==='true'?usuario.tipo:con.bloqueador}
                                                                    : con
                                                                )
                                                            });
                                                            if(valor==='true') socket.emit('leaveRoom', chatId);
                                                            else socket.emit('joinRoom', chatId);
                                                            break;
                                                        }
                                                        case 'clean': {
                                                            setDadosConversas(prev=> {
                                                                return prev.map((con)=>
                                                                    con.id === chatId ?
                                                                    {...con, mensagens: [], ultimaMensagem: ''}
                                                                    : con
                                                                )
                                                            });
                                                            break;
                                                        }
                                                        case 'remove': {
                                                            setDadosConversas(prev=> {
                                                                return prev.filter((con)=>
                                                                    con.id !== chatId 
                                                                )
                                                            });
                                                            setConversaAtualId('0');
                                                            socket.emit('leaveRoom', chatId);
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
                        </>
                    )}
                )()}
            </main>
        </div>
    )
}