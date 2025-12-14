import { Link, useNavigate } from "react-router-dom";
import { DadosUsuario, logout } from "../utils/globalFunctions";
import ThemeTogleConfig from "./ThemeTogleConfig";
import genPfp from '../assets/imgs/genPfp.png';
import BIGSlogo from '../assets/imgs/BIGSlogo.png';
import { useEffect, useRef, useState } from "react";
import SinoNotificacoes from "./SinoNotificacoes";

export default function HeaderProfiles(){
    const navigate = useNavigate();
    const [usuario] = useState(DadosUsuario.getUsuario(true));
    if(!usuario) {
        setTimeout(()=>{
            navigate('/')
        }, 3000)
    };

    const [mostrarDropDown, setMostrarDropDown] = useState(false);
    const profileToggleRef = useRef(null);
    const profileDropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                profileDropdownRef.current &&
                !profileDropdownRef.current.contains(e.target) &&
                profileToggleRef.current &&
                !profileToggleRef.current.contains(e.target)
            ) {
                setMostrarDropDown(false);
            }
        }

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <header
        className=" top-0 left-0 right-0 bg-white dark:bg-dark-600 dark:shadow-md z-50 ">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div id="logo" className="flex items-center">
            <Link to="/" target="_self" className="flex items-center">
                <img src={BIGSlogo} alt="Logo" id="logoimg" className="h-10 mr-2"/>
                <span id="nomedosite" className="text-xl font-bold text-gray-900 dark:text-white">
                Empre<span className="text-professional-accent">Go</span>
                </span>
            </Link>
            </div>
            <nav className="links flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">Início</Link>
            <Link className="headerlink text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors" to="/chats"
                target="_self">Chats</Link>
            <Link className="headerlink text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors" to="#"
                target="_self">Fórum</Link>

            <SinoNotificacoes />

            <div className="header-profile flex items-center gap-3 bg-transparent rounded-full cursor-pointer w-10 h-10 border-2 border-primary-500"
                id="profile-toggle" ref={profileToggleRef}>
                <div
                className="user-avatar bg-twitch-purple text-white font-bold text-base w-9 h-9 rounded-full flex justify-center items-center select-none shadow-x1">
                <img src={usuario.foto==='/assets/imgs/genPfp.png'?genPfp:usuario.foto} alt="Foto de perfil do usuário" id="FotoDePerfil"
                    className="w-full h-full object-cover rounded-full" onClick={()=>setMostrarDropDown(e=>!e)} />
                </div>

                <div className={`profile-dropdown absolute top-16 right-4 bg-white text-professional-dark dark:bg-twitch-gray dark:text-white w-60 rounded-lg shadow-xl flex flex-col p-2 z-50 ${mostrarDropDown?'':'hidden'}`}
                    id="profile-dropdown" ref={profileDropdownRef}>
                    <div className="profile-info p-3">
                        <p className="profile-name font-bold m-0">{usuario.nome}</p>
                        <Link to={`/perfil/${usuario.tipo}`} className="text-twitch-purple text-sm no-underline">Acessar perfil</Link>
                    </div>
                    <hr className="border-t border-gray-700 my-1"/>
                    <button className="bg-transparent border-none text-professional-gray dark:text-white text-left p-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        onClick={()=>navigate(`/perfil/${usuario.tipo}/editar`)}>Editar perfil</button>
                    <button className="bg-transparent border-none text-professional-gray dark:text-white text-left p-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        onClick={()=>logout()} id="logoutButton">Sair</button>
                    <hr className="border-t border-gray-700 my-1"/>
                    {/* <button className="bg-transparent border-none text-professional-gray dark:text-white text-left p-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Notificações</button> */}
                    <button className="bg-transparent border-none text-professional-gray dark:text-white text-left p-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        onClick={()=>navigate('/chats')}>Chats</button>
                    <hr className="border-t border-gray-700 my-1"/>
                    <button className="bg-transparent border-none text-professional-gray dark:text-white text-left p-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Configurações</button>
                    <ThemeTogleConfig />
                    <button className="bg-transparent border-none text-professional-gray dark:text-white text-left p-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        onClick={()=>navigate('/suporte')}>Ajuda</button>
                </div>
            </div>
            </nav>
        </div>
        </header>
    )
}