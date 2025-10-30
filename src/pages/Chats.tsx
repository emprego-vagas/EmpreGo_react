import { useNavigate } from 'react-router-dom';
import { DadosUsuario, fileDownload } from '../utils/globalFunctions';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUsers, faBell, faStar, faGear, faReply, faBriefcase, faLock, faSearch, faEllipsisVertical, faCircleInfo, faHeart, faXmark, faBan, faTrash, faTrashCan, faChevronUp, faChevronDown, faTimes, faFile, faImage, faCamera, faPaperclip, faPaperPlane, faFileZipper, faDownload } from '@fortawesome/free-solid-svg-icons';
import {faStar as faStarRegular} from '@fortawesome/free-regular-svg-icons';

import '../css/chat.css';
import genPfp from '../assets/imgs/genPfp.png';
import PDFpng from '../assets/imgs/PDF.png';
import DOCXICONROXO from '../assets/imgs/DOCXICONROXO.png'
import TXTAZUL from '../assets/imgs/TXTAZUL.png'
import { carregarConversasBack, transformarLinksEmAnchors, validarSeEhArquivo } from '../ts/chatsFunctions';

export default function Chats(){
    const navigate = useNavigate();
    const [usuario] = useState(DadosUsuario.getUsuario(true));
    if(!usuario) {
        setTimeout(()=>{
            navigate('/')
        }, 3000)
    };

    const [dadosConversas, setDadosConversas] = useState([]);
    const [estadoConversas, setEstadoConversas] = useState({conversaAtualId: "0", conversas: [], contadorMensagens: 0, contadorFavoritos: 0, resultadosPesquisa: 0, indicePesquisaAtual: -1});

    useEffect(()=>{
        if(!usuario) return;
        const params = new URLSearchParams(window.location.search)
        const id = params.get('id');
        
        async function carregarConversas() {
            try {
                const conversasInit = await carregarConversasBack(usuario, id);
                setDadosConversas(conversasInit.conversas);
                setEstadoConversas({...estadoConversas, conversaAtualId: conversasInit.conversaAtual, contadorFavoritos: (() => {
                    return conversasInit.conversas.reduce((acc, dado) => {
                        if (dado.favoritada) acc++;
                        return acc;
                    }, 0)
                })()
                });
                // setConversasFavoritadas(conversasInit.conversas.filter(con=>con.favoritada));
                // setConversasNaoFavoritadas(conversasInit.conversas.filter(con=>!con.favoritada));
            } catch (erro) {
                console.error("Erro ao carregar conversas:", erro);
            }
        }
        carregarConversas();
        
    }, [usuario]);

    return (
        <div className="bg-dark-900 text-white h-screen flex overflow-hidden">
            <aside className="w-16 bg-dark-800 border-r border-gray-800 flex flex-col h-full items-center py-4">
                {/* <!-- Foto de perfil do usuário --> */}
                <a href="/perfil/candidato" className="relative mb-8">
                    <img src={usuario.foto||genPfp} alt="Foto de perfil do usuário" id="FotoDePerfil"
                        className="w-8 h-8 object-cover rounded-full cursor-pointer" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800"
                        id="bolaSemMexer"></div>
                </a>

                {/* <!-- Ícones de navegação --> */}
                <nav className="flex-1 flex flex-col space-y-8 items-center">
                    <a href="/" className="sidebar-icon text-gray-400 hover:text-white transition-colors">
                        <FontAwesomeIcon icon={faHouse} className='text-xl' />
                    </a>
                    <a href="#" className="sidebar-icon text-gray-400 hover:text-white transition-colors">
                        <FontAwesomeIcon icon={faUsers} className='text-xl' />
                    </a>
                    <a href="#" className="sidebar-icon text-gray-400 hover:text-white transition-colors">
                        <FontAwesomeIcon icon={faBell} className='text-xl' />
                        <span className="notification-badge">3</span>
                    </a>
                    <a href="/perfil/candidato" className="sidebar-icon text-gray-400 hover:text-white transition-colors">
                        <FontAwesomeIcon icon={faStar} className='text-xl' />
                    </a>
                </nav>

                {/* <!-- Configurações e voltar --> */}
                <div className="mt-auto flex flex-col space-y-6 items-center">
                    <a href="#" className="sidebar-icon text-gray-400 hover:text-white transition-colors">
                        <FontAwesomeIcon icon={faGear} className='text-xl' />
                    </a>
                    <a href="/" className="sidebar-icon text-gray-400 hover:text-white transition-colors">
                        <FontAwesomeIcon icon={faReply} className='text-xl' />
                    </a>
                </div>
            </aside>

            {/* // <!-- conversas (1 pra N) --> */}
            <aside className="w-80 bg-dark-800 border-r border-gray-800 flex flex-col h-full">
                <div className="p-4 border-b border-gray-800">
                    <h2 className="text-lg font-semibold">Conversas</h2>
                </div>

                {/* <!-- Lista das conversas --> */}
                <div className="flex-1 overflow-y-auto custom-scrollbar" id="conversations-list">
                    {dadosConversas.filter(con=>con.favoritada).length>0 && dadosConversas.filter(con=>con.favoritada).map(conversa=>(
                        <div className="flex items-center p-3 hover:bg-gray-700 cursor-pointer transition-colors mb-1 rounded-lg" key={conversa.id} onClick={()=>{setEstadoConversas({...estadoConversas, conversaAtualId: conversa.id})}}>

                            <div className="flex items-center w-full">
                                <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold shrink-0">
                                    <img src={conversa.avatar} className="w-full h-full object-cover rounded-full"/>
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
                                <button className={`ml-2 botao-favorito p-1 rounded-full ${conversa.favoritada ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-300'}`} 
                                    data-id={conversa.id}>
                                    <FontAwesomeIcon icon={conversa.favoritada?faStar : faStarRegular} />
                                </button>
                            </div>

                        </div>
                    ))}
                    {/* <!-- As conversas serão inseridas aqui via JavaScript (O código todo está lá) --> */}
                    <div className="px-4 py-2 text-xs text-gray-500 uppercase font-semibold">Conversas</div>
                    {dadosConversas.filter(con=>!con.favoritada).length>0 && dadosConversas.filter(con=>!con.favoritada).map(conversa=>(
                        <div className="flex items-center p-3 hover:bg-gray-700 cursor-pointer transition-colors mb-1 rounded-lg" key={conversa.id} onClick={()=>{setEstadoConversas({...estadoConversas, conversaAtualId: conversa.id})}}>

                            <div className="flex items-center w-full">
                                <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold shrink-0">
                                    <img src={conversa.avatar} className="w-full h-full object-cover rounded-full"/>
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
                                <button className={`ml-2 botao-favorito p-1 rounded-full ${conversa.favoritada ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-300'}`} 
                                    data-id={conversa.id}>
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
                {(estadoConversas.conversaAtualId==='0') && (
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
                {(estadoConversas.conversaAtualId!=='0') && (()=>{
                    const conversa = dadosConversas.find(con=>con.id===estadoConversas.conversaAtualId);
                    return (
                        <>
                            <header className="bg-dark-800 px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div
                                        className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                                        <img src={conversa.avatar||genPfp} id="current-chat-avatar"
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
                                        <button id="menu-toggle" className="p-2 rounded-full hover:bg-gray-700 w-12 h-12 transition-colors"
                                            aria-label="Menu">
                                            <FontAwesomeIcon icon={faEllipsisVertical} />
                                        </button>

                                        {/* <!-- Dropdown Menu --> */}
                                        <div id="menu-dropdown"
                                            className="hidden absolute right-0 mt-2 w-64 bg-dark-800 shadow-lg rounded-lg overflow-hidden border border-gray-700 z-50">
                                            <ul className="py-2 text-sm text-gray-200">
                                                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center space-x-2">
                                                    <FontAwesomeIcon icon={faCircleInfo} className='text-gray-400' />
                                                    <span>Dados do contato</span>
                                                </li>
                                                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center space-x-2">
                                                    <FontAwesomeIcon icon={faHeart} className='text-gray-400' />
                                                    <span>Adicionar aos favoritos</span>
                                                </li>
                                                <li id="fecharBtn"
                                                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center space-x-2">
                                                    <FontAwesomeIcon icon={faXmark} className='text-gray-400' />
                                                    <span>Fechar conversa</span>
                                                </li>

                                                <hr className="border-gray-700 my-2"/>

                                                <li id="bloquearBtn"
                                                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center space-x-2">
                                                    <FontAwesomeIcon icon={faBan} className='text-gray-400' />
                                                    <span id="bloquearTxt">{conversa.bloqueadoStatus && conversa.bloqueador === usuario.tipo ? 'Desbloquear' : 'Bloquear'}</span>
                                                </li>
                                                <li id="limparBtn"
                                                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center space-x-2">
                                                    <FontAwesomeIcon icon={faTrash} className='text-gray-400' />
                                                    <span id="limparTxt">Limpar conversa</span>
                                                </li>
                                                <li id="apagarBtn"
                                                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center space-x-2">
                                                    <FontAwesomeIcon icon={faTrashCan} className='text-gray-400' />
                                                    <span id="apagarTxt">Apagar conversa</span>
                                                </li>
                                            </ul>
                                        </div>
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
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-dark-900 bg-opacity-50" id="messages-container">
                                {/* <!-- As mensagens serão inseridas aqui via JavaScript --> */}
                                {conversa.mensagens.map(msg=>{
                                        const ehUsuario = msg.remetente === 'usuario';
                                        const ehArquivo = validarSeEhArquivo(msg.texto);
                                        console.log(msg)
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
                            <div id="attachment-menu"
                                className="hidden absolute bottom-24 left-4 bg-[#1e1e1e] rounded-xl p-2 w-56 z-50 shadow-lg">
                                <ul className="space-y-2">
                                    <li id="btn-documento" className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a2a] cursor-pointer">
                                        <FontAwesomeIcon icon={faFile} className='text-purple-400 text-xl'/>
                                        <span className="text-gray-200">Documento</span>
                                    </li>
                                    <li id="btn-fotos" className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a2a] cursor-pointer">
                                        <FontAwesomeIcon icon={faImage} className='text-blue-400 text-xl'/>
                                        <span className="text-gray-200">Fotos</span>
                                    </li>
                                    <li id="btn-camera" className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a2a] cursor-pointer">
                                        <FontAwesomeIcon icon={faCamera} className='text-pink-500 text-xl'/>
                                        <span className="text-gray-200">Câmera</span>
                                    </li>
                                </ul>
                            </div>

                            <input type="file" id="input-documento" className="hidden" accept=".pdf,.doc,.docx,.txt,.zip" />
                            <input type="file" id="input-fotos" className="hidden" accept=".jpg,.jpeg,.png,.webp" />
                            <input type="file" id="input-camera" accept="image/*" capture="environment" className="hidden"/>

                            {/* <!-- Modal de confirmação --> */}
                            <div id="modalConfirmacao"
                                className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 hidden">
                                <div className="bg-dark-800 rounded-xl p-6 w-full max-w-md">
                                    <h3 className="text-lg font-semibold mb-4 text-center"><strong>Enviar arquivo?</strong></h3>
                                    <div className="bg-dark-700 rounded-xl p-3 mb-4 flex items-center">
                                        <span id="modal-file-name" className="text-white font-semibold"></span>
                                        <span id="modal-file-size" className="text-gray-400 ml-2"></span>
                                    </div>
                                    <div className="flex justify-center space-x-3">
                                        <button id="btnCancelarEnvio"
                                            className="px-4 py-2 rounded-lg bg-dark-600 text-gray-300 hover:bg-dark-500 transition-colors">Cancelar</button>
                                        <button id="btnConfirmarEnvio"
                                            className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors">Confirmar</button>
                                    </div>
                                </div>
                            </div>


                            <div className="bg-dark-800 p-4 border-t border-gray-800">
                                <div className="flex items-end space-x-3">
                                    <button id="attach-button" className="p-2 rounded-full w-12 h-12 hover:bg-gray-700 transition-colors mb-2"
                                        aria-label="Anexar arquivo">
                                        <FontAwesomeIcon icon={faPaperclip} className='text-gray-400'/>
                                    </button>


                                    <div className="flex-1 bg-dark-700 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary-500">
                                        <textarea id="message-input"
                                            className="w-full bg-transparent border-0 outline-none text-white message-input py-2"
                                            placeholder="Digite sua mensagem..." rows={1} maxLength={500}></textarea>
                                    </div>

                                    <button id="send-button"
                                        className="bg-primary-500 text-white p-3 w-12 h-12 rounded-full hover:bg-primary-600 transition-colors mb-2"
                                        aria-label="Enviar mensagem">
                                        <FontAwesomeIcon icon={faPaperPlane} className='text-gray-400'/>
                                    </button>
                                </div>

                                <div className="flex justify-between items-center mt-2 text-xs text-gray-500 px-2">
                                    <span>Pressione Enter para enviar</span>
                                    <span id="message-counter">0 mensagens nesta conversa</span>
                                </div>
                            </div>
                        </>
                    )}
                )()}
            </main>
        </div>

    )
};