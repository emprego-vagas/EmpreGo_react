import { useNavigate } from "react-router-dom"
import HeaderProfiles from "../components/HeaderProfiles";
import { DadosUsuario } from "../utils/globalFunctions";
import { useState } from "react";

export default function EditarPerfilEmpresa () {
    const navigate = useNavigate();
    const [usuario] = useState(DadosUsuario.getUsuario(true, 'empresa'));
    if(!usuario) {
        setTimeout(()=>{
            navigate('/')
        }, 3000);
    };

    return (
        <div className="font-inter min-h-screen">
            <HeaderProfiles />
            <div className="container mx-auto px-4 pt-20 pb-10">
                <div className="page-header text-center mb-10">
                    <h1 className="text-4xl font-bold gradient-text mb-2">Editar Perfil Empresarial</h1>
                    <p className="text-professional-subtitle text-lg max-w-2xl mx-auto">Atualize as informações da sua empresa para atrair os melhores talentos e oportunidades</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* <!-- Coluna esquerda - Informações da empresa --> */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* <!-- Informações Básicas --> */}
                        <div
                            className="gradient-bg rounded-2xl p-8 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in">
                            <h2 className="text-2xl text-center font-semibold mb-8 text-professional-subtitle relative pb-4
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-20 after:h-0.5 after:bg-professional-subtitleText after:rounded">
                                <i className="fas fa-building text-professional-accent mr-2"></i>Informações da Empresa
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="nomeEmpresa"
                                        className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fas fa-signature text-professional-accent mr-2"></i>Nome Fantasia
                                    </label>
                                    <input type="text" id="nomeEmpresa"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: Tech Solutions Ltda" />
                                </div>

                                <div>
                                    <label htmlFor="cnpj"
                                        className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fas fa-id-card text-professional-accent mr-2"></i>CNPJ
                                    </label>
                                    <input type="text" id="cnpj"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: xx.xxx.xxx/xxxx-xx" />
                                </div>

                                {/* <!-- <div>
                                    <label for="dataAbertura"
                                        className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fas fa-calendar-alt text-professional-accent mr-2"></i>Data de Abertura
                                    </label>
                                    <input type="date" id="dataAbertura"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText">
                                </div>

                                <div>
                                    <label for="situacaoCadastral"
                                        className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fas fa-user-check text-professional-accent mr-2"></i>Situação Cadastral
                                    </label>
                                    <select id="situacaoCadastral"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText">
                                        <option value="" disabled selected className="text-professional-subtitle">Selecione a situação</option>
                                        <option value="Ativa" className="bg-professional-dark">Ativa</option>
                                        <option value="Inativa" className="bg-professional-dark">Inativa</option>
                                        <option value="Suspensa" className="bg-professional-dark">Suspensa</option>
                                        <option value="Baixada" className="bg-professional-dark">Baixada</option>
                                    </select>
                                </div> --> */}

                                <div>
                                    <label htmlFor="setorAtuacao"
                                        className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fas fa-industry text-professional-accent mr-2"></i>Setor de Atuação
                                    </label>
                                    <input type="text" id="setorAtuacao"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: Tecnologia da Informação" />
                                </div>

                                {/* <!-- <div>
                                    <label for="naturezaJuridica"
                                        className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fas fa-gavel text-professional-accent mr-2"></i>Natureza Jurídica
                                    </label>
                                    <input type="text" id="naturezaJuridica"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: Sociedade Limitada">
                                </div> --> */}

                                <div>
                                    <label htmlFor="porteEmpresa"
                                        className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fas fa-chart-bar text-professional-accent mr-2"></i>Porte da Empresa
                                    </label>
                                    <select id="porteEmpresa"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText">
                                        <option value="" disabled selected className="text-professional-subtitle">Selecione o porte</option>
                                        <option value="ME" className="bg-professional-dark">Microempresa (ME)</option>
                                        <option value="EPP" className="bg-professional-dark">Empresa de Pequeno Porte (EPP)</option>
                                        <option value="Média" className="bg-professional-dark">Média Empresa</option>
                                        <option value="Grande" className="bg-professional-dark">Grande Empresa</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        

                        {/* <!-- Redes Sociais e Links --> */}
                        <div
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
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: https://empresa.com" />
                                </div>

                                <div>
                                    <label htmlFor="telefone"
                                        className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fas fa-phone text-professional-accent mr-2"></i> Telefone
                                    </label>
                                    <input type="tel" id="telefone"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: (11) 99999-9999" />
                                </div>

                                <div>
                                    <label htmlFor="instagram"
                                        className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fab fa-instagram text-professional-accent mr-2"></i> Instagram
                                    </label>
                                    <input type="url" id="instagram"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: https://instagram.com/empresa" />
                                </div>

                                <div>
                                    <label htmlFor="github"
                                        className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fab fa-github text-professional-accent mr-2"></i> GitHub
                                    </label>
                                    <input type="url" id="github"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: https://github.com/empresa" />
                                </div>

                                <div>
                                    <label htmlFor="twitter"
                                        className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fab fa-x-twitter text-professional-accent mr-2"></i> Twitter/X
                                    </label>
                                    <input type="url" id="twitter"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: https://twitter.com/empresa" />
                                </div>

                                <div>
                                    <label htmlFor="mapa"
                                        className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                        <i className="fas fa-map text-professional-accent mr-2"></i> Link do Mapa
                                    </label>
                                    <input type="url" id="mapa"
                                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: https://maps.google.com/..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Coluna direita - Logo e Cultura --> */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* <!-- Logo da Empresa --> */}
                        <div
                            className="gradient-bg rounded-2xl p-8 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in">
                            <h2 className="text-2xl text-center font-semibold mb-8 text-professional-subtitle relative pb-4
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

                                <p className="text-sm text-professional-subtitle text-center">
                                    Use o logo oficial da sua empresa para melhor identificação.
                                </p>
                            </div>
                        </div>


                        {/* <!-- Localização --> */}
                        <div
                            className="gradient-bg rounded-2xl p-8 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in">
                            <h2 className="text-2xl text-center font-semibold mb-8 text-professional-subtitle relative pb-4
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-20 after:h-0.5 after:bg-professional-subtitleText after:rounded">
                                <i className="fas fa-map-marker-alt text-professional-accent mr-2"></i>Localização
                            </h2>

                            <div className="mb-6">
                                <h3 className=" text-lg font-semibold mb-4 text-professional-subtitle flex items-center justify-center">
                                    <i className="fas fa-home mr-2 text-professional-accent"></i>Sede Principal
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="cidadeSede"
                                            className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                            <i className="fas fa-city text-professional-accent mr-2"></i>Cidade da Sede
                                        </label>
                                        <input type="text" id="cidadeSede"
                                            className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                            placeholder="Ex: São Paulo" />
                                    </div>

                                    <div>
                                        <label htmlFor="estadoSede"
                                            className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                            <i className="fas fa-flag text-professional-accent mr-2"></i>Estado da Sede
                                        </label>
                                        <select id="estadoSede"
                                            className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20">
                                            <option value="" disabled selected className="bg-professional-dark">Selecione o estado</option>
                                            <option value="AC" className="bg-professional-dark">Acre (AC)</option>
                                            <option value="AL" className="bg-professional-dark">Alagoas (AL)</option>
                                            <option value="AP" className="bg-professional-dark">Amapá (AP)</option>
                                            <option value="AM" className="bg-professional-dark">Amazonas (AM)</option>
                                            <option value="BA" className="bg-professional-dark">Bahia (BA)</option>
                                            <option value="CE" className="bg-professional-dark">Ceará (CE)</option>
                                            <option value="DF" className="bg-professional-dark">Distrito Federal (DF)</option>
                                            <option value="ES" className="bg-professional-dark">Espírito Santo (ES)</option>
                                            <option value="GO" className="bg-professional-dark">Goiás (GO)</option>
                                            <option value="MA" className="bg-professional-dark">Maranhão (MA)</option>
                                            <option value="MT" className="bg-professional-dark">Mato Grosso (MT)</option>
                                            <option value="MS" className="bg-professional-dark">Mato Grosso do Sul (MS)</option>
                                            <option value="MG" className="bg-professional-dark">Minas Gerais (MG)</option>
                                            <option value="PA" className="bg-professional-dark">Pará (PA)</option>
                                            <option value="PB" className="bg-professional-dark">Paraíba (PB)</option>
                                            <option value="PR" className="bg-professional-dark">Paraná (PR)</option>
                                            <option value="PE" className="bg-professional-dark">Pernambuco (PE)</option>
                                            <option value="PI" className="bg-professional-dark">Piauí (PI)</option>
                                            <option value="RJ" className="bg-professional-dark">Rio de Janeiro (RJ)</option>
                                            <option value="RN" className="bg-professional-dark">Rio Grande do Norte (RN)</option>
                                            <option value="RS" className="bg-professional-dark">Rio Grande do Sul (RS)</option>
                                            <option value="RO" className="bg-professional-dark">Rondônia (RO)</option>
                                            <option value="RR" className="bg-professional-dark">Roraima (RR)</option>
                                            <option value="SC" className="bg-professional-dark">Santa Catarina (SC)</option>
                                            <option value="SP" className="bg-professional-dark">São Paulo (SP)</option>
                                            <option value="SE" className="bg-professional-dark">Sergipe (SE)</option>
                                            <option value="TO" className="bg-professional-dark">Tocantins (TO)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-professional-subtitle flex items-center justify-center">
                                    <i className="fas fa-code-branch mr-2 text-professional-accent "></i>Filiais (Opcional)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    

                                    <div>
                                        <label htmlFor="cidadeFilial"
                                            className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                            <i className="fas fa-city text-professional-accent mr-2"></i>Cidade da Filial
                                        </label>
                                        <input type="text" id="cidadeFilial"
                                            className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                            placeholder="Ex: Rio de Janeiro" />
                                    </div>

                                    <div>
                                        <label htmlFor="estadoFilial"
                                            className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                            <i className="fas fa-flag text-professional-accent mr-2"></i>Estado da Filial
                                        </label>
                                        <select id="estadoFilial"
                                            className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20">
                                            <option value="" disabled selected className="bg-professional-dark">Selecione o estado</option>
                                            <option value="AC" className="bg-professional-dark">Acre (AC)</option>
                                            <option value="AL" className="bg-professional-dark">Alagoas (AL)</option>
                                            <option value="AP" className="bg-professional-dark">Amapá (AP)</option>
                                            <option value="AM" className="bg-professional-dark">Amazonas (AM)</option>
                                            <option value="BA" className="bg-professional-dark">Bahia (BA)</option>
                                            <option value="CE" className="bg-professional-dark">Ceará (CE)</option>
                                            <option value="DF" className="bg-professional-dark">Distrito Federal (DF)</option>
                                            <option value="ES" className="bg-professional-dark">Espírito Santo (ES)</option>
                                            <option value="GO" className="bg-professional-dark">Goiás (GO)</option>
                                            <option value="MA" className="bg-professional-dark">Maranhão (MA)</option>
                                            <option value="MT" className="bg-professional-dark">Mato Grosso (MT)</option>
                                            <option value="MS" className="bg-professional-dark">Mato Grosso do Sul (MS)</option>
                                            <option value="MG" className="bg-professional-dark">Minas Gerais (MG)</option>
                                            <option value="PA" className="bg-professional-dark">Pará (PA)</option>
                                            <option value="PB" className="bg-professional-dark">Paraíba (PB)</option>
                                            <option value="PR" className="bg-professional-dark">Paraná (PR)</option>
                                            <option value="PE" className="bg-professional-dark">Pernambuco (PE)</option>
                                            <option value="PI" className="bg-professional-dark">Piauí (PI)</option>
                                            <option value="RJ" className="bg-professional-dark">Rio de Janeiro (RJ)</option>
                                            <option value="RN" className="bg-professional-dark">Rio Grande do Norte (RN)</option>
                                            <option value="RS" className="bg-professional-dark">Rio Grande do Sul (RS)</option>
                                            <option value="RO" className="bg-professional-dark">Rondônia (RO)</option>
                                            <option value="RR" className="bg-professional-dark">Roraima (RR)</option>
                                            <option value="SC" className="bg-professional-dark">Santa Catarina (SC)</option>
                                            <option value="SP" className="bg-professional-dark">São Paulo (SP)</option>
                                            <option value="SE" className="bg-professional-dark">Sergipe (SE)</option>
                                            <option value="TO" className="bg-professional-dark">Tocantins (TO)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="gradient-bg rounded-2xl p-4 mt-5 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in">
                    <h2 className="text-2xl text-center font-semibold mb-8 text-professional-subtitle relative pb-4
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-12 after:h-0.5 after:bg-professional-subtitleText after:rounded">
                        <i className="fas fa-file-alt text-professional-accent mr-2"></i>Sobre a Empresa
                    </h2>

                    <div>
                        <label htmlFor="sobreEmpresa" className="block text-professional-subtitle mb-2 font-medium">Descrição da Empresa</label>
                        <textarea id="sobreEmpresa" rows={6} maxLength={500}
                            className="w-full h-48 p-6 bg-professional-dark border border-professional-card rounded-xl text-professional-text resize-y transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                            placeholder="Descreva sua empresa, sua história, especialidades e diferenciais no mercado. Seja específico e use métricas quando possível."></textarea>
                        <div className="flex justify-between mt-2">
                            <span className="text-xs text-professional-subtitle">Máximo de 500 caracteres</span>
                            <span id="contadorCaracteres" className="text-xs text-professional-subtitle">0/500</span>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex justify-center space-x-4">
                    <button id="btnSalvar"
                        className="flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-xl transition-all bg-gradient-to-r from-professional-accent to-professional-lightaccent text-white shadow-lg shadow-professional-accent/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-professional-accent/40">
                        <i className="fas fa-save"></i>Salvar Alterações
                    </button>
                    <button id="btnCancelar" onClick={()=>navigate('/perfil/empresa')}
                        className="flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-xl transition-all bg-professional-card text-professional-subtitle hover:bg-professional-card/80 hover:-translate-y-1">
                        <i className="fas fa-times"></i>Cancelar
                    </button>
                </div>

                <div id="mensagemStatus" className="hidden mt-6 p-4 rounded-lg text-center"></div>
            </div>
        </div>
    )
}