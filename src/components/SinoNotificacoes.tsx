import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCheck, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { carregarNotificacoes, lerNotificacao, lerTodasNotificacoes, type NotificationEG } from "../ts/sinoNotificacoesFunctions";
import genPfp from '../assets/imgs/genPfp.png';
import { useNavigate } from "react-router-dom";
import { DadosUsuario } from "../utils/globalFunctions";
import socket from "../utils/socketsConnection";

export default function SinoNotificacoes() {
    const navigate = useNavigate();
    const [usuario] = useState(DadosUsuario.getUsuario(true));
    if(!usuario) {
        setTimeout(()=>{
            navigate('/')
        }, 3000)
    };

    useEffect(()=>{
        if(!usuario) return;
        async function carregarAsNotificacoes(){
            try {
                const notificacoes = await carregarNotificacoes();
                
                setNotifications(notificacoes);

                socket.emit('joinNotifications', usuario);
            } catch (erro) {
                console.error("Erro ao carregar as notificações:", erro);
            }
        }
        carregarAsNotificacoes();

        function receivedNotification(newNotification: NotificationEG){
            console.log('Recebi Notificação Componente')
            setNotifications(prev=>[newNotification, ...prev]);
        }

        socket.on('receivedNotification', receivedNotification);

        return ()=> {
            socket.off('receivedNotification', receivedNotification);
        }
    }, [usuario])

    const [open, setOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState('left-0');
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);
    const [notifications, setNotifications] = useState<NotificationEG[]|null>(null);
    
    const unreadCount = notifications?.filter((n) => !n.lida).length;

    const marcarComoLida = async(id) => {
        setNotifications(notifications?.map(notificacao => 
            notificacao.id === id ? { ...notificacao, lida: true } : notificacao
        ));
        await lerNotificacao(id);
    };

    const marcarTodasComoLidas = async() => {
        setNotifications(notifications?.map(notificacao => 
            ({ ...notificacao, lida: true })
        ));
        await lerTodasNotificacoes();
    };

    // Calcular posição do dropdown
    useEffect(() => {
        if (open && buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const spaceOnRight = window.innerWidth - buttonRect.right;
            const spaceOnLeft = buttonRect.left;
            
            if (spaceOnRight >= 350 || spaceOnRight > spaceOnLeft) {
                setDropdownPosition('left-0');
            } else {
                setDropdownPosition('right-0');
            }
        }
    }, [open]);

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block" ref={dropdownRef} title="Notificações">
            <button
                ref={buttonRef}
                onClick={() => setOpen(!open)}
                className="sidebar-icon text-gray-400 hover:text-white transition-colors relative"
            >
                <FontAwesomeIcon icon={faBell} className="text-xl" />
                {unreadCount > 0 && (
                <span className="notification-badge absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                    {unreadCount}
                </span>
                )}
            </button>

            {open && (
                <div className={`absolute ${dropdownPosition} mt-3 w-[350px] bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden`}>
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="text-white font-semibold">Notificações</h4>
                        {unreadCount > 0 && (
                            <button
                                onClick={marcarTodasComoLidas}
                                className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                                title="Marcar todas como lidas"
                            >
                                <FontAwesomeIcon icon={faCheckDouble} className="text-xs" />
                                Marcar todas
                            </button>
                        )}
                    </div>

                    {notifications && notifications.length === 0 ? (
                        <p className="text-gray-400 text-sm">Nenhuma notificação</p>
                    ) : (
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`p-3 rounded-lg border relative group ${
                                    n.lida
                                    ? "border-gray-700 bg-gray-800/50"
                                    : "border-blue-600 bg-blue-600/10"
                                }`}
                            >
                                <div className="flex gap-3">
                                    {/* Container da imagem */}
                                    <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
                                        <img 
                                            src={n.imagem==='/assets/imgs/genPfp.png'?genPfp:n.imagem} 
                                            alt=""
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // Fallback para ícone se a imagem não carregar
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                    
                                    {/* Conteúdo da notificação */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h5 className="text-white font-medium break-words pr-8">{n.titulo}</h5>
                                            
                                            {/* Botão para marcar como lida */}
                                            {!n.lida && (
                                                <button
                                                    onClick={() => marcarComoLida(n.id)}
                                                    className="flex-shrink-0 bg-green-600 hover:bg-green-500 text-white w-6 h-6 flex items-center justify-center rounded-full transition-all opacity-100 group-hover:opacity-100 shadow-lg ml-2"
                                                    title="Marcar como lida"
                                                >
                                                    <FontAwesomeIcon icon={faCheck} className="text-xs w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                        
                                        <p className="text-gray-300 text-sm mt-1 break-words">{n.texto}</p>
                                        
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-xs text-gray-400">{n.tipo}</span>
                                            <div className="flex items-center gap-2">
                                                {n.lida ? (
                                                    <span className="text-xs text-green-400 flex items-center gap-1">
                                                        <FontAwesomeIcon icon={faCheck} className="text-xs" />
                                                        Lida
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-blue-400">Não lida</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}