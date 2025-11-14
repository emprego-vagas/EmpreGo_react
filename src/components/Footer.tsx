import { Link } from 'react-router-dom';
import logoEmpreGo from '../assets/logos/logoEmpreGo.png';

export default function Footer () {
    return (
        <footer className="bg-dark-900 py-12 border-t border-gray-800">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* <!-- Coluna 1 --> */}
                    <div>
                        <div className="flex items-center mb-4">
                            <img src={logoEmpreGo} alt="Logo EmpreGo" className="h-10 w-10"/>
                            <span className="ml-2 text-2xl font-bold">
                                Empre<span className="text-primary-500">Go</span>
                            </span>
                        </div>
                        <p className="text-gray-400 mb-4">
                            A mais nova plataforma para encontrar e divulgar trabalho no Brasil.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://x.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                                <i className='bx bxl-twitter text-xl'></i>
                            </a>
                            <a href="https://www.tiktok.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                                <i className='bx bxl-tiktok text-xl'></i>
                            </a>
                            <a href="https://www.instagram.com/"
                                className="text-gray-400 hover:text-primary-400 transition-colors">
                                <i className='bx bxl-instagram text-xl'></i>
                            </a>
                            <a href="https://www.youtube.com/"
                                className="text-gray-400 hover:text-primary-400 transition-colors">
                                <i className='bx bxl-youtube text-xl'></i>
                            </a>
                        </div>
                    </div>

                    {/* <!-- coluna 2 --> */}
                    <div>
                        <h3 className="text-lg font--semibold text-white mb-4">Links Rápidos</h3>
                        <ul className="space-y-2">
                            <li><Link to="/#home" className="text-gray-400 hover:text-primary-400 transition-colors">Início</Link>
                            </li>
                            <li><Link to="/#servicos"
                                className="text-gray-400 hover:text-primary-400 transition-colors">Serviços</Link></li>
                            <li><Link to="/#biografias"
                                className="text-gray-400 hover:text-primary-400 transition-colors">Biografias</Link></li>
                            <li><Link to="/sobre" className="text-gray-400 hover:text-primary-400 transition-colors">Sobre</Link>
                            </li>
                            <li><Link to="/suporte"
                                className="text-gray-400 hover:text-primary-400 transition-colors">Suporte</Link></li>
                        </ul>
                    </div>

                    {/* <!-- coluna 3 --> */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Recursos</h3>
                        <ul className="space-y-2">
                            <li><Link to="/suporte" className="text-gray-400 hover:text-primary-400 transition-colors">FAQ</Link></li>
                            <li><Link to="/suporte" className="text-gray-400 hover:text-primary-400 transition-colors">Termos de
                                Serviço</Link></li>
                            <li><Link to="/suporte" className="text-gray-400 hover:text-primary-400 transition-colors">Política de
                                Privacidade</Link></li>
                        </ul>
                    </div>

                    {/* <!-- Coluna 4 --> */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Contato</h3>
                        <ul className="space-y-2">
                            <li><a href="mailto:emprego.contato22@gmail.com" className="text-gray-400 cursor-pointer"><i
                                className='bx bx-envelope mr-2'></i> emprego.contato22@gmail.com</a></li>
                            <li className="text-gray-400"><i className='bx bx-phone mr-2'></i> (79) 91234-5678</li>
                            <li className="text-gray-400"><i className='bx bx-map mr-2'></i> Aracaju, Sergipe - Brasil</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center">
                    <p className="text-gray-500">
                        &copy; 2025 EmpreGo. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    )
}