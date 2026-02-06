import logoEmpreGo from '../assets/logos/logoEmpreGo.png';
import genPfp from '../assets/imgs/genPfp.png';
import { logout, DadosUsuario } from '../utils/globalFunctions';
import '../css/headerTW.css';
import { interacaoUI } from "../ts/indexFunctions";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function HeaderInit(){
    interacaoUI();
    const User = DadosUsuario.getUsuario();
    const [mobileOpen, setMobileOpen] = useState(false);
    return (
        <header className="fixed w-full bg-light-100 dark:bg-dark-900 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-md z-[100] transition-colors duration-300 dark:dark:border-professional-card">

            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Efeito de glitch */}
                    <div className="flex items-center space-x-3">
                        <Link to="/" className="flex items-center group" id="logo-container">
                            <img src={logoEmpreGo} alt="Logo EmpreGo"
                                className="h-10 w-10 transition-transform group-hover:scale-110" />
                            <span className="ml-2 text-2xl font-bold group-hover:animate-text-glitch text-gray-900 dark:text-white">
                                Empre<span className="text-primary-500">Go</span>
                            </span>
                        </Link>
                    </div>

                    {/* Navegação */}
                    <nav className="links hidden md:flex items-center space-x-8">
                        <Link to="/#home"
                            className="text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors link-underline">Início</Link>
                        <Link to="/#servicos"
                            className="text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors link-underline">Serviços</Link>
                        <Link to="/#biografias"
                            className="text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors link-underline">Biografias</Link>
                        <Link to="/sobre"
                            className="text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors link-underline">Sobre</Link>
                        <Link to="/suporte"
                            className="text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors link-underline">Suporte</Link>

                        {/* Login / Cadastrar */}
                        <Link to="/login"
                            className={User?"hidden":"px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center animate-pulse-glow"}
                            id="loginOuCadas">
                            <i className='bx bx-log-in mr-2'></i> Login / Cadastrar
                        </Link>

                        {/* Foto de Perfil (inicialmente oculta) */}
                        <Link to={`/perfil/${User?User.tipo:'candidato'}`} className={User?"rounded-full w-10 h-10 border-2 border-primary-500":"hidden"}
                            id="fotoPerfil">
                            <img src={User ? User.foto!=="/assets/imgs/genPfp.png" ? User.foto : genPfp : genPfp} alt="Foto de perfil do usuário" id="fotoPerfilImg"
                                className="w-full h-full object-cover rounded-full" onError={(e) => {
                                e.currentTarget.src = genPfp;
                            }}/>
                        </Link>

                        {/* Botão de Logout (inicialmente oculto) */}
                        <Link to="#" className={User?"text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors":"hidden"} id="logout" onClick={()=>logout()}>Sair</Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                    className="md:hidden text-gray-600 dark:text-gray-300"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    >
                    <i className='bx bx-menu text-3xl'></i>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                className={`md:hidden mt-4 space-y-4 pb-4 transition-all duration-300 ${
                    mobileOpen ? "block" : "hidden"
                }`}
                >
                    <Link to="#home" className="block text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">Início</Link>
                    <Link to="#servicos" className="block text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">Serviços</Link>
                    <Link to="#biografias"
                        className="block text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">Biografias</Link>
                    <Link to="/sobre" className="block text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">Sobre</Link>
                    <Link to="/suporte" className="block text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">Suporte</Link>

                    {/* Login / Cadastrar */}
                    <Link to="/login"
                        className="block px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-center animate-pulse-glow"
                        id="mobileLoginOuCadas">
                        Login / Cadastrar
                    </Link>
                    
                    {/* Foto de Perfil (inicialmente oculta) */}
                    <Link to={`/perfil/${User?User.tipo:'candidato'}`}
                        className="block w-12 h-12 mx-auto rounded-full overflow-hidden border-2 border-primary-500 hidden"
                        id="mobileFotoPerfil">
                        <img src="/assets/imgs/genPfp.png" alt="Foto de perfil do usuário" id="mobileFotoPerfilImg"
                            className="w-full h-full rounded-full object-cover" />
                    </Link>

                    {/* Botão de Logout (inicialmente oculto) */}
                    <Link to="#" className="block text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 text-center transition-colors" onClick={()=>logout()}
                        id="mobileLogout">Sair</Link>
                </div>
            </div>
        </header>
    )
}