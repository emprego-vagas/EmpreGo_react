import { faFacebook, faGithub, faInstagram, faLinkedin, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import {faAward, faBell, faBriefcase, faTimes, faCity, faFlag, faCodeBranch, faSearch, faBuilding, faChevronLeft, faChevronRight, faCogs, faCommentAlt, faEdit, faEnvelope, faGlobe, faHandshake, faIdCard, faIndustry, faMap, faMapMarkerAlt, faPhone, faPlus, faPlusCircle, faProjectDiagram, faStar, faUserPlus, faUsers} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom"
import HeaderProfiles from "../components/HeaderProfiles";
// import ThemeToggle from "../components/ThemeTogle";
import { DadosUsuario, mostrarErroTopo } from "../utils/globalFunctions";
import { useEffect, useRef, useState } from "react";
import axiosWe from "../utils/axiosInstance";
import type { CustomEmp, Empresa, Tag } from "../utils/utilsInterfaces";
import Loader from "../components/Loader";
import genPfp from '../assets/imgs/genPfp.png';



export default function PerfilEmpresa() {
    const navigate = useNavigate();
    const [usuario] = useState(DadosUsuario.getUsuario(true, 'empresa'));
    if (!usuario) {
        setTimeout(() => {
            navigate('/');
        }, 3000);
    };

    const [empPerfil, setEmpPerfil] = useState<Empresa | null>(null);
    const [customPerfil, setCustomPerfil] = useState<CustomEmp | null>(null);
    const [mostrarModalRmvTag, setMostrarModalRmvTag] = useState(false);
    const [tagToRemove, setTagToRemove] = useState({ nome: '', id: '' });
    const [mostrarMaisTagsExib, setMostrarMaisTagsExib] = useState(true);
    const mostrarMaisTagsRef = useRef(null);
    const [mostrarMaisTags, setMostrarMaisTags] = useState(true);
    const [mostrarModalAddTag, setMostrarModalAddTag] = useState(false);
    const [tagToAdd, setTagToAdd] = useState('');
    const [mostrarModalAddFilial, setMostrarModalAddFilial] = useState(false);
    const [editingFilialId, setEditingFilialId] = useState<string | null>(null);
    const [novaFilial, setNovaFilial] = useState({
        cidade: '',
        estado: '',
        tipo: '',
        tipo_outro: ''
    });
    const [buscaEstado, setBuscaEstado] = useState('');
    const [mostrarListaEstados, setMostrarListaEstados] = useState(false);
    const [mostrarMaisFiliaisExib, setMostrarMaisFiliaisExib] = useState(true);
    const [carregandoFilial, setCarregandoFilial] = useState(false);

    const estadosBrasil = [
        { sigla: 'AC', nome: 'Acre' },
        { sigla: 'AL', nome: 'Alagoas' },
        { sigla: 'AP', nome: 'Amapá' },
        { sigla: 'AM', nome: 'Amazonas' },
        { sigla: 'BA', nome: 'Bahia' },
        { sigla: 'CE', nome: 'Ceará' },
        { sigla: 'DF', nome: 'Distrito Federal' },
        { sigla: 'ES', nome: 'Espírito Santo' },
        { sigla: 'GO', nome: 'Goiás' },
        { sigla: 'MA', nome: 'Maranhão' },
        { sigla: 'MT', nome: 'Mato Grosso' },
        { sigla: 'MS', nome: 'Mato Grosso do Sul' },
        { sigla: 'MG', nome: 'Minas Gerais' },
        { sigla: 'PA', nome: 'Pará' },
        { sigla: 'PB', nome: 'Paraíba' },
        { sigla: 'PR', nome: 'Paraná' },
        { sigla: 'PE', nome: 'Pernambuco' },
        { sigla: 'PI', nome: 'Piauí' },
        { sigla: 'RJ', nome: 'Rio de Janeiro' },
        { sigla: 'RN', nome: 'Rio Grande do Norte' },
        { sigla: 'RS', nome: 'Rio Grande do Sul' },
        { sigla: 'RO', nome: 'Rondônia' },
        { sigla: 'RR', nome: 'Roraima' },
        { sigla: 'SC', nome: 'Santa Catarina' },
        { sigla: 'SP', nome: 'São Paulo' },
        { sigla: 'SE', nome: 'Sergipe' },
        { sigla: 'TO', nome: 'Tocantins' }
    ];

    const handleMostrarTodasFiliais = async () => {
        try {
            if (!customPerfil) {
                setMostrarMaisFiliaisExib(false);
                return;
            }
            if (customPerfil.filiais_count && (customPerfil.filiais?.length ?? 0) >= customPerfil.filiais_count) {
                setMostrarMaisFiliaisExib(false);
                return;
            }
            const response = await axiosWe(`/filial?offset=${customPerfil.filiais?.length ?? 0}`);
            setCustomPerfil(prev => ({ ...prev, filiais: [...(prev.filiais || []), ...response.data] }));
            setMostrarMaisFiliaisExib(false);
        } catch (erro) {
            console.error('Erro ao buscar mais filiais', erro);
        }
    };

    const handleMostrarTodasTags = async () => {
        try {
            if (customPerfil.tags_count <= 6) {
                setMostrarMaisTags(false);
                setMostrarMaisTagsExib(false);
                return;
            };
            setMostrarMaisTags(false);
            const response = await axiosWe(`/tags/empresas?offset=6`) as { data: Tag[] };
            setCustomPerfil(prev => ({ ...prev, tags_empresas: [...prev.tags_empresas, ...response.data] }));
            setMostrarMaisTagsExib(false);
        } catch (erro) {
            setMostrarMaisTags(true);
            setMostrarMaisTagsExib(true);
            console.error('Erro ao mostrar todas as tags:', erro);
        }
    }
    const adicionarTagRef = useRef(null);
    const handleKeyDownInputTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            adicionarTagRef.current?.click();
        }
    }

    useEffect(() => {
        async function loadEmp() {
            if (!usuario) return;
            try {
                const response = await axiosWe('/custom/perfil-empresa') as { data: { usua: Empresa, custom: CustomEmp } };
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

    useEffect(()=>{
        if(!mostrarMaisTags) {
            if(!mostrarMaisTagsRef.current) return;
            mostrarMaisTagsRef.current.disabled = true;
            mostrarMaisTagsRef.current.textContent = 'Carregando...';
        };
    }, [mostrarMaisTags]);

    // ! Dps validar se precisa mesmo desse effect
    // useEffect(() => {
    //     if (customPerfil.filiais && customPerfil) {
    //         setCustomPerfil(prev => ({ ...prev, filiais: customPerfil.filiais, filiais_count: customPerfil.filiais_count }));
    //     }
    // }, [customPerfil]);

    if (!empPerfil) return (<Loader />)

    return (
        <>
            <HeaderProfiles />
            <div id="main" className="container mx-auto px-4 pt-10 pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" >
                    <div id="bodyLeft" className="lg:col-span-8 flex flex-col lg:flex-row gap-6">
                        <div id="impInfo"
                            className="bg-professional-card rounded-xl border border-professional-card p-6 lg:w-1/3 flex flex-col items-center transition-all duration-300 ease-in-out hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                            <img id="fotoUsuario" src={empPerfil.foto === '/assets/imgs/genPfp.png' ? genPfp : empPerfil.foto} alt="Foto de perfil"
                                className="w-40 h-40 rounded-full border-4 border-professional-accent object-cover mb-4"
                                title="Foto de Perfil" />
                            <div className="w-full space-y-2 mb-6">
                                <div className="bg-professional-gray rounded-lg p-3" title="CNPJ">
                                    <FontAwesomeIcon icon={faIdCard} className="text-professional-accent mr-2" />
                                    <span id="cnpjEmpresa" className="text-sm">{empPerfil.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}</span>
                                </div>

                                <div className="bg-professional-gray rounded-lg p-3" title="Telefone">
                                    <FontAwesomeIcon icon={faPhone} className="text-professional-accent mr-2" />
                                    <span id="telefoneEmpresa" className="text-sm">{empPerfil.telefone.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, '+$1 ($2) $3-$4')}</span>
                                </div>
                                
                                {/* {empPerfil.data_fund && (
                                    <div className="bg-professional-gray rounded-lg p-3" title="Data de abertura">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-professional-accent mr-2" />
                                        {(() => {
                                            const dataISO = empPerfil.data_fund.split('T')[0];
                                            const [anoNasc, mesNasc, diaNasc] = String(dataISO).split('-');
                                            return (<span id="aberturaEmpresa" className="text-sm">{`${diaNasc}/${mesNasc}/${anoNasc}`}</span>)
                                        })()}
                                    </div>
                                )} */}

                                {/*
                                //? Azevedo: O que vai definir essa situação cadastral?
                            */}
                                {/* <div className="bg-professional-gray rounded-lg p-3" title="Situação cadastral">
                                    <FontAwesomeIcon icon={faUser} className="text-professional-accent mr-2" />
                                    <span id="setuacaoEmpresa" className="text-sm">Ativo</span>
                                </div> */}

                                {empPerfil.setor && (
                                    <div className="bg-professional-gray rounded-lg p-3" title="Setor de Atuação">
                                        <FontAwesomeIcon icon={faBriefcase} className="text-professional-accent mr-2" />
                                        <span id="setorEmpresa" className="text-sm">{empPerfil.setor}</span>
                                    </div>
                                )}

                                {/*
                                //? Azevedo: Esse vai ser pela API de CNPJ?
                            */}
                                {/* <div className="bg-professional-gray rounded-lg p-3" title="Natureza jurídica">
                                    <FontAwesomeIcon icon={faBuilding} className="text-professional-accent mr-2" />
                                    <span id="naturezaEmpresa" className="text-sm">Natureza jurídica</span>
                                </div> */}

                                {empPerfil.porte && (
                                    <div className="bg-professional-gray rounded-lg p-3" title="Porte da empresa">
                                        <FontAwesomeIcon icon={faIndustry} className="text-professional-accent mr-2" />
                                        <span id="porteEmpresa" className="text-sm">{empPerfil.porte}</span>
                                    </div>
                                )}

                                <div id="divLocalizacaoSede" className="bg-professional-gray rounded-lg p-3" title="Localização Sede">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-professional-accent mr-2" />
                                    <span id="localizacaoSedeEmpresa" className="text-sm">Endereço da Sede</span><br />
                                    <span id="estadoEmpresaSede" className="text-sm text-center">Estado: ({empPerfil.estado})</span><br />
                                    <span id="cidadeEmpresaSede" className="text-sm text-center">Cidade: {empPerfil.cidade}</span>
                                </div>
                                {customPerfil.filiais && customPerfil.filiais_count > 0 && (
                                    <div id="divLocalizacaoFilial" className="bg-professional-gray rounded-lg p-3 mt-3" title="Localização Filial">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-professional-accent mr-2" />
                                        <span id="localizacaoFilialEmpresa" className="text-sm">{`${customPerfil.filiais[0].cidade} (${customPerfil.filiais[0].estado})`}</span><br />
                                        <span id="tipoEmpresaFilial" className="text-sm">{`Tipo: ${customPerfil.filiais[0].tipo ?? 'Não informado'}`}</span>
                                    </div>
                                )}

                                {/* 
                            // ? Acredito que não vai mais ter esse ngç de filiais, por isso comentei, mas qualquer bota dnv
                            <div id="divLocalizacaoFilial" className="bg-professional-gray rounded-lg p-3" title="Localização Filial">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-professional-accent mr-2" />
                                <span id="localizacaoFilialEmpresa" className="text-sm">Endereço de Filiais</span>
                                <span id="estadoEmpresaFilial" className="text-sm text-center">Estado: (XX)</span>
                                <span id="cidadeEmpresaFilial" className="text-sm text-center">Cidade: (Nenhuma)</span>
                            </div> */}

                            </div>
                            <button id="btnEditarPerfil" onClick={() => navigate('/perfil/empresa/editar')}
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
                                    <a id="mapaEmpresa" href={empPerfil.link_endereco}
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

                                <div className="flex items-center bg-professional-gray rounded-lg p-3" title="YouTube">
                                    <FontAwesomeIcon icon={faYoutube} className="text-professional-accent mr-3 text-xl" />
                                    {empPerfil.youtube && (
                                        <a id="twtUsuario" href={empPerfil.youtube}
                                            className="ytUsuario text-professional-subtitle hover:text-professional-accent transition-colors"
                                            target="_blank">
                                            YouTube
                                        </a>
                                    )}
                                </div>

                                <div className="flex items-center bg-professional-gray rounded-lg p-3" title="Linkedin">
                                    <FontAwesomeIcon icon={faLinkedin} className="text-professional-accent mr-3 text-xl" />
                                    {empPerfil.linkedin && (
                                        <a id="linkedinUsuario" href={empPerfil.linkedin}
                                            className="twtUsuario text-professional-subtitle hover:text-professional-accent transition-colors"
                                            target="_blank">
                                            Linkedin
                                        </a>
                                    )}
                                </div>

                                <div className="flex items-center bg-professional-gray rounded-lg p-3" title="Linkedin">
                                    <FontAwesomeIcon icon={faFacebook} className="text-professional-accent mr-3 text-xl" />
                                    {empPerfil.facebook && (
                                        <a id="linkedinUsuario" href={empPerfil.facebook}
                                            className="facebookUsuario text-professional-subtitle hover:text-professional-accent transition-colors"
                                            target="_blank">
                                            Facebook
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

                    <div id="bodyTags" className="lg:col-span-4 space-y-6">
                        <div
                            className="bg-professional-card rounded-xl border border-professional-card p-6 transition-all duration-300 ease-in-out hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                            <h1 id="tituloTags" className="text-lg text-center font-semibold mb-2 text-professional-accent relative pb-3
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-10 after:h-0.5 after:bg-professional-accent after:rounded">
                                {`Áreas de Especialização${customPerfil.tags_count > 0 ? ` (${customPerfil.tags_count})` : ''}`}</h1>
                            <div id="boxTags"
                                className="bg-professional-gray rounded-lg p-4 border border-professional-card min-h-[120px]">
                                <div id="Tags" className="flex flex-wrap gap-3">
                                    {customPerfil.tags_count > 0 && customPerfil.tags_empresas.map(tag => {
                                        return (
                                            <div className="inline-flex items-center gap-1.5 py-2 px-4 bg-linear-to-br from-professional-gray to-professional-card text-professional-text text-sm font-medium rounded-lg border border-professional-card transition-all duration-200 ease-in-out hover:border-professional-accent hover:-translate-y-0.5 cursor-pointer"
                                                key={tag.id} title={`Tag: ${tag.nome}`} onClick={() => {
                                                    setTagToRemove({ nome: tag.nome, id: tag.id });
                                                    setMostrarModalRmvTag(true);
                                                }}>
                                                <span>{tag.nome}</span>
                                            </div>
                                        )
                                    })}
                                    {(mostrarMaisTagsExib && customPerfil.tags_count > 6) && (
                                        <button id="maisTags"
                                            className="inline-flex items-center gap-1.5 py-2 px-4 bg-linear-to-br from-professional-gray to-professional-card text-professional-text text-sm font-medium rounded-lg border border-professional-card cursor-default transition-all duration-200 ease-in-out hover:border-professional-accent hover:-translate-y-0.5 cursor-pointer"
                                            title="Carregar mais Habilidades" ref={mostrarMaisTagsRef} onClick={async () => {
                                                await handleMostrarTodasTags();
                                            }}>
                                            <FontAwesomeIcon icon={faPlus} className="text-professional-accent" />
                                        </button>
                                    )}
                                </div>
                                <button id="btnAddTags"
                                    className="mt-4 flex items-center text-professional-accent hover:text-professional-lightaccent transition-colors cursor-pointer"
                                    title="Adicionar Habilidade" onClick={() => {
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

                        {/* <!-- Localização - Filiais --> */}
                        <div
                            className="bg-professional-card rounded-xl border border-professional-card p-6 transition-all duration-300 ease-in-out hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                            <h2 className="text-lg text-center font-semibold mb-2 text-professional-accent relative pb-3
                                after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                                after:w-10 after:h-0.5 after:bg-professional-accent after:rounded">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                                Unidades: {customPerfil.filiais_count}
                            </h2>

                            <div id="divFiliaisExib" className="space-y-3 min-h-[100px] mb-4">
                                {(customPerfil.filiais && customPerfil.filiais.length > 0) ? customPerfil.filiais.map((filial, idx) => (
                                    <div key={filial.id} className="inline-flex items-center gap-2 py-2 px-4 bg-linear-to-br from-professional-gray to-professional-card text-professional-text text-sm font-medium rounded-lg border border-professional-card transition-all duration-200 ease-in-out hover:border-professional-accent hover:-translate-y-0.5 cursor-pointer group"
                                        title={`Filial ${filial.cidade} (${filial.estado}) - ${filial.tipo ?? 'Tipo não informado'}`}
                                        onClick={() => console.log(`Editar filial ${filial.estado}`)}>
                                        <FontAwesomeIcon icon={faBuilding} className="text-professional-accent" />
                                        <span>{`${filial.cidade} (${filial.estado}) ${filial.tipo ? `- ${filial.tipo}` : ''}`}</span>
                                        <button className="ml-2 text-professional-subtitleText hover:text-professional-accent opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Editar filial"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const knownTypes = ['Sede', 'Filial', 'Escritório', 'Centro de Operações', 'Depósito / Logística'];
                                                
                                                // Normaliza o tipo da filial para comparação
                                                const filialTipoNormalizado = String(filial.tipo || '').toLowerCase().trim();
                                                
                                                // Encontra o tipo correspondente nos knownTypes
                                                const matchedType = knownTypes.find(t => 
                                                    String(t).toLowerCase().trim() === filialTipoNormalizado
                                                );
                                                
                                                if (matchedType) {
                                                    setNovaFilial({ 
                                                        cidade: filial.cidade ?? '', 
                                                        estado: filial.estado ?? '', 
                                                        tipo: matchedType, 
                                                        tipo_outro: '' 
                                                    });
                                                } else if (filial.tipo) {
                                                    // Se tem um tipo mas não está nos conhecidos, usa 'outro'
                                                    setNovaFilial({ 
                                                        cidade: filial.cidade ?? '', 
                                                        estado: filial.estado ?? '', 
                                                        tipo: 'outro', 
                                                        tipo_outro: filial.tipo ?? '' 
                                                    });
                                                } else {
                                                    // Se não tem tipo definido
                                                    setNovaFilial({ 
                                                        cidade: filial.cidade ?? '', 
                                                        estado: filial.estado ?? '', 
                                                        tipo: '', 
                                                        tipo_outro: '' 
                                                    });
                                                }
                                                
                                                setEditingFilialId(filial.id ?? `${filial.cidade}-${filial.estado}-${idx}`);
                                                setBuscaEstado(filial.estado ?? ''); // IMPORTANTE: Preenche o campo de busca do estado
                                                setMostrarModalAddFilial(true);
                                            }}>
                                            <FontAwesomeIcon icon={faEdit} size="sm" />
                                        </button>
                                        <button className="ml-2 text-professional-subtitleText hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={async(e) => {
                                                e.stopPropagation();
                                                setCustomPerfil(prev => {
                                                    if (!prev) return prev;
                                                    const current = prev.filiais ?? [];
                                                    const newList = current.filter((f, i) => (filial.id ? f.id !== filial.id : i !== idx));
                                                    return { ...prev, filiais: newList, filiais_count: prev.filiais_count-1 };
                                                });
                                                await axiosWe.delete(`/filial/${filial.id}`)
                                            }}>
                                            <FontAwesomeIcon icon={faTimes} size="xs" />
                                        </button>
                                    </div>
                                )) : (
                                    <div className="flex items-center justify-center relative top-11 gap-2">
                                        <div className="text-2xl text-dark-400">Nenhuma filial cadastrada</div>
                                        <FontAwesomeIcon icon={faSearch} className="text-professional-accent text-2xl" />
                                    </div>
                                )}

                                {mostrarMaisFiliaisExib && (customPerfil.filiais_count ?? 0) > (customPerfil.filiais.length ?? 0) && (
                                    <button id="maisFiliais"
                                        className="inline-flex items-center gap-1.5 py-2 px-4 bg-linear-to-br from-professional-gray to-professional-card text-professional-text text-sm font-medium rounded-lg border border-professional-card cursor-default transition-all duration-200 ease-in-out hover:border-professional-accent hover:-translate-y-0.5 cursor-pointer"
                                        title="Carregar mais filiais"
                                        onClick={() => handleMostrarTodasFiliais()}>
                                        <FontAwesomeIcon icon={faPlus} className="text-professional-accent" />
                                    </button>
                                )}
                            </div>

                            <button id="btnAddFilial"
                                className="mt-2 flex items-center justify-center text-professional-accent hover:text-professional-lightaccent transition-colors cursor-pointer w-full py-2"
                                title="Adicionar nova filial"
                                onClick={() => { setEditingFilialId(null); setNovaFilial({ cidade: '', estado: '', tipo: '', tipo_outro: '' }); setMostrarModalAddFilial(true); }}>
                                <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                                Adicionar Filial
                            </button>
                        </div>

                        {mostrarModalAddFilial && (
                            <div id="modalAddFilial"
                                className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                                <div id="modalAddFilial-content"
                                    className="bg-professional-card p-6 rounded-xl w-full max-w-md border border-professional-card shadow-2xl">
                                    <h3 className="text-lg font-semibold mb-6 text-center text-professional-accent">
                                        <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                                        {editingFilialId ? 'Editar Filial' : 'Adicionar Nova Filial'}
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="inputCidadeFilial"
                                                className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                                <FontAwesomeIcon icon={faCity} className="text-professional-accent mr-2" />
                                                Cidade da Filial
                                            </label>
                                            <input
                                                type="text"
                                                id="inputCidadeFilial"
                                                placeholder="Ex: Rio de Janeiro"
                                                value={novaFilial.cidade}
                                                onChange={(e) => setNovaFilial({ ...novaFilial, cidade: e.target.value })}
                                                autoFocus
                                                className="w-full bg-professional-dark border border-professional-card rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-professional-accent placeholder-professional-subtitleText"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                                <FontAwesomeIcon icon={faFlag} className="text-professional-accent mr-2" />
                                                Estado da Filial
                                            </label>

                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Digite ou selecione o estado..."
                                                    value={buscaEstado}
                                                    onChange={(e) => {
                                                        setBuscaEstado(e.target.value);
                                                        if (e.target.value.length > 0) {
                                                            setMostrarListaEstados(true);
                                                        }
                                                    }}
                                                    className="w-full bg-professional-dark border border-professional-card rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-professional-accent placeholder-professional-subtitleText pr-10"
                                                />
                                                <FontAwesomeIcon
                                                    icon={faSearch}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-professional-subtitleText"
                                                />
                                            </div>

                                            {mostrarListaEstados && (
                                                <div className="mt-2 bg-professional-dark border border-professional-card rounded-lg max-h-48 overflow-y-auto shadow-lg">
                                                    {estadosBrasil
                                                        .filter(estado =>
                                                            estado.nome.toLowerCase().includes(buscaEstado.toLowerCase()) ||
                                                            estado.sigla.toLowerCase().includes(buscaEstado.toLowerCase())
                                                        )
                                                        .map((estado) => (
                                                            <div
                                                                key={estado.sigla}
                                                                className={`px-4 py-3 hover:bg-professional-gray cursor-pointer transition-colors ${novaFilial.estado === estado.sigla ? 'bg-professional-accent/20 border-l-2 border-professional-accent' : ''
                                                                    }`}
                                                                onClick={() => {
                                                                    setNovaFilial({ ...novaFilial, estado: estado.sigla });
                                                                    setBuscaEstado(`${estado.nome} (${estado.sigla}) `);
                                                                    setMostrarListaEstados(false);
                                                                }}
                                                            >
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-professional-text">{estado.nome}</span>
                                                                    <span className="text-professional-accent font-medium">{estado.sigla}</span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )}

                                            <div className="mt-3">
                                                <div className="text-sm text-professional-subtitleText mb-2">Estados mais comuns:</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {['SP', 'RJ', 'MG', 'RS', 'PR', 'SC'].map(sigla => {
                                                        const estado = estadosBrasil.find(e => e.sigla === sigla);
                                                        return (
                                                            <button
                                                                key={sigla}
                                                                type="button"
                                                                className={`px-3 py-1 rounded-lg text-sm transition-colors ${novaFilial.estado === sigla
                                                                    ? 'bg-professional-accent text-white'
                                                                    : 'bg-professional-gray text-professional-text hover:bg-professional-accent/20'
                                                                    }`}
                                                                onClick={() => {
                                                                    setNovaFilial({ ...novaFilial, estado: sigla });
                                                                    setBuscaEstado(`${estado?.nome} (${sigla})`);
                                                                }}
                                                            >
                                                                {sigla}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="tipoFilial"
                                                className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                                <FontAwesomeIcon icon={faCodeBranch} className="text-professional-accent mr-2" />
                                                Tipo da Filial (Opcional)
                                            </label>
                                            <select
                                                id="tipoFilial"
                                                value={novaFilial.tipo}
                                                onChange={(e) => setNovaFilial({ ...novaFilial, tipo: e.target.value, tipo_outro: e.target.value === 'outro' ? novaFilial.tipo_outro : '' })}
                                                className="w-full bg-professional-dark border border-professional-card rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-professional-accent"
                                            >
                                                <option value="" className="bg-professional-dark">Selecione o tipo</option>
                                                <option value="Sede" className="bg-professional-dark">Sede</option>
                                                <option value="Filial" className="bg-professional-dark">Filial</option>
                                                <option value="Escritório" className="bg-professional-dark">Escritório</option>
                                                <option value="Centro de Operações" className="bg-professional-dark">Centro de Operações</option>
                                                <option value="Depósito / Logística" className="bg-professional-dark">Depósito/Logística</option>
                                                <option value="outro" className="bg-professional-dark">Outro</option>
                                            </select>
                                            {String(novaFilial.tipo).toLowerCase() === 'outro' && (
                                                <div className="mt-3">
                                                    <label htmlFor="tipoFilialOutro" className="block text-professional-subtitle mb-2 font-medium">Especifique o tipo</label>
                                                    <input
                                                        id="tipoFilialOutro"
                                                        type="text"
                                                        value={novaFilial.tipo_outro}
                                                        onChange={(e) => setNovaFilial({ ...novaFilial, tipo_outro: e.target.value })}
                                                        placeholder="Ex: Centro de Distribuição"
                                                        className="w-full bg-professional-dark border border-professional-card rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-professional-accent"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-professional-card">
                                        <button
                                            onClick={() => {
                                                setMostrarModalAddFilial(false);
                                                setNovaFilial({ cidade: '', estado: '', tipo: '', tipo_outro: '' });
                                                setEditingFilialId(null);
                                                setBuscaEstado('');
                                            }}
                                            className="bg-professional-card text-professional-subtitle font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out hover:bg-professional-gray cursor-pointer"
                                        >
                                            Cancelar
                                        </button>
                                        <button disabled={carregandoFilial}
                                            onClick={async () => {
                                                if (!novaFilial.cidade || !novaFilial.estado) {
                                                    return;
                                                }
                                                if (String(novaFilial.tipo).toLowerCase() === 'outro' && !novaFilial.tipo_outro) {
                                                    return mostrarErroTopo('Por favor, especifique o tipo da filial.');
                                                }
                                                try {
                                                    setCarregandoFilial(true);
                                                    if (editingFilialId) {
                                                        const resolvedTipo = String(novaFilial.tipo).toLowerCase() === 'outro' && novaFilial.tipo_outro ? novaFilial.tipo_outro : novaFilial.tipo;

                                                        const filialDataBefore = customPerfil.filiais.find(c=>c.id === editingFilialId);
                                                        const alterouCidade = filialDataBefore.cidade!==novaFilial.cidade;
                                                        const alterouEstado = filialDataBefore.estado!==novaFilial.estado;
                                                        const alterouTipo = filialDataBefore.tipo!==resolvedTipo;
                                                        const modifiedData = {
                                                            ...(alterouCidade?{cidade: novaFilial.cidade}:{}),
                                                            ...(alterouEstado?{estado: novaFilial.estado}:{}),
                                                            ...(alterouTipo?{tipo: resolvedTipo===''?null:resolvedTipo}:{}),
                                                        };

                                                        if(Object.keys(modifiedData).length!==0){
                                                            await axiosWe.patch(`/filial/${editingFilialId}`, modifiedData);

                                                            setCustomPerfil(prev => {
                                                                if (!prev) return prev;
                                                                const current = prev.filiais ?? [];

                                                                const newList = current.map(f => {
                                                                    const fid = f.id ?? `${f.cidade}-${f.estado}`;
                                                                    if (fid === editingFilialId) {
                                                                        return { ...f, ...(modifiedData) };
                                                                    }
                                                                    return f;
                                                                });
                                                                return { ...prev, filiais: newList };
                                                            });
                                                        };                                                        

                                                        console.log('Editando filial:', novaFilial);
                                                        setEditingFilialId(null);
                                                    } else {
                                                        const resolvedTipo = String(novaFilial.tipo).toLowerCase() === 'outro' && novaFilial.tipo_outro ? novaFilial.tipo_outro : novaFilial.tipo;
                                                        const newFilial = { cidade: novaFilial.cidade, estado: novaFilial.estado, tipo: resolvedTipo };
                                                        const response = await axiosWe.post('/filial', newFilial);
                                                        const newFilialId = response.data.id;
                                                        setCustomPerfil(prev => {
                                                            if (!prev) return prev;
                                                            const current = prev.filiais ?? [];
                                                            const newList = [{...newFilial, id: newFilialId}, ...current];
                                                            return { ...prev, filiais: newList, filiais_count: prev.filiais_count+1 };
                                                        });
                                                        console.log('Adicionando filial:', novaFilial);
                                                    }
                                                    setMostrarModalAddFilial(false);
                                                    setNovaFilial({ cidade: '', estado: '', tipo: '', tipo_outro: '' });
                                                    setBuscaEstado('');
                                                } catch (erro) {
                                                    console.error('Erro ao adicionar filial:', erro);
                                                } finally{
                                                    setCarregandoFilial(false);
                                                }
                                            }}
                                            className="bg-professional-accent text-white font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out hover:bg-professional-lightaccent cursor-pointer">
                                            {editingFilialId ? 'Salvar' : 'Adicionar'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* <!--TODO Dashboard com abas --> */}
                <div className="mt-10">
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
                                    onClick={() => navigate('/vagas/criar')}>
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
                                    onClick={() => navigate('/projetos/criar')}>
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
                            <input type="text" id="inputTag" placeholder="Digite a habilidade" onChange={(e) => setTagToAdd(e.target.value)} autoFocus onKeyDown={(e) => handleKeyDownInputTag(e)}
                                className="w-full bg-professional-gray border border-professional-card rounded-lg px-4 py-3 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-professional-accent" value={tagToAdd} />
                            <div className="flex justify-end space-x-3">
                                <button id="btnCancelar" onClick={() => {
                                    setTagToAdd('');
                                    setMostrarModalAddTag(false);
                                }}
                                    className="bg-professional-card text-professional-subtitle font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out hover:bg-professional-gray cursor-pointer">Cancelar</button>
                                <button id="btnConfirmar" onClick={async () => {
                                    try {
                                        const tagNome = tagToAdd;
                                        if (!tagNome) return mostrarErroTopo('A tag não pode ser vazia.');
                                        setTagToAdd('');
                                        setMostrarModalAddTag(false);
                                        if (mostrarMaisTags) await handleMostrarTodasTags();
                                        const tagsExistentes = customPerfil.tags_empresas.map(tag => tag.nome.toLowerCase());
                                        if (tagsExistentes.includes(tagNome.toLowerCase())) return mostrarErroTopo('A empresa não pode ter tags repetidas.');
                                        const response = await axiosWe.post('/tags/empresas', { nome: tagNome }) as { data: { id: string } };
                                        setCustomPerfil(prev => ({ ...prev, tags_empresas: [{ nome: tagNome, id: response.data.id }, ...prev.tags_empresas], tags_count: prev.tags_count + 1 }));
                                    } catch (erro) {
                                        console.error(erro);
                                        if (erro.status === 409) mostrarErroTopo(erro.message);
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
                            habilidade? `}<br /><strong>{`(${tagToRemove.nome})`}</strong>
                            </p>
                            <div className="flex justify-center space-x-3">
                                <button id="btnCancelarDel" onClick={() => { setMostrarModalRmvTag(false); setTagToRemove({ nome: '', id: '' }); }}
                                    className="bg-professional-card text-professional-subtitle font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out hover:bg-professional-gray cursor-pointer">Cancelar</button>
                                <button id="btnConfirmarDel" onClick={async (e) => {
                                    const target = e.target as HTMLButtonElement;
                                    try {
                                        const tagId = tagToRemove.id;
                                        target.disabled = true;
                                        target.textContent = 'Removendo...'
                                        if (mostrarMaisTags) await handleMostrarTodasTags();
                                        await axiosWe.delete(`/tags/empresas/${tagId}`);
                                        setCustomPerfil(prev => {
                                            return { ...prev, tags_empresas: prev.tags_empresas.filter(tag => tag.id !== tagId), tags_count: prev.tags_count - 1 };
                                        })
                                    } catch (erro) {
                                        console.error(erro);
                                    } finally {
                                        setTagToRemove({ nome: '', id: '' });
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

                {/* <ThemeToggle />  */}
                {/* <!--* Modais tags fim --> */}
            </div>
        </>
    )
}