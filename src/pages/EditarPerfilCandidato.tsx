import { faGithub, faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faBriefcase, faBuilding, faCamera, faCity, faEdit, faFileAlt, faFileInvoice, faFlag, faGlobe, faIdCard, faMagic, faMapMarkerAlt, faSave, faShareAlt, faSignature, faTimes, faTrashAlt, faUndo, faUser, faUserTag, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import type { Usua } from "../ts/perfilCandidatoFunctions";
import { DadosUsuario } from "../utils/globalFunctions";
import axiosWe from "../utils/axiosInstance";
import HeaderProfiles from "../components/HeaderProfiles";
import type { FileEditCandFace } from "../ts/editarPerfilCandidatoFunctions";

export default function EditarPerfilCandidato () {
    const navigate = useNavigate();
    const [usuario] = useState(DadosUsuario.getUsuario(true, 'candidato'));
    if(!usuario) {
        setTimeout(()=>{
            navigate('/')
        }, 3000);
    };

    const [candEdit, setCandEdit] = useState<Usua | null>(null);
    useEffect(()=>{
        async function loadCand(){
            if(!usuario) return;
            try {
                const response = await axiosWe('/custom/perfil-candidato-editar') as {data: {usua: Usua}};
                const usua = response.data.usua;
                DadosUsuario.setarFoto(usua.foto);
                DadosUsuario.setarNome(usua.nome);
                setCandEdit(usua);
            } catch (erro) {
                console.error('Erro ao carregar dados do usuário:',erro)
            }
        }
        loadCand();
    }, [usuario]);

    const [nome, setNome] = useState({cached: '', value: '', disabled: false});
    const [cpf, setCpf] = useState({cached: '', value: '', disabled: false});
    const [pronomes, setPronomes] = useState({cached: '', value: '', disabled: false});
    const [portfolio, setPortfolio] = useState({cached: '', value: '', disabled: false});
    const [github, setGithub] = useState({cached: '', value: '', disabled: false});
    const [curriculo, setCurriculo] = useState({cached: '', value: '', disabled: false});
    const [instagram, setInstagram] = useState({cached: '', value: '', disabled: false});
    const [site_pessoal, setSite_pessoal] = useState({cached: '', value: '', disabled: false});
    const [twitter, setTwitter] = useState({cached: '', value: '', disabled: false});
    const [cidade, setCidade] = useState({cached: '', value: '', disabled: false});
    const [estado, setEstado] = useState({cached: '', value: '', disabled: false});
    const [cargo_atual, setCargo_atual] = useState({cached: '', value: '', disabled: false});
    const [empresa_atual, setEmpresa_atual] = useState({cached: '', value: '', disabled: false});
    const [descricao, setDescricao] = useState({cached: '', value: '', disabled: false});
    const [foto, setFoto] = useState<FileEditCandFace>({cached: '', value: null, disabled: false});
    const [curriculo_file, setCurriculo_file] = useState<FileEditCandFace>({cached: '', value: null, disabled: false});

    return (
        <>
        <HeaderProfiles />
        <div className="container mx-auto px-4 pt-20 pb-10">
            {candEdit && (
            <>
            <div className="page-header text-center mb-10">
                <h1 className="text-4xl font-bold gradient-text mb-2">Editar Perfil</h1>
                <p className="text-professional-subtitle text-lg max-w-2xl mx-auto">Atualize suas informações profissionais e
                    pessoais para destacar seu perfil no mercado</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* <!-- Coluna esquerda - Informações pessoais --> */}
                <div className="lg:col-span-8 space-y-6">
                    {/* <!-- Informações Básicas --> */}
                    <div
                        className="gradient-bg rounded-2xl p-8 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in">
                        <h2 className="text-2xl text-center font-semibold mb-8 text-professional-subtitle relative pb-4
                        after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                        after:w-20 after:h-0.5 after:bg-professional-subtitleText after:rounded">
                            <FontAwesomeIcon icon={faUser} className="text-professional-accent mr-2" />Informações Pessoais
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="nomeCompleto"
                                    className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faSignature} className="text-professional-accent mr-2" />Nome Completo
                                </label>
                                <input type="text" id="nomeCompleto"
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: João Silva Santos" />
                            </div>


                            <div>
                                <label htmlFor="cpf"
                                    className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faIdCard} className="text-professional-accent mr-2" />CPF
                                </label>
                                <input type="text" id="cpf"
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: 000.000.000-00" />
                            </div>

                            

                            <div>
                                <label htmlFor="pronomes"
                                    className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faUserTag} className="text-professional-accent mr-2" />Pronomes
                                </label>
                                <select id="pronomes"
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText">
                                    <option value="" disabled selected className="text-professional-subtitle">Selecione seus
                                        pronomes</option>
                                    <option value="Ela/Dela" className="bg-professional-dark">Ela/Dela</option>
                                    <option value="Ele/Dele" className="bg-professional-dark">Ele/Dele</option>
                                    <option value="Elu/Delu" className="bg-professional-dark">Elu/Delu</option>
                                    <option value="Outro" className="bg-professional-dark">Outro</option>
                                    <option value="Prefiro não informar" className="bg-professional-dark">Prefiro não informar
                                    </option>
                                </select>
                            </div>

                            <div id="pronomePersonalizadoContainer" className="hidden">
                                <label htmlFor="pronomePersonalizado"
                                    className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faEdit} className="text-professional-accent mr-2" />Especifique seus pronomes
                                </label>
                                <input type="text" id="pronomePersonalizado"
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: Ela/Dela, Elu/Delu" />
                            </div>
                        </div>
                    </div>

                    {/* <!-- Redes Sociais e Links --> */}
                    <div
                        className="gradient-bg rounded-2xl p-8 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in">
                        <h2 className="text-2xl text-center font-semibold mb-8 text-professional-subtitle relative pb-4
                        after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                        after:w-12 after:h-0.5 after:bg-professional-subtitleText after:rounded">
                            <FontAwesomeIcon icon={faShareAlt} className="text-professional-accent mr-2" />Redes Sociais
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="portfolio"
                                    className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faMagic} className="text-professional-accent mr-2" /> Portfólio
                                </label>
                                <input type="url" id="portfolio"
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: https://seuportfolio.com" />
                            </div>

                            <div>
                                <label htmlFor="github"
                                    className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faGithub} className="text-professional-accent mr-2" /> GitHub
                                </label>
                                <input type="url" id="github"
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: https://github.com/seuusuario" />
                            </div>

                            <div>
                                <label htmlFor="curriculo"
                                    className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faFileInvoice} className="text-professional-accent mr-2" /> Currículo
                                </label>
                                <input type="url" id="curriculo"
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: Link para seu currículo" />
                            </div>

                            <div>
                                <label htmlFor="instagram"
                                    className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faInstagram} className="text-professional-accent mr-2" /> Instagram
                                </label>
                                <input type="url" id="instagram"
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: https://instagram.com/seuusuario" />
                            </div>

                            <div>
                                <label htmlFor="sitePessoal"
                                    className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faGlobe} className="text-professional-accent mr-2" /> Site Pessoal
                                </label>
                                <input type="url" id="sitePessoal"
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: https://seusite.com" />
                            </div>

                            <div>
                                <label htmlFor="twitter"
                                    className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faXTwitter} className="text-professional-accent mr-2" /> Twitter/X
                                </label>
                                <input type="url" id="twitter"
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: https://twitter.com/seuusuario" />
                            </div>
                        </div>
                    </div>
                    {/* <!-- Localização --> */}
                    <div
                        className="gradient-bg rounded-2xl p-8 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in">
                        <h2 className="text-2xl text-center font-semibold mb-8 text-professional-subtitle relative pb-4
                        after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                        after:w-12 after:h-0.5 after:bg-professional-subtitleText after:rounded">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-professional-accent mr-2" />Localização
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="cidade"
                                    className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faCity} className="text-professional-accent mr-2" />Cidade
                                </label>
                                <input type="text" id="cidade"
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: São Paulo" />
                            </div>

                            <div>
                                <label htmlFor="estado"
                                    className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faFlag} className="text-professional-accent mr-2" />Estado
                                </label>
                                <select id="estado"
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20">
                                    <option value="" className="bg-professional-dark" selected>Selecione seu estado</option>
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

                {/* <!-- Coluna direita - Foto de perfil e ações --> */}
                <div className="lg:col-span-4 space-y-6">
                    {/* <!-- Foto de Perfil --> */}
                    <div
                        className="gradient-bg rounded-2xl p-8 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in">
                        <h2 className="text-2xl text-center font-semibold mb-8 text-professional-subtitle relative pb-4
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-12 after:h-0.5 after:bg-professional-subtitleText after:rounded">
                            <FontAwesomeIcon icon={faCamera} className="text-professional-accent mr-2" />Foto de Perfil
                        </h2>

                        <div className="flex flex-col items-center">
                            <div className="relative mb-4">
                                <img id="previewFoto" src="/assets/imgs/genPfp.png" alt="Foto de perfil"
                                    className="w-40 h-40 rounded-full border-4 border-professional-accent object-cover shadow-lg" />

                                <input type="file" id="inputFotoPerfil" accept="image/*" className="hidden" />

                                <button id="btnAlterarFoto"
                                    title="Adicionar Foto"
                                    className="absolute bottom-2 right-2 bg-professional-accent text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-professional-lightaccent transition-all duration-200 transform hover:scale-110">
                                    <FontAwesomeIcon icon={faCamera} />
                                </button>

                                <button id="btnRemoverFoto"
                                    title="Remover Foto"
                                    className="absolute top-2 right-2 bg-red-500 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-110 hidden">
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>

                                <button id="btnVoltarFoto" 
                                    title="Cancelar Edição"
                                    className="absolute top-2 left-2 bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-110 hidden">
                                    <FontAwesomeIcon icon={faUndo} />
                                </button>

                            </div>

                            <p className="text-sm text-professional-subtitle text-center">
                                Use uma foto profissional para destacar seu perfil.
                            </p>
                        </div>
                    </div>

                    {/* <!-- Informações Profissionais --> */}
                    <div
                        className="gradient-bg rounded-2xl p-8 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in">
                        <h2 className="text-2xl text-center font-semibold mb-8 text-professional-subtitle relative pb-4
                        after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                        after:w-12 after:h-0.5 after:bg-professional-subtitleText after:rounded">
                            <FontAwesomeIcon icon={faBriefcase} className="text-professional-accent mr-2" />Informações Profissionais
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="cargoAtual"
                                    className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faUserTie} className="text-professional-accent mr-2" />Cargo Atual
                                </label>
                                <input type="text" id="cargoAtual"
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: Desenvolvedor Full Stack" />
                            </div>

                            <div>
                                <label htmlFor="empresaAtual"
                                    className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faBuilding} className="text-professional-accent mr-2" />Empresa Atual
                                </label>
                                <input type="text" id="empresaAtual"
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: Tech Solutions Ltda" />
                            </div>
                        </div>
                    </div>

                    {/* <!-- Imagem --> */}
                    <div
                        className="gradient-bg rounded-2xl p-3 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in h-56">
                        <label className="block text-professional-subtitle h-10 font-medium">Arquivo do Currículo
                            (Opcional)<button id="btnVoltarArquivo" 
                                    title="Cancelar Edição"
                                    className="bg-professional-accent rounded-full w-6 h-6 ml-2 justify-center items-center hidden">
                                    <FontAwesomeIcon icon={faUndo} />
                                </button></label>
                        <div className="image-upload-container relative border-2 border-dashed border-professional-card rounded-xl p-1 text-center transition-all bg-professional-dark/50 cursor-pointer min-h-[150px] flex flex-col justify-center items-center hover:border-professional-accent hover:bg-professional-accent/5"
                            id="uploadArea">
                            <div className="upload-content flex flex-col items-center -mt-4" id="uploadContent">
                                <i className='bx bx-cloud-upload text-5xl text-professional-accent mb-4'></i>
                                <div className="upload-text text-professional-subtitle mb-4">
                                    <h3 className="text-xl font-medium mb-2">Adicionar Arquivo</h3>
                                    <p className="text-sm">Arraste um arquivo ou clique para selecionar</p>
                                    <p className="text-sm">Formatos: JPG, JPEG, PNG, WEBP, PDF, DOC, DOCX, TXT, RTF, ODT (Máx. 5MB)</p>
                                </div>

                            </div>

                            <div className="image-preview hidden w-full h-full rounded-xl overflow-hidden relative"
                                id="imagePreview">
                                <img id="previewImage" src="" alt="Pré-visualização" className="w-full h-full object-cover" />
                                <div
                                    className="preview-actions absolute bottom-0 left-0 right-0 gradient-overlay p-4 flex justify-center gap-2">
                                    <button type="button"
                                        className="preview-btn bg-white/20 text-white px-4 py-2 rounded-md text-sm cursor-pointer transition-colors hover:bg-white/30 backdrop-blur-custom"
                                        id="changeImage">Alterar</button>
                                    <button type="button"
                                        className="preview-btn delete bg-red-500/70 hover:bg-red-500/90 text-white px-4 py-2 rounded-md text-sm cursor-pointer transition-colors backdrop-blur-custom z-10"
                                        id="removeImage">Remover</button>
                                </div>
                            </div>

                            <input id="imgPlaceholder" type="file" accept="image/*,.pdf,.doc,.docx,.txt,.rtf,.odt"
                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>

                        <div className="file-info hidden items-center gap-2 mt-4 p-3 bg-professional-accent/10 rounded-lg border-l-4 border-professional-accent"
                            id="fileInfo">
                            <i className='bx bx-file text-professional-accent'></i>
                            <div className="file-name flex-1 text-sm text-professional-subtitle" id="fileName">Nome do arquivo
                            </div>
                            <div className="file-size text-xs text-professional-subtitle" id="fileSize">0 KB</div>
                        </div>
                    </div>


                </div>
            </div>

            {/* <!-- Resumo Profissional --> */}
            <div
                className="gradient-bg rounded-2xl p-4 mt-5 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in">
                <h2 className="text-2xl text-center font-semibold mb-8 text-professional-subtitle relative pb-4
                        after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                        after:w-12 after:h-0.5 after:bg-professional-subtitleText after:rounded">
                    <FontAwesomeIcon icon={faFileAlt} className="text-professional-accent mr-2" />Resumo Profissional
                </h2>

                <div>
                    <label htmlFor="resumoProfissional" className="block text-professional-subtitle mb-2 font-medium">Resumo</label>
                    <textarea id="resumoProfissional" rows={6} maxLength={500}
                        className="w-full h-48 p-6 bg-professional-dark border border-professional-card rounded-xl text-professional-text resize-y transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                        placeholder="Descreva sua experiência profissional, habilidades e objetivos de carreira. Seja específico e use métricas quando possível."></textarea>
                    <div className="flex justify-between mt-2">
                        <span className="text-xs text-professional-subtitle">Máximo de 500 caracteres</span>
                        <span id="contadorCaracteres" className="text-xs text-professional-subtitle">0/500</span>
                    </div>
                </div>
            </div>

            {/* <!-- Botões de Ação --> */}
            <div className="mt-10 flex justify-center space-x-4">
                <button id="btnSalvar"
                    className="flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-xl transition-all bg-linear-to-r from-professional-accent to-professional-lightaccent text-white shadow-lg shadow-professional-accent/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-professional-accent/40 cursor-pointer">
                    <FontAwesomeIcon icon={faSave} />Salvar Alterações
                </button>
                <button id="btnCancelar" onClick={()=>navigate('/perfil/candidato')}
                    className="flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-xl transition-all bg-professional-card text-professional-subtitle hover:bg-professional-card/80 hover:-translate-y-1 cursor-pointer">
                    <FontAwesomeIcon icon={faTimes} />Cancelar
                </button>
            </div>

            {/* <!-- Mensagem de Status --> */}
            <div id="mensagemStatus" className="hidden mt-6 p-4 rounded-lg text-center"></div>
            </>
            )}
        </div>
        </>
    )
}