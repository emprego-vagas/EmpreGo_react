import logoEmpreGo from '../assets/logos/logoEmpreGo.png';
import genPfp from '../assets/imgs/genPfp.png';
import { logout, DadosUsuario } from '../utils/globalFunctions';
import '../css/header.css';

export default function Header1(){
    const User = DadosUsuario.getUsuario();
    return (
        <header className="fixed w-full bg-light-100 dark:bg-dark-900 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-md z-20 transition-colors duration-300">

            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Efeito de glitch */}
                    <div className="flex items-center space-x-3">
                        <a href="/" className="flex items-center group" id="logo-container">
                            <img src={logoEmpreGo} alt="Logo EmpreGo"
                                className="h-10 w-10 transition-transform group-hover:scale-110" />
                            <span className="ml-2 text-2xl font-bold group-hover:animate-text-glitch text-gray-900 dark:text-white">
                                Empre<span className="text-primary-500">Go</span>
                            </span>
                        </a>
                    </div>

                    {/* Navegação */}
                    <nav className="links hidden md:flex items-center space-x-8">
                        <a href="#home"
                            className="text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors link-underline">Início</a>
                        <a href="#servicos"
                            className="text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors link-underline">Serviços</a>
                        <a href="#testperfis"
                            className="text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors link-underline">Biografias</a>
                        <a href="/sobre"
                            className="text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors link-underline">Sobre</a>
                        <a href="/suporte"
                            className="text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors link-underline">Suporte</a>

                        {/* Login / Cadastrar */}
                        <a href="/login"
                            className={User?"hidden":"px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center animate-pulse-glow"}
                            id="loginOuCadas">
                            <i className='bx bx-log-in mr-2'></i> Login / Cadastrar
                        </a>

                        {/* Foto de Perfil (inicialmente oculta) */}
                        <a href="/perfil/candidato" className={User?"rounded-full w-10 h-10 border-2 border-primary-500":"hidden"}
                            id="fotoPerfil">
                            <img src={User? User.foto : genPfp} alt="Foto de perfil do usuário" id="fotoPerfilImg"
                                className="w-full h-full object-cover rounded-full" />
                        </a>

                        {/* Botão de Logout (inicialmente oculto) */}
                        <a href="#" className={User?"text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors":"hidden"} id="logout" onClick={()=>logout()}>Sair</a>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button id="mobile-menu-button" className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none">
                        <i className='bx bx-menu text-3xl'></i>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div id="mobile-menu" className="hidden md:hidden mt-4 space-y-4 pb-4">
                    <a href="#home" className="block text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">Início</a>
                    <a href="#servicos" className="block text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">Serviços</a>
                    <a href="#testperfis"
                        className="block text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">Biografias</a>
                    <a href="/sobre" className="block text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">Sobre</a>
                    <a href="/suporte" className="block text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">Suporte</a>

                    {/* Login / Cadastrar */}
                    <a href="/login"
                        className="block px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-center animate-pulse-glow"
                        id="mobileLoginOuCadas">
                        Login / Cadastrar
                    </a>
                    
                    {/* Foto de Perfil (inicialmente oculta) */}
                    <a href="/perfil/candidato"
                        className="block w-12 h-12 mx-auto rounded-full overflow-hidden border-2 border-primary-500 hidden"
                        id="mobileFotoPerfil">
                        <img src="/assets/imgs/genPfp.png" alt="Foto de perfil do usuário" id="mobileFotoPerfilImg"
                            className="w-full h-full rounded-full object-cover" />
                    </a>

                    {/* Botão de Logout (inicialmente oculto) */}
                    <a href="#" className="block text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400 text-center transition-colors" onClick={()=>logout()}
                        id="mobileLogout">Sair</a>
                </div>
            </div>
        </header>
    )
}