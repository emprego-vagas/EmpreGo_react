import { useEffect } from 'react';
import Footer from '../components/Footer';
import HeaderInit from '../components/HeaderInit';
import ThemeToggle from '../components/ThemeTogle';
import suportimg from '../assets/imgs/bustedFuseBox.png';
import suportimgBlack from '../assets/imgs/bustedFuseBoxBlack.png';
import "../css/sobre.css";


export default function Suporte() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <HeaderInit />
            <main className="pt-32 pb-20 bg-grid-pattern min-h-screen bg-dark-50 dark:bg-dark-900">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto" id="support-content">
                        {/* <!-- Suporte Header --> */}
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-dark-900 dark:text-dark-50">
                                Suporte<span className="text-gradient"> Técnico</span>
                            </h1>
                            <p className="text-xl text-dark-900 dark:text-dark-50 max-w-3xl mx-auto">
                                Estamos aqui para ajudar com qualquer problema ou dúvida que você possa ter.
                            </p>
                        </div>

                        <div className="flex justify-center items-center gap-10 mb-16 ">
                            {/* <!-- Texto --> */}
                            <div className="card-hover bg-dark-50 dark:bg-dark-900 border border-gray-800 hover:border-primary-500 rounded-xl p-8 max-w-md">
                                <p className="text-dark-900 dark:text-dark-50 mb-4 text-center">
                                    Caso encontre qualquer problema ou tenha alguma dúvida
                                </p>
                                <p className="text-dark-900 dark:text-dark-50 mb-4 text-center">
                                    Você pode ler as nossas Perguntas Frequentes (FAQ) Logo abaixo!
                                </p>
                                <p className="text-dark-900 dark:text-dark-50 mb-4 text-center">
                                    E caso não resolva, encontram-se também nossos contatos.
                                </p>
                                <p className="text-dark-900 dark:text-dark-50 text-center">
                                    Sinta-se à vontade para nos contactar caso necessário!
                                </p>
                            </div>

                            {/* <!-- Imagem --> */}
                            <div className="relative animate-shake">
                                <img src={suportimg} alt="Suporte Técnico" className="w-64 h-64 object-contain hidden dark:block" />
                                <img src={suportimgBlack} alt="Suporte Técnico" className="w-64 h-64 object-contain block dark:hidden" />
                                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-primary-500 rounded-full opacity-20 blur-xl"></div>
                            </div>
                        </div>

                        {/* <!-- Contact Options --> */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* <!-- Email --> */}
                            <div
                                className="card-hover bg-dark-50 dark:bg-dark-900 rounded-xl p-6 border border-gray-800 hover:border-primary-500 transition-colors text-center">
                                <div
                                    className="w-16 h-16 bg-primary-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <i className='bx bx-envelope text-3xl text-primary-500 dark:text-primary-400'></i>
                                </div>
                                <h3 className="text-2xl font-bold text-primary-500 dark:text-primary-400 mb-4">E-mail</h3>
                                <a href="mailto:emprego.contato22@gmail.com?subject=Contato&body=Olá,%20gostaria%20de%20mais%20informações"
                                    className="text-dark-900 dark:text-dark-50 hover:text-primary-500 dark:hover:text-primary-400 transition-colors block">
                                    emprego.contato22@gmail.com
                                </a>
                            </div>

                            {/* <!-- FAQ --> */}
                            <div
                                className="card-hover bg-dark-50 dark:bg-dark-900 rounded-xl p-6 border border-gray-800 hover:border-primary-500 transition-colors text-center">
                                <div
                                    className="w-16 h-16 bg-primary-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <i className='bx bx-help-circle text-3xl text-primary-500 dark:text-primary-400'></i>
                                </div>
                                <h3 className="text-primary-500 dark:text-primary-400 text-2xl font-bold  mb-4 ">FAQ</h3>
                                <button
                                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors transform hover:scale-105">
                                    Clique aqui!
                                </button>
                            </div>

                            {/* <!-- Phone --> */}
                            <div
                                className="card-hover bg-dark-50 dark:bg-dark-900 rounded-xl p-6 border border-gray-800 hover:border-primary-500 transition-colors text-center">
                                <div
                                    className="w-16 h-16 bg-primary-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <i className='bx bx-phone text-3xl text-primary-500 dark:text-primary-400'></i>
                                </div>
                                <h3 className="text-2xl font-bold text-primary-500 dark:text-primary-400 mb-4">Telefone</h3>
                                <a href="tel:+5579123456789"
                                    className="text-dark-900 dark:text-dark-50 hover:text-primary-500 dark:hover:text-primary-400 transition-colors block">
                                    +55 79 12345-6789
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <ThemeToggle />
        </>
    )
}