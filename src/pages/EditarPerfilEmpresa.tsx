import { useNavigate } from 'react-router-dom'
import HeaderProfiles from '../components/HeaderProfiles';
import { DadosUsuario, mostrarSucessoTopo } from '../utils/globalFunctions';
import { useEffect, useRef, useState } from 'react';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileAlt, faBuilding, faSign, faIdCard, faIndustry, faChartBar,
    faCamera, faShareAlt, faGlobe, faMap, faSave, faTimes, faUndo,
    faTrashAlt, faEdit, faCancel, faBullseye, faEye, faHandshake,
    faImage
} from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faGithub, faTwitter, faYoutube, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import axiosWe from '../utils/axiosInstance';
import type { Empresa } from '../utils/utilsInterfaces';
import { salvarEdicaoEmpresa, type CampoEditEmpFace, type FileEditEmpFace } from '../ts/editarPerfilEmpresaFunctions';
import Loader from '../components/Loader';
import genPfp from '../assets/imgs/genPfp.png';
import FundoRoxo from '../assets/imgs/FundoRoxo.png';

export default function EditarPerfilEmpresa() {
    const navigate = useNavigate();
    const [usuario] = useState(DadosUsuario.getUsuario(true, 'empresa'));
    if (!usuario) {
        setTimeout(() => {
            navigate('/')
        }, 3000);
    };

    const [salvandoEdicao, setSalvandoEdicao] = useState(false);

    const [dataLoaded, setDataLoaded] = useState(false);
    useEffect(() => {
        async function loadEmp() {
            if (!usuario) return;
            try {
                const response = await axiosWe('/custom/perfil-empresa-editar') as { data: { usua: Empresa } };
                const { usua } = response.data;
                DadosUsuario.setarFoto(usua.foto);
                DadosUsuario.setarNome(usua.nome_fant);
                const {
                    foto, descricao, instagram, github, twitter, nome_fant, facebook,
                    setor, porte, contato, site, youtube, linkedin, link_endereco,
                    missao, visao, valores, banner
                } = usua;
                setNomeFantInfo({ cached: nome_fant, value: nome_fant, disabled: true });
                if (foto) setFotoInfo({ cached: foto, value: null, disabled: true, truncate: false });
                if (descricao) setDescricaoInfo({ cached: descricao, value: descricao, disabled: true });
                if (instagram) setInstagramInfo({ cached: instagram, value: instagram, disabled: true });
                if (github) setGithubInfo({ cached: github, value: github, disabled: true });
                if (twitter) setTwitterInfo({ cached: twitter, value: twitter, disabled: true });
                if (facebook) setFacebookInfo({ cached: facebook, value: facebook, disabled: true });
                if (setor) setSetorInfo({ cached: setor, value: setor, disabled: true });
                if (porte) setPorteInfo({ cached: porte, value: porte, disabled: true });
                if (contato) setContatoInfo({ cached: contato, value: contato, disabled: true });
                if (site) setSiteInfo({ cached: site, value: site, disabled: true });
                if (youtube) setYoutubeInfo({ cached: youtube, value: youtube, disabled: true });
                if (linkedin) setLinkedinInfo({ cached: linkedin, value: linkedin, disabled: true });
                if (link_endereco) setLinkEnderecoInfo({ cached: link_endereco, value: link_endereco, disabled: true });

                // Novos campos
                if (missao) setMissaoInfo({ cached: missao, value: missao, disabled: true });
                if (visao) setVisaoInfo({ cached: visao, value: visao, disabled: true });
                if (valores) setValoresInfo({ cached: valores, value: valores, disabled: true });
                if (banner) setBannerInfo({ cached: banner, value: null, disabled: true, truncate: false });

                setDataLoaded(true);
            } catch (erro) {
                console.error('Erro ao carregar dados do usuário:', erro)
            }
        }
        loadEmp();
    }, [usuario]);

    const initialState = { cached: '', value: '', disabled: false };
    const [nomeFantInfo, setNomeFantInfo] = useState<CampoEditEmpFace>(initialState);
    const [descricaoInfo, setDescricaoInfo] = useState<CampoEditEmpFace>(initialState);
    const descricaoLength = descricaoInfo.value.length;
    const [instagramInfo, setInstagramInfo] = useState<CampoEditEmpFace>(initialState);
    const [githubInfo, setGithubInfo] = useState<CampoEditEmpFace>(initialState);
    const [twitterInfo, setTwitterInfo] = useState<CampoEditEmpFace>(initialState);
    const [setorInfo, setSetorInfo] = useState<CampoEditEmpFace>(initialState);
    const [porteInfo, setPorteInfo] = useState<CampoEditEmpFace>(initialState);
    const [contatoInfo, setContatoInfo] = useState<CampoEditEmpFace>(initialState);
    const [siteInfo, setSiteInfo] = useState<CampoEditEmpFace>(initialState);
    const [youtubeInfo, setYoutubeInfo] = useState<CampoEditEmpFace>(initialState);
    const [linkedinInfo, setLinkedinInfo] = useState<CampoEditEmpFace>(initialState);
    const [linkEnderecoInfo, setLinkEnderecoInfo] = useState<CampoEditEmpFace>(initialState);
    const [facebookInfo, setFacebookInfo] = useState<CampoEditEmpFace>(initialState);
    const [fotoInfo, setFotoInfo] = useState<FileEditEmpFace>({ cached: '', value: null, disabled: false, truncate: false });
    const [missaoInfo, setMissaoInfo] = useState<CampoEditEmpFace>(initialState);
    const [visaoInfo, setVisaoInfo] = useState<CampoEditEmpFace>(initialState);
    const [valoresInfo, setValoresInfo] = useState<CampoEditEmpFace>(initialState);
    const [missaoLength, setMissaoLength] = useState(0);
    const [visaoLength, setVisaoLength] = useState(0);
    const [valoresLength, setValoresLength] = useState(0);
    const [previewSrcBanner, setPreviewSrcBanner] = useState(FundoRoxo);
    const inputBannerOcultRef = useRef<HTMLInputElement>(null);
    const [bannerInfo, setBannerInfo] = useState<FileEditEmpFace>({
        cached: '',
        value: null,
        disabled: false,
        truncate: false
    });

    const [previewSrcFoto, setPreviewSrcFoto] = useState(genPfp);

    const inputFotoPerfilOcultRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (fotoInfo.truncate) {
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

    useEffect(() => {
        if (dataLoaded) {
            setMissaoLength(missaoInfo.value.length);
            setVisaoLength(visaoInfo.value.length);
            setValoresLength(valoresInfo.value.length);
        }
    }, [dataLoaded, missaoInfo.value, visaoInfo.value, valoresInfo.value]);

    if (!dataLoaded) return (<Loader />);

    return (
        <div className="font-inter min-h-screen dark:bg-dark-900 bg-dark-50 ">
            <HeaderProfiles />
            <div className="container mx-auto px-4 pt-20 pb-10  ">
                <div className="page-header text-center mb-10 ">
                    <h1 className="text-4xl font-bold text-dark-900 dark:text-dark-50 mb-2 ">Editar Perfil Empresarial</h1>
                    <p className="text-dark-900 dark:text-professional-subtitle text-lg max-w-2xl mx-auto">Atualize as informações da sua empresa para atrair os melhores talentos e oportunidades</p>
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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 ">
                    <div className="lg:col-span-8 space-y-6 ">
                        <div
                            className="gradient-bg  rounded-2xl p-8 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in">
                            <h2 className="text-2xl text-center font-semibold mb-8 text-dark-900 dark:text-professional-subtitle relative pb-4
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-20 after:h-0.5 after:bg-professional-subtitleText after:rounded">

                                <FontAwesomeIcon icon={faBuilding} className="text-professional-accent mr-2" />Informações da Empresa
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="nomeEmpresa"
                                        className="text-dark-900 dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                        <FontAwesomeIcon icon={faSign} className="text-professional-accent mr-2" />Nome Fantasia
                                        {nomeFantInfo.cached && (nomeFantInfo.disabled ? (
                                            <FontAwesomeIcon icon={faEdit} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 dark:hover:text-professional-subtitleText cursor-pointer" onClick={() => setNomeFantInfo(prev => ({ ...prev, disabled: false }))} />
                                        ) : (
                                            <FontAwesomeIcon icon={faCancel} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 cursor-pointer" onClick={() => setNomeFantInfo(prev => ({ ...prev, value: prev.cached, disabled: true }))} />
                                        ))}
                                    </label>
                                    <input type="text" id="nomeEmpresa" value={nomeFantInfo.value} onChange={(e) => setNomeFantInfo(prev => ({ ...prev, value: e.target.value }))} disabled={nomeFantInfo.disabled}
                                        className="w-full px-4 py-3 bg-dark-50 dark:bg-dark-700  border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: Tech Solutions Ltda" />
                                </div>

                                <div>
                                    <label htmlFor="EmailEmpresa"
                                        className="text-dark-900 dark:text-professional-subtitle  mb-2 font-medium flex items-center">
                                        <FontAwesomeIcon icon={faIdCard} className="text-professional-accent mr-2" />Email de Contato
                                        {contatoInfo.cached && (contatoInfo.disabled ? (
                                            <FontAwesomeIcon icon={faEdit} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 dark:hover:text-professional-subtitleText cursor-pointer" onClick={() => setContatoInfo(prev => ({ ...prev, disabled: false }))} />
                                        ) : (
                                            <FontAwesomeIcon icon={faCancel} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 cursor-pointer" onClick={() => setContatoInfo(prev => ({ ...prev, value: prev.cached, disabled: true }))} />
                                        ))}
                                    </label>
                                    <input type="text" id="EmailEmpresa" value={contatoInfo.value} onChange={(e) => setContatoInfo(prev => ({ ...prev, value: e.target.value }))} disabled={contatoInfo.disabled}
                                        className="w-full px-4 py-3 bg-dark-50 dark:bg-dark-700  border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: nome@exemplo.com" />
                                </div>

                                <div>
                                    <label htmlFor="setorAtuacao"
                                        className="text-dark-900 dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                        <FontAwesomeIcon icon={faIndustry} className="text-professional-accent mr-2" />Setor de Atuação
                                        {setorInfo.cached && (setorInfo.disabled ? (
                                            <FontAwesomeIcon icon={faEdit} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 dark:hover:text-professional-subtitleText cursor-pointer" onClick={() => setSetorInfo(prev => ({ ...prev, disabled: false }))} />
                                        ) : (
                                            <FontAwesomeIcon icon={faCancel} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 cursor-pointer" onClick={() => setSetorInfo(prev => ({ ...prev, value: prev.cached, disabled: true }))} />
                                        ))}
                                    </label>
                                    <input type="text" id="setorAtuacao" value={setorInfo.value} onChange={(e) => setSetorInfo(prev => ({ ...prev, value: e.target.value }))} disabled={setorInfo.disabled}
                                        className="w-full px-4 py-3 bg-dark-50 dark:bg-dark-700  border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                        placeholder="Ex: Tecnologia da Informação" />
                                </div>

                                <div>
                                    <label htmlFor="porteEmpresa"
                                        className="text-dark-900 dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                        <FontAwesomeIcon icon={faChartBar} className="text-professional-accent mr-2" />Porte da Empresa
                                        {porteInfo.cached && (porteInfo.disabled ? (
                                            <FontAwesomeIcon icon={faEdit} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 dark:hover:text-professional-subtitleText cursor-pointer" onClick={() => setPorteInfo(prev => ({ ...prev, disabled: false }))} />
                                        ) : (
                                            <FontAwesomeIcon icon={faCancel} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 cursor-pointer" onClick={() => setPorteInfo(prev => ({ ...prev, value: prev.cached, disabled: true }))} />
                                        ))}
                                    </label>
                                    <select id="porteEmpresa" value={porteInfo.value} onChange={(e) => setPorteInfo(prev => ({ ...prev, value: e.target.value }))} disabled={porteInfo.disabled}
                                        className="w-full px-4 py-3 bg-dark-50 dark:bg-dark-700 border border-professional-card rounded-xl text-professional-subtitleText dark:text-dark-50 transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20">
                                        <option value="" disabled className="text-dark-900 dark:text-dark-50">Selecione o porte</option>
                                        <option value="Pequeno" className="text-dark-900 dark:text-dark-50">Pequena Empresa</option>
                                        <option value="Médio" className="text-dark-900 dark:text-dark-50">Média Empresa</option>
                                        <option value="Grande" className="text-dark-900 dark:text-dark-50">Grande Empresa</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* <!-- Coluna direita - Logo e Cultura --> */}
                    <div className="lg:col-span-4 space-y-6">
                        <div
                            className="gradient-bg rounded-2xl p-5 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in">
                            <h2 className="text-2xl text-center font-semibold mb-8 text-dark-900 dark:text-professional-subtitle relative pb-4
                                after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                                after:w-12 after:h-0.5 after:bg-professional-subtitleText after:rounded">
                                <FontAwesomeIcon icon={faCamera} className="text-professional-accent mr-2" />Logo da Empresa
                            </h2>

                            <div className="flex flex-col items-center">
                                <div className="relative mb-4">
                                    <img id="previewLogo" src={previewSrcFoto || genPfp} alt="Logo da empresa"
                                        className="w-40 h-40 rounded-full border-4 border-professional-accent object-cover shadow-lg" />

                                    <input type="file" id="inputFotoPerfil" accept="image/*" className="hidden" ref={inputFotoPerfilOcultRef} onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setFotoInfo(prev => ({ ...prev, value: file, truncate: false }));
                                    }} />

                                    <button id="btnAlterarFoto" onClick={() => inputFotoPerfilOcultRef.current?.click()}
                                        title="Adicionar Foto"
                                        className="absolute bottom-2 right-2 bg-professional-accent text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-professional-lightaccent transition-all duration-200 transform hover:scale-110 cursor-pointer">
                                        <FontAwesomeIcon icon={faCamera} />
                                    </button>

                                    {(!fotoInfo.truncate && (fotoInfo.value || fotoInfo.cached !== '/assets/imgs/genPfp.png')) && (
                                        <button id="btnRemoverFoto" onClick={() => setFotoInfo(prev => ({ ...prev, value: null, truncate: true }))}
                                            title="Remover Foto"
                                            className="absolute top-2 right-2 bg-red-500 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-110 cursor-pointer">
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    )}

                                    {(fotoInfo.truncate || fotoInfo.value) && (
                                        <button id="btnVoltarFoto" onClick={() => setFotoInfo(prev => ({ ...prev, value: null, truncate: false }))}
                                            title="Cancelar Edição"
                                            className="absolute top-2 left-2 bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-110 cursor-pointer">
                                            <FontAwesomeIcon icon={faUndo} />
                                        </button>
                                    )}

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
                        <FontAwesomeIcon icon={faShareAlt} className="text-professional-accent mr-2" />Redes Sociais e Contatos
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="siteOficial"
                                className="text-dark-900 dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                <FontAwesomeIcon icon={faGlobe} className="text-professional-accent mr-2" /> Site Oficial
                                {siteInfo.cached && (siteInfo.disabled ? (
                                    <FontAwesomeIcon icon={faEdit} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 dark:hover:text-professional-subtitleText cursor-pointer" onClick={() => setSiteInfo(prev => ({ ...prev, disabled: false }))} />
                                ) : (
                                    <FontAwesomeIcon icon={faCancel} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 cursor-pointer" onClick={() => setSiteInfo(prev => ({ ...prev, value: prev.cached, disabled: true }))} />
                                ))}
                            </label>
                            <input type="url" id="siteOficial" value={siteInfo.value} onChange={(e) => setSiteInfo(prev => ({ ...prev, value: e.target.value }))} disabled={siteInfo.disabled}
                                className="w-full px-4 py-3 bg-dark-50 dark:bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                placeholder="Ex: https://empresa.com" />
                        </div>

                        <div>
                            <label htmlFor="youtube"
                                className="text-dark-900 dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                <FontAwesomeIcon icon={faYoutube} className="text-professional-accent mr-2" /> Youtube
                                {youtubeInfo.cached && (youtubeInfo.disabled ? (
                                    <FontAwesomeIcon icon={faEdit} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 dark:hover:text-professional-subtitleText cursor-pointer" onClick={() => setYoutubeInfo(prev => ({ ...prev, disabled: false }))} />
                                ) : (
                                    <FontAwesomeIcon icon={faCancel} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 cursor-pointer" onClick={() => setYoutubeInfo(prev => ({ ...prev, value: prev.cached, disabled: true }))} />
                                ))}
                            </label>
                            <input type="url" id="youtube" value={youtubeInfo.value} onChange={(e) => setYoutubeInfo(prev => ({ ...prev, value: e.target.value }))} disabled={youtubeInfo.disabled}
                                className="w-full px-4 py-3 bg-dark-50 dark:bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                placeholder="Ex: https://www.youtube.com/@empresa" />
                        </div>

                        <div>
                            <label htmlFor="instagram"
                                className="text-dark-900 dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                <FontAwesomeIcon icon={faInstagram} className="text-professional-accent mr-2" /> Instagram
                                {instagramInfo.cached && (instagramInfo.disabled ? (
                                    <FontAwesomeIcon icon={faEdit} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 dark:hover:text-professional-subtitleText cursor-pointer" onClick={() => setInstagramInfo(prev => ({ ...prev, disabled: false }))} />
                                ) : (
                                    <FontAwesomeIcon icon={faCancel} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 cursor-pointer" onClick={() => setInstagramInfo(prev => ({ ...prev, value: prev.cached, disabled: true }))} />
                                ))}
                            </label>
                            <input type="url" id="instagram" value={instagramInfo.value} onChange={(e) => setInstagramInfo(prev => ({ ...prev, value: e.target.value }))} disabled={instagramInfo.disabled}
                                className="w-full px-4 py-3 bg-dark-50 dark:bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                placeholder="Ex: https://instagram.com/empresa" />
                        </div>

                        <div>
                            <label htmlFor="github"
                                className="text-dark-900 dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                <FontAwesomeIcon icon={faGithub} className="text-professional-accent mr-2" /> GitHub
                                {githubInfo.cached && (githubInfo.disabled ? (
                                    <FontAwesomeIcon icon={faEdit} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 dark:hover:text-professional-subtitleText cursor-pointer" onClick={() => setGithubInfo(prev => ({ ...prev, disabled: false }))} />
                                ) : (
                                    <FontAwesomeIcon icon={faCancel} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 cursor-pointer" onClick={() => setGithubInfo(prev => ({ ...prev, value: prev.cached, disabled: true }))} />
                                ))}
                            </label>
                            <input type="url" id="github" value={githubInfo.value} onChange={(e) => setGithubInfo(prev => ({ ...prev, value: e.target.value }))} disabled={githubInfo.disabled}
                                className="w-full px-4 py-3 bg-dark-50 dark:bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                placeholder="Ex: https://github.com/empresa" />
                        </div>

                        <div>
                            <label htmlFor="twitter"
                                className="text-dark-900 dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                <FontAwesomeIcon icon={faTwitter} className="text-professional-accent mr-2" /> Twitter/X
                                {twitterInfo.cached && (twitterInfo.disabled ? (
                                    <FontAwesomeIcon icon={faEdit} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 dark:hover:text-professional-subtitleText cursor-pointer" onClick={() => setTwitterInfo(prev => ({ ...prev, disabled: false }))} />
                                ) : (
                                    <FontAwesomeIcon icon={faCancel} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 cursor-pointer" onClick={() => setTwitterInfo(prev => ({ ...prev, value: prev.cached, disabled: true }))} />
                                ))}
                            </label>
                            <input type="url" id="twitter" value={twitterInfo.value} onChange={(e) => setTwitterInfo(prev => ({ ...prev, value: e.target.value }))} disabled={twitterInfo.disabled}
                                className="w-full px-4 py-3 bg-dark-50 dark:bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                placeholder="Ex: https://twitter.com/empresa" />
                        </div>

                        <div>
                            <label htmlFor="mapa"
                                className="text-dark-900 dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                <FontAwesomeIcon icon={faMap} className="text-professional-accent mr-2" /> Link do Mapa
                                {linkEnderecoInfo.cached && (linkEnderecoInfo.disabled ? (
                                    <FontAwesomeIcon icon={faEdit} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 dark:hover:text-professional-subtitleText cursor-pointer" onClick={() => setLinkEnderecoInfo(prev => ({ ...prev, disabled: false }))} />
                                ) : (
                                    <FontAwesomeIcon icon={faCancel} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 cursor-pointer" onClick={() => setLinkEnderecoInfo(prev => ({ ...prev, value: prev.cached, disabled: true }))} />
                                ))}
                            </label>
                            <input type="url" id="mapa" value={linkEnderecoInfo.value} onChange={(e) => setLinkEnderecoInfo(prev => ({ ...prev, value: e.target.value }))} disabled={linkEnderecoInfo.disabled}
                                className="w-full px-4 py-3 bg-dark-50 dark:bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                placeholder="Ex: https://maps.google.com/..." />
                        </div>

                        <div>
                            <label htmlFor="facebook"
                                className="text-dark-900 dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                <FontAwesomeIcon icon={faFacebook} className="text-professional-accent mr-2" /> Facebook
                                {facebookInfo.cached && (facebookInfo.disabled ? (
                                    <FontAwesomeIcon icon={faEdit} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 dark:hover:text-professional-subtitleText cursor-pointer" onClick={() => setFacebookInfo(prev => ({ ...prev, disabled: false }))} />
                                ) : (
                                    <FontAwesomeIcon icon={faCancel} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 cursor-pointer" onClick={() => setFacebookInfo(prev => ({ ...prev, value: prev.cached, disabled: true }))} />
                                ))}
                            </label>
                            <input type="url" id="facebook" value={facebookInfo.value} onChange={(e) => setFacebookInfo(prev => ({ ...prev, value: e.target.value }))} disabled={facebookInfo.disabled}
                                className="w-full px-4 py-3 bg-dark-50 dark:bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                placeholder="Ex: https://www.facebook.com/empresa" />
                        </div>

                        <div>
                            <label htmlFor="linkedin"
                                className="text-dark-900 dark:text-professional-subtitle mb-2 font-medium flex items-center">
                                <FontAwesomeIcon icon={faLinkedin} className="text-professional-accent mr-2" /> Linkedin
                                {linkedinInfo.cached && (linkedinInfo.disabled ? (
                                    <FontAwesomeIcon icon={faEdit} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 dark:hover:text-professional-subtitleText cursor-pointer" onClick={() => setLinkedinInfo(prev => ({ ...prev, disabled: false }))} />
                                ) : (
                                    <FontAwesomeIcon icon={faCancel} className="text-professional-dark hover:text-gray-500 dark:text-professional-accent ml-2 cursor-pointer" onClick={() => setLinkedinInfo(prev => ({ ...prev, value: prev.cached, disabled: true }))} />
                                ))}
                            </label>
                            <input type="url" id="linkedin" value={linkedinInfo.value} onChange={(e) => setLinkedinInfo(prev => ({ ...prev, value: e.target.value }))} disabled={linkedinInfo.disabled}
                                className="w-full px-4 py-3 bg-dark-50 dark:bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                placeholder="Ex: https://www.linkedin.com/company/empresa" />
                        </div>

                    </div>
                </div>
                <div
                    className="gradient-bg rounded-2xl p-4 mt-5 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in">
                    <h2 className="text-2xl text-center font-semibold mb-8 text-dark-900 dark:text-professional-subtitle relative pb-4
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-12 after:h-0.5 after:bg-professional-subtitleText after:rounded">
                        <FontAwesomeIcon icon={faFileAlt} className="text-professional-accent mr-2" />Sobre a Empresa
                    </h2>

                    <div>
                        <label htmlFor="sobreEmpresa" className="block text-dark-900 dark:text-professional-subtitle mb-2 font-medium">
                            <FontAwesomeIcon icon={faFileAlt} className="text-professional-accent mr-2" />Descrição da Empresa
                            {descricaoInfo.cached && (descricaoInfo.disabled ? (
                                <FontAwesomeIcon icon={faEdit} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={() => setDescricaoInfo(prev => ({ ...prev, disabled: false }))} />
                            ) : (
                                <FontAwesomeIcon icon={faCancel} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={() => setDescricaoInfo(prev => ({ ...prev, value: prev.cached, disabled: true }))} />
                            ))}
                        </label>
                        <textarea id="sobreEmpresa" rows={6} maxLength={700} value={descricaoInfo.value} onChange={(e) => setDescricaoInfo(prev => ({ ...prev, value: e.target.value }))} disabled={descricaoInfo.disabled}
                            className="w-full h-48 p-6 bg-dark-50 dark:bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-subtitle resize-y transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                            placeholder="Descreva sua empresa, sua história, especialidades e diferenciais no mercado. Seja específico e use métricas quando possível."></textarea>
                        <div className="flex justify-between mt-2">
                            <span className="text-xs text-dark-900 dark:text-professional-subtitle">Máximo de 700 caracteres</span>
                            <span id="contadorCaracteres" className="text-xs text-dark-900 dark:text-professional-subtitle">{`${descricaoLength}/700`}</span>
                        </div>
                    </div>
                </div>

                {/* Nova seção: Missão, Visão e Valores */}
                <div
                    className="gradient-bg rounded-2xl p-4 mt-5 border border-professional-card shadow-xl transition-all duration-300 ease-in-out hover:border-professional-accent/50 animate-fade-in">
                    <h2 className="text-2xl text-center font-semibold mb-8 text-dark-900 dark:text-professional-subtitle relative pb-4
                            after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                            after:w-12 after:h-0.5 after:bg-professional-subtitleText after:rounded">
                        <FontAwesomeIcon icon={faHandshake} className="text-professional-accent mr-2" />Missão, Visão e Valores
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="missaoEmpresa" className="block text-dark-900 dark:text-professional-subtitle mb-2 font-medium">
                                <FontAwesomeIcon icon={faBullseye} className="text-professional-accent mr-2" />Missão
                                {missaoInfo.cached && (missaoInfo.disabled ? (
                                    <FontAwesomeIcon icon={faEdit} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={() => setMissaoInfo(prev => ({ ...prev, disabled: false }))} />
                                ) : (
                                    <FontAwesomeIcon icon={faCancel} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={() => setMissaoInfo(prev => ({ ...prev, value: prev.cached, disabled: true }))} />
                                ))}
                            </label>
                            <textarea id="missaoEmpresa" rows={4} maxLength={300} value={missaoInfo.value}
                                onChange={(e) => {
                                    setMissaoInfo(prev => ({ ...prev, value: e.target.value }));
                                    setMissaoLength(e.target.value.length);
                                }}
                                disabled={missaoInfo.disabled}
                                className="w-full h-40 p-4 bg-dark-50 dark:bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-subtitle resize-y transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                placeholder="Descreva a missão da sua empresa, seu propósito fundamental e razão de existir."></textarea>
                            <div className="flex justify-between mt-2">
                                <span className="text-xs text-dark-900 dark:text-professional-subtitle">Máximo de 300 caracteres</span>
                                <span className="text-xs text-dark-900 dark:text-professional-subtitle">{`${missaoLength}/300`}</span>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="visaoEmpresa" className="block text-dark-900 dark:text-professional-subtitle mb-2 font-medium">
                                <FontAwesomeIcon icon={faEye} className="text-professional-accent mr-2" />Visão
                                {visaoInfo.cached && (visaoInfo.disabled ? (
                                    <FontAwesomeIcon icon={faEdit} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={() => setVisaoInfo(prev => ({ ...prev, disabled: false }))} />
                                ) : (
                                    <FontAwesomeIcon icon={faCancel} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={() => setVisaoInfo(prev => ({ ...prev, value: prev.cached, disabled: true }))} />
                                ))}
                            </label>
                            <textarea id="visaoEmpresa" rows={4} maxLength={300} value={visaoInfo.value}
                                onChange={(e) => {
                                    setVisaoInfo(prev => ({ ...prev, value: e.target.value }));
                                    setVisaoLength(e.target.value.length);
                                }}
                                disabled={visaoInfo.disabled}
                                className="w-full h-40 p-4 bg-dark-50 dark:bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-subtitle resize-y transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                placeholder="Descreva a visão futura da sua empresa, onde deseja chegar e seus objetivos de longo prazo."></textarea>
                            <div className="flex justify-between mt-2">
                                <span className="text-xs text-dark-900 dark:text-professional-subtitle">Máximo de 300 caracteres</span>
                                <span className="text-xs text-dark-900 dark:text-professional-subtitle">{`${visaoLength}/300`}</span>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="valoresEmpresa" className="block text-dark-900 dark:text-professional-subtitle mb-2 font-medium">
                                <FontAwesomeIcon icon={faHandshake} className="text-professional-accent mr-2" />Valores
                                {valoresInfo.cached && (valoresInfo.disabled ? (
                                    <FontAwesomeIcon icon={faEdit} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={() => setValoresInfo(prev => ({ ...prev, disabled: false }))} />
                                ) : (
                                    <FontAwesomeIcon icon={faCancel} className="text-professional-accent ml-2 hover:text-professional-subtitleText cursor-pointer" onClick={() => setValoresInfo(prev => ({ ...prev, value: prev.cached, disabled: true }))} />
                                ))}
                            </label>
                            <textarea id="valoresEmpresa" rows={4} maxLength={300} value={valoresInfo.value}
                                onChange={(e) => {
                                    setValoresInfo(prev => ({ ...prev, value: e.target.value }));
                                    setValoresLength(e.target.value.length);
                                }}
                                disabled={valoresInfo.disabled}
                                className="w-full h-40 p-4 bg-dark-50 dark:bg-professional-dark border border-professional-card rounded-xl text-dark-900 dark:text-professional-subtitle resize-y transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"
                                placeholder="Descreva os valores e princípios éticos que norteiam as ações e decisões da sua empresa."></textarea>
                            <div className="flex justify-between mt-2">
                                <span className="text-xs text-dark-900 dark:text-professional-subtitle">Máximo de 300 caracteres</span>
                                <span className="text-xs text-dark-900 dark:text-professional-subtitle">{`${valoresLength}/300`}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex justify-center space-x-4">
                    <button id="btnSalvar" disabled={salvandoEdicao}
                        className="flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-xl transition-all bg-gradient-to-r from-professional-accent to-professional-lightaccent text-white shadow-lg shadow-professional-accent/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-professional-accent/40"
                        onClick={async () => {
                            setSalvandoEdicao(true);
                            const editou = await salvarEdicaoEmpresa(
                                nomeFantInfo, descricaoInfo, instagramInfo, githubInfo,
                                twitterInfo, setorInfo, porteInfo, contatoInfo,
                                siteInfo, youtubeInfo, linkedinInfo, linkEnderecoInfo,
                                facebookInfo, fotoInfo, missaoInfo, visaoInfo, valoresInfo, bannerInfo
                            );
                            if (!editou) setSalvandoEdicao(false);
                            else {
                                mostrarSucessoTopo('Perfil editado com sucesso!');
                                setTimeout(() => { navigate('/perfil/empresa') }, 3000);
                            }
                        }}>
                        <FontAwesomeIcon icon={faSave} />{salvandoEdicao ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                    <button id="btnCancelar" onClick={() => navigate('/perfil/empresa')}
                        className="flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-xl transition-all bg-dark-700 text-professional-subtitle hover:bg-dark-700 hover:-translate-y-1">
                        <FontAwesomeIcon icon={faTimes} />Cancelar
                    </button>
                </div>

                <div id="mensagemStatus" className="hidden mt-6 p-4 rounded-lg text-center"></div>
            </div>
        </div>
    )
}