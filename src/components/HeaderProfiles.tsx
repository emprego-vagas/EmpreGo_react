import { useNavigate } from "react-router-dom";
import { DadosUsuario, logout } from "../utils/globalFunctions";

import genPfp from '../assets/imgs/genPfp.png';
import BIGSlogo from '../assets/imgs/BIGSlogo.png';
import { useEffect, useRef, useState } from "react";

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
        className=" top-0 left-0 right-0 bg-professional-gray shadow-md z-50 border-b border-professional-card">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div id="logo" className="flex items-center">
            <a href="/" target="_self" className="flex items-center">
                <img src={BIGSlogo} alt="Logo" id="logoimg" className="h-10 mr-2"/>
                <span id="nomedosite" className="text-xl font-bold text-white">
                Empre<span className="text-professional-accent">Go</span>
                </span>
            </a>
            </div>
            <nav className="links flex items-center space-x-6">
            <a href="/" className="text-professional-subtitle hover:text-white transition-colors">Início</a>
            <a className="headerlink text-professional-subtitle hover:text-white transition-colors" href="/chats"
                target="_self">Chat Geral</a>
            <a className="headerlink text-professional-subtitle hover:text-white transition-colors" href="#"
                target="_self">Fórum</a>
            <a className="headerlink text-professional-subtitle hover:text-white transition-colors" href="#"
                target="_self">Favoritos</a>

            <div className="header-profile flex items-center gap-3 bg-transparent px-1 py-1 rounded-full cursor-pointer transition-colors hover:bg-gray-700"
                id="profile-toggle" ref={profileToggleRef}>
                <div
                className="user-avatar bg-twitch-purple text-white font-bold text-base w-9 h-9 rounded-full flex justify-center items-center select-none shadow-x1">
                <img src={usuario.foto==='/assets/imgs/genPfp.png'?genPfp:usuario.foto} alt="Foto de perfil do usuário" id="FotoDePerfil"
                    className="w-full h-full object-cover rounded-full" onClick={()=>setMostrarDropDown(e=>!e)} />
                </div>

                {mostrarDropDown && (
                    <div className="profile-dropdown absolute top-16 right-4 bg-twitch-gray text-white w-60 rounded-lg shadow-xl flex flex-col p-2 z-50"
                        id="profile-dropdown" ref={profileDropdownRef}>
                        <div className="profile-info p-3">
                            <p className="profile-name font-bold m-0">{usuario.nome}</p>
                            <a href="/perfil/candidato" className="text-twitch-purple text-sm no-underline">Acessar perfil</a>
                        </div>
                        <hr className="border-t border-gray-700 my-1"/>
                        <button className="bg-transparent border-none text-white text-left p-2 text-sm cursor-pointer hover:bg-gray-700"
                            onClick={()=>navigate('/perfil/candidato/editar')}>Editar perfil</button>
                        <button className="bg-transparent border-none text-white text-left p-2 text-sm cursor-pointer hover:bg-gray-700"
                            onClick={()=>logout()} id="logoutButton">Sair</button>
                        <hr className="border-t border-gray-700 my-1"/>
                        <button className="bg-transparent border-none text-white text-left p-2 text-sm cursor-pointer hover:bg-gray-700">Notificações</button>
                        <button className="bg-transparent border-none text-white text-left p-2 text-sm cursor-pointer hover:bg-gray-700"
                            onClick={()=>navigate('/chats')}>Chats</button>
                        <hr className="border-t border-gray-700 my-1"/>
                        <button className="bg-transparent border-none text-white text-left p-2 text-sm cursor-pointer hover:bg-gray-700">Configurações</button>
                        <button className="bg-transparent border-none text-white text-left p-2 text-sm cursor-pointer hover:bg-gray-700">Modo: Escuro</button>
                        <button className="bg-transparent border-none text-white text-left p-2 text-sm cursor-pointer hover:bg-gray-700"
                            onClick={()=>navigate('/suporte')}>Ajuda</button>
                    </div>
                )}
            </div>
            </nav>
        </div>
        </header>
    )
}