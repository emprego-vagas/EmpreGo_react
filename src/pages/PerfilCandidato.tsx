import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { DadosUsuario } from "../utils/globalFunctions";
import axiosWe from "../utils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBirthdayCake, faBriefcase, faBuilding, faEdit, faIdCard, faMapMarkerAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import genPfp from '../assets/imgs/genPfp.png';

export default function PerfilCandidato() {
    const navigate = useNavigate();
    const [usuario] = useState(DadosUsuario.getUsuario(true, 'candidato'));
    if(!usuario) {
        setTimeout(()=>{
            navigate('/')
        }, 3000)
    };
    const [candPerfil, setCandPerfil] = useState({});
    const [customPerfil, setCustomPerfil] = useState({});

    useEffect(()=>{
        console.log('opa');
        async function loadCand(){
            try {
                const response = await axiosWe('/custom/perfil-candidato');
                const data = response.data;
                const {usua, custom} = data;
                DadosUsuario.setarFoto(usua.foto);
                DadosUsuario.setarNome(usua.nome);
                setCandPerfil(usua);
                setCustomPerfil(custom);
            } catch (erro) {
                console.error("Erro ao carregar perfil do candidato:", erro);
            }
        };
        loadCand();
    },[]);
    return (
        <div id="main" className="container mx-auto px-4 pt-28 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* <!-- Coluna esquerda - Informações principais --> */}
                <div id="bodyLeft" className="lg:col-span-8 flex flex-col lg:flex-row gap-6">
                    {/* <!-- Informações importantes --> */}
                    <div id="impInfo"
                        className="bg-professional-card rounded-xl border border-professional-card p-6 lg:w-1/3 flex flex-col items-center transition-all duration-300 ease-in-out hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                        <img id="fotoUsuario" src={candPerfil.foto==='/assets/imgs/genPfp.png'?genPfp:candPerfil.foto} alt="Foto de perfil"
                            className="w-40 h-40 rounded-full border-4 border-professional-accent object-cover mb-4"
                            title="Foto de Perfil"/>
                        <div className="w-full space-y-2 mb-6">
                            <div className="bg-professional-gray rounded-lg p-3" title="CPF">
                                <FontAwesomeIcon icon={faIdCard} className="text-professional-accent mr-2" />
                                <span id="cpfUsuario" className="text-sm">XXX.XXX.XXX-XX</span>
                            </div>
                            <div className="bg-professional-gray rounded-lg p-3" title="Data de Nascimento">
                                <FontAwesomeIcon icon={faBirthdayCake} className="text-professional-accent mr-2" />
                                <span id="nascUsuario" className="text-sm">XX/XX/XXXX</span>
                            </div>

                            <div className="bg-professional-gray rounded-lg p-3" title="Pronomes">
                                <FontAwesomeIcon icon={faUser} className="text-professional-accent mr-2" />
                                <span id="pronUsuario" className="text-sm">Elx/Delx</span>
                            </div>

                            <div className="bg-professional-gray rounded-lg p-3" title="Cargo Atual">
                                <FontAwesomeIcon icon={faBriefcase} className="text-professional-accent mr-2" />
                                <span id="cargoUsuario" className="text-sm">Cargo Atual</span>
                            </div>
                            <div className="bg-professional-gray rounded-lg p-3" title="Empresa Atual">
                                <FontAwesomeIcon icon={faBuilding} className="text-professional-accent mr-2" />
                                <span id="empresaUsuario" className="text-sm">Empresa Atual</span>
                            </div>
                            <div id="divLocalizacao" className="bg-professional-gray rounded-lg p-3" title="Localização">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-professional-accent mr-2" />
                                <span id="localizacaoUsuario" className="text-sm">Localização</span><br/>
                                <span id="estadoUsuario" className="text-sm">Estado: (XX)</span><br/>
                                <span id="cidadeUsuario" className="text-sm">Cidade: (Nenhuma)</span>
                            </div>

                        </div>
                        <button id="btnEditarPerfil" onClick={()=>{navigate('/perfil/candidato/editar')}}
                            className="bg-professional-accent text-white font-medium py-2.5 px-5 rounded-lg w-full transition-all duration-200 ease-in-out hover:bg-professional-lightaccent cursor-pointer"
                            title="Editar Perfil">
                            <FontAwesomeIcon icon={faEdit} className="mr-2" />Editar Perfil
                        </button>
                    </div>

                    {/* <!-- Informações centrais --> */}
                    <div id="bodyMid"
                        className="bg-professional-card rounded-xl border border-professional-card p-6 lg:w-2/3 flex flex-col transition-all duration-300 ease-in-out hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                        <h1 id="nomUsuario" className="text-3xl font-bold mb-2 text-center lg:text-left">Nome Completo</h1>
                        <div className="flex items-center justify-center lg:justify-start mb-4">
                            <i className="fas fa-envelope text-professional-accent mr-2" title="Email"></i>
                            <a id="emailUsuario"
                                className="text-lg text-professional-subtitle">email.profissional@empresa.com</a>
                        </div>

                        <div className="bg-professional-gray rounded-lg p-4 mb-6">
                            <h2 className="text-lg text-center font-semibold mb-2 text-professional-accent relative pb-3
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-10 after:h-0.5 after:bg-professional-accent after:rounded">
                                Resumo Profissional
                            </h2>

                            <p id="descUsuario" className="text-professional-subtitle text-center">
                                Profissional com X anos de experiência na área de [sua área], especializado em [suas
                                especialidades].
                                Possuo expertise em [tecnologias/ferramentas] e experiência comprovada em
                                [projetosrelevantes].
                                Busco oportunidades desafiadoras para aplicar minhas habilidades e contribuir para o
                                crescimento
                                da organização.
                            </p>
                        </div>


                        <div id="conexoes" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center bg-professional-gray rounded-lg p-3">
                                <i className="fas fa-magic text-professional-accent mr-3 text-xl" title="Portfólio"></i>
                                <a id="portUsuario" href="#"
                                    className="nomeRedeSoc text-professional-subtitle hover:text-professional-accent transition-colors"
                                    target="_blank">
                                    Portfólio
                                </a>
                            </div>

                            <div className="flex items-center bg-professional-gray rounded-lg p-3">
                                <i className="fab fa-github text-professional-accent mr-3 text-xl" title="GitHub"></i>
                                <a id="gitUsuario" href="#"
                                    className="nomeRedeSoc text-professional-subtitle hover:text-professional-accent transition-colors"
                                    target="_blank">
                                    GitHub
                                </a>
                            </div>

                            <div className="flex items-center bg-professional-gray rounded-lg p-3">
                                <i className="fas fa-file-invoice text-professional-accent mr-3 text-xl"
                                    title="Currículo"></i>
                                <a id="curriculoUsuario" href="#"
                                    className="nomeRedeSoc text-professional-subtitle hover:text-professional-accent transition-colors"
                                    target="_blank">
                                    Currículo
                                </a>
                                <p id="curriculoSize" className="hidden ml-auto"></p>
                                <i id="downloadCurriculo" className="fa-solid fa-download text-lg cursor-pointer hidden ml-2" title="Download do Currículo"></i>
                            </div>

                            <div className="flex items-center bg-professional-gray rounded-lg p-3">
                                <i className="fab fa-instagram text-professional-accent mr-3 text-xl" title="Instagram"></i>
                                <a id="instUsuario" href="#"
                                    className="nomeRedeSoc text-professional-subtitle hover:text-professional-accent transition-colors"
                                    target="_blank">
                                    Instagram
                                </a>
                            </div>

                            <div className="flex items-center bg-professional-gray rounded-lg p-3">
                                <i className="fas fa-globe text-professional-accent mr-3 text-xl" title="Site Pessoal"></i>
                                <a id="siteUsuario" href="#"
                                    className="nomeRedeSoc text-professional-subtitle hover:text-professional-accent transition-colors"
                                    target="_blank">
                                    Site Pessoal
                                </a>
                            </div>

                            <div className="flex items-center bg-professional-gray rounded-lg p-3">
                                <i className="fab fa-x-twitter text-professional-accent mr-3 text-xl" title="Twitter/X"></i>
                                <a id="twtUsuario" href="#"
                                    className="twtUsuario text-professional-subtitle hover:text-professional-accent transition-colors"
                                    target="_blank">
                                    Twitter/X
                                </a>
                            </div>
                        </div>

                        <div id="formacaoInfo" className="bg-professional-gray rounded-lg p-4">

                            <h2 className="text-lg text-center font-semibold mb-2 text-professional-accent relative pb-3
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-10 after:h-0.5 after:bg-professional-accent after:rounded">
                                Formação Acadêmica</h2>

                            <div className="space-y-3">
                                <div>
                                    <h3 className="font-medium text-white text-center">Bacharelado em [Área]</h3>
                                    <p className="text-professional-subtitle text-sm text-center">Universidade [Nome] • [Ano
                                        de
                                        Conclusão]
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-white text-center">Pós-graduação em [Especialização]
                                    </h3>
                                    <p className="text-professional-subtitle text-sm text-center">Instituição [Nome] • [Ano
                                        de
                                        Conclusão]
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-white text-center">Tecnologo em [Especialização]</h3>
                                    <p className="text-professional-subtitle text-sm text-center">Instituição [Nome] • [Ano
                                        de
                                        Conclusão]
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- Coluna direita - Habilidades e Estatísticas --> */}
                <div id="bodyTags" className="lg:col-span-4 space-y-6">
                    <div
                        className="bg-professional-card rounded-xl border border-professional-card p-6 transition-all duration-300 ease-in-out hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                        <h1 id="tituloTags" className="text-lg text-center font-semibold mb-2 text-professional-accent relative pb-3
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-10 after:h-0.5 after:bg-professional-accent after:rounded">
                            Habilidades & Competências</h1>
                        <div id="boxTags"
                            className="bg-professional-gray rounded-lg p-4 border border-professional-card min-h-[120px]">
                            <div id="Tags" className="flex flex-wrap gap-3">
                                {/* <!-- Tags serão adicionadas aqui dinamicamente --> */}
                                <button id="maisTags"
                                    className="inline-flex items-center gap-1.5 py-2 px-4 bg-gradient-to-br from-professional-gray to-professional-card text-professional-text text-sm font-medium rounded-lg border border-professional-card cursor-default transition-all duration-200 ease-in-out hover:border-professional-accent hover:-translate-y-0.5"
                                    title="Carregar mais Habilidades">
                                    <i className="fas fa-plus text-professional-accent"></i>
                                </button>
                            </div>
                            <button id="btnAddTags"
                                className="mt-4 flex items-center text-professional-accent hover:text-professional-lightaccent transition-colors"
                                title="Adicionar Habilidade">
                                <i className="fas fa-plus-circle mr-2"></i>
                                Adicionar habilidade
                            </button>
                        </div>
                    </div>

                    {/* <!-- Estatísticas --> */}
                    <div
                        className="bg-professional-card rounded-xl border border-professional-card p-6 transition-all duration-300 ease-in-out hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                        <h2 className="text-lg text-center font-semibold mb-2 text-professional-accent relative pb-3
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-10 after:h-0.5 after:bg-professional-accent after:rounded">
                            Métricas Profissionais</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                className="bg-gradient-to-br from-professional-gray to-professional-card rounded-lg p-5 text-center border border-professional-card">
                                <div id="experienciasCount" className="text-[2rem] font-bold text-professional-accent mb-1">
                                    12</div>
                                <div className="text-sm text-professional-subtitle">Experiências</div>
                            </div>
                            <div
                                className="bg-gradient-to-br from-professional-gray to-professional-card rounded-lg p-5 text-center border border-professional-card">
                                <div className="text-[2rem] font-bold text-professional-accent mb-1">15</div>
                                <div className="text-sm text-professional-subtitle">Certificações</div>
                            </div>
                            <div
                                className="bg-gradient-to-br from-professional-gray to-professional-card rounded-lg p-5 text-center border border-professional-card">
                                <div id="projetosCount" className="text-[2rem] font-bold text-professional-accent mb-1">15
                                </div>
                                <div className="text-sm text-professional-subtitle">Projetos</div>
                            </div>
                            <div
                                className="bg-gradient-to-br from-professional-gray to-professional-card rounded-lg p-5 text-center border border-professional-card">
                                <div className="text-[2rem] font-bold text-professional-accent mb-1">4</div>
                                <div className="text-sm text-professional-subtitle">Formações</div>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Idiomas --> */}
                    <div
                        className="bg-professional-card rounded-xl border border-professional-card p-6 transition-all duration-300 ease-in-out hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                        <h2 className="text-lg text-center font-semibold mb-2 text-professional-accent relative pb-3
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-10 after:h-0.5 after:bg-professional-accent after:rounded">
                            Idiomas</h2>
                        <button id="btnAddIdiomas"
                            className="mt-4 flex items-center text-professional-accent hover:text-professional-lightaccent transition-colors">
                            <i className="fas fa-plus-circle mr-2"></i>
                            Adicionar Idioma
                        </button>
                        <div id="divIdiomasExib" className="space-y-3">
                            <button id="maisIdiomas"
                                className="inline-flex items-center gap-1.5 py-2 px-4 bg-gradient-to-br from-professional-gray to-professional-card text-professional-text text-sm font-medium rounded-lg border border-professional-card cursor-default transition-all duration-200 ease-in-out hover:border-professional-accent hover:-translate-y-0.5">
                                <i className="fas fa-plus text-professional-accent"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Dashboard com abas --> */}
            <div className="mt-10">
                {/* <!-- Navegação por abas --> */}
                <div className="border-b border-professional-card mb-6">
                    <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" id="dashboard-tabs">
                        <li className="mr-2">
                            <button id="experienciasTelinha" className="tab-button relative inline-block p-4 text-professional-subtitle hover:text-gray-300
                            after:content-[''] after:absolute after:-bottom-0 after:left-0 after:w-full after:h-0.5
                            after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="experiencias">
                                <i className="fas fa-briefcase mr-2"></i>Experiências
                            </button>
                        </li>
                        <li className="mr-2">
                            <button className="tab-button relative inline-block p-4 text-professional-subtitle hover:text-gray-300
                            after:content-[''] after:absolute after:-bottom-0 after:left-0 after:w-full after:h-0.5
                            after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="certificacoes">
                                <i className="fas fa-certificate mr-2"></i>Certificações
                            </button>
                        </li>
                        <li className="mr-2">
                            <button className="tab-button relative inline-block p-4 text-professional-subtitle hover:text-gray-300
                            after:content-[''] after:absolute after:-bottom-0 after:left-0 after:w-full after:h-0.5
                            after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="projetos">
                                <i className="fas fa-project-diagram mr-2"></i>Projetos
                            </button>
                        </li>
                        <li className="mr-2">
                            <button className="tab-button relative inline-block p-4 text-professional-subtitle hover:text-gray-300
                            after:content-[''] after:absolute after:-bottom-0 after:left-0 after:w-full after:h-0.5
                            after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="formacoes">
                                <div className="relative">
                                    <i className="fa-solid fa-book mr-2"></i>Formações
                                </div>
                            </button>
                        </li>
                        <li className="mr-2">
                            <button className="tab-button relative inline-block p-4 text-professional-subtitle hover:text-gray-300
                            after:content-[''] after:absolute after:-bottom-0 after:left-0 after:w-full after:h-0.5
                            after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="solicitacoes">
                                <div className="relative">
                                    <i className="fas fa-handshake mr-2"></i>Solicitações
                                </div>
                            </button>
                        </li>
                        <li className="mr-2">
                            <button className="tab-button relative inline-block p-4 text-professional-subtitle hover:text-gray-300
                            after:content-[''] after:absolute after:-bottom-0 after:left-0 after:w-full after:h-0.5
                            after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="notificacoes">
                                <div className="relative">
                                    <i className="fas fa-bell mr-2"></i>Notificações
                                </div>
                            </button>
                        </li>
                        <li className="mr-2">
                            <button className="tab-button relative inline-block p-4 text-professional-subtitle hover:text-gray-300
                            after:content-[''] after:absolute after:-bottom-0 after:left-0 after:w-full after:h-0.5
                            after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="recomendacoes">
                                <div className="relative">
                                    <i className="fas fa-star mr-2"></i>Favoritos
                                </div>
                            </button>
                        </li>
                    </ul>
                </div>

                {/* <!-- Conteúdo das abas --> */}
                <div id="tab-content">
                    {/* <!-- Aba Experiências --> */}
                    <div id="experiencias" className="tab-pane active">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="bodyBottom">
                            <div id="boxCriar"
                                className="bg-professional-card rounded-xl border-2 border-dashed border-professional-card p-5 flex flex-col items-center justify-center transition-colors cursor-pointer h-full min-h-[200px] hover:border-professional-accent"
                                onClick={()=>{navigate('/experiencias/criar')}}>
                                <a href="/experiencias/criar" className="flex flex-col items-center text-center">
                                    <i className="fas fa-plus-circle text-4xl text-professional-accent mb-3"></i>
                                    <p id="textCriar" className="text-professional-subtitle">Adicionar nova experiência
                                        profissional</p>
                                </a>
                            </div>

                            {/* <!-- Experiências adicionadas aparecerão aqui --> */}
                            
                        </div>
                    </div>

                    {/* <!-- Aba Certificações --> */}
                    <div id="certificacoes" className="tab-pane hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div id="boxCriar"
                                className="bg-professional-card rounded-xl border-2 border-dashed border-professional-card p-5 flex flex-col items-center justify-center transition-colors cursor-pointer h-full min-h-[200px] hover:border-professional-accent">
                                <a href="/experiencias/criar" className="flex flex-col items-center text-center">
                                    <i className="fas fa-plus-circle text-4xl text-professional-accent mb-3"></i>
                                    <p id="textCriar" className="text-professional-subtitle">Adicionar novas Certificações
                                    </p>
                                </a>
                            </div>
                            <div
                                className="bg-professional-card rounded-xl border border-professional-card p-5 transition-all duration-300 ease-in-out hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-white">PMP - Project Management Professional
                                    </h3>
                                    <span
                                        className="bg-professional-accent text-white text-xs font-medium px-2.5 py-0.5 rounded">2022</span>
                                </div>
                                <p className="text-professional-subtitle mb-4">Project Management Institute</p>
                                <p className="text-professional-subtitle text-sm">Certificação internacional em
                                    gerenciamento de
                                    projetos reconhecida globalmente.</p>
                            </div>

                            <div
                                className="bg-professional-card rounded-xl border border-professional-card p-5 transition-all duration-300 ease-in-out hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-white">Scrum Master Certified</h3>
                                    <span
                                        className="bg-professional-accent text-white text-xs font-medium px-2.5 py-0.5 rounded">2021</span>
                                </div>
                                <p className="text-professional-subtitle mb-4">Scrum Alliance</p>
                                <p className="text-professional-subtitle text-sm">Certificação em metodologias ágeis e
                                    framework
                                    Scrum.</p>
                            </div>

                            <div
                                className="bg-professional-card rounded-xl border border-professional-card p-5 transition-all duration-300 ease-in-out hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-white">Google Analytics Certification</h3>
                                    <span
                                        className="bg-professional-accent text-white text-xs font-medium px-2.5 py-0.5 rounded">2020</span>
                                </div>
                                <p className="text-professional-subtitle mb-4">Google</p>
                                <p className="text-professional-subtitle text-sm">Certificação em análise de dados e
                                    métricas
                                    digitais.</p>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Aba Projetos --> */}
                    <div id="projetos" className="tab-pane hidden">
                        <div id="projetosExib" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div id="boxCriar"
                                className="bg-professional-card rounded-xl border-2 border-dashed border-professional-card p-5 flex flex-col items-center justify-center transition-colors cursor-pointer h-full min-h-[200px] hover:border-professional-accent"
                                onClick={()=>{navigate('/projetos/criar')}}>
                                <a href="/projetos/criar" className="flex flex-col items-center text-center">
                                    <i className="fas fa-plus-circle text-4xl text-professional-accent mb-3"></i>
                                    <p id="textCriar" className="text-professional-subtitle">Adicionar novos projetos</p>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Aba formações --> */}
                    <div id="formacoes" className="tab-pane hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div id="boxCriar"
                                className="bg-professional-card rounded-xl border-2 border-dashed border-professional-card p-5 flex flex-col items-center justify-center transition-colors cursor-pointer h-full min-h-[200px] hover:border-professional-accent">
                                <a href="/experiencias/criar" className="flex flex-col items-center text-center">
                                    <i className="fas fa-plus-circle text-4xl text-professional-accent mb-3"></i>
                                    <p id="textCriar" className="text-professional-subtitle">Adicionar uma nova formação</p>
                                </a>
                            </div>
                            <div
                                className="bg-professional-card rounded-xl border border-professional-card p-5 transition-all duration-300 ease-in-out hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-white">Sistema de Gestão Empresarial</h3>
                                    <span
                                        className="bg-professional-accent text-white text-xs font-medium px-2.5 py-0.5 rounded">Concluído</span>
                                </div>
                                <p className="text-professional-subtitle mb-4">Tech Solutions Ltda • 2022</p>
                                <p className="text-professional-subtitle text-sm mb-4">Desenvolvimento de sistema integrado
                                    para
                                    gestão de processos empresariais, resultando em aumento de 30% na eficiência
                                    operacional.</p>
                                <div className="flex flex-wrap gap-2">
                                    <span
                                        className="bg-professional-gray text-professional-subtitle text-xs px-2 py-1 rounded">Java</span>
                                    <span
                                        className="bg-professional-gray text-professional-subtitle text-xs px-2 py-1 rounded">Spring
                                        Boot</span>
                                    <span
                                        className="bg-professional-gray text-professional-subtitle text-xs px-2 py-1 rounded">PostgreSQL</span>
                                </div>
                            </div>

                            <div
                                className="bg-professional-card rounded-xl border border-professional-card p-5 transition-all duration-300 ease-in-out hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-white">Plataforma de E-learning</h3>
                                    <span
                                        className="bg-professional-accent text-white text-xs font-medium px-2.5 py-0.5 rounded">Em
                                        Andamento</span>
                                </div>
                                <p className="text-professional-subtitle mb-4">Inovação Digital S.A. • 2023</p>
                                <p className="text-professional-subtitle text-sm mb-4">Desenvolvimento de plataforma
                                    educacional
                                    com foco em experiência do usuário e acessibilidade.</p>
                                <div className="flex flex-wrap gap-2">
                                    <span
                                        className="bg-professional-gray text-professional-subtitle text-xs px-2 py-1 rounded">React</span>
                                    <span
                                        className="bg-professional-gray text-professional-subtitle text-xs px-2 py-1 rounded">Node.js</span>
                                    <span
                                        className="bg-professional-gray text-professional-subtitle text-xs px-2 py-1 rounded">MongoDB</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Aba Recomendações --> */}
                    <div id="recomendacoes" className="tab-pane hidden">
                        <div
                            className="bg-professional-card rounded-xl border border-professional-card overflow-hidden transition-all duration-300 ease-in-out hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                            <div className="border-b border-professional-card px-6 py-4">
                                <h3 className="text-lg font-semibold text-white">Recomendações de Colegas</h3>
                            </div>
                            <div className="divide-y divide-professional-card">
                                <div className="p-6">
                                    <div className="flex items-start">
                                        <img src="/assets/imgs/genPfp.png" alt="User"
                                            className="w-12 h-12 rounded-full mr-4"/>
                                        <div>
                                            <h4 className="font-medium text-white">Maria Silva</h4>
                                            <p className="text-professional-subtitle">Diretora de Projetos na Tech Solutions
                                            </p>
                                            <div className="flex text-yellow-400 my-2">
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                            </div>
                                            <p className="text-professional-subtitle">"Profissional excepcional com grande
                                                capacidade de liderança e resolução de problemas. Sempre entrega
                                                resultados
                                                além do esperado."</p>
                                            <p className="text-xs text-professional-subtitle mt-2">Há 3 meses</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-start">
                                        <img src="/assets/imgs/genPfp.png" alt="User"
                                            className="w-12 h-12 rounded-full mr-4"/>
                                        <div>
                                            <h4 className="font-medium text-white">João Santos</h4>
                                            <p className="text-professional-subtitle">CTO na Inovação Digital</p>
                                            <div className="flex text-yellow-400 my-2">
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                            </div>
                                            <p className="text-professional-subtitle">"Um dos melhores profissionais com
                                                quem já
                                                trabalhei. Sua expertise técnica e visão estratégica foram fundamentais
                                                para
                                                o sucesso de nossos projetos."</p>
                                            <p className="text-xs text-professional-subtitle mt-2">Há 6 meses</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Modais --> */}
            <div id="modalInput"
                className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 hidden">
                <div id="modalInput-content"
                    className="bg-professional-card p-6 rounded-xl w-11/12 max-w-md border border-professional-card">
                    <h3 className="text-lg font-semibold mb-4">Adicionar Habilidade</h3>
                    <input type="text" id="inputTag" placeholder="Digite a habilidade"
                        className="w-full bg-professional-gray border border-professional-card rounded-lg px-4 py-3 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-professional-accent"/>
                    <div className="flex justify-end space-x-3">
                        <button id="btnCancelar"
                            className="bg-professional-card text-professional-subtitle font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out hover:bg-professional-gray">Cancelar</button>
                        <button id="btnConfirmar"
                            className="bg-professional-accent text-white font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out hover:bg-professional-lightaccent">Confirmar</button>
                    </div>
                </div>
            </div>

            <div id="modalDelete"
                className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 hidden">
                <div id="modalDelete-content"
                    className="bg-professional-card p-6 rounded-xl w-11/12 max-w-md border border-professional-card">
                    <h3 className="text-lg font-semibold mb-4 text-center">Confirmar exclusão</h3>
                    <p className="text-professional-subtitle text-center mb-6">Tem certeza que deseja remover esta
                        habilidade?
                    </p>
                    <div className="flex justify-center space-x-3">
                        <button id="btnCancelarDel"
                            className="bg-professional-card text-professional-subtitle font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out hover:bg-professional-gray">Cancelar</button>
                        <button id="btnConfirmarDel"
                            className="bg-red-600 text-white font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out hover:bg-red-700">Confirmar</button>
                    </div>
                </div>
            </div>

            {/* <!-- * Modais de Idiomas --> */}
            <div id="modalInputIdioma"
                className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 hidden">
                <div id="modalInputIdioma-content"
                    className="bg-professional-card p-6 rounded-xl w-11/12 max-w-md border border-professional-card">
                    <h3 className="text-lg font-semibold mb-4">Adicionar Idioma</h3>
                    <input type="text" id="inputIdioma" placeholder="Digite o Idioma"
                        className="w-full bg-professional-gray border border-professional-card rounded-lg px-4 py-3 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-professional-accent"/>
                    <label htmlFor="selectNivelIdioma" className="block text-professional-subtitle mb-2 font-medium">
                        Nível do Idioma
                    </label>
                    <select id="selectNivelIdioma"
                        className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 mb-4">

                        {/* <!-- Opção padrão --> */}
                        <option value="" disabled selected className="text-professional-subtitle">Adicione o Nível do Idioma
                        </option>

                        <option value="A1" className="bg-professional-dark">Iniciante(A1)</option>
                        <option value="A2" className="bg-professional-dark">Básico(A2)</option>
                        <option value="B1" className="bg-professional-dark">Intermediário(B1)</option>
                        <option value="B2" className="bg-professional-dark">Intermediário Avançado(B2)</option>
                        <option value="C1" className="bg-professional-dark">Avançado(C1)</option>
                        <option value="C2" className="bg-professional-dark">Fluente(C2)</option>
                    </select>
                    <div className="flex justify-end space-x-3">
                        <button id="btnCancelarIdioma"
                            className="bg-professional-card text-professional-subtitle font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out hover:bg-professional-gray">Cancelar</button>
                        <button id="btnConfirmarIdioma"
                            className="bg-professional-accent text-white font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out hover:bg-professional-lightaccent">Confirmar</button>
                    </div>
                </div>
            </div>

            <div id="modalDeleteIdioma"
                className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 hidden">
                <div id="modalDeleteIdioma-content"
                    className="bg-professional-card p-6 rounded-xl w-11/12 max-w-md border border-professional-card">
                    <h3 className="text-lg font-semibold mb-4 text-center">Confirmar exclusão</h3>
                    <p className="text-professional-subtitle text-center mb-6">Tem certeza que deseja remover este
                        idioma?
                    </p>
                    <div className="flex justify-center space-x-3">
                        <button id="btnCancelarDelIdioma"
                            className="bg-professional-card text-professional-subtitle font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out hover:bg-professional-gray">Cancelar</button>
                        <button id="btnConfirmarDelIdioma"
                            className="bg-red-600 text-white font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out hover:bg-red-700">Confirmar</button>
                    </div>
                </div>
            </div>
            {/* <!-- * Fim modais idiomas --> */}

        </div>
    )
}