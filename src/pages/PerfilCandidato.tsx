import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { DadosUsuario, fileDownload, mostrarErroTopo } from "../utils/globalFunctions";
import axiosWe from "../utils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBirthdayCake, faBook, faBriefcase, faBuilding, faCertificate, faDownload, faEdit, faEnvelope, faEye, faFileInvoice, faGlobe, faIdCard, faMagic, faMapMarkerAlt, faPlus, faPlusCircle, faProjectDiagram, faStar, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import genPfp from '../assets/imgs/genPfp.png';
import { carregarPorcentagemPeloNivel, carregarTextoDoNivel } from "../ts/perfilCandidatoFunctions";
import HeaderProfiles from "../components/HeaderProfiles";
import Loader from "../components/Loader";
import type { Candidato, CustomCand, Idioma, Tag } from "../utils/utilsInterfaces";

export default function PerfilCandidato() {
    const navigate = useNavigate();
    const [usuario] = useState(DadosUsuario.getUsuario(true, 'candidato'));
    if(!usuario) {
        setTimeout(()=>{
            navigate('/')
        }, 3000);
    };

    const handleMostrarTodasTags = async()=>{
        try {
            if(customPerfil.candTagsTotal<=6) {
                setMostrarMaisTags(false);
                setMostrarMaisTagsExib(false);
                return;
            };
            setMostrarMaisTags(false);
            const response = await axiosWe(`/tag/cand/candidate/${usuario.id}?skip=6`) as {data: Tag[]};
            setCustomPerfil(prev=>({...prev, candTags: [...prev.candTags, ...response.data]}));
            setMostrarMaisTagsExib(false);
        } catch (erro) {
            setMostrarMaisTags(true);
            setMostrarMaisTagsExib(true);
            console.error('Erro ao mostrar todas as tags:',erro);
        }
    }
    const handleMostrarTodosIdiomas = async()=>{
        try {
            if(customPerfil.languagesTotal<=3) {
                setMostrarMaisIdiomas(false);
                setMostrarMaisIdiomasExib(false);
                return;
            };
            setMostrarMaisIdiomas(false);
            const response = await axiosWe(`/language/candidate/${usuario.id}?offset=3`) as {data: Idioma[]};
            setCustomPerfil(prev=>({...prev, languages: [...prev.languages, ...response.data]}));
            setMostrarMaisIdiomasExib(false);
        } catch (erro) {
            setMostrarMaisIdiomas(true);
            setMostrarMaisIdiomasExib(true);
            console.error('Erro ao mostrar todos os idiomas:',erro);
        }
    }
    const adicionarTagRef = useRef(null);
    const handleKeyDownInputTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            adicionarTagRef.current?.click();
        }
    }

    const [candPerfil, setCandPerfil] = useState<Candidato & {cpf?: string; birth_date?: string; city?: string; email?: string;} | null>(null);
    const [customPerfil, setCustomPerfil] = useState<CustomCand | null>(null);
    const [mostrarMaisTags, setMostrarMaisTags] = useState(true);
    const [mostrarMaisTagsExib, setMostrarMaisTagsExib] = useState(true);
    const mostrarMaisTagsRef = useRef(null);
    const [mostrarModalAddTag, setMostrarModalAddTag] = useState(false);
    const [tagToAdd, setTagToAdd] = useState('');
    const [mostrarModalRmvTag, setMostrarModalRmvTag] = useState(false);
    const [tagToRemove, setTagToRemove] = useState({nome: '', id: ''});

    const [mostrarMaisIdiomas, setMostrarMaisIdiomas] = useState(true);
    const [mostrarMaisIdiomasExib, setMostrarMaisIdiomasExib] = useState(true);
    const mostrarMaisIdiomasRef = useRef(null);
    const [idiomaToRemove, setIdiomaToRemove] = useState({nome: '', id: ''});
    const [mostrarModalRmvIdioma, setMostrarModalRmvIdioma] = useState(false);
    const [idiomaToAdd, setIdiomaToAdd] = useState({nome: '', nivel: ''});
    const [mostrarModalAddIdioma, setMostrarModalAddIdioma] = useState(false);

    const [tabAtual, setTabAtual] = useState('experiencias');

    useEffect(()=>{
        async function loadCand(){
            if(!usuario) return;
            try {
                const response = await axiosWe('/custom/meu-perfil-candidato') as {data: {user: Candidato, custom: CustomCand}};
                const data = response.data;
                const { user, custom } = data;
                DadosUsuario.setarFoto(user.image);
                DadosUsuario.setarNome(user.name);
                setCandPerfil(user);
                setCustomPerfil(custom);
            } catch (erro) {
                console.error("Erro ao carregar perfil do candidato:", erro);
            }
        };
        loadCand();
    },[usuario]);

    useEffect(()=>{
        if(!mostrarMaisTags) {
            if(!mostrarMaisTagsRef.current) return;
            mostrarMaisTagsRef.current.disabled = true;
            mostrarMaisTagsRef.current.textContent = 'Carregando...';
        };
    }, [mostrarMaisTags]);
    useEffect(()=>{
        if(!mostrarMaisIdiomas) {
            if(!mostrarMaisIdiomasRef.current) return;
            mostrarMaisIdiomasRef.current.disabled = true;
            mostrarMaisIdiomasRef.current.textContent = 'Carregando...';
        }
    }, [mostrarMaisIdiomas])

    if (!candPerfil) return (<Loader />);

    return (
        <div className="font-inter min-h-screen bg-white dark:bg-professional-dark">
        <HeaderProfiles />
        <div id="main" className="container mx-auto px-4 pt-10 pb-10">
            {candPerfil && (
            <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div id="bodyLeft" className="lg:col-span-8 flex flex-col lg:flex-row gap-6">
                    <div id="impInfo"
                        className="bg-white dark:bg-professional-card rounded-xl border border-professional-card p-6 lg:w-1/3 flex flex-col items-center transition-all duration-300 ease-in-out hover:border-professional-card dark:hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                        <img id="fotoUsuario" src={candPerfil.image==='genPfp.png'?genPfp:candPerfil.image} alt="Foto de perfil"
                            className="w-40 h-40 rounded-full border-4 border-professional-card dark:border-professional-accent object-cover mb-4"
                            title="Foto de Perfil"/>
                        <div className="w-full space-y-2 mb-6">
                            {candPerfil.cpf && (
                                <div className="bg-gray-100 text-professional-gray dark:text-gray-100 dark:bg-professional-gray rounded-lg p-3" title="CPF">
                                    <FontAwesomeIcon icon={faIdCard} className="text-professional-card dark:text-professional-accent mr-2" />
                                    <span id="cpfUsuario" className="text-sm">{candPerfil.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/,"$1.$2.$3-$4")}</span>
                                </div>
                            )}
                            {candPerfil.birth_date && (
                                <div className="bg-gray-100 text-professional-gray dark:text-gray-100 dark:bg-professional-gray rounded-lg p-3" title="Data de Nascimento">
                                    <FontAwesomeIcon icon={faBirthdayCake} className="text-professional-card dark:text-professional-accent mr-2" />
                                    {(()=>{
                                        const dataISO = candPerfil.birth_date.split('T')[0];
                                        const [anoNasc, mesNasc, diaNasc] = String(dataISO).split('-');
                                        return (<span id="nascUsuario" className="text-sm">{`${diaNasc}/${mesNasc}/${anoNasc}`}</span>)
                                    })()}
                                </div>
                            )}
                            {candPerfil.pronouns && (
                                <div className="bg-gray-100 text-professional-gray dark:text-gray-100 dark:bg-professional-gray rounded-lg p-3" title="Pronomes">
                                    <FontAwesomeIcon icon={faUser} className="text-professional-card dark:text-professional-accent mr-2" />
                                    <span id="pronUsuario" className="text-sm">{candPerfil.pronouns}</span>
                                </div>
                            )}
                            {candPerfil.current_position && (
                                <div className="bg-gray-100 text-professional-gray dark:text-gray-100 dark:bg-professional-gray rounded-lg p-3" title="Cargo Atual">
                                    <FontAwesomeIcon icon={faBriefcase} className="text-professional-card dark:text-professional-accent mr-2" />
                                    <span id="cargoUsuario" className="text-sm">{candPerfil.current_position}</span>
                                </div>
                            )}
                            {candPerfil.current_company && (
                                <div className="bg-gray-100 text-professional-gray dark:text-gray-100 dark:bg-professional-gray rounded-lg p-3" title="Empresa Atual">
                                    <FontAwesomeIcon icon={faBuilding} className="text-professional-card dark:text-professional-accent mr-2" />
                                    <span id="empresaUsuario" className="text-sm">{candPerfil.current_company}</span>
                                </div>
                            )}
                            {candPerfil.state && (
                                <div id="divLocalizacao" className="bg-gray-100 text-professional-gray dark:text-gray-100 dark:bg-professional-gray rounded-lg p-3" title="Localização">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-professional-card dark:text-professional-accent mr-2" />
                                    <span id="localizacaoUsuario" className="text-sm">Localização</span><br/>
                                    <span id="estadoUsuario" className="text-sm">{`Estado: (${candPerfil.state})`}</span><br/>
                                    <span id="cidadeUsuario" className="text-sm">{`Cidade: ${candPerfil.city||'Não informada'}`}</span>
                                </div>
                            )}
                        </div>
                        <button id="btnEditarPerfil" onClick={()=>{navigate('/perfil/candidato/editar')}}
                            className="hover:bg-gray-700 bg-professional-dark dark:bg-professional-accent text-white font-medium py-2.5 px-5 rounded-lg w-full transition-all duration-200 ease-in-out dark:hover:bg-professional-lightaccent cursor-pointer"
                            title="Editar Perfil">
                            <FontAwesomeIcon icon={faEdit} className="mr-2" />Editar Perfil
                        </button>
                        <button
                            id="btnVerPerfilPublico"
                            onClick={() => navigate(`/candidato/${usuario?.id}`)}
                            className="group flex items-center justify-center gap-2
                                        bg-transparent border border-professional-card
                                        dark:border-professional-accent
                                        text-professional-gray dark:text-white
                                        font-medium py-2.5 px-5 rounded-lg w-full mt-3
                                        transition-all duration-200 ease-in-out
                                        hover:bg-professional-card
                                        dark:hover:bg-professional-accent
                                        hover:text-white"
                            title="Ver perfil público"
                            >
                            <FontAwesomeIcon
                                icon={faEye}
                                className="text-sm opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <span>Ver perfil</span>
                        </button>
                    </div>

                    {/* <!-- Informações centrais --> */}
                    <div id="bodyMid"
                        className="bg-white dark:bg-professional-card rounded-xl border border-professional-card p-6 lg:w-2/3 flex flex-col transition-all duration-300 ease-in-out dark:hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                        <h1 id="nomUsuario" className="text-professional-dark dark:text-gray-100 text-3xl font-bold mb-2 text-center lg:text-left">{candPerfil.name}</h1>
                        <div className="flex items-center justify-center lg:justify-start mb-4" title="Email">
                            <FontAwesomeIcon icon={faEnvelope} className="text-professional-card dark:text-professional-accent mr-2" />
                            <a id="emailUsuario"
                                className="text-lg text-professional-card dark:text-professional-subtitle">{candPerfil.email}</a>
                        </div>

                        <div className="bg-gray-100 dark:bg-professional-gray rounded-lg p-4 mb-6">
                            <h2 className="text-lg text-center font-semibold mb-2 text-professional-dark dark:text-professional-accent relative pb-3
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-10 after:h-0.5 after:bg-professional-gray dark:after:bg-professional-accent after:rounded">
                                Resumo Profissional
                            </h2>

                            <p id="descUsuario" className="text-professional-card dark:text-professional-subtitle text-center">
                                {candPerfil.description}
                            </p>
                        </div>


                        <div id="conexoes" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center dark:bg-professional-gray dark:text-professional-subtitle text-professional-card bg-gray-100 rounded-lg p-3" title="Portfólio">
                                <FontAwesomeIcon icon={faMagic} className="text-professional-card dark:text-professional-accent mr-3 text-xl" />
                                {candPerfil.portfolio && (
                                <a id="portUsuario" href={candPerfil.portfolio}
                                    className="nomeRedeSoc  text-professional-card hover:text-professional-dark hover:underline dark:text-professional-subtitle dark:hover:text-professional-accent transition-colors"
                                    target="_blank">
                                    Portfólio
                                </a>
                                )}
                            </div>

                            <div className="flex items-center dark:bg-professional-gray dark:text-professional-subtitle text-professional-card bg-gray-100 rounded-lg p-3" title="GitHub">
                                <FontAwesomeIcon icon={faGithub} className="text-professional-card dark:text-professional-accent mr-3 text-xl" />
                                {candPerfil.github && (
                                <a id="gitUsuario" href={candPerfil.github}
                                    className="nomeRedeSoc  text-professional-card hover:text-professional-dark hover:underline dark:text-professional-subtitle dark:hover:text-professional-accent transition-colors"
                                    target="_blank">
                                    GitHub
                                </a>
                                )}
                            </div>

                            <div className="flex items-center dark:bg-professional-gray dark:text-professional-subtitle text-professional-card bg-gray-100 rounded-lg p-3" title="Currículo">
                                <FontAwesomeIcon icon={faFileInvoice} className="text-professional-card dark:text-professional-accent mr-3 text-xl" />
                                {candPerfil.resume && (
                                <a id="curriculoUsuario" href={candPerfil.resume}
                                    className="nomeRedeSoc  text-professional-card hover:text-professional-dark hover:underline dark:text-professional-subtitle dark:hover:text-professional-accent transition-colors"
                                    target="_blank">
                                    Currículo
                                </a>
                                )}
                                {(()=>{
                                    if(!candPerfil.resume_file) return;
                                    const curriculo_fileSplited = candPerfil.resume_file.split('|');
                                    return (
                                        <>
                                        <p id="curriculoSize" className="ml-auto">{`${(parseFloat(curriculo_fileSplited[1])/1024).toFixed(2)}MB`}</p>
                                        <FontAwesomeIcon icon={faDownload} className="text-lg cursor-pointer ml-2" id="downloadCurriculo" onClick={()=>fileDownload(curriculo_fileSplited[0],'raw')}/>
                                        </>
                                    )
                                })()}
                            </div>

                            <div className="flex items-center dark:bg-professional-gray dark:text-professional-subtitle text-professional-card bg-gray-100 rounded-lg p-3" title="Instagram">
                                <FontAwesomeIcon icon={faInstagram} className="text-professional-card dark:text-professional-accent mr-3 text-xl" />
                                {candPerfil.instagram && (
                                <a id="instUsuario" href={candPerfil.instagram}
                                    className="nomeRedeSoc  text-professional-card hover:text-professional-dark hover:underline dark:text-professional-subtitle dark:hover:text-professional-accent transition-colors"
                                    target="_blank">
                                    Instagram
                                </a>
                                )}
                            </div>

                            <div className="flex items-center dark:bg-professional-gray dark:text-professional-subtitle text-professional-card bg-gray-100 rounded-lg p-3" title="Site Pessoal">
                                <FontAwesomeIcon icon={faGlobe} className="text-professional-card dark:text-professional-accent mr-3 text-xl" />
                                {candPerfil.personal_site && (
                                <a id="siteUsuario" href={candPerfil.personal_site}
                                    className="nomeRedeSoc text-professional-card hover:text-professional-dark hover:underline dark:text-professional-subtitle dark:hover:text-professional-accent transition-colors"
                                    target="_blank">
                                    Site Pessoal
                                </a>
                                )}
                            </div>

                            <div className="flex items-center dark:bg-professional-gray dark:text-professional-subtitle text-professional-card bg-gray-100 rounded-lg p-3" title="Twitter/X">
                                <FontAwesomeIcon icon={faXTwitter} className="text-professional-card dark:text-professional-accent mr-3 text-xl" />
                                {candPerfil.twitter && (
                                <a id="twtUsuario" href={candPerfil.twitter}
                                    className="twtUsuario text-professional-card hover:text-professional-dark hover:underline dark:text-professional-subtitle dark:hover:text-professional-accent transition-colors"
                                    target="_blank">
                                    Twitter/X
                                </a>
                                )}
                            </div>
                        </div>

                        <div id="formacaoInfo" className="dark:bg-professional-gray bg-gray-100 rounded-lg p-4">

                            <h2 className="text-lg text-center font-semibold mb-2 dark:bg-professional-gray  text-professional-card dark:text-professional-accent relative pb-3
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-10 after:h-0.5 after:bg-professional-card dark:after:bg-professional-accent after:rounded">
                                Formação Acadêmica</h2>

                            <div className="space-y-3">
                                <div>
                                    <h3 className="font-medium dark:text-professional-subtitle text-professional-card text-center">Bacharelado em [Área]</h3>
                                    <p className=" dark:text-professional-subtitle text-professional-gray text-sm text-center">Universidade [Nome] • [Ano
                                        de
                                        Conclusão]
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium  dark:text-professional-subtitle text-professional-card text-center">Pós-graduação em [Especialização]
                                    </h3>
                                    <p className="dark:text-professional-subtitle text-professional-gray text-sm text-center">Instituição [Nome] • [Ano
                                        de
                                        Conclusão]
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium  dark:text-professional-subtitle text-professional-card text-center">Tecnologo em [Especialização]</h3>
                                    <p className="dark:text-professional-subtitle text-professional-gray text-sm text-center">Instituição [Nome] • [Ano
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
                        className="dark:bg-professional-card dark:text-professional-subtitle text-professional-card bg-white rounded-xl border border-professional-card p-6 transition-all duration-300 ease-in-out dark:hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                        <h1 id="tituloTags" className="text-lg text-center font-semibold mb-2 text-professional-dark dark:text-professional-accent relative pb-3
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-10 after:h-0.5 after:bg-professional-gray dark:after:bg-professional-accent after:rounded">
                            {`Habilidades & Competências${customPerfil.candTagsTotal>0?` (${customPerfil.candTagsTotal})`:''}`}</h1>
                        <div id="boxTags"
                            className="bg-gray-100 border-gray-100 dark:bg-professional-gray rounded-lg p-4 border dark:border-professional-card min-h-[120px]">
                            <div id="Tags" className="flex flex-wrap gap-3">
                                {/* <!-- Tags serão adicionadas aqui dinamicamente --> */}
                                {customPerfil.candTagsTotal>0 && customPerfil.candTags.map(tag=>{
                                    return (
                                        <div className="inline-flex items-center gap-1.5 py-2 px-4 bg-linear-to-br from-professional-gray to-professional-card text-professional-card dark:text-professional-text text-sm font-medium rounded-lg border border-professional-card transition-all duration-200 ease-in-out dark:hover:border-professional-accent hover:-translate-y-0.5 cursor-pointer"
                                            key={tag.id} title={`Tag: ${tag.name}`} onClick={()=>{
                                                setTagToRemove({nome: tag.name, id: tag.id});
                                                setMostrarModalRmvTag(true);
                                            }}>
                                            <span>{tag.name}</span>
                                        </div>
                                    )
                                })}
                                {(mostrarMaisTagsExib&&customPerfil.candTagsTotal>6) && (
                                    <button id="maisTags"
                                        className="inline-flex items-center gap-1.5 py-2 px-4 bg-linear-to-br from-professional-gray to-professional-card text-professional-accent text-sm font-medium rounded-lg border border-professional-card transition-all duration-200 ease-in-out hover:border-professional-accent hover:-translate-y-0.5 cursor-pointer"
                                        title="Carregar mais Habilidades" ref={mostrarMaisTagsRef} onClick={async()=>{
                                            await handleMostrarTodasTags();
                                        }}>
                                        <FontAwesomeIcon icon={faPlus} className="text-professional-accent" />
                                    </button>
                                )}
                            </div>
                            <button id="btnAddTags"
                                className="mt-4 flex items-center hover:text-gray-700 text-professional-dark dark:text-professional-accent dark:hover:text-professional-lightaccent transition-colors cursor-pointer"
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
                        className="dark:bg-professional-card dark:text-professional-subtitle text-professional-card bg-white rounded-xl border border-professional-card p-6 transition-all duration-300 ease-in-out dark:hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                        <h2 className="text-lg text-center font-semibold mb-2 dark:text-professional-accent relative pb-3
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-10 after:h-0.5 after:bg-professional-card dark:after:bg-professional-accent after:rounded text-professional-dark">
                            Métricas Profissionais</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                className="bg-gray-100 dark:bg-professional-gray  rounded-lg p-5 text-center border dark:border-professional-gray">
                                <div id="experienciasCount" className="text-[2rem] font-bold text-professional-dark dark:text-professional-accent mb-1">
                                    {customPerfil.experiencesTotal}</div>
                                <div className="text-sm text-professional-card dark:text-professional-subtitle">Experiências</div>
                            </div>
                            <div
                                className="bg-gray-100 dark:bg-professional-gray rounded-lg p-5 text-center border dark:border-professional-gray">
                                <div className="text-[2rem] font-bold  text-professional-dark dark:text-professional-accent mb-1">15</div>
                                <div className="text-smtext-professional-card text-professional-card dark:text-professional-subtitle">Certificações</div>
                            </div>
                            <div
                                className="bg-gray-100 dark:bg-professional-gray rounded-lg p-5 text-center border dark:border-professional-gray">
                                <div id="projetosCount" className="text-[2rem] font-bold text-professional-dark dark:text-professional-accent mb-1">{customPerfil.candProjectsTotal}
                                </div>
                                <div className="text-sm text-professional-card dark:text-professional-subtitle">Projetos</div>
                            </div>
                            <div
                                className="bg-gray-100 dark:bg-professional-gray rounded-lg p-5 text-center border dark:border-professional-gray">
                                <div className="text-[2rem] font-bold text-professional-dark dark:text-professional-accent mb-1">4</div>
                                <div className="text-sm text-professional-card dark:text-professional-subtitle">Formações</div>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Idiomas --> */}
                    <div
                        className="bg-white dark:bg-professional-card rounded-xl border border-professional-card p-6 transition-all duration-300 ease-in-out dark:hover:border-professional-accent hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]">
                        <h2 className="text-lg text-center font-semibold mb-2 text-professional-dark dark:text-professional-accent relative pb-3
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-10 after:h-0.5 after:bg-professional-gray dark:after:bg-professional-accent after:rounded">
                            {`Idiomas${customPerfil.languagesTotal>0?` (${customPerfil.languagesTotal})`:''}`}</h2>
                        <button id="btnAddIdiomas" onClick={()=>setMostrarModalAddIdioma(true)}
                            className="mt-4 flex items-center hover:text-gray-700 text-professional-dark dark:text-professional-accent dark:hover:text-professional-lightaccent transition-colors cursor-pointer">
                            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                            Adicionar Idioma
                        </button>
                        {customPerfil.languagesTotal>0 && customPerfil.languages.map(idio=>{
                            return (
                                <div key={idio.id} title={`Idioma: ${idio.name}`} className="mb-2 mt-1">
                                    <div className="flex justify-between mb-1 mt-1">
                                        <span className="text-professional-dark dark:text-gray-100">{idio.name}</span>
                                        <span className="text-professional-card dark:text-professional-subtitle text-sm">{carregarTextoDoNivel(idio.level)}</span>
                                        <FontAwesomeIcon icon={faXmark} className="removerIdiomaIcone text-professional-card dark:text-professional-subtitle cursor-pointer" onClick={()=>{
                                            setIdiomaToRemove({nome: idio.name, id: idio.id});
                                            setMostrarModalRmvIdioma(true);
                                        }}/>
                                    </div>
                                    <div className="w-full bg-gray-300 dark:bg-professional-gray rounded-full h-2">
                                        <div className={`bg-professional-dark dark:bg-professional-accent h-2 rounded-full`} style={{width: `${idio.percentage}%`}}></div>
                                    </div>
                                </div>
                            )
                        })}
                        {(mostrarMaisIdiomasExib&&customPerfil.languagesTotal>3) && (
                            <div id="divIdiomasExib" className="space-y-3">
                                <button id="maisIdiomas" ref={mostrarMaisIdiomasRef} onClick={async()=>await handleMostrarTodosIdiomas()}
                                    className="inline-flex items-center gap-1.5 py-2 px-4 bg-gray-100 text-professional-dark dark:bg-professional-card dark:text-professional-text text-sm font-medium rounded-lg border border-professional-card transition-all duration-200 ease-in-out dark:hover:border-professional-accent hover:-translate-y-0.5 cursor-pointer mt-2">
                                    <FontAwesomeIcon icon={faPlus} className="text-professional-dark dark:text-professional-accent" />
                                </button>
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>

            {/* <!-- Dashboard com abas --> */}
            <div className="mt-10">
                {/* <!-- Navegação por abas --> */}
                <div className="border-b border-professional-card mb-6">
                    <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" id="dashboard-tabs">
                        <li className="mr-2">
                            <button id="experienciasTelinha" className="tab-button relative inline-block p-4 text-gray-600 hover:text-gray-900 dark:text-professional-subtitle dark:hover:text-professional-accent
                            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 cursor-pointer after:bg-professional-gray
                            dark:after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="experiencias" style={tabAtual==='experiencias'?{color: '#7c3aed'}:{}}
                            onClick={()=>setTabAtual('experiencias')}>
                                <FontAwesomeIcon icon={faBriefcase} className="mr-2" />Experiências
                            </button>
                        </li>
                        <li className="mr-2">
                            <button className="tab-button relative inline-block p-4 text-gray-600 hover:text-gray-900 dark:text-professional-subtitle 
                            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 cursor-pointer after:bg-professional-gray
                            dark:after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out dark:hover:text-professional-accent" data-tab="certificacoes" style={tabAtual==='certificacoes'?{color: '#7c3aed'}:{}}
                            onClick={()=>setTabAtual('certificacoes')}>
                                <FontAwesomeIcon icon={faCertificate} className="mr-2" />Certificações
                            </button>
                        </li>
                        <li className="mr-2">
                            <button className="tab-button relative inline-block p-4 text-gray-600 hover:text-gray-900 dark:text-professional-subtitle dark:hover:text-professional-accent
                            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 cursor-pointer after:bg-professional-gray
                            dark:after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="projetos" style={tabAtual==='projetos'?{color: '#7c3aed'}:{}}
                            onClick={()=>setTabAtual('projetos')}>
                                <FontAwesomeIcon icon={faProjectDiagram} className="mr-2" />Projetos
                            </button>
                        </li>
                        <li className="mr-2">
                            <button className="tab-button relative inline-block p-4 text-gray-600 hover:text-gray-900 dark:text-professional-subtitle dark:hover:text-professional-accent
                            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 cursor-pointer after:bg-professional-gray
                            dark:after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="formacoes" style={tabAtual==='formacoes'?{color: '#7c3aed'}:{}}
                            onClick={()=>setTabAtual('formacoes')}>
                                <div className="relative">
                                    <FontAwesomeIcon icon={faBook} className="mr-2" />Formações
                                </div>
                            </button>
                        </li>
                        {/* <li className="mr-2">
                            <button className="tab-button relative inline-block p-4 text-gray-600 hover:text-gray-900 dark:text-professional-subtitle dark:hover:text-professional-accent
                            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 cursor-pointer after:bg-professional-gray
                            dark:after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="solicitacoes" style={tabAtual==='solicitacoes'?{color: '#7c3aed'}:{}}
                            onClick={()=>setTabAtual('solicitacoes')}>
                                <div className="relative">
                                    <FontAwesomeIcon icon={faHandshake} className="mr-2" />Solicitações
                                </div>
                            </button>
                        </li> */}
                        {/* <li className="mr-2">
                            <button className="tab-button relative inline-block p-4 text-gray-600 hover:text-gray-900 dark:text-professional-subtitle dark:hover:text-professional-accent
                            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 cursor-pointer after:bg-professional-gray
                            dark:after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="notificacoes" style={tabAtual==='notificacoes'?{color: '#7c3aed'}:{}}
                            onClick={()=>setTabAtual('notificacoes')}>
                                <div className="relative">
                                    <FontAwesomeIcon icon={faBell} className="mr-2" />Notificações
                                </div>
                            </button>
                        </li> */}
                        <li className="mr-2">
                            <button className="tab-button relative inline-block p-4 text-gray-600 hover:text-gray-900 dark:text-professional-subtitle dark:hover:text-professional-accent
                            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 cursor-pointer after:bg-professional-gray
                            dark:after:bg-professional-accent after:rounded after:scale-x-0 after:opacity-0
                            after:transition-all after:duration-300 after:ease-out" data-tab="recomendacoes" style={tabAtual==='recomendacoes'?{color: '#7c3aed'}:{}}
                            onClick={()=>setTabAtual('recomendacoes')}>
                                <div className="relative">
                                    <FontAwesomeIcon icon={faStar} className="mr-2" />Favoritos
                                </div>
                            </button>
                        </li>
                    </ul>
                </div>

                {/* <!-- Conteúdo das abas --> */}
                <div id="tab-content">
                    {/* <!-- Aba Experiências --> */}
                    {tabAtual==='experiencias' && (
                    <div id="experiencias" className="tab-pane active">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="bodyBottom">
                            <div id="boxCriar"
                                className="duration-300 ease-in-out hover:-translate-y-1 bg-white dark:bg-professional-card border-professional-dark dark:border-professional-gray after:bg-professional-card rounded-xl border-2 border-dashed p-5 flex flex-col items-center justify-center transition-colors cursor-pointer h-full min-h-[200px] hover:border-professional-accent dark:hover:border-professional-accent"
                                onClick={()=>{navigate('/experiencias/criar')}}>
                                <Link to="/experiencias/criar" className="flex flex-col items-center text-center">
                                    <FontAwesomeIcon icon={faPlusCircle} className="text-professional-dark dark:text-professional-accent mb-3 text-4xl" />
                                    <p id="textCriar" className="text-professional-card dark:text-professional-subtitle">Adicionar nova experiência
                                        profissional</p>
                                </Link>
                            </div>
                            {customPerfil.experiencesTotal>0 && customPerfil.experiences.map(expe=>(
                                <div key={expe.id}
                                    className="bg-white border-professional-dark after:bg-professional-card dark:bg-professional-card rounded-xl border dark:border-professional-card p-5  transition-all duration-300 ease-in-out hover:-translate-y-1 dark:hover:border-professional-accent cursor-pointer">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-professional-dark dark:text-white">{expe.title}</h3>
                                            <p className="text-professional-dark dark:text-professional-accent font-medium">{expe.name}</p>
                                        </div>
                                        {expe.period.split(' - ')[1] === 'Presente' && (
                                            <span className="bg-professional-dark dark:bg-professional-accent text-white text-xs font-medium px-2.5 py-0.5 rounded">Atual</span>
                                        )}
                                    </div>
                                    <p className="text-professional-gray dark:text-professional-subtitle mb-4">{expe.period}</p>
                                    <p className="text-professional-card dark:text-professional-subtitle text-sm mb-4 line-clamp-4 text-justify">{expe.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {expe.experiences_tags[0] && (
                                            <span className="bg-white text-professional-gray dark:bg-professional-gray dark:text-professional-subtitle text-xs px-2 py-1 rounded">{expe.experiences_tags[0].name}</span>
                                        )}
                                        {expe.experiences_tags[1] && (
                                            <span className="bg-white text-professional-gray dark:bg-professional-gray dark:text-professional-subtitle text-xs px-2 py-1 rounded">{expe.experiences_tags[1].name}</span>
                                        )}
                                        {expe.experiences_tags[2] && (
                                            <span className="bg-white text-professional-gray dark:bg-professional-gray dark:text-professional-subtitle   text-xs px-2 py-1 rounded">{expe.experiences_tags[2].name}</span>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* <!-- Experiências adicionadas aparecerão aqui --> */}
                            
                        </div>
                    </div>
                    )}

                    {/* <!-- Aba Certificações --> */}
                    {tabAtual==='certificacoes' && (
                    <div id="certificacoes" className="tab-pane">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div id="boxCriar"
                                className="bg-gray-100 border-gray-100 after:bg-professional-card dark:bg-professional-card dark:border-professional-card hover:border-professional-dark duration-300 ease-in-out hover:-translate-y-1 dark:hover:border-professional-accent rounded-xl border-2 border-dashed p-5 flex flex-col items-center justify-center transition-colors cursor-pointer h-full min-h-[200px]">
                                <Link to="/experiencias/criar" className="flex flex-col items-center text-center">
                                    <FontAwesomeIcon icon={faPlusCircle} className="text-4xl text-professional-dark dark:text-professional-accent mb-3" />
                                    <p id="textCriar" className="text-professional-card dark:text-professional-subtitle">Adicionar novas Certificações
                                    </p>
                                </Link>
                            </div>
                            {/* <div
                                className="bg-gray-100 border-gray-100 after:bg-professional-card dark:bg-professional-card rounded-xl border dark:border-professional-card p-5 hover:border-professional-dark transition-all duration-300 ease-in-out hover:-translate-y-1 dark:hover:border-professional-accent cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-professional-dark dark:text-white">PMP - Project Management Professional
                                    </h3>
                                    <span
                                        className="bg-professional-dark dark:bg-professional-accent text-white text-xs font-medium px-2.5 py-0.5 rounded">2022</span>
                                </div>
                                <p className="text-professional-gray dark:text-professional-subtitle mb-4">Project Management Institute</p>
                                <p className="text-professional-card dark:text-professional-subtitle text-sm">Certificação internacional em
                                    gerenciamento de
                                    projetos reconhecida globalmente.</p>
                            </div>

                            <div
                                className="bg-gray-100 border-gray-100 after:bg-professional-card dark:bg-professional-card rounded-xl border dark:border-professional-card p-5 hover:border-professional-dark transition-all duration-300 ease-in-out hover:-translate-y-1 dark:hover:border-professional-accent cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-professional-dark dark:text-white">Scrum Master Certified</h3>
                                    <span
                                        className="bg-professional-dark dark:bg-professional-accent text-white text-xs font-medium px-2.5 py-0.5 rounded">2021</span>
                                </div>
                                <p className="text-professional-gray dark:text-professional-subtitle mb-4">Scrum Alliance</p>
                                <p className="text-professional-card dark:text-professional-subtitle text-sm">Certificação em metodologias ágeis e
                                    framework
                                    Scrum.</p>
                            </div>

                            <div
                                className="bg-gray-100 border-gray-100 after:bg-professional-card dark:bg-professional-card rounded-xl border dark:border-professional-card p-5 hover:border-professional-dark transition-all duration-300 ease-in-out hover:-translate-y-1 dark:hover:border-professional-accent cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-professional-dark dark:text-white">Google Analytics Certification</h3>
                                    <span
                                        className="bg-professional-dark dark:bg-professional-accent text-white text-xs font-medium px-2.5 py-0.5 rounded">2020</span>
                                </div>
                                <p className="text-professional-gray dark:text-professional-subtitle mb-4">Google</p>
                                <p className="text-professional-card dark:text-professional-subtitle text-sm">Certificação em análise de dados e
                                    métricas
                                    digitais.</p>
                            </div> */}
                        </div>
                    </div>
                    )}

                    {/* <!-- Aba Projetos --> */}
                    {tabAtual==='projetos' && (
                    <div id="projetos" className="tab-pane">
                        <div id="projetosExib" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div id="boxCriar"
                                className="duration-300 ease-in-out hover:-translate-y-1 bg-gray-100 dark:bg-professional-card border-gray-100 dark:border-professional-gray after:bg-professional-card rounded-xl border-2 border-dashed p-5 flex flex-col items-center justify-center transition-colors cursor-pointer h-full min-h-[200px] hover:border-professional-dark dark:hover:border-professional-accent"
                                onClick={()=>{navigate('/projetos/criar')}}>
                                <Link to="/projetos/criar" className="flex flex-col items-center text-center">
                                    <FontAwesomeIcon icon={faPlusCircle} className="text-professional-dark dark:text-professional-accent mb-3 text-4xl" />
                                    <p id="textCriar" className="text-professional-card dark:text-professional-subtitle">Adicionar novos projetos</p>
                                </Link>
                            </div>
                            {customPerfil.candProjectsTotal>0 && customPerfil.candProjects.map(proj=>(
                                <div key={proj.id}
                                    className="bg-professional-card rounded-xl border border-professional-card p-5 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-professional-accent">

                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{proj.title}</h3>
                                            <p className="text-professional-accent font-medium">{proj.name}</p>
                                        </div>
                                        <span
                                            className="bg-professional-accent text-white text-xs font-medium px-2.5 py-0.5 rounded">
                                            {proj.status}
                                        </span>
                                    </div>

                                    <p className="text-professional-subtitle mb-2">{proj.period}</p>

                                    <div className="relative mb-4">
                                        <img src={proj.image} alt="Imagem do projeto"
                                            className="w-full h-48 object-contain rounded-lg  bg-professional-gray/10" />

                                        {proj.link && (
                                            <Link to={proj.link} target="_blank" rel="noopener noreferrer"
                                                className="absolute bottom-32 right-3 bg-professional-accent text-white p-1.5 rounded-full shadow-md hover:bg-professional-accent/80 transition-colors"
                                                title="Visitar site">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1" stroke="currentColor" className="w-5 h-5">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M13.828 10.172a4 4 0 010 5.656l-3.535 3.535a4 4 0 01-5.656-5.656l1.414-1.414m4.95-4.95a4 4 0 015.657 5.657l-3.535 3.535a4 4 0 01-5.657-5.657l1.414-1.414" />
                                                </svg>
                                            </Link>
                                        )}
                                    </div>

                                    {/* <!-- Descrição --> */}
                                    <p className="text-professional-subtitle text-sm mb-4 line-clamp-4 text-justify">
                                        {proj.description}
                                    </p>

                                    {/* <!-- Tags --> */}
                                    <div className="flex flex-wrap gap-2">
                                        {proj.cand_projects_tags[0] && (
                                            <span className="bg-professional-gray text-professional-subtitle text-xs px-2 py-1 rounded">
                                            {proj.cand_projects_tags[0].name}</span>
                                        )}
                                        {proj.cand_projects_tags[1] && (
                                            <span className="bg-professional-gray text-professional-subtitle text-xs px-2 py-1 rounded">
                                            {proj.cand_projects_tags[1].name}</span>
                                        )}
                                        {proj.cand_projects_tags[2] && (
                                            <span className="bg-professional-gray text-professional-subtitle text-xs px-2 py-1 rounded">
                                            {proj.cand_projects_tags[2].name}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    )}

                    {/* <!-- Aba formações --> */}
                    {tabAtual==='formacoes' && (
                    <div id="formacoes" className="tab-pane">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div id="boxCriar"
                                className="duration-300 ease-in-out hover:-translate-y-1 bg-gray-100 dark:bg-professional-card border-gray-100 dark:border-professional-gray after:bg-professional-card rounded-xl border-2 border-dashed p-5 flex flex-col items-center justify-center transition-colors cursor-pointer h-full min-h-[200px] hover:border-professional-dark dark:hover:border-professional-accent">
                                <Link to="/experiencias/criar" className="flex flex-col items-center text-center">
                                    <FontAwesomeIcon icon={faPlusCircle} className="text-professional-dark dark:text-professional-accent mb-3 text-4xl" />
                                    <p id="textCriar" className="text-professional-card dark:text-professional-subtitle">Adicionar uma nova formação</p>
                                </Link>
                            </div>
                            {/* <div
                                className="bg-gray-100 border-gray-100 after:bg-professional-card dark:bg-professional-card rounded-xl border dark:border-professional-card p-5 hover:border-professional-dark transition-all duration-300 ease-in-out hover:-translate-y-1 dark:hover:border-professional-accent cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-professional-dark dark:text-white">Sistema de Gestão Empresarial</h3>
                                    <span
                                        className="bg-professional-dark dark:bg-professional-accent text-white text-xs font-medium px-2.5 py-0.5 rounded">Concluído</span>
                                </div>
                                <p className="text-professional-gray dark:text-professional-subtitle mb-4">Tech Solutions Ltda • 2022</p>
                                <p className="text-professional-card dark:text-professional-subtitle text-sm mb-4">Desenvolvimento de sistema integrado
                                    para
                                    gestão de processos empresariais, resultando em aumento de 30% na eficiência
                                    operacional.</p>
                                <div className="flex flex-wrap gap-2">
                                    <span
                                        className="bg-white text-professional-dark dark:bg-professional-gray dark:text-professional-subtitle text-xs px-2 py-1 rounded">Java</span>
                                    <span
                                        className="bg-white text-professional-dark dark:bg-professional-gray dark:text-professional-subtitle text-xs px-2 py-1 rounded">Spring
                                        Boot</span>
                                    <span
                                        className="bg-white text-professional-dark dark:bg-professional-gray dark:text-professional-subtitle text-xs px-2 py-1 rounded">PostgreSQL</span>
                                </div>
                            </div> */}

                            {/* <div
                                className="bg-gray-100 border-gray-100 after:bg-professional-card dark:bg-professional-card rounded-xl border dark:border-professional-card p-5 hover:border-professional-dark transition-all duration-300 ease-in-out hover:-translate-y-1 dark:hover:border-professional-accent cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-professional-dark dark:text-white">Plataforma de E-learning</h3>
                                    <span
                                        className="bg-professional-dark dark:bg-professional-accent text-white text-xs font-medium px-2.5 py-0.5 rounded">Em
                                        Andamento</span>
                                </div>
                                <p className="text-professional-gray dark:text-professional-subtitle mb-4">Inovação Digital S.A. • 2023</p>
                                <p className="text-professional-card dark:text-professional-subtitle text-sm mb-4">Desenvolvimento de plataforma
                                    educacional
                                    com foco em experiência do usuário e acessibilidade.</p>
                                <div className="flex flex-wrap gap-2">
                                    <span
                                        className="bg-white text-professional-dark dark:bg-professional-gray dark:text-professional-subtitle text-xs px-2 py-1 rounded">React</span>
                                    <span
                                        className="bg-white text-professional-dark dark:bg-professional-gray dark:text-professional-subtitle text-xs px-2 py-1 rounded">Node.js</span>
                                    <span
                                        className="bg-white text-professional-dark dark:bg-professional-gray dark:text-professional-subtitle text-xs px-2 py-1 rounded">MongoDB</span>
                                </div>
                            </div> */}
                        </div>
                    </div>
                    )}

                    {/* <!-- Aba Recomendações --> */}
                    {tabAtual==='recomendacoes' && (
                    <div id="recomendacoes" className="tab-pane">
                        <div
                            className="bg-gray-100 border-gray-100 after:bg-professional-card dark:bg-professional-card rounded-xl border dark:border-professional-card p-5 hover:border-professional-dark transition-all duration-300 ease-in-out hover:-translate-y-1 dark:hover:border-professional-accent cursor-pointer">
                            <div className="border-b border-gray-100  dark:border-professional-card px-6 py-4">
                                <h3 className="text-lg font-semibold text-professional-dark dark:text-white">Recomendações de Colegas</h3>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-professional-card">
                                <div className="p-6">
                                    <div className="flex items-start">
                                        <img src={genPfp} alt="User"
                                            className="w-12 h-12 rounded-full mr-4"/>
                                        <div>
                                            <h4 className="font-bold text-professional-dark dark:text-white">Maria Silva</h4>
                                            <p className="text-professional-gray dark:text-professional-subtitle">Diretora de Projetos na Tech Solutions
                                            </p>
                                            <div className="flex text-yellow-400 my-2">
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                            </div>
                                            <p className="text-professional-gray dark:text-professional-subtitle">"Profissional excepcional com grande
                                                capacidade de liderança e resolução de problemas. Sempre entrega
                                                resultados
                                                além do esperado."</p>
                                            <p className="text-xs text-professional-card dark:text-professional-subtitle mt-2">Há 3 meses</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-start">
                                        <img src={genPfp} alt="User"
                                            className="w-12 h-12 rounded-full mr-4"/>
                                        <div>
                                            <h4 className="font-bold text-professional-dark dark:text-white">João Santos</h4>
                                            <p className="text-professional-gray dark:text-professional-subtitle">CTO na Inovação Digital</p>
                                            <div className="flex text-yellow-400 my-2">
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                                <FontAwesomeIcon icon={faStar} />
                                            </div>
                                            <p className="text-professional-gray dark:text-professional-subtitle">"Um dos melhores profissionais com
                                                quem já
                                                trabalhei. Sua expertise técnica e visão estratégica foram fundamentais
                                                para
                                                o sucesso de nossos projetos."</p>
                                            <p className="text-xs text-professional-card dark:text-professional-subtitle mt-2">Há 6 meses</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>

            {/* <!-- Modais --> */}
            {mostrarModalAddTag && (
                <div id="modalInput"
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div id="modalInput-content"
                        className="bg-professional-card p-6 rounded-xl w-11/12 max-w-md border border-professional-card">
                        <h3 className="text-lg font-semibold mb-4">Adicionar Habilidade</h3>
                        <input type="text" id="inputTag" placeholder="Digite a habilidade" onChange={(e)=>setTagToAdd(e.target.value)} autoFocus onKeyDown={(e)=>handleKeyDownInputTag(e)}
                            className="w-full bg-professional-gray border border-professional-card rounded-lg px-4 py-3 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-professional-accent" value={tagToAdd}/>
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
                                    const tagsExistentes = customPerfil.candTags.map(tag=>tag.name.toLowerCase());
                                    if(tagsExistentes.includes(tagNome.toLowerCase())) return mostrarErroTopo('Você não pode ter tags repetidas.');
                                    const response = await axiosWe.post('/tag/cand', { name: tagNome }) as {data: {id:string}};
                                    setCustomPerfil(prev=>({...prev, candTags:[{name: tagNome, id: response.data.id}, ...prev.candTags], candTagsTotal: prev.candTagsTotal+1}));
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
                                    await axiosWe.delete(`/tag/cand/${tagId}`);
                                    setCustomPerfil(prev=>{
                                        return {...prev, candTags: prev.candTags.filter(tag=>tag.id!==tagId), candTagsTotal: prev.candTagsTotal-1};
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

            {/* <!-- * Modais de Idiomas --> */}
            {mostrarModalAddIdioma && (
                <div id="modalInputIdioma"
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div id="modalInputIdioma-content"
                        className="bg-professional-card p-6 rounded-xl w-11/12 max-w-md border border-professional-card">
                        <h3 className="text-lg font-semibold mb-4">Adicionar Idioma</h3>
                        <input type="text" id="inputIdioma" placeholder="Digite o Idioma" value={idiomaToAdd.nome} onChange={(e)=>setIdiomaToAdd({...idiomaToAdd, nome: e.target.value})} autoFocus
                            className="w-full bg-professional-gray border border-professional-card rounded-lg px-4 py-3 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-professional-accent"/>
                        <label htmlFor="selectNivelIdioma" className="block text-professional-subtitle mb-2 font-medium">
                            Nível do Idioma
                        </label>
                        <select id="selectNivelIdioma"  value={idiomaToAdd.nivel} onChange={(e)=>setIdiomaToAdd({...idiomaToAdd, nivel: e.target.value})}
                            className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 mb-4">

                            {/* <!-- Opção padrão --> */}
                            <option value="" disabled className="text-professional-subtitle">Adicione o Nível do Idioma
                            </option>

                            <option value="A1" className="bg-professional-dark">Iniciante(A1)</option>
                            <option value="A2" className="bg-professional-dark">Básico(A2)</option>
                            <option value="B1" className="bg-professional-dark">Intermediário(B1)</option>
                            <option value="B2" className="bg-professional-dark">Intermediário Avançado(B2)</option>
                            <option value="C1" className="bg-professional-dark">Avançado(C1)</option>
                            <option value="C2" className="bg-professional-dark">Fluente(C2)</option>
                        </select>
                        <div className="flex justify-end space-x-3">
                            <button id="btnCancelarIdioma" onClick={()=>{
                                setIdiomaToAdd({nome: '', nivel: ''});
                                setMostrarModalAddIdioma(false);
                            }}
                                className="bg-professional-card text-professional-subtitle font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out hover:bg-professional-gray cursor-pointer">Cancelar</button>
                            <button id="btnConfirmarIdioma" onClick={async()=>{
                                try {
                                    const idiomaNome = idiomaToAdd.nome;
                                    const idiomaNivel = idiomaToAdd.nivel;
                                    if(!idiomaNome) return mostrarErroTopo('O nome do idioma não pode ser vazio.');
                                    if(!idiomaNivel) return mostrarErroTopo('Selecione o nível do idioma.');
                                    setIdiomaToAdd({nome:'', nivel:''});
                                    setMostrarModalAddIdioma(false);
                                    if(mostrarMaisIdiomas) await handleMostrarTodosIdiomas();
                                    const idiomasExistentes = customPerfil.languages.map(idi=>idi.name.toLowerCase());
                                    if(idiomasExistentes.includes(idiomaNome.toLowerCase())) return mostrarErroTopo('Você não pode adicionar idiomas repetidos.');
                                    const response = await axiosWe.post('/language', {name: idiomaNome, level: idiomaNivel}) as {data: {id:string}};
                                    setCustomPerfil(prev=>({...prev, languages:[{name: idiomaNome, level: idiomaNivel, id: response.data.id, percentage: Number(carregarPorcentagemPeloNivel(idiomaNivel)) }, ...prev.languages], languagesTotal: prev.languagesTotal+1}));
                                } catch (erro) {
                                    console.error(erro);
                                    if(erro.status===409) mostrarErroTopo(erro.message);
                                }
                            }}
                                className="bg-professional-accent text-white font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out hover:bg-professional-lightaccent cursor-pointer">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
            
            {mostrarModalRmvIdioma && (
                <div id="modalDeleteIdioma"
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div id="modalDeleteIdioma-content"
                        className="bg-professional-card p-6 rounded-xl w-11/12 max-w-md border border-professional-card">
                        <h3 className="text-lg font-semibold mb-4 text-center">Confirmar exclusão</h3>
                        <p className="text-professional-subtitle text-center mb-6">{`Tem certeza que deseja remover este
                            idioma? `}<strong>{`(${idiomaToRemove.nome})`}</strong>
                        </p>
                        <div className="flex justify-center space-x-3">
                            <button id="btnCancelarDelIdioma" onClick={()=>{setMostrarModalRmvIdioma(false);setIdiomaToRemove({nome: '', id:''});}}
                                className="bg-professional-card text-professional-subtitle font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out hover:bg-professional-gray cursor-pointer">Cancelar</button>
                            <button id="btnConfirmarDelIdioma" onClick={async(e)=>{
                                const target = e.target as HTMLButtonElement;
                                try {
                                    const idiomaId = idiomaToRemove.id;
                                    target.disabled = true;
                                    target.textContent = 'Removendo...';
                                    if(mostrarMaisIdiomas) await handleMostrarTodosIdiomas();
                                    await axiosWe.delete(`/language/${idiomaId}`);
                                    setCustomPerfil(prev=>{
                                        return {...prev, languages: prev.languages.filter(idi=>idi.id!==idiomaId), languagesTotal: prev.languagesTotal-1};
                                    })
                                } catch (erro) {
                                    console.error(erro);
                                } finally {
                                    setIdiomaToRemove({nome: '', id: ''});
                                    setMostrarModalRmvIdioma(false);
                                    target.disabled = false;
                                    target.textContent = 'Confirmar';
                                }
                            }}
                                className="bg-red-600 text-white font-medium py-2.5 px-5 rounded-lg transition-all duration-200 ease-in-out hover:bg-red-700 cursor-pointer">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
            {/* <!-- * Fim modais idiomas --> */}
            </>
            )}
        </div>
        </div>
    )
}