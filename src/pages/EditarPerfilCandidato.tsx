import { faGithub, faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faBriefcase, faBuilding, faCamera, faCancel, faCity, faEdit, faFile, faFileAlt, faFileInvoice, faFlag, faGlobe, faIdCard, faImage, faMagic, faMapMarkerAlt, faSave, faShareAlt, faSignature, faTimes, faTrashAlt, faUndo, faUser, faUserTag, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"
import { DadosUsuario, mostrarErroTopo, mostrarSucessoTopo } from "../utils/globalFunctions";
import axiosWe from "../utils/axiosInstance";
import HeaderProfiles from "../components/HeaderProfiles";
import { salvarEdicaoCandidato, type CampoEditCandFace, type FileEditCandFace } from "../ts/editarPerfilCandidatoFunctions";
import genPfp from '../assets/imgs/genPfp.png';

import defaultIconFile from '../assets/imgs/arquivo-de-link.png';
import pdfIconFile from '../assets/imgs/PDF.png';
import docxIconFile from '../assets/imgs/DOCXINCON.png';
import jpgIconFile from '../assets/imgs/jpg.png';
import pngIconFile from '../assets/imgs/png.png';
import Loader from "../components/Loader";
import type { Candidato } from "../utils/utilsInterfaces";
import FundoRoxo from '../assets/imgs/FundoRoxo.png';

export default function EditarPerfilCandidato () {
    const navigate = useNavigate();
    const [usuario] = useState(DadosUsuario.getUsuario(true, 'candidato'));
    if(!usuario) {
        setTimeout(()=>{
            navigate('/')
        }, 3000);
    };

    const [salvandoEdicao, setSalvandoEdicao] = useState(false);

    const [dataLoaded, setDataLoaded] = useState(false);
    useEffect(()=>{
        async function loadCand(){
            if(!usuario) return;
            try {
                const response = await axiosWe('/custom/perfil-candidato-editar') as {data: {usua: Candidato}};
                const usua = response.data.usua;
                DadosUsuario.setarFoto(usua.foto);
                DadosUsuario.setarNome(usua.nome);
                const { 
                    nome, foto, descricao, cpf, estado, cidade, instagram, github,
                    twitter, pronomes, site_pessoal, curriculo, cargo_atual,
                    portifolio, empresa_atual, curriculo_file, banner
                } = usua;
                setNomeInfo({cached: nome, value: nome, disabled: true});
                if(cpf) setCpfInfo({cached: cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"), value: cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"), disabled: true});
                if(pronomes) {
                    const pronomesDoSelect = ["Ela/Dela", "Ele/Dele", "Elu/Delu", "Prefiro não informar"];
                    if(!pronomesDoSelect.includes(pronomes)){
                        setPronomesInfo({cached: 'Outro', value: 'Outro', disabled: true});
                        setPronomesPersonalizadosInfo({cached: pronomes, value: pronomes, disabled: true});
                    } else setPronomesInfo({cached: pronomes, value: pronomes, disabled: true})
                };
                if(portifolio) setPortfolioInfo({cached: portifolio, value: portifolio, disabled: true});
                if(curriculo) setCurriculoInfo({cached: curriculo, value: curriculo, disabled: true});
                if(site_pessoal) setSite_pessoalInfo({cached: site_pessoal, value: site_pessoal, disabled: true});
                if(github) setGithubInfo({cached: github, value: github, disabled: true});
                if(instagram) setInstagramInfo({cached: instagram, value: instagram, disabled: true});
                if(twitter) setTwitterInfo({cached: twitter, value: twitter, disabled: true});
                if(cidade) setCidadeInfo({cached: cidade, value: cidade, disabled: true});
                if(estado) setEstadoInfo({cached: estado, value: estado, disabled: true});
                if(foto) setFotoInfo({cached: foto, value: null, disabled: true, truncate: false});
                if(cargo_atual) setCargo_atualInfo({cached: cargo_atual, value: cargo_atual, disabled: true});
                if(empresa_atual) setEmpresa_atualInfo({cached: empresa_atual, value: empresa_atual, disabled: true});
                if(descricao) setDescricaoInfo({cached: descricao, value: descricao, disabled: true});
                if(curriculo_file) setCurriculo_fileInfo({cached: curriculo_file, value: null, disabled: true, truncate: false});
                if (banner) setBannerInfo({ cached: banner, value: null, disabled: true, truncate: false });

                setDataLoaded(true);
            } catch (erro) {
                console.error('Erro ao carregar dados do usuário:',erro)
            }
        }
        loadCand();
    }, [usuario]);

    const initialState = {cached: '', value: '', disabled: false};
    const [nomeInfo, setNomeInfo] = useState<CampoEditCandFace>(initialState);
    const [cpfInfo, setCpfInfo] = useState<CampoEditCandFace>(initialState);
    const [pronomesInfo, setPronomesInfo] = useState<CampoEditCandFace>(initialState);
    const [pronomesPersonalizadosInfo, setPronomesPersonalizadosInfo] = useState<CampoEditCandFace>(initialState);
    const [portfolioInfo, setPortfolioInfo] = useState<CampoEditCandFace>(initialState);
    const [githubInfo, setGithubInfo] = useState<CampoEditCandFace>(initialState);
    const [curriculoInfo, setCurriculoInfo] = useState<CampoEditCandFace>(initialState);
    const [instagramInfo, setInstagramInfo] = useState<CampoEditCandFace>(initialState);
    const [site_pessoalInfo, setSite_pessoalInfo] = useState<CampoEditCandFace>(initialState);
    const [twitterInfo, setTwitterInfo] = useState<CampoEditCandFace>(initialState);
    const [cidadeInfo, setCidadeInfo] = useState<CampoEditCandFace>(initialState);
    const [estadoInfo, setEstadoInfo] = useState<CampoEditCandFace>(initialState);
    const [cargo_atualInfo, setCargo_atualInfo] = useState<CampoEditCandFace>(initialState);
    const [empresa_atualInfo, setEmpresa_atualInfo] = useState<CampoEditCandFace>(initialState);
    const [descricaoInfo, setDescricaoInfo] = useState<CampoEditCandFace>(initialState);
    const descricaoLength = descricaoInfo.value.length;
    const [fotoInfo, setFotoInfo] = useState<FileEditCandFace>({cached: '', value: null, disabled: false, truncate: false});
    const [curriculo_fileInfo, setCurriculo_fileInfo] = useState<FileEditCandFace>({cached: '', value: null, disabled: false, truncate: false});
    const [previewSrcBanner, setPreviewSrcBanner] = useState(FundoRoxo);
    const inputBannerOcultRef = useRef<HTMLInputElement>(null);
    const [bannerInfo, setBannerInfo] = useState<FileEditCandFace>({
        cached: '',
        value: null,
        disabled: false,
        truncate: false
    });

    const [previewSrcFoto, setPreviewSrcFoto] = useState(genPfp);
    const inputFotoPerfilOcultRef = useRef(null);
    useEffect(() => {
        if(fotoInfo.truncate) {
            setPreviewSrcFoto(genPfp);
            if(inputFotoPerfilOcultRef.current) inputFotoPerfilOcultRef.current.value = '';
        }
        else if (!fotoInfo.value && fotoInfo.cached !== '/assets/imgs/genPfp.png') {
            setPreviewSrcFoto(fotoInfo.cached);
            if(inputFotoPerfilOcultRef.current) inputFotoPerfilOcultRef.current.value = '';
        }
        else if (fotoInfo.value as File) {
            const reader = new FileReader();
            reader.onload = (e) => setPreviewSrcFoto(e.target?.result as string);
            reader.readAsDataURL(fotoInfo.value as File);
        }
        else {
            if(inputFotoPerfilOcultRef.current) inputFotoPerfilOcultRef.current.value = '';
            setPreviewSrcFoto(genPfp);
        }
    }, [fotoInfo]);

    useEffect(() => {
        if (bannerInfo.truncate) {
            setPreviewSrcBanner(FundoRoxo);
            if(inputBannerOcultRef.current) inputBannerOcultRef.current.value = '';
        }
        else if (!bannerInfo.value && bannerInfo.cached !== 'fundoroxo') {
            setPreviewSrcBanner(bannerInfo.cached);
            if(inputBannerOcultRef.current) inputBannerOcultRef.current.value = '';
        }
        else if (bannerInfo.value as File) {
            const reader = new FileReader();
            reader.onload = (e) => setPreviewSrcBanner(e.target?.result as string);
            reader.readAsDataURL(bannerInfo.value as File);
        }
        else {
            if(inputBannerOcultRef.current) inputBannerOcultRef.current.value = '';
            setPreviewSrcBanner(FundoRoxo);
        }
    }, [bannerInfo]);

    const [previewCurriculoFile, setPreviewCurriculoFile] = useState({name: '', size: '', src: defaultIconFile});
    const inputCurriculoFileOcultRef = useRef(null);
    useEffect(() => {
        const icones = {
            pdf: pdfIconFile,
            docx: docxIconFile,
            jpg: jpgIconFile,
            png: pngIconFile,
            default: defaultIconFile
        };
        if(curriculo_fileInfo.truncate) {
            setPreviewCurriculoFile({name: '', size: '', src: icones.default});
        } else if (!curriculo_fileInfo.value && curriculo_fileInfo.cached){
            const curriculo_fileSplited = curriculo_fileInfo.cached.split('|');
            const fileExt = curriculo_fileSplited[2].split('.').pop().toLowerCase();
            const iconSrc = icones[fileExt] || icones.default;
            setPreviewCurriculoFile({name: curriculo_fileSplited[2], size: curriculo_fileSplited[1], src: iconSrc});
        } else if (curriculo_fileInfo.value as File) {
            const file = curriculo_fileInfo.value;
            if (file.size > 5 * 1024 * 1024) {
                mostrarErroTopo('O arquivo deve ter no máximo 5MB.');
                setCurriculo_fileInfo(prev=>({...prev, value: null, truncate: false}));
                return;
            }
            const fileName = file.name;
            const fileExt = fileName.split('.').pop().toLowerCase();
            const iconSrc = icones[fileExt] || icones.default;
            const fileSize = `${(file.size / 1024).toFixed(2)} KB`;
            setPreviewCurriculoFile({name: fileName, size: fileSize, src: iconSrc});
        } else {
            setPreviewCurriculoFile({name: '', size: '', src: icones.default});
        }
    }, [curriculo_fileInfo])

    if(!dataLoaded) return (<Loader />);

    return (
        <div className="font-inter min-h-screen bg-white dark:bg-professional-dark">
        <HeaderProfiles />
        <div className="container mx-auto px-4 pt-10 pb-10 ">
            {dataLoaded && (
            <>
            <div className="page-header text-center mb-10">
                <h1 className="text-4xl font-bold gradient-text mb-2 text-professional-dark dark:text-white">Editar Perfil</h1>
                <p className="text-professional-gray dark:text-professional-subtitle text-lg max-w-2xl mx-auto">Atualize suas informações profissionais e
                    pessoais para destacar seu perfil no mercado</p>
            </div>
            <h2 className="text-2xl text-center font-semibold mb-4 text-professional-subtitle">
                <FontAwesomeIcon icon={faImage} className="text-professional-accent mr-2" />
                Banner do Perfil
            </h2>
            <div className="relative w-full h-56 overflow-hidden rounded-xl mb-4">
                <img
                    src={previewSrcBanner || FundoRoxo}
                    alt="Banner do perfil"
                    className="w-full h-full object-cover"
                />

                {/* Input oculto */}
                <input
                    type="file"
                    accept="image/*"
                    ref={inputBannerOcultRef}
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setBannerInfo(prev => ({ ...prev, value: file, truncate: false }));
                    }}
                />

                {/* Botão alterar */}
                <button
                    onClick={() => inputBannerOcultRef.current?.click()}
                    className="absolute bottom-4 right-4 bg-professional-accent text-white w-11 h-11 rounded-full shadow-lg hover:scale-110 transition"
                    title="Alterar banner"
                >
                    <FontAwesomeIcon icon={faCamera} />
                </button>

                {/* Remover */}
                {(!bannerInfo.truncate && (bannerInfo.value || bannerInfo.cached !== 'fundoroxo')) && (
                    <button
                        onClick={() => setBannerInfo(prev => ({ ...prev, value: null, truncate: true }))}
                        className="absolute top-4 right-4 bg-red-500 text-white w-11 h-11 rounded-full shadow-lg hover:scale-110 transition"
                        title="Remover banner"
                    >
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                )}

                {/* Cancelar */}
                {(bannerInfo.truncate || bannerInfo.value) && (
                    <button
                        onClick={() => setBannerInfo(prev => ({ ...prev, value: null, truncate: false }))}
                        className="absolute top-4 left-4 bg-blue-500 text-white w-11 h-11 rounded-full shadow-lg hover:scale-110 transition"
                        title="Cancelar edição"
                    >
                        <FontAwesomeIcon icon={faUndo} />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* <!-- Coluna esquerda - Informações pessoais --> */}
                <div className="lg:col-span-8 space-y-6">
                    {/* <!-- Informações Básicas --> */}
                    <div
                        className="bg-gray-100 dark:bg-professional-dark rounded-2xl p-8 border border-professional-dark dark:border-professional-card shadow-xl transition-all duration-300 ease-in-out dark:hover:border-professional-accent/50 animate-fade-in">
                        <h2 className="text-2xl text-center font-semibold mb-8 text-professional-dark dark:text-professional-subtitle relative pb-4
                        after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                        after:w-20 after:h-0.5 after:bg-professional-gray dark:after:bg-professional-subtitleText after:rounded">
                            <FontAwesomeIcon icon={faUser} className="text-professional-dark dark:text-professional-accent mr-2" />Informações Pessoais
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="nomeCompleto"
                                    className="text-professional-gray dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faSignature} className="text-professional-dark dark:text-professional-accent mr-2" />Nome Completo
                                    {nomeInfo.cached && (nomeInfo.disabled ? (
                                        <FontAwesomeIcon icon={faEdit} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 dark:hover:text-professional-subtitleText cursor-pointer" onClick={()=>setNomeInfo(prev=>({...prev, disabled: false}))} />
                                    ):(
                                        <FontAwesomeIcon icon={faCancel} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 cursor-pointer" onClick={()=>setNomeInfo(prev=>({...prev, value: prev.cached, disabled: true}))} />
                                    ))}
                                </label>
                                
                                <input type="text" id="nomeCompleto" value={nomeInfo.value} onChange={(e)=>setNomeInfo(prev=>({...prev, value: e.target.value}))} disabled={nomeInfo.disabled}
                                    className="w-full px-4 py-3 bg-white dark:bg-professional-dark border border-professional-card rounded-xl text-professional-card dark:text-professional-text transition-all focus:outline-none focus:border-professional-dark focus:border-2 dark:focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: João Silva Santos" />
                            </div>


                            <div>
                                <label htmlFor="cpf"
                                    className="text-professional-gray dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faIdCard} className="text-professional-dark dark:text-professional-accent mr-2" />CPF
                                    {cpfInfo.cached && (cpfInfo.disabled ? (
                                        <FontAwesomeIcon icon={faEdit} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 dark:hover:text-professional-subtitleText cursor-pointer" onClick={()=>setCpfInfo(prev=>({...prev, disabled: false}))} />
                                    ):(
                                        <FontAwesomeIcon icon={faCancel} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 dark:hover:text-professional-subtitleText cursor-pointer" onClick={()=>setCpfInfo(prev=>({...prev, value: prev.cached, disabled: true}))} />
                                    ))}
                                </label>
                                <input type="text" id="cpf" value={cpfInfo.value} onChange={(e)=>{
                                    let value = e.target.value.replace(/\D/g, "");
                                    if (value.length > 11) value = value.slice(0, 11);
                                    value = value.replace(/(\d{3})(\d)/, "$1.$2");
                                    value = value.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
                                    value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
                                    setCpfInfo(prev=>({...prev, value}));
                                }} disabled={cpfInfo.disabled}
                                    className="w-full px-4 py-3 bg-white dark:bg-professional-dark border border-professional-card rounded-xl text-professional-card dark:text-professional-text transition-all focus:outline-none focus:border-professional-dark focus:border-2 dark:focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: 000.000.000-00" />
                            </div>

                            <div>
                                <label htmlFor="pronomes"
                                    className="text-professional-gray dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faUserTag} className="text-professional-dark dark:text-professional-accent mr-2" />Pronomes
                                    {pronomesInfo.cached && (pronomesInfo.disabled ? ( 
                                        <FontAwesomeIcon icon={faEdit} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 dark:hover:text-professional-subtitleText cursor-pointer" onClick={()=>setPronomesInfo(prev=>({...prev, disabled: false}))} />
                                    ):(
                                        <FontAwesomeIcon icon={faCancel} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 dark:hover:text-professional-subtitleText cursor-pointer" onClick={()=>setPronomesInfo(prev=>({...prev, value: prev.cached, disabled: true}))} />
                                    ))}
                                </label>
                                <select id="pronomes" value={pronomesInfo.value} onChange={(e)=>setPronomesInfo(prev=>({...prev, value: e.target.value}))} disabled={pronomesInfo.disabled}
                                    className="w-full px-4 py-3 bg-white dark:bg-professional-dark border border-professional-card rounded-xl text-professional-card dark:text-professional-text transition-all focus:outline-none focus:border-professional-dark focus:border-2 dark:focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText">
                                    <option value="" disabled className="text-professional-subtitle">Selecione seus
                                        pronomes</option>
                                    <option value="Ela/Dela" className="bg-white dark:bg-professional-dark">Ela/Dela</option>
                                    <option value="Ele/Dele" className="bg-white dark:bg-professional-dark">Ele/Dele</option>
                                    <option value="Elu/Delu" className="bg-white dark:bg-professional-dark">Elu/Delu</option>
                                    <option value="Outro" className="bg-white dark:bg-professional-dark">Outro</option>
                                    <option value="Prefiro não informar" className="bg-white dark:bg-professional-dark">Prefiro não informar
                                    </option>
                                </select>
                            </div>

                            {pronomesInfo.value==='Outro' && (
                                <div id="pronomePersonalizadoContainer">
                                    <label htmlFor="pronomePersonalizado"
                                        className="text-professional-gray dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                        <FontAwesomeIcon icon={faEdit} className="text-professional-dark dark:text-professional-accent mr-2" />Especifique seus pronomes
                                        {pronomesPersonalizadosInfo.cached && (pronomesPersonalizadosInfo.disabled ? (
                                            <FontAwesomeIcon icon={faEdit} className="text-professional-dark dark:text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setPronomesPersonalizadosInfo(prev=>({...prev, disabled: false}))} />
                                        ):(
                                            <FontAwesomeIcon icon={faCancel} className="text-professional-dark dark:text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setPronomesPersonalizadosInfo(prev=>({...prev, value: prev.cached, disabled: true}))} />
                                        ))}
                                    </label>
                                    <input type="text" id="pronomePersonalizado" value={pronomesPersonalizadosInfo.value} onChange={(e)=>setPronomesPersonalizadosInfo(prev=>({...prev, value: e.target.value}))} disabled={pronomesPersonalizadosInfo.disabled}
                                        className="w-full px-4 py-3 bg-white dark:bg-professional-dark border border-professional-card rounded-xl text-professional-card dark:text-professional-text transition-all focus:outline-none focus:border-professional-dark focus:border-2 dark:focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: Ela/Dela, Elu/Delu" />
                                </div>
                            )}
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
                                    {portfolioInfo.cached && (portfolioInfo.disabled ? (
                                        <FontAwesomeIcon icon={faEdit} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setPortfolioInfo(prev=>({...prev, disabled: false}))} />
                                    ):(
                                        <FontAwesomeIcon icon={faCancel} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setPortfolioInfo(prev=>({...prev, value: prev.cached, disabled: true}))} />
                                    ))}
                                </label>
                                <input type="url" id="portfolio" value={portfolioInfo.value} onChange={(e)=>setPortfolioInfo(prev=>({...prev, value: e.target.value}))} disabled={portfolioInfo.disabled}
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: https://seuportfolio.com" />
                            </div>

                            <div>
                                <label htmlFor="github"
                                    className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faGithub} className="text-professional-accent mr-2" /> GitHub
                                    {githubInfo.cached && (githubInfo.disabled ? (
                                        <FontAwesomeIcon icon={faEdit} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setGithubInfo(prev=>({...prev, disabled: false}))} />
                                    ):(
                                        <FontAwesomeIcon icon={faCancel} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setGithubInfo(prev=>({...prev, value: prev.cached, disabled: true}))} />
                                    ))}
                                </label>
                                <input type="url" id="github" value={githubInfo.value} onChange={(e)=>setGithubInfo(prev=>({...prev, value: e.target.value}))} disabled={githubInfo.disabled}
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: https://github.com/seuusuario" />
                            </div>

                            <div>
                                <label htmlFor="curriculo"
                                    className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faFileInvoice} className="text-professional-accent mr-2" /> Currículo
                                    {curriculoInfo.cached && (curriculoInfo.disabled ? (
                                        <FontAwesomeIcon icon={faEdit} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setCurriculoInfo(prev=>({...prev, disabled: false}))} />
                                    ):(
                                        <FontAwesomeIcon icon={faCancel} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setCurriculoInfo(prev=>({...prev, value: prev.cached, disabled: true}))} />
                                    ))}
                                </label>
                                <input type="url" id="curriculo" value={curriculoInfo.value} onChange={(e)=>setCurriculoInfo(prev=>({...prev, value: e.target.value}))} disabled={curriculoInfo.disabled}
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: Link para seu currículo" />
                            </div>

                            <div>
                                <label htmlFor="instagram"
                                    className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faInstagram} className="text-professional-accent mr-2" /> Instagram
                                    {instagramInfo.cached && (instagramInfo.disabled ? (
                                        <FontAwesomeIcon icon={faEdit} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setInstagramInfo(prev=>({...prev, disabled: false}))} />
                                    ):(
                                        <FontAwesomeIcon icon={faCancel} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setInstagramInfo(prev=>({...prev, value: prev.cached, disabled: true}))} />
                                    ))}
                                </label>
                                <input type="url" id="instagram" value={instagramInfo.value} onChange={(e)=>setInstagramInfo(prev=>({...prev, value: e.target.value}))} disabled={instagramInfo.disabled}
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: https://instagram.com/seuusuario" />
                            </div>

                            <div>
                                <label htmlFor="sitePessoal"
                                    className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faGlobe} className="text-professional-accent mr-2" /> Site Pessoal
                                    {site_pessoalInfo.cached && (site_pessoalInfo.disabled ? (
                                        <FontAwesomeIcon icon={faEdit} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setSite_pessoalInfo(prev=>({...prev, disabled: false}))} />
                                    ):(
                                        <FontAwesomeIcon icon={faCancel} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setSite_pessoalInfo(prev=>({...prev, value: prev.cached, disabled: true}))} />
                                    ))}
                                </label>
                                <input type="url" id="sitePessoal" value={site_pessoalInfo.value} onChange={(e)=>setSite_pessoalInfo(prev=>({...prev, value: e.target.value}))} disabled={site_pessoalInfo.disabled}
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: https://seusite.com" />
                            </div>

                            <div>
                                <label htmlFor="twitter"
                                    className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faXTwitter} className="text-professional-accent mr-2" /> Twitter/X
                                    {twitterInfo.cached && (twitterInfo.disabled ? (
                                        <FontAwesomeIcon icon={faEdit} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setTwitterInfo(prev=>({...prev, disabled: false}))} />
                                    ):(
                                        <FontAwesomeIcon icon={faCancel} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setTwitterInfo(prev=>({...prev, value: prev.cached, disabled: true}))} />
                                    ))}
                                </label>
                                <input type="url" id="twitter" value={twitterInfo.value} onChange={(e)=>setTwitterInfo(prev=>({...prev, value: e.target.value}))} disabled={twitterInfo.disabled}
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: https://x.com/seuusuario" />
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
                                    {cidadeInfo.cached && (cidadeInfo.disabled ? (
                                        <FontAwesomeIcon icon={faEdit} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setCidadeInfo(prev=>({...prev, disabled: false}))} />
                                    ):(
                                        <FontAwesomeIcon icon={faCancel} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setCidadeInfo(prev=>({...prev, value: prev.cached, disabled: true}))} />
                                    ))}
                                </label>
                                <input type="text" id="cidade" value={cidadeInfo.value} onChange={(e)=>setCidadeInfo(prev=>({...prev, value: e.target.value}))} disabled={cidadeInfo.disabled}
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: São Paulo" />
                            </div>

                            <div>
                                <label htmlFor="estado"
                                    className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faFlag} className="text-professional-accent mr-2" />Estado
                                    {estadoInfo.cached && (estadoInfo.disabled ? (
                                        <FontAwesomeIcon icon={faEdit} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setEstadoInfo(prev=>({...prev, disabled: false}))} />
                                    ):(
                                        <FontAwesomeIcon icon={faCancel} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setEstadoInfo(prev=>({...prev, value: prev.cached, disabled: true}))} />
                                    ))}
                                </label>
                                <select id="estado" value={estadoInfo.value} onChange={(e)=>setEstadoInfo(prev=>({...prev, value: e.target.value}))} disabled={estadoInfo.disabled}
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20">
                                    <option value="" className="bg-professional-dark">Selecione seu estado</option>
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
                    <div
                        className="gradient-bg rounded-2xl p-8 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in">
                        <h2 className="text-2xl text-center font-semibold mb-8 text-professional-subtitle relative pb-4
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-12 after:h-0.5 after:bg-professional-subtitleText after:rounded">
                            <FontAwesomeIcon icon={faCamera} className="text-professional-accent mr-2" />Foto de Perfil
                        </h2>

                        <div className="flex flex-col items-center">
                            <div className="relative mb-4">
                                <img id="previewFoto" src={previewSrcFoto||genPfp}
                                    alt="Foto de perfil"
                                    className="w-40 h-40 rounded-full border-4 border-professional-accent object-cover shadow-lg" />

                                <input type="file" id="inputFotoPerfil" accept="image/*" className="hidden" ref={inputFotoPerfilOcultRef} onChange={(e)=>{
                                    const file = e.target.files[0];
                                    if(!file) return;
                                    setFotoInfo(prev=>({...prev, value: file, truncate: false}));
                                }}/>

                                <button id="btnAlterarFoto" onClick={()=>inputFotoPerfilOcultRef.current.click()}
                                    title="Adicionar Foto"
                                    className="absolute bottom-2 right-2 bg-professional-accent text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-professional-lightaccent transition-all duration-200 transform hover:scale-110 cursor-pointer">
                                    <FontAwesomeIcon icon={faCamera} />
                                </button>

                                {(!fotoInfo.truncate && (fotoInfo.value || fotoInfo.cached!=='/assets/imgs/genPfp.png')) && (
                                    <button id="btnRemoverFoto" onClick={()=>setFotoInfo(prev=>({...prev, value: null, truncate: true}))}
                                        title="Remover Foto"
                                        className="absolute top-2 right-2 bg-red-500 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-110 cursor-pointer">
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                )}

                                {(fotoInfo.truncate || fotoInfo.value) && (
                                    <button id="btnVoltarFoto" onClick={()=>setFotoInfo(prev=>({...prev, value: null, truncate: false}))}
                                        title="Cancelar Edição"
                                        className="absolute top-2 left-2 bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-110 cursor-pointer">
                                        <FontAwesomeIcon icon={faUndo} />
                                    </button>
                                )}

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
                                    {cargo_atualInfo.cached && (cargo_atualInfo.disabled ? (
                                        <FontAwesomeIcon icon={faEdit} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setCargo_atualInfo(prev=>({...prev, disabled: false}))} />
                                    ):(
                                        <FontAwesomeIcon icon={faCancel} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setCargo_atualInfo(prev=>({...prev, value: prev.cached, disabled: true}))} />
                                    ))}
                                </label>
                                <input type="text" id="cargoAtual" value={cargo_atualInfo.value} onChange={(e)=>setCargo_atualInfo(prev=>({...prev, value: e.target.value}))} disabled={cargo_atualInfo.disabled}
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: Desenvolvedor Full Stack" />
                            </div>

                            <div>
                                <label htmlFor="empresaAtual"
                                    className="block text-professional-subtitle mb-2 font-medium flex items-center">
                                    <FontAwesomeIcon icon={faBuilding} className="text-professional-accent mr-2" />Empresa Atual
                                    {empresa_atualInfo.cached && (empresa_atualInfo.disabled ? (
                                        <FontAwesomeIcon icon={faEdit} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setEmpresa_atualInfo(prev=>({...prev, disabled: false}))} />
                                    ):(
                                        <FontAwesomeIcon icon={faCancel} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setEmpresa_atualInfo(prev=>({...prev, value: prev.cached, disabled: true}))} />
                                    ))}
                                </label>
                                <input type="text" id="empresaAtual" value={empresa_atualInfo.value} onChange={(e)=>setEmpresa_atualInfo(prev=>({...prev, value: e.target.value}))} disabled={empresa_atualInfo.disabled}
                                    className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                    placeholder="Ex: Tech Solutions Ltda" />
                            </div>
                        </div>
                    </div>

                    {/* <!-- Imagem --> */}
                    <div
                        className="gradient-bg rounded-2xl p-3 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in h-min">
                        <label className="block text-professional-subtitle h-10 font-medium"><FontAwesomeIcon icon={faFile} className="text-professional-accent mr-2" />Arquivo do Currículo
                            {((curriculo_fileInfo.truncate || curriculo_fileInfo.value) && curriculo_fileInfo.cached) && (
                                <button id="btnVoltarArquivo" onClick={()=>setCurriculo_fileInfo(prev=>({...prev, value: null, truncate: false}))}
                                    title="Cancelar Edição"
                                    className="bg-professional-accent rounded-full w-6 h-6 ml-2 justify-center items-center cursor-pointer">
                                    <FontAwesomeIcon icon={faUndo} />
                                </button>
                            )}
                        </label>

                        {((curriculo_fileInfo.cached && curriculo_fileInfo.truncate) || (!curriculo_fileInfo.value && !curriculo_fileInfo.cached)) && (
                            <div className="image-upload-container relative border-2 border-dashed border-professional-card rounded-xl p-1 text-center transition-all bg-professional-dark/50 cursor-pointer min-h-[150px] flex flex-col justify-center items-center hover:border-professional-accent hover:bg-professional-accent/5"
                                id="uploadArea">
                                <div className="upload-content flex flex-col items-center -mt-4 h-max" id="uploadContent" onClick={()=>inputCurriculoFileOcultRef.current.click()}>
                                    <i className='bx bx-cloud-upload text-5xl text-professional-accent mb-0.5 mt-2'></i>
                                    <div className="upload-text text-professional-subtitle mb-4">
                                        <h3 className="text-xl font-medium mb-2">Adicionar Arquivo</h3>
                                        <p className="text-sm">Arraste um arquivo ou clique para selecionar</p>
                                        <p className="text-sm">Formatos: JPG, JPEG, PNG, WEBP, PDF, DOC, DOCX, TXT, RTF, ODT (Máx. 5MB)</p>
                                    </div>

                                </div>

                                {/* <div className="image-preview hidden w-full h-full rounded-xl overflow-hidden relative"
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
                                </div> */}

                                
                            </div>
                        )}
                        <input id="imgPlaceholder" type="file" accept="image/*,.pdf,.doc,.docx,.txt,.rtf,.odt" ref={inputCurriculoFileOcultRef}
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer hidden" onChange={(e)=>{
                                const file = e.target.files[0];
                                if(!file) return;
                                setCurriculo_fileInfo(prev=>({...prev, value: file, truncate: false}));
                            }}/>
                        
                        {((curriculo_fileInfo.cached && !curriculo_fileInfo.truncate) || curriculo_fileInfo.value) && (
                            <div className="mensagem-arquivo bg-professional-dark rounded-xl p-3 flex flex-col w-auto shadow-md my-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <img src={previewCurriculoFile.src} alt="icone" className="w-6 h-6"/>
                                    <p className="text-white font-semibold text-sm truncate">{previewCurriculoFile.name}</p>
                                </div>
                                <p className="text-gray-400 text-xs mb-3">Arquivo • {previewCurriculoFile.size}</p>
                                <div className="flex gap-2">
                                    <button className="flex-1 bg-dark-700 hover:bg-gray-700 text-white text-sm py-2 rounded-lg cursor-pointer" onClick={()=>inputCurriculoFileOcultRef.current.click()}>Alterar</button> 
                                    <button className="flex-1 bg-dark-700 hover:bg-gray-700 text-white text-sm py-2 rounded-lg remover-arquivo cursor-pointer"
                                        onClick={()=>setCurriculo_fileInfo(prev=>({...prev, value: null, truncate: true}))}>
                                        Remover
                                    </button> 
                                </div>
                            </div>
                        )}
                        
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
                    <label htmlFor="resumoProfissional" className="block text-professional-subtitle mb-2 font-medium">
                        Resumo
                        {descricaoInfo.cached && (descricaoInfo.disabled ? (
                            <FontAwesomeIcon icon={faEdit} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setDescricaoInfo(prev=>({...prev, disabled: false}))} />
                        ):(
                            <FontAwesomeIcon icon={faCancel} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={()=>setDescricaoInfo(prev=>({...prev, value: prev.cached, disabled: true}))} />
                        ))}
                    </label>
                    <textarea id="resumoProfissional" rows={6} maxLength={700} value={descricaoInfo.value} onChange={(e)=>setDescricaoInfo(prev=>({...prev, value: e.target.value}))} disabled={descricaoInfo.disabled}
                        className="w-full h-48 p-6 bg-professional-dark border border-professional-card rounded-xl text-professional-text resize-y transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                        placeholder="Descreva sua experiência profissional, habilidades e objetivos de carreira. Seja específico e use métricas quando possível."></textarea>
                    <div className="flex justify-between mt-2">
                        <span className="text-xs text-professional-subtitle">Máximo de 700 caracteres</span>
                        <span id="contadorCaracteres" className="text-xs text-professional-subtitle">{`${descricaoLength}/700`}</span>
                    </div>
                </div>
            </div>

            {/* <!-- Botões de Ação --> */}
            <div className="mt-10 flex justify-center space-x-4">
                <button id="btnSalvar" disabled={salvandoEdicao}
                    className="flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-xl transition-all bg-linear-to-r bg-primary-700 from-professional-accent to-professional-lightaccent text-white shadow-lg shadow-professional-accent/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-professional-accent/40 cursor-pointer"
                    onClick={async()=>{
                        setSalvandoEdicao(true);
                        const editou = await salvarEdicaoCandidato(nomeInfo, cpfInfo, pronomesInfo, pronomesPersonalizadosInfo, portfolioInfo, githubInfo, curriculoInfo, instagramInfo, site_pessoalInfo, twitterInfo, cidadeInfo, estadoInfo, cargo_atualInfo, empresa_atualInfo, descricaoInfo, fotoInfo, curriculo_fileInfo, bannerInfo);
                        if(!editou) setSalvandoEdicao(false);
                        else {
                            mostrarSucessoTopo('Perfil editado com sucesso!');
                            setTimeout(()=>{navigate('/perfil/candidato')}, 3000);
                        }
                    }}>
                    <FontAwesomeIcon icon={faSave} />{salvandoEdicao ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <button id="btnCancelar" onClick={()=>navigate('/perfil/candidato')}
                    className="flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-xl transition-all bg-professional-card text-professional-subtitle hover:bg-professional-card/80 hover:-translate-y-1 cursor-pointer">
                    <FontAwesomeIcon icon={faTimes} />Cancelar
                </button>
            </div>

            <div id="mensagemStatus" className="hidden mt-6 p-4 rounded-lg text-center"></div>
            </>
            )}
        </div>
        </div>
    )
}