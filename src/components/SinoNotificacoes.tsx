import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCheck, faCheckDouble } from "@fortawesome/free-solid-svg-icons";

export default function SinoNotificacoes() {
    const [open, setOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState('left-0');
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            titulo: "Bem-vindo ao sistema!",
            tipo: "Sistema",
            texto: "Sua conta foi criada com sucesso. Explore as funcionalidades disponíveis.",
            lida: false
        },
        {
            id: 2,
            titulo: "Novo seguidor",
            tipo: "Novo seguidor",
            texto: "Maria Silva começou a seguir seu perfil.",
            lida: false
        },
        {
            id: 3,
            titulo: "Solicitação de conversa",
            tipo: "Solicitação de Conversa",
            texto: "João Santos quer iniciar uma conversa com você.",
            lida: true
        },
        {
            id: 4,
            titulo: "Atualização do sistema",
            tipo: "Sistema",
            texto: "Nova versão 2.1 disponível com melhorias de performance.",
            lida: false
        },
        {
            id: 5,
            titulo: "Novo seguidor",
            tipo: "Novo seguidor",
            texto: "Ana Costa começou a seguir seu perfil.",
            lida: true
        },
        {
            id: 6,
            titulo: "Lembrete importante",
            tipo: "Sistema",
            texto: "Complete seu perfil para melhorar sua experiência.",
            lida: false
        }
    ]);
    
    const unreadCount = notifications.filter((n) => !n.lida).length;

    const marcarComoLida = (id) => {
        setNotifications(notifications.map(notificacao => 
            notificacao.id === id ? { ...notificacao, lida: true } : notificacao
        ));
    };

    const marcarTodasComoLidas = () => {
        setNotifications(notifications.map(notificacao => 
            ({ ...notificacao, lida: true })
        ));
    };

    // Calcular posição do dropdown
    useEffect(() => {
        if (open && buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const spaceOnRight = window.innerWidth - buttonRect.right;
            const spaceOnLeft = buttonRect.left;
            
            if (spaceOnRight >= 350 || spaceOnRight > spaceOnLeft) { // Ajustado para 350px
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
        <div className="relative inline-block" ref={dropdownRef}>
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

                    {notifications.length === 0 ? (
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
                                {/* Botão para marcar como lida - agora dentro dos limites */}
                                {!n.lida && (
                                    <button
                                        onClick={() => marcarComoLida(n.id)}
                                        className="absolute top-2 right-2 bg-green-600 hover:bg-green-500 text-white w-6 h-6 flex items-center justify-center rounded-full transition-all opacity-100 group-hover:opacity-100 shadow-lg"
                                        title="Marcar como lida"
                                    >
                                        <FontAwesomeIcon icon={faCheck} className="text-xs w-3 h-3" />
                                    </button>
                                )}
                                
                                <h5 className="text-white font-medium pr-10 break-words">{n.titulo}</h5>
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
                        ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}