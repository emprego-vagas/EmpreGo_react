import { useNavigate } from "react-router-dom"
import HeaderProfiles from "../components/HeaderProfiles";
import { DadosUsuario } from "../utils/globalFunctions";
import { useState } from "react";
import '../App.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";

export default function EditarPerfilEmpresa() {
    const navigate = useNavigate();
    const [usuario] = useState(DadosUsuario.getUsuario(true, 'empresa'));
    if (!usuario) {
        setTimeout(() => {
            navigate('/')
        }, 3000);
    };

    return (
        <div className="font-inter min-h-screen dark:bg-dark-900 bg-dark-50 ">
            <HeaderProfiles />
            <div className="container mx-auto px-4 pt-20 pb-10  ">
                <div className="page-header text-center mb-10 ">
                    <h1 className="text-4xl font-bold text-dark-900 dark:text-dark-50 mb-2 ">Editar Perfil Empresarial</h1>
                    <p className="text-dark-900 dark:text-professional-subtitle text-lg max-w-2xl mx-auto">Atualize as informações da sua empresa para atrair os melhores talentos e oportunidades</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 ">
                    {/* <!-- Coluna esquerda - Informações da empresa --> */}
                    <div className="lg:col-span-8 space-y-6 ">
                        <div
                            className="gradient-bg  rounded-2xl p-8 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in">
                            <h2 className="text-2xl text-center font-semibold mb-8 text-dark-900 dark:text-professional-subtitle relative pb-4
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-20 after:h-0.5 after:bg-professional-subtitleText after:rounded">
                                <i className="fas fa-building text-professional-accent mr-2"></i>Informações da Empresa
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="nomeEmpresa"
                                        className="block text-dark-900 dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fas fa-signature text-professional-accent mr-2"></i>Nome Fantasia
                                    </label>
                                    <input type="text" id="nomeEmpresa"
                                        className="w-full px-4 py-3 bg-dark-50 dark:bg-dark-700  border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: Tech Solutions Ltda" />
                                </div>

                                <div>
                                    <label htmlFor="EmailEmpresa"
                                        className="block text-dark-900 dark:text-professional-subtitle  mb-2 font-medium flex items-center">
                                        <i className="fas fa-id-card text-professional-accent mr-2"></i>Email de Contato
                                    </label>
                                    <input type="text" id="EmailEmpresa"
                                        className="w-full px-4 py-3 bg-dark-50 dark:bg-dark-700  border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: nome@exemplo.com" />
                                </div>

                                {/* <div>
                                    <label htmlFor="cnpj"
                                        className="block text-dark-900 dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fas fa-id-card text-professional-accent mr-2"></i>CNPJ
                                    </label>
                                    <input type="text" id="cnpj"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: xx.xxx.xxx/xxxx-xx" />
                                </div> */}

                                {/* <!-- <div>
                                    <label for="dataAbertura"
                                        className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fas fa-calendar-alt text-professional-accent mr-2"></i>Data de Abertura
                                    </label>
                                    <input type="date" id="dataAbertura"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText">
                                </div>

                                <div>
                                    <label for="situacaoCadastral"
                                        className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fas fa-user-check text-professional-accent mr-2"></i>Situação Cadastral
                                    </label>
                                    <select id="situacaoCadastral"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText">
                                        <option value="" disabled selected className="text-professional-subtitle">Selecione a situação</option>
                                        <option value="Ativa" className="bg-professional-dark">Ativa</option>
                                        <option value="Inativa" className="bg-professional-dark">Inativa</option>
                                        <option value="Suspensa" className="bg-professional-dark">Suspensa</option>
                                        <option value="Baixada" className="bg-professional-dark">Baixada</option>
                                    </select>
                                </div> --> */}

                                <div>
                                    <label htmlFor="setorAtuacao"
                                        className="block text-dark-900 dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fas fa-industry text-professional-accent mr-2"></i>Setor de Atuação
                                    </label>
                                    <input type="text" id="setorAtuacao"
                                        className="w-full px-4 py-3 bg-dark-50 dark:bg-dark-700  border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: Tecnologia da Informação" />
                                </div>

                                {/* <!-- <div>
                                    <label for="naturezaJuridica"
                                        className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fas fa-gavel text-professional-accent mr-2"></i>Natureza Jurídica
                                    </label>
                                    <input type="text" id="naturezaJuridica"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: Sociedade Limitada">
                                </div> --> */}

                                <div>
                                    <label htmlFor="porteEmpresa"
                                        className="block text-dark-900 dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fas fa-chart-bar text-professional-accent mr-2"></i>Porte da Empresa
                                    </label>
                                    <select id="porteEmpresa"
                                        className="w-full px-4 py-3 bg-dark-50 dark:bg-dark-700 border border-professional-card rounded-xl text-professional-subtitleText dark:text-dark-50 transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20">
                                        <option value="" disabled selected className="text-dark-900 dark:text-dark-50">Selecione o porte</option>
                                        <option value="Pequeno" className="text-dark-900 dark:text-dark-50">Pequena Empresa</option>
                                        <option value="Médio" className="text-dark-900 dark:text-dark-50">Média Empresa</option>
                                        <option value="Grande" className="text-dark-900 dark:text-dark-50">Grande Empresa</option>
                                    </select>
                                </div>
                            </div>
                        </div>



                        {/* <!-- Redes Sociais e Links --> */}
                        {/* <div
                            className="gradient-bg rounded-2xl p-8 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in">
                            <h2 className="text-2xl text-center font-semibold mb-8 text-professional-subtitle relative pb-4
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-12 after:h-0.5 after:bg-professional-subtitleText after:rounded">
                                <i className="fas fa-share-alt text-professional-accent mr-2"></i>Redes Sociais e Contatos
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="siteOficial"
                                        className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fas fa-globe text-professional-accent mr-2"></i> Site Oficial
                                    </label>
                                    <input type="url" id="siteOficial"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: https://empresa.com" />
                                </div>

                                <div>
                                    <label htmlFor="telefone"
                                        className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fas fa-phone text-professional-accent mr-2"></i> Telefone
                                    </label>
                                    <input type="tel" id="telefone"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: (11) 99999-9999" />
                                </div>

                                <div>
                                    <label htmlFor="instagram"
                                        className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fab fa-instagram text-professional-accent mr-2"></i> Instagram
                                    </label>
                                    <input type="url" id="instagram"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: https://instagram.com/empresa" />
                                </div>

                                <div>
                                    <label htmlFor="github"
                                        className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fab fa-github text-professional-accent mr-2"></i> GitHub
                                    </label>
                                    <input type="url" id="github"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: https://github.com/empresa" />
                                </div>

                                <div>
                                    <label htmlFor="twitter"
                                        className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fab fa-x-twitter text-professional-accent mr-2"></i> Twitter/X
                                    </label>
                                    <input type="url" id="twitter"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: https://twitter.com/empresa" />
                                </div>

                                <div>
                                    <label htmlFor="mapa"
                                        className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fas fa-map text-professional-accent mr-2"></i> Link do Mapa
                                    </label>
                                    <input type="url" id="mapa"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: https://maps.google.com/..." />
                                </div>
                            </div>
                        </div> */}
                    </div>

                    {/* <!-- Coluna direita - Logo e Cultura --> */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* <!-- Logo da Empresa --> */}
                        <div
                            className="gradient-bg rounded-2xl p-5 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in">
                            <h2 className="text-2xl text-center font-semibold mb-8 text-dark-900 dark:text-professional-subtitle relative pb-4
                                after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                                after:w-12 after:h-0.5 after:bg-professional-subtitleText after:rounded">
                                <i className="fas fa-camera text-professional-accent mr-2"></i>Logo da Empresa
                            </h2>

                            <div className="flex flex-col items-center">
                                <div className="relative mb-4">
                                    <img id="previewLogo" src="/assets/imgs/genPfp.png" alt="Logo da empresa"
                                        className="w-40 h-40 rounded-full border-4 border-professional-accent object-cover shadow-lg" />

                                    <input type="file" id="inputLogo" accept="image/*" className="hidden" />

                                    <button id="btnAlterarLogo"
                                        title="Alterar Logo"
                                        className="absolute bottom-2 right-2 bg-professional-accent text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-professional-lightaccent transition-all duration-200 transform hover:scale-110">
                                        <i className="fas fa-camera"></i>
                                    </button>

                                    <button id="btnRemoverLogo"
                                        title="Remover Logo"
                                        className="absolute top-2 right-2 bg-red-500 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-110 hidden">
                                        <i className="fas fa-trash-alt"></i>
                                    </button>

                                    <button id="btnVoltarLogo"
                                        title="Cancelar Edição"
                                        className="absolute top-2 left-2 bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-110 hidden">
                                        <i className="fas fa-undo"></i>
                                    </button>

                                </div>

                                <p className="text-sm text-dark-900 dark:text-professional-subtitle text-center">
                                    Use o logo oficial da sua empresa para melhor identificação.
                                </p>
                            </div>
                        </div>


                        
                    </div>
                </div>
                <div
                    className="gradient-bg rounded-2xl p-8 mt-6 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in">
                    <h2 className="text-2xl text-center font-semibold mb-8 text-dark-900 dark:text-professional-subtitle relative pb-4
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-12 after:h-0.5 after:bg-professional-subtitleText after:rounded">
                        <i className="fas fa-share-alt text-professional-accent mr-2"></i>Redes Sociais e Contatos
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="siteOficial"
                                className="block text-dark-900 dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                <i className="fas fa-globe text-professional-accent mr-2"></i> Site Oficial
                            </label>
                            <input type="url" id="siteOficial"
                                className="w-full px-4 py-3 bg-dark-50 dark:bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                placeholder="Ex: https://empresa.com" />
                        </div>

                        <div>
                            <label htmlFor="telefone"
                                className="block text-dark-900 dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                <i className="fas fa-phone text-professional-accent mr-2"></i> Telefone
                            </label>
                            <input type="tel" id="telefone"
                                className="w-full px-4 py-3 bg-dark-50 dark:bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                placeholder="Ex: (11) 99999-9999" />
                        </div>

                        <div>
                            <label htmlFor="instagram"
                                className="block text-dark-900 dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                <i className="fab fa-instagram text-professional-accent mr-2"></i> Instagram
                            </label>
                            <input type="url" id="instagram"
                                className="w-full px-4 py-3 bg-dark-50 dark:bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                placeholder="Ex: https://instagram.com/empresa" />
                        </div>

                        <div>
                            <label htmlFor="github"
                                className="block text-dark-900 dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                <i className="fab fa-github text-professional-accent mr-2"></i> GitHub
                            </label>
                            <input type="url" id="github"
                                className="w-full px-4 py-3 bg-dark-50 dark:bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                placeholder="Ex: https://github.com/empresa" />
                        </div>

                        <div>
                            <label htmlFor="twitter"
                                className="block text-dark-900 dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                <i className="fab fa-x-twitter text-professional-accent mr-2"></i> Twitter/X
                            </label>
                            <input type="url" id="twitter"
                                className="w-full px-4 py-3 bg-dark-50 dark:bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                placeholder="Ex: https://twitter.com/empresa" />
                        </div>

                        <div>
                            <label htmlFor="mapa"
                                className="block text-dark-900 dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                <i className="fas fa-map text-professional-accent mr-2"></i> Link do Mapa
                            </label>
                            <input type="url" id="mapa"
                                className="w-full px-4 py-3 bg-dark-50 dark:bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                placeholder="Ex: https://maps.google.com/..." />
                        </div>
                    </div>
                </div>
                <div
                    className="gradient-bg rounded-2xl p-4 mt-5 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in">
                    <h2 className="text-2xl text-center font-semibold mb-8 text-dark-900 dark:text-professional-subtitle relative pb-4
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-12 after:h-0.5 after:bg-professional-subtitleText after:rounded">
                        <i className="fas fa-file-alt text-professional-accent mr-2"></i>Sobre a Empresa
                    </h2>

                    <div>
                        <label htmlFor="sobreEmpresa" className="block text-dark-900 dark:text-professional-subtitle mb-2 font-medium">
                            <FontAwesomeIcon icon={faFileAlt} className="text-professional-accent mr-2" />Descrição da Empresa</label>
                        <textarea id="sobreEmpresa" rows={6} maxLength={500}
                            className="w-full h-48 p-6 bg-dark-50 dark:bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-subtitle resize-y transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                            placeholder="Descreva sua empresa, sua história, especialidades e diferenciais no mercado. Seja específico e use métricas quando possível."></textarea>
                        <div className="flex justify-between mt-2">
                            <span className="text-xs text-dark-900 dark:text-professional-subtitle">Máximo de 500 caracteres</span>
                            <span id="contadorCaracteres" className="text-xs text-dark-900 dark:text-professional-subtitle">0/500</span>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex justify-center space-x-4">
                    <button id="btnSalvar"
                        className="flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-xl transition-all bg-gradient-to-r from-professional-accent to-professional-lightaccent text-white shadow-lg shadow-professional-accent/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-professional-accent/40">
                        <i className="fas fa-save"></i>Salvar Alterações
                    </button>
                    <button id="btnCancelar" onClick={() => navigate('/perfil/empresa')}
                        className="flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-xl transition-all bg-dark-700 text-professional-subtitle hover:bg-dark-700 hover:-translate-y-1">
                        <i className="fas fa-times"></i>Cancelar
                    </button>
                </div>

                <div id="mensagemStatus" className="hidden mt-6 p-4 rounded-lg text-center"></div>
            </div>
        </div>
    )
}