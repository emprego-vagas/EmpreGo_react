import { faGithub, faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faAward, faBell, faBriefcase, faBuilding, faCalendarAlt, faChevronLeft, faChevronRight, faCogs, faCommentAlt, faEdit, faEnvelope, faGlobe, faHandshake, faIdCard, faIndustry, faMap, faMapMarkerAlt, faPhone, faPlus, faPlusCircle, faProjectDiagram, faStar, faUser, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom"
import HeaderProfiles from "../components/HeaderProfiles";
import ThemeToggle from "../components/ThemeTogle";
import { DadosUsuario, mostrarErroTopo } from "../utils/globalFunctions";
import { useEffect, useRef, useState } from "react";
import axiosWe from "../utils/axiosInstance";
import type { CustomEmp, Empresa, Tag } from "../utils/utilsInterfaces";
import Loader from "../components/Loader";
import genPfp from '../assets/imgs/genPfp.png';

export default function PerfilEmpresa () {
    const navigate = useNavigate();
    const [usuario] = useState(DadosUsuario.getUsuario(true, 'empresa'));
    if(!usuario) {
        setTimeout(()=>{
            navigate('/');
        }, 3000);
    };

    const [empPerfil, setEmpPerfil] = useState<Empresa | null>(null);
    const [customPerfil, setCustomPerfil] = useState<CustomEmp | null>(null);

    // * Tags session
    const [mostrarModalRmvTag, setMostrarModalRmvTag] = useState(false);
    const [tagToRemove, setTagToRemove] = useState({nome: '', id: ''});
    const [mostrarMaisTagsExib, setMostrarMaisTagsExib] = useState(true);
    const mostrarMaisTagsRef = useRef(null);
    const [mostrarMaisTags, setMostrarMaisTags] = useState(true);
    const [mostrarModalAddTag, setMostrarModalAddTag] = useState(false);
    const [tagToAdd, setTagToAdd] = useState('');
    const handleMostrarTodasTags = async()=>{
        try {
            if(customPerfil.tags_count<=6) {
                setMostrarMaisTags(false);
                setMostrarMaisTagsExib(false);
                return;
            };
            setMostrarMaisTags(false);
            const response = await axiosWe(`/tags/empresas?offset=6`) as {data: Tag[]};
            setCustomPerfil(prev=>({...prev, tags_empresas: [...prev.tags_empresas, ...response.data]}));
            setMostrarMaisTagsExib(false);
        } catch (erro) {
            setMostrarMaisTags(true);
            setMostrarMaisTagsExib(true);
            console.error('Erro ao mostrar todas as tags:',erro);
        }
    }
    const adicionarTagRef = useRef(null);
    const handleKeyDownInputTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            adicionarTagRef.current?.click();
        }
    }
    // * End tag session

    useEffect(()=>{
        async function loadEmp(){
            if(!usuario) return;
            try {
                const response = await axiosWe('/custom/perfil-empresa') as {data: {usua: Empresa, custom: CustomEmp}};
                const data = response.data;
                const { usua, custom } = data;
                DadosUsuario.setarFoto(usua.foto);
                DadosUsuario.setarNome(usua.nome_fant);
                setEmpPerfil(usua);
                setCustomPerfil(custom);
                console.log(data);
            } catch (erro) {
                console.error("Erro ao carregar perfil da empresa:", erro);
            };
        };
        loadEmp();
    }, [usuario]);

    if(!empPerfil) return (<Loader />)

    return (
        <>
        <HeaderProfiles />
        <div id="main" className="container mx-auto px-4 pt-10 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* <!--* Coluna esquerda - Informações principais --> */}
                <div id="bodyLeft" className="lg:col-span-8 flex flex-col lg:flex-row gap-6">
                    {/* <!--* Informações importantes --> */}
                    <div id="impInfo"
                        className="bg-professional-card rounded-xl border border-professional-card p-6 lg:w-1/3 flex flex-col items-center transition-all duration-300 ease-in-out hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                        <img id="fotoUsuario" src={empPerfil.foto==='/assets/imgs/genPfp.png'?genPfp:empPerfil.foto} alt="Foto de perfil"
                            className="w-40 h-40 rounded-full border-4 border-professional-accent object-cover mb-4"
                            title="Foto de Perfil" />
                        <div className="w-full space-y-2 mb-6">
                            <div className="bg-professional-gray rounded-lg p-3" title="CNPJ">
                                <FontAwesomeIcon icon={faIdCard} className="text-professional-accent mr-2" />
                                <span id="cnpjEmpresa" className="text-sm">{empPerfil.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}</span>
                            </div>
                            {empPerfil.data_fund && (
                                <div className="bg-professional-gray rounded-lg p-3" title="Data de abertura">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-professional-accent mr-2" />
                                    {(()=>{
                                        const dataISO = empPerfil.data_fund.split('T')[0];
                                        const [anoNasc, mesNasc, diaNasc] = String(dataISO).split('-');
                                        return (<span id="aberturaEmpresa" className="text-sm">{`${diaNasc}/${mesNasc}/${anoNasc}`}</span>)
                                    })()}
                                </div>
                            )}

                            {/*
                                //? Azevedo: O que vai definir essa situação cadastral?
                            */}
                            <div className="bg-professional-gray rounded-lg p-3" title="Situação cadastral">
                                <FontAwesomeIcon icon={faUser} className="text-professional-accent mr-2" />
                                <span id="setuacaoEmpresa" className="text-sm">Ativo</span>
                            </div>

                            {empPerfil.setor && (
                                <div className="bg-professional-gray rounded-lg p-3" title="Setor de Atuação">
                                    <FontAwesomeIcon icon={faBriefcase} className="text-professional-accent mr-2" />
                                    <span id="setorEmpresa" className="text-sm">{empPerfil.setor}</span>
                                </div>
                            )}
                            
                            {/*
                                //? Azevedo: Esse vai ser pela API de CNPJ?
                            */}
                            <div className="bg-professional-gray rounded-lg p-3" title="Natureza jurídica">
                                <FontAwesomeIcon icon={faBuilding} className="text-professional-accent mr-2" />
                                <span id="naturezaEmpresa" className="text-sm">Natureza jurídica</span>
                            </div>

                            {empPerfil.porte && (
                                <div className="bg-professional-gray rounded-lg p-3" title="Porte da empresa">
                                    <FontAwesomeIcon icon={faIndustry} className="text-professional-accent mr-2" />
                                    <span id="porteEmpresa" className="text-sm">{empPerfil.porte}</span>
                                </div>
                            )}

                            <div id="divLocalizacaoSede" className="bg-professional-gray rounded-lg p-3" title="Localização Sede">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-professional-accent mr-2" />
                                <span id="localizacaoSedeEmpresa" className="text-sm">Endereço da Sede</span><br/>
                                <span id="estadoEmpresaSede" className="text-sm text-center">Estado: ({empPerfil.estado})</span><br/>
                                <span id="cidadeEmpresaSede" className="text-sm text-center">Cidade: {empPerfil.cidade}</span>
                            </div>
                            
                            {/* 
                            // ? Acredito que não vai mais ter esse ngç de filiais, por isso comentei, mas qualquer bota dnv
                            <div id="divLocalizacaoFilial" className="bg-professional-gray rounded-lg p-3" title="Localização Filial">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-professional-accent mr-2" />
                                <span id="localizacaoFilialEmpresa" className="text-sm">Endereço de Filiais</span>
                                <span id="estadoEmpresaFilial" className="text-sm text-center">Estado: (XX)</span>
                                <span id="cidadeEmpresaFilial" className="text-sm text-center">Cidade: (Nenhuma)</span>
                            </div> */}

                        </div>
                        <button id="btnEditarPerfil" onClick={()=>navigate('/perfil/empresa/editar')}
                            className="bg-professional-accent text-white font-medium py-2.5 px-5 rounded-lg w-full transition-all duration-200 ease-in-out hover:bg-professional-lightaccent cursor-pointer"
                            title="Editar Perfil">
                                <FontAwesomeIcon icon={faEdit} className="mr-2" />Editar Perfil
                        </button>
                    </div>

                    {/* <!-- Informações centrais --> */}
                    <div id="bodyMid"
                        className="bg-professional-card rounded-xl border border-professional-card p-6 lg:w-2/3 flex flex-col transition-all duration-300 ease-in-out hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                        <h1 id="nomUsuario" className="text-3xl font-bold mb-2 text-center lg:text-left">{empPerfil.nome_fant}</h1>
                        <div className="flex items-center justify-center lg:justify-start mb-4" title="Email">
                            <FontAwesomeIcon icon={faEnvelope} className="text-professional-accent mr-2" />
                            <a id="emailUsuario"
                                className="text-lg text-professional-subtitle">{empPerfil.email}</a>
                        </div>

                        <div className="bg-professional-gray rounded-lg p-4 mb-6">
                            <h2 className="text-lg text-center font-semibold mb-2 text-professional-accent relative pb-3
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-10 after:h-0.5 after:bg-professional-accent after:rounded">
                                Sobre a empresa
                            </h2>

                            <p id="descUsuario" className="text-professional-subtitle text-center">
                                {empPerfil.descricao}
                            </p>
                        </div>


                        <div id="conexoes" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center bg-professional-gray rounded-lg p-3" title="Mapa">
                                <FontAwesomeIcon icon={faMap} className="text-professional-accent mr-3 text-xl" />
                                <a id="mapaEmpresa" href="#"
                                    className="nomeRedeSoc text-professional-subtitle hover:text-professional-accent transition-colors"
                                    target="_blank">
                                    Mapa ou link para Google Maps
                                </a>
                            </div>

                            <div className="flex items-center bg-professional-gray rounded-lg p-3" title="Site Oficial">
                                <FontAwesomeIcon icon={faGlobe} className="text-professional-accent mr-3 text-xl" />
                                {empPerfil.site && (
                                    <a id="siteEmpresa" href={empPerfil.site}
                                        className="nomeRedeSoc text-professional-subtitle hover:text-professional-accent transition-colors"
                                        target="_blank">
                                        Site Oficial
                                    </a>
                                )}
                            </div>

                            <div className="flex items-center bg-professional-gray rounded-lg p-3" title="Telefone">
                                <FontAwesomeIcon icon={faPhone} className="text-professional-accent mr-3 text-xl" />
                                <span id="telefoneEmpresa"
                                    className="nomeRedeSoc text-professional-subtitle hover:text-professional-accent transition-colors">
                                    {empPerfil.telefone.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, '+$1 ($2) $3-$4')}
                                </span>  
                            </div>

                            <div className="flex items-center bg-professional-gray rounded-lg p-3" title="Instagram">
                                <FontAwesomeIcon icon={faInstagram} className="text-professional-accent mr-3 text-xl" />
                                {empPerfil.instagram && (
                                    <a id="instEmpresa" href={empPerfil.instagram}
                                        className="nomeRedeSoc text-professional-subtitle hover:text-professional-accent transition-colors"
                                        target="_blank">
                                        Instagram
                                    </a>
                                )}
                            </div>

                            <div className="flex items-center bg-professional-gray rounded-lg p-3" title="GitHub">
                                <FontAwesomeIcon icon={faGithub} className="text-professional-accent mr-3 text-xl" />
                                {empPerfil.github && (
                                    <a id="gitEmpresa" href={empPerfil.github}
                                        className="nomeRedeSoc text-professional-subtitle hover:text-professional-accent transition-colors"
                                        target="_blank">
                                        GitHub
                                    </a>
                                )}
                            </div>


                            <div className="flex items-center bg-professional-gray rounded-lg p-3" title="Twitter/X">
                                <FontAwesomeIcon icon={faXTwitter} className="text-professional-accent mr-3 text-xl" />
                                {empPerfil.twitter && (
                                    <a id="twtUsuario" href={empPerfil.twitter}
                                        className="twtUsuario text-professional-subtitle hover:text-professional-accent transition-colors"
                                        target="_blank">
                                        Twitter/X
                                    </a>
                                )}
                            </div>
                        </div>

                        <div id="valoresInfo" className="bg-professional-gray rounded-lg p-4">

                            <h2 className="text-lg text-center font-semibold mb-2 text-professional-accent relative pb-3
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-10 after:h-0.5 after:bg-professional-accent after:rounded">
                                Cultura e Valores</h2>

                            <div className="space-y-3">
                                <div>
                                    <h3 className="font-medium text-white text-center">Missão</h3>
                                    <p className="text-professional-subtitle text-sm text-center">[Missão da empresa -
                                        propósito fundamental]
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-white text-center">Titulo
                                    </h3>
                                    <p className="text-professional-subtitle text-sm text-center">Descrição
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-white text-center">Titulo</h3>
                                    <p className="text-professional-subtitle text-sm text-center">Descrição
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
                            {`Áreas de Especialização${customPerfil.tags_count>0 ? ` (${customPerfil.tags_count})` : ''}`}</h1>
                        <div id="boxTags"
                            className="bg-professional-gray rounded-lg p-4 border border-professional-card min-h-[120px]">
                            <div id="Tags" className="flex flex-wrap gap-3">
                                {customPerfil.tags_count>0 && customPerfil.tags_empresas.map(tag=>{
                                    return (
                                        <div className="inline-flex items-center gap-1.5 py-2 px-4 bg-linear-to-br from-professional-gray to-professional-card text-professional-text text-sm font-medium rounded-lg border border-professional-card transition-all duration-200 ease-in-out hover:border-professional-accent hover:-translate-y-0.5 cursor-pointer"
                                            key={tag.id} title={`Tag: ${tag.nome}`} onClick={()=>{
                                                setTagToRemove({nome: tag.nome, id: tag.id});
                                                setMostrarModalRmvTag(true);
                                            }}>
                                            <span>{tag.nome}</span>
                                        </div>
                                    )
                                })}
                                {(mostrarMaisTagsExib&&customPerfil.tags_count>6) && (
                                    <button id="maisTags"
                                        className="inline-flex items-center gap-1.5 py-2 px-4 bg-linear-to-br from-professional-gray to-professional-card text-professional-text text-sm font-medium rounded-lg border border-professional-card cursor-default transition-all duration-200 ease-in-out hover:border-professional-accent hover:-translate-y-0.5 cursor-pointer"
                                        title="Carregar mais Habilidades" ref={mostrarMaisTagsRef} onClick={async()=>{
                                            await handleMostrarTodasTags();
                                        }}>
                                        <FontAwesomeIcon icon={faPlus} className="text-professional-accent" />
                                    </button>
                                )}
                            </div>
                            <button id="btnAddTags"
                                className="mt-4 flex items-center text-professional-accent hover:text-professional-lightaccent transition-colors cursor-pointer"
                                title="Adicionar Habilidade" onClick={()=>{
                                    setMostrarModalAddTag(true);
                                }}>
                                <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
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
                            Métricas Empresariais</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                className="bg-linear-to-br from-professional-gray to-professional-card rounded-lg p-5 text-center border border-professional-card">
                                <div id="vagasCount" className="text-[2rem] font-bold text-professional-accent mb-1">
                                    12</div>
                                <div className="text-sm text-professional-subtitle">Vagas Ativas</div>
                            </div>
                            <div
                                className="bg-linear-to-br from-professional-gray to-professional-card rounded-lg p-5 text-center border border-professional-card">
                                <div id="colaboradoresCount" className="text-[2rem] font-bold text-professional-accent mb-1">15</div>
                                <div className="text-sm text-professional-subtitle">Colaboradores</div>
                            </div>
                            <div
                                className="bg-linear-to-br from-professional-gray to-professional-card rounded-lg p-5 text-center border border-professional-card">
                                <div id="projetosCount" className="text-[2rem] font-bold text-professional-accent mb-1">15
                                </div>
                                <div className="text-sm text-professional-subtitle">Projetos Ativos</div>
                            </div>
                            <div
                                className="bg-linear-to-br from-professional-gray to-professional-card rounded-lg p-5 text-center border border-professional-card">
                                <div id="certificacoesCount" className="text-[2rem] font-bold text-professional-accent mb-1">4</div>
                                <div className="text-sm text-professional-subtitle">Certificações Empresariais</div>
                            </div>
                        </div>
                    </div>

                    {/* <!--* Vagas adicionadas --> */}
                    <div
                        className="bg-professional-card rounded-xl border border-professional-card p-6 transition-all duration-300 ease-in-out hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                        <h2 className="text-lg text-center font-semibold mb-2 text-professional-accent relative pb-3
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-10 after:h-0.5 after:bg-professional-accent after:rounded">
                            Vagas adicionadas</h2>
                        <div id="divIdiomasExib" className="space-y-3">
                            <button id="maisVagas"
                                className="inline-flex items-center gap-1.5 py-2 px-4 bg-linear-to-br from-professional-gray to-professional-card text-professional-text text-sm font-medium rounded-lg border border-professional-card cursor-default transition-all duration-200 ease-in-out hover:border-professional-accent hover:-translate-y-0.5">
                                <FontAwesomeIcon icon={faPlus} className="text-professional-accent" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!--TODO Dashboard com abas --> */}
            <div className="mt-10">
                {/* <!--* Navegação por abas --> */}
                <div className="relative border-b border-professional-card mb-6">

                    <button id="scrollLeft"
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-professional-card/90 text-white px-2 py-3 rounded-r-md z-10 hover:bg-professional-accent transition">
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>

                    <ul className="flex overflow-x-auto whitespace-nowrap text-sm font-medium text-center gap-1 scrollbar-hide scroll-smooth px-8"
                        id="dashboard-tabs">
                        <li>
                            <button id="vagasTelinha" className="tab-button relative inline-block p-4 text-professional-subtitle hover:text-gray-300
                            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
                            after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="vagas">
                                <FontAwesomeIcon icon={faBriefcase} className="mr-2" />Vagas
                            </button>
                        </li>
                        <li>
                            <button className="tab-button relative inline-block p-4 text-professional-subtitle hover:text-gray-300
                            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
                            after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="Projetos">
                                <FontAwesomeIcon icon={faProjectDiagram} className="mr-2" />Projetos
                            </button>
                        </li>
                        <li>
                            <button className="tab-button relative inline-block p-4 text-professional-subtitle hover:text-gray-300
                            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
                            after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="Candidatos">
                                <FontAwesomeIcon icon={faUsers} className="mr-2" />Candidatos
                            </button>
                        </li>
                        <li>
                            <button className="tab-button relative inline-block p-4 text-professional-subtitle hover:text-gray-300
                            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
                            after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="Depoimentos">
                                <FontAwesomeIcon icon={faCommentAlt} className="mr-2" />Depoimentos
                            </button>
                        </li>
                        <li>
                            <button className="tab-button relative inline-block p-4 text-professional-subtitle hover:text-gray-300
                            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
                            after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="Servicos">
                                <FontAwesomeIcon icon={faCogs} className="mr-2" />Serviços Fornecidos
                            </button>
                        </li>
                        <li>
                            <button className="tab-button relative inline-block p-4 text-professional-subtitle hover:text-gray-300
                            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
                            after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="Certificacoes">
                                <FontAwesomeIcon icon={faAward} className="mr-2" />Certificações Empresariais
                            </button>
                        </li>
                        <li>
                            <button className="tab-button relative inline-block p-4 text-professional-subtitle hover:text-gray-300
                            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
                            after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="Parcerias">
                                <FontAwesomeIcon icon={faHandshake} className="mr-2" />Parcerias
                            </button>
                        </li>
                        <li>
                            <button className="tab-button relative inline-block p-4 text-professional-subtitle hover:text-gray-300
                            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
                            after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="Solicitacoes">
                                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />Solicitações
                            </button>
                        </li>
                        
                        <li>
                            <button className="tab-button relative inline-block p-4 text-professional-subtitle hover:text-gray-300
                            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
                            after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="Notificacoes">
                                <FontAwesomeIcon icon={faBell} className="mr-2" />Notificações
                            </button>
                        </li>
                        <li>
                            <button className="tab-button relative inline-block p-4 text-professional-subtitle hover:text-gray-300
                            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
                            after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="Favoritos">
                                <FontAwesomeIcon icon={faStar} className="mr-2" />Favoritos
                            </button>
                        </li>
                    </ul>

                    <button id="scrollRight"
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-professional-card/90 text-white px-2 py-3 rounded-l-md z-10 hover:bg-professional-accent transition">
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>

                {/* <!--TODO: Conteúdo das abas --> */}
                <div id="tab-content">
                    {/* <!--* Aba vagas --> */}
                    <div id="vagas" className="tab-pane active">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="bodyBottom">
                            <div id="boxCriar"
                                className="bg-professional-card rounded-xl border-2 border-dashed border-professional-card p-5 flex flex-col items-center justify-center transition-colors cursor-pointer h-full min-h-[200px] hover:border-professional-accent"
                                onClick={()=>navigate('/vagas/criar')}>
                                <Link to="/vagas/criar" className="flex flex-col items-center text-center">
                                    <FontAwesomeIcon icon={faPlusCircle} className="text-4xl text-professional-accent mb-3" />
                                    <p id="textCriar" className="text-professional-subtitle">Adicionar nova experiência
                                        profissional</p>
                                </Link>
                            </div>

                            {/* <!-- Experiências adicionadas aparecerão aqui --> */}
                            {/* <!-- <div
                            className="bg-professional-card rounded-xl border border-professional-card p-5 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-professional-accent">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Gerente de Projetos</h3>
                                    <p className="text-professional-accent font-medium">Tech Solutions Ltda</p>
                                </div>
                                <span
                                    className="bg-professional-accent text-white text-xs font-medium px-2.5 py-0.5 rounded">Atual</span>
                            </div>
                            <p className="text-professional-subtitle mb-4">Jan 2020 - Presente</p>
                            <p className="text-professional-subtitle text-sm mb-4">Liderança de equipes multidisciplinares
                                para entrega de projetos complexos dentro do prazo e orçamento.</p>
                            <div className="flex flex-wrap gap-2">
                                <span
                                    className="bg-professional-gray text-professional-subtitle text-xs px-2 py-1 rounded">Gestão
                                    Ágil</span>
                                <span
                                    className="bg-professional-gray text-professional-subtitle text-xs px-2 py-1 rounded">Scrum</span>
                                <span
                                    className="bg-professional-gray text-professional-subtitle text-xs px-2 py-1 rounded">Jira</span>
                            </div>
                        </div> --> */}

                            {/* <!-- <div
                            className="bg-professional-card rounded-xl border border-professional-card p-5 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-professional-accent">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Analista de Sistemas Sênior</h3>
                                    <p className="text-professional-accent font-medium">Inovação Digital S.A.</p>
                                </div>
                            </div>
                            <p className="text-professional-subtitle mb-4">Mar 2016 - Dez 2019</p>
                            <p className="text-professional-subtitle text-sm mb-4">Análise e desenvolvimento de soluções
                                tecnológicas para otimização de processos empresariais.</p>
                            <div className="flex flex-wrap gap-2">
                                <span
                                    className="bg-professional-gray text-professional-subtitle text-xs px-2 py-1 rounded">Análise
                                    de Requisitos</span>
                                <span
                                    className="bg-professional-gray text-professional-subtitle text-xs px-2 py-1 rounded">SQL</span>
                                <span
                                    className="bg-professional-gray text-professional-subtitle text-xs px-2 py-1 rounded">UML</span>
                            </div>
                        </div> --> */}
                        </div>
                    </div>

                    {/* <!--* Aba Candidatos --> */}
                    <div id="Candidatos" className="tab-pane hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div id="boxCriar"
                                className="bg-professional-card rounded-xl border-2 border-dashed border-professional-card p-5 flex flex-col items-center justify-center transition-colors cursor-pointer h-full min-h-[200px] hover:border-professional-accent">
                                <Link to="/Candidatos/criar" className="flex flex-col items-center text-center">
                                    <FontAwesomeIcon icon={faPlusCircle} className="text-4xl text-professional-accent mb-3" />
                                    <p id="textCriar" className="text-professional-subtitle">Adicionar novas Certificações
                                    </p>
                                </Link>
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

                    {/* <!--* Aba Projetos --> */}
                    <div id="projetos" className="tab-pane hidden">
                        <div id="projetosExib" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div id="boxCriar"
                                className="bg-professional-card rounded-xl border-2 border-dashed border-professional-card p-5 flex flex-col items-center justify-center transition-colors cursor-pointer h-full min-h-[200px] hover:border-professional-accent"
                                onClick={()=>navigate('/projetos/criar')}>
                                <Link to="/projetos/criar" className="flex flex-col items-center text-center">
                                    <FontAwesomeIcon icon={faPlusCircle} className="text-4xl text-professional-accent mb-3" />
                                    <p id="textCriar" className="text-professional-subtitle">Adicionar novos projetos</p>
                                </Link>
                            </div>
                            {/* <!-- <div
                                className="bg-professional-card rounded-xl border border-professional-card p-5 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-professional-accent">

                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Gerente de Projetos</h3>
                                        <p className="text-professional-accent font-medium">Tech Solutions Ltda</p>
                                    </div>
                                    <span
                                        className="bg-professional-accent text-white text-xs font-medium px-2.5 py-0.5 rounded">
                                        Concluído
                                    </span>
                                </div>

                                <p className="text-professional-subtitle mb-2">Jan 2020 - Presente</p>

                                <div className="relative mb-4">
                                    <img src="/assets/imgs/image.png" alt="Imagem do projeto"
                                        className="w-full h-48 object-contain rounded-lg  bg-professional-gray/10" />

                                    <a href="https://www.techsolutions.com" target="_blank" rel="noopener noreferrer"
                                        className="absolute bottom-32 right-3 bg-professional-accent text-white p-1.5 rounded-full shadow-md hover:bg-professional-accent/80 transition-colors"
                                        title="Visitar site">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="1" stroke="currentColor" className="w-5 h-5">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M13.828 10.172a4 4 0 010 5.656l-3.535 3.535a4 4 0 01-5.656-5.656l1.414-1.414m4.95-4.95a4 4 0 015.657 5.657l-3.535 3.535a4 4 0 01-5.657-5.657l1.414-1.414" />
                                        </svg>
                                    </a>
                                </div>

                                
                                <p className="text-professional-subtitle text-sm mb-4">
                                    Liderança de equipes multidisciplinares para entrega de projetos complexos dentro do
                                    prazo e orçamento.
                                </p>

                                
                                <div className="flex flex-wrap gap-2">
                                    <span
                                        className="bg-professional-gray text-professional-subtitle text-xs px-2 py-1 rounded">Gestão
                                        Ágil</span>
                                    <span
                                        className="bg-professional-gray text-professional-subtitle text-xs px-2 py-1 rounded">Scrum</span>
                                    <span
                                        className="bg-professional-gray text-professional-subtitle text-xs px-2 py-1 rounded">Jira</span>
                                </div>
                            </div> --> */}

                            {/* <!-- <div
                                className="bg-professional-card rounded-xl border border-professional-card p-5 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-professional-accent">

                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Plataforma de E-learning</h3>
                                        <p className="text-professional-accent font-medium">Inovação Digital S.A. </p>
                                    </div>
                                    <span
                                        className="bg-professional-accent text-white text-xs font-medium px-2.5 py-0.5 rounded">
                                        Em Andamento
                                    </span>
                                </div>

                                <p className="text-professional-subtitle mb-2">Jan • 2023 - Presente</p>

                                <div className="relative mb-4">
                                    <img src="/assets/imgs/image.png" alt="Imagem do projeto"
                                        className="w-full h-48 object-contain rounded-lg  bg-professional-gray/10" />

                                    <a href="https://www.techsolutions.com" target="_blank" rel="noopener noreferrer"
                                        className="absolute bottom-32 right-3 bg-professional-accent text-white p-1.5 rounded-full shadow-md hover:bg-professional-accent/80 transition-colors"
                                        title="Visitar site">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="1" stroke="currentColor" className="w-5 h-5">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M13.828 10.172a4 4 0 010 5.656l-3.535 3.535a4 4 0 01-5.656-5.656l1.414-1.414m4.95-4.95a4 4 0 015.657 5.657l-3.535 3.535a4 4 0 01-5.657-5.657l1.414-1.414" />
                                        </svg>
                                    </a>
                                </div>

                                <p className="text-professional-subtitle text-sm mb-4">
                                    Desenvolvimento de plataforma
                                    educacional
                                    com foco em experiência do usuário e acessibilidade.
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    <span
                                        className="bg-professional-gray text-professional-subtitle text-xs px-2 py-1 rounded">React</span>
                                    <span
                                        className="bg-professional-gray text-professional-subtitle text-xs px-2 py-1 rounded">Node.js</span>
                                    <span
                                        className="bg-professional-gray text-professional-subtitle text-xs px-2 py-1 rounded">MongoDB</span>
                                </div>
                            </div>  --> */}
                        </div>
                    </div>

                    {/* <!--* Aba Depoimentos --> */}
                    <div id="Depoimentos" className="tab-pane hidden">
                        <div
                            className="bg-professional-card rounded-xl border border-professional-card overflow-hidden transition-all duration-300 ease-in-out hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                            <div className="border-b border-professional-card px-6 py-4">
                                <h3 className="text-lg font-semibold text-white">Recomendações de Colegas</h3>
                            </div>
                            <div className="divide-y divide-professional-card">
                                <div className="p-6">
                                    <div className="flex items-start">
                                        <img src="/assets/imgs/genPfp.png" alt="User"
                                            className="w-12 h-12 rounded-full mr-4" />
                                        <div>
                                            <h4 className="font-medium text-white">Maria Silva</h4>
                                            <p className="text-professional-subtitle">Diretora de Projetos na Tech Solutions
                                            </p>
                                            <div className="flex text-yellow-400 my-2">
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
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
                                            className="w-12 h-12 rounded-full mr-4" />
                                        <div>
                                            <h4 className="font-medium text-white">João Santos</h4>
                                            <p className="text-professional-subtitle">CTO na Inovação Digital</p>
                                            <div className="flex text-yellow-400 my-2">
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
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

                    {/* <!--* Aba Favoritos --> */}
                    <div id="Favoritos" className="tab-pane hidden">
                        <div
                            className="bg-professional-card rounded-xl border border-professional-card overflow-hidden transition-all duration-300 ease-in-out hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                            <div className="border-b border-professional-card px-6 py-4">
                                <h3 className="text-lg font-semibold text-white">Recomendações de Colegas</h3>
                            </div>
                            <div className="divide-y divide-professional-card">
                                <div className="p-6">
                                    <div className="flex items-start">
                                        <img src="/assets/imgs/genPfp.png" alt="User"
                                            className="w-12 h-12 rounded-full mr-4" />
                                        <div>
                                            <h4 className="font-medium text-white">Maria Silva</h4>
                                            <p className="text-professional-subtitle">Diretora de Projetos na Tech Solutions
                                            </p>
                                            <div className="flex text-yellow-400 my-2">
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
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
                                            className="w-12 h-12 rounded-full mr-4" />
                                        <div>
                                            <h4 className="font-medium text-white">João Santos</h4>
                                            <p className="text-professional-subtitle">CTO na Inovação Digital</p>
                                            <div className="flex text-yellow-400 my-2">
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
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

            {/* <!--* Modais tags --> */}
            {mostrarModalAddTag && (
                <div id="modalInput"
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div id="modalInput-content"
                        className="bg-professional-card p-6 rounded-xl w-11/12 max-w-md border border-professional-card">
                        <h3 className="text-lg font-semibold mb-4">Adicionar Habilidade</h3>
                        <input type="text" id="inputTag" placeholder="Digite a habilidade" onChange={(e)=>setTagToAdd(e.target.value)} autoFocus onKeyDown={(e)=>handleKeyDownInputTag(e)}
                            className="w-full bg-professional-gray border border-professional-card rounded-lg px-4 py-3 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-professional-accent" value={tagToAdd} />
                        <div className="flex justify-end space-x-3">
                            <button id="btnCancelar" onClick={()=>{
                                setTagToAdd('');
                                setMostrarModalAddTag(false);
                            }}
                                className="bg-professional-card text-professional-subtitle font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out hover:bg-professional-gray cursor-pointer">Cancelar</button>
                            <button id="btnConfirmar" onClick={async()=>{
                                try {
                                    const tagNome = tagToAdd;
                                    if(!tagNome) return mostrarErroTopo('A tag não pode ser vazia.');
                                    setTagToAdd('');
                                    setMostrarModalAddTag(false);
                                    if(mostrarMaisTags) await handleMostrarTodasTags();
                                    const tagsExistentes = customPerfil.tags_empresas.map(tag=>tag.nome.toLowerCase());
                                    if(tagsExistentes.includes(tagNome.toLowerCase())) return mostrarErroTopo('A empresa não pode ter tags repetidas.');
                                    const response = await axiosWe.post('/tags/empresas', { nome: tagNome }) as {data: {id:string}};
                                    setCustomPerfil(prev=>({...prev, tags_empresas:[{nome: tagNome, id: response.data.id}, ...prev.tags_empresas], tags_count: prev.tags_count+1}));
                                } catch (erro) {
                                    console.error(erro);
                                    if(erro.status===409) mostrarErroTopo(erro.message);
                                }
                                
                            }}
                            ref={adicionarTagRef} className="bg-professional-accent text-white font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out hover:bg-professional-lightaccent cursor-pointer">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
            
            {mostrarModalRmvTag && (
                <div id="modalDelete"
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div id="modalDelete-content"
                        className="bg-professional-card p-6 rounded-xl w-11/12 max-w-md border border-professional-card">
                        <h3 className="text-lg font-semibold mb-4 text-center">Confirmar exclusão</h3>
                        <p className="text-professional-subtitle text-center mb-6">{`Tem certeza que deseja remover esta
                            habilidade? `}<br/><strong>{`(${tagToRemove.nome})`}</strong>
                        </p>
                        <div className="flex justify-center space-x-3">
                            <button id="btnCancelarDel" onClick={()=>{setMostrarModalRmvTag(false);setTagToRemove({nome:'',id:''});}}
                                className="bg-professional-card text-professional-subtitle font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out hover:bg-professional-gray cursor-pointer">Cancelar</button>
                            <button id="btnConfirmarDel" onClick={async(e)=>{
                                const target = e.target as HTMLButtonElement;
                                try {
                                    const tagId = tagToRemove.id;
                                    target.disabled = true;
                                    target.textContent = 'Removendo...'
                                    if(mostrarMaisTags) await handleMostrarTodasTags();
                                    await axiosWe.delete(`/tags/empresas/${tagId}`);
                                    setCustomPerfil(prev=>{
                                        return {...prev, tags_empresas: prev.tags_empresas.filter(tag=>tag.id!==tagId), tags_count: prev.tags_count-1};
                                    })
                                } catch (erro) {
                                    console.error(erro);
                                } finally {
                                    setTagToRemove({nome:'', id: ''});
                                    setMostrarModalRmvTag(false);
                                    target.disabled = false;
                                    target.textContent = 'Confirmar';
                                }
                                
                            }}
                                className="bg-red-600 text-white font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out hover:bg-red-700 cursor-pointer">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
            
            <ThemeToggle /> 
            {/* <!--* Modais tags fim --> */}
        </div>
        </>
    )
}