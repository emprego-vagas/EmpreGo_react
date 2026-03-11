import {faGithub, faInstagram, faXTwitter} from "@fortawesome/free-brands-svg-icons";
import {faBriefcase, faCodeBranch, faChevronLeft, faChevronRight, faEnvelope, faGlobe, faProjectDiagram, faChartLine, faUser, faGraduationCap, faCertificate, faLanguage, faFileAlt, faCalendarAlt, faDownload, faComment, faHeadset, faHome, faTag, faBuilding} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import { DadosUsuario, fileDownload } from "../utils/globalFunctions";
import HeaderProfiles from "../components/HeaderProfiles";
import { useEffect, useState, useMemo } from "react";
import axiosWe from "../utils/axiosInstance";
import type { Candidato, Tag, Experiencia, ProjetoCand, Idioma, PublicCustomCand } from "../utils/utilsInterfaces";
import Loader from "../components/Loader";
import genPfp from '../assets/imgs/genPfp.png';
import "../App.css";
import FundoRoxo from '../assets/imgs/FundoRoxo.png';

export default function PerfilCandidatoPF() {
  const navigate = useNavigate();
  const [usuario] = useState(DadosUsuario.getUsuario(true));
  if (!usuario) {
    setTimeout(() => {
      navigate('/');
    }, 3000);
  }

  const params = useParams<{ candidatoId?: string; id?: string }>();
  const candidatoId = params.candidatoId ?? params.id;
  const [candPerfil, setCandPerfil] = useState<Candidato | null>(null);
  const [customPerfil, setCustomPerfil] = useState<PublicCustomCand | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sobre');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMoreTags, setIsLoadingMoreTags] = useState(false);
  const [allTagsLoaded, setAllTagsLoaded] = useState(false);
  const tagsPerPage = 15;
  const [isLoadingMoreIdiomas, setIsLoadingMoreIdiomas] = useState(false);
  const [allIdiomasLoaded, setAllIdiomasLoaded] = useState(false);
  
  // EXPERIÊNCIAS
  const [pageExperiencias, setPageExperiencias] = useState(1);
  const [isLoadingExperiencias, setIsLoadingExperiencias] = useState(false);
  const [isLoadingMoreExperiencias, setIsLoadingMoreExperiencias] = useState(false);
  const [hasLoadedFirstPageExperiencias, setHasLoadedFirstPageExperiencias] = useState(false);

  // PROJETOS
  const [pageProjetos, setPageProjetos] = useState(1);
  const [isLoadingProjetos, setIsLoadingProjetos] = useState(false);
  const [isLoadingMoreProjetos, setIsLoadingMoreProjetos] = useState(false);
  const [hasLoadedFirstPageProjetos, setHasLoadedFirstPageProjetos] = useState(false);

  // FORMAÇÕES ACADÊMICAS
  const [pageFormacoes, setPageFormacoes] = useState(1);
  const [isLoadingFormacoes, setIsLoadingFormacoes] = useState(false);
  const [isLoadingMoreFormacoes, setIsLoadingMoreFormacoes] = useState(false);
  const [hasLoadedFirstPageFormacoes, setHasLoadedFirstPageFormacoes] = useState(false);

  // Função para carregar primeira página de experiências
  const carregarPrimeiraPaginaExperiencias = async () => {
    if (!candPerfil || hasLoadedFirstPageExperiencias || isLoadingExperiencias || !customPerfil?.experiencesTotal) return;
    
    try {
      setIsLoadingExperiencias(true);
      const response = await axiosWe(
        `/experience/candidate/${candPerfil.id}?page=1`
      ) as { data: Experiencia[] };
      
      setCustomPerfil(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          experiences: response.data,
        };
      });
      
      setPageExperiencias(1);
      setHasLoadedFirstPageExperiencias(true);
    } catch (err) {
      console.error('Erro ao carregar experiências', err);
    } finally {
      setIsLoadingExperiencias(false);
    }
  };

  // Função para carregar primeira página de projetos
  const carregarPrimeiraPaginaProjetos = async () => {
    if (!candPerfil || hasLoadedFirstPageProjetos || isLoadingProjetos || !customPerfil.candProjects) return;
    
    try {
      setIsLoadingProjetos(true);
      const response = await axiosWe(
        `/candproject/candidate/${candPerfil.id}?page=1`
      ) as { data: ProjetoCand[] };
      
      setCustomPerfil(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          candProjects: response.data,
        };
      });
      
      setPageProjetos(1);
      setHasLoadedFirstPageProjetos(true);
    } catch (err) {
      console.error('Erro ao carregar projetos', err);
    } finally {
      setIsLoadingProjetos(false);
    }
  };

  // Função para carregar primeira página de formações acadêmicas
  const carregarPrimeiraPaginaFormacoes = async () => {
    if (!candPerfil || hasLoadedFirstPageFormacoes || isLoadingFormacoes || !customPerfil.academicBackgroundsTotal) return;
    
    try {
      setIsLoadingFormacoes(true);
      const response = await axiosWe(
        `/academicbackground/candidate/${candPerfil.id}?page=1`
      ) as { data: typeof customPerfil.academicBackgrounds };
      
      setCustomPerfil(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          academicBackgrounds: response.data,
        };
      });
      
      setPageFormacoes(1);
      setHasLoadedFirstPageFormacoes(true);
    } catch (err) {
      console.error('Erro ao carregar formações acadêmicas', err);
    } finally {
      setIsLoadingFormacoes(false);
    }
  };

  const carregarMaisExperiencias = async () => {
    if (
      !customPerfil ||
      !candPerfil ||
      isLoadingMoreExperiencias ||
      customPerfil.experiences.length >= customPerfil.experiencesTotal
    ) return;

    try {
      setIsLoadingMoreExperiencias(true);

      const nextPage = pageExperiencias + 1

      const response = await axiosWe(
        `/experience/candidate/${candPerfil.id}?page=${nextPage}`
      ) as { data: Experiencia[] };

      setCustomPerfil(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          experiences: [...prev.experiences, ...response.data],
        };
      });
      
      setPageExperiencias(nextPage);
    } catch (err) {
      console.error('Erro ao carregar experiências', err);
    } finally {
      setIsLoadingMoreExperiencias(false);
    }
  };

  const carregarMaisProjetos = async () => {
    if (
      !customPerfil ||
      !candPerfil ||
      isLoadingMoreProjetos ||
      customPerfil.candProjects.length >= customPerfil.candProjectsTotal
    ) return;

    try {
      setIsLoadingMoreProjetos(true);

      const nextPage = pageProjetos + 1;

      const response = await axiosWe(
        `/candproject/candidate/${candPerfil.id}?page=${nextPage}`
      ) as { data: ProjetoCand[] };

      setCustomPerfil(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          candProjects: [...prev.candProjects, ...response.data],
        };
      });

      setPageProjetos(nextPage);
    } catch (err) {
      console.error('Erro ao carregar projetos', err);
    } finally {
      setIsLoadingMoreProjetos(false);
    }
  };

  const carregarMaisFormacoes = async () => {
    if (
      !customPerfil ||
      !candPerfil ||
      isLoadingMoreFormacoes ||
      customPerfil.academicBackgrounds.length >= customPerfil.academicBackgroundsTotal
    ) return;

    try {
      setIsLoadingMoreFormacoes(true);

      const nextPage = pageFormacoes + 1;

      const response = await axiosWe(
        `/academicbackground/candidate/${candPerfil.id}?page=${nextPage}`
      ) as { data: typeof customPerfil.academicBackgrounds };

      setCustomPerfil(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          academicBackgrounds: [...prev.academicBackgrounds, ...response.data],
        };
      });

      setPageFormacoes(nextPage);
    } catch (err) {
      console.error('Erro ao carregar formações acadêmicas', err);
    } finally {
      setIsLoadingMoreFormacoes(false);
    }
  };

  const carregarRestoDosIdiomas = async () => {
    if (
      !customPerfil ||
      !candPerfil ||
      allIdiomasLoaded ||
      isLoadingMoreIdiomas ||
      customPerfil.languages.length >= customPerfil.languagesTotal
    ) return;

    try {
      setIsLoadingMoreIdiomas(true);

      const response = await axiosWe(
        `/language/candidate/${candPerfil.id}?skip=${customPerfil.languages.length}&inen=end`
      ) as { data: Idioma[] };

      setCustomPerfil(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          languages: [...prev.languages, ...response.data],
        };
      });

      setAllIdiomasLoaded(true);
    } catch (err) {
      console.error('Erro ao carregar idiomas', err);
    } finally {
      setIsLoadingMoreIdiomas(false);
    }
  };

  const carregarRestoDasTags = async () => {
    if (
      !customPerfil ||
      allTagsLoaded ||
      isLoadingMoreTags ||
      customPerfil.candTags.length >= customPerfil.candTagsTotal
    ) return;

    try {
      setIsLoadingMoreTags(true);
      const response = await axiosWe(
        `/tag/cand/candidate/${candPerfil?.id}?skip=${customPerfil.candTags.length}&inen=end`
      ) as { data: Tag[] };

      setCustomPerfil(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          candTags: [...prev.candTags, ...response.data],
        };
      });

      setAllTagsLoaded(true);
    } catch (err) {
      console.error('Erro ao carregar tags', err);
    } finally {
      setIsLoadingMoreTags(false);
    }
  };

  useEffect(() => {
    async function loadCand() {
      if (!usuario) return;
      try {
        setLoading(true);
        if (candidatoId) {
          const response = await axiosWe(`/candidate/id/${candidatoId}/profile`) as {
            data: { 
              user: Candidato,
              custom: {
                experiencesTotal: number;
                candProjectsTotal: number;
                candTags: Tag[];
                candTagsTotal: number;
                languages: Idioma[];
                languagesTotal: number;
                academicBackgroundsTotal: number;
              }
          }
          };
          const data = response.data;
          const { user, custom } = data;
          setCandPerfil(user);
          setCustomPerfil({
            ...custom, 
            experiences: [], 
            candProjects: [],
            academicBackgrounds: []
          });
          
          // Resetar flags de carregamento
          setHasLoadedFirstPageExperiencias(false);
          setHasLoadedFirstPageProjetos(false);
          setHasLoadedFirstPageFormacoes(false);
          setPageExperiencias(1);
          setPageProjetos(1);
          setPageFormacoes(1);
          
          return;
        }
      } catch (erro) {
        console.error("Erro ao carregar perfil público do candidato:", erro);
        setCandPerfil(null);
      } finally {
        setLoading(false);
      }
    };
    loadCand();
  }, [candidatoId, usuario]);

  // Efeito para carregar experiências quando a aba for ativada
  useEffect(() => {
    if (activeTab === 'experiencias' && candPerfil && !hasLoadedFirstPageExperiencias && !isLoadingExperiencias) {
      carregarPrimeiraPaginaExperiencias();
    }
  }, [activeTab, candPerfil, hasLoadedFirstPageExperiencias, isLoadingExperiencias]);

  // Efeito para carregar projetos quando a aba for ativada
  useEffect(() => {
    if (activeTab === 'projetos' && candPerfil && !hasLoadedFirstPageProjetos && !isLoadingProjetos) {
      carregarPrimeiraPaginaProjetos();
    }
  }, [activeTab, candPerfil, hasLoadedFirstPageProjetos, isLoadingProjetos]);

  // Efeito para carregar formações acadêmicas quando a aba for ativada
  useEffect(() => {
    if (activeTab === 'formacoes' && candPerfil && !hasLoadedFirstPageFormacoes && !isLoadingFormacoes) {
      carregarPrimeiraPaginaFormacoes();
    }
  }, [activeTab, candPerfil, hasLoadedFirstPageFormacoes, isLoadingFormacoes]);

  useEffect(() => {
    setCurrentPage(1);
    setAllIdiomasLoaded(false);
    // Não resetar as páginas de experiências, projetos e formações aqui
    // Apenas resetar quando mudar de candidato
  }, [activeTab, candidatoId]);

  const currentTags = useMemo(() => {
    if (!customPerfil?.candTags || customPerfil.candTags.length === 0) {
      return [];
    }
    const startIndex = (currentPage - 1) * tagsPerPage;
    const endIndex = startIndex + tagsPerPage;
    return customPerfil.candTags.slice(startIndex, endIndex);
  }, [customPerfil?.candTags, currentPage, tagsPerPage]);

  const totalPages = useMemo(() => {
    if (!customPerfil) return 0;
    return Math.ceil(customPerfil.candTagsTotal / tagsPerPage);
  }, [customPerfil, tagsPerPage]);

  const handlePageChange = (pageNumber: number) => {
    const precisaCarregarMais =
      pageNumber > 1 &&
      customPerfil &&
      customPerfil.candTags.length < customPerfil.candTagsTotal;

    if (precisaCarregarMais) {
      carregarRestoDasTags();
    }

    setCurrentPage(pageNumber);
  };

  const goToPreviousPage = () => {
    handlePageChange(Math.max(currentPage - 1, 1));
  };

  const goToNextPage = () => {
    handlePageChange(Math.min(currentPage + 1, totalPages));
  };

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(currentPage - halfMaxPagesToShow, 1);
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = getPageNumbers();
    const showStartEllipsis = pageNumbers[0] > 2;
    const showEndEllipsis = pageNumbers[pageNumbers.length - 1] < totalPages - 1;

    return (
      <div className="flex items-center justify-center mt-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg mr-2 ${currentPage === 1
            ? 'bg-dark-300 dark:bg-professional-card text-dark-700 dark:text-professional-subtitle cursor-not-allowed'
            : 'bg-dark-300 dark:bg-professional-gray text-black dark:text-white hover:bg-professional-accent hover:text-white transition-colors'}`}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        {pageNumbers[0] > 1 && (
          <button
            onClick={() => handlePageChange(1)}
            className={`px-3 py-2 mx-1 rounded-lg ${currentPage === 1
              ? 'bg-professional-accent text-white'
              : 'bg-dark-100 dark:bg-professional-gray text-white hover:bg-professional-card'}`}
          >
            1
          </button>
        )}

        {showStartEllipsis && (
          <span className="px-3 py-2 text-dark-700 dark:text-professional-subtitle">...</span>
        )}

        <div className="flex overflow-x-auto max-w-[280px] scrollbar-hide">
          {pageNumbers.map(pageNumber => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-3 py-2 mx-1 min-w-[40px] rounded-lg ${currentPage === pageNumber
                ? 'bg-professional-accent text-white'
                : 'bg-dark-300 dark:bg-professional-gray text-black dark:text-white hover:bg-primary-400 dark:hover:bg-professional-card'}`}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        {showEndEllipsis && (
          <span className="px-3 py-2 text-dark-700 dark:text-professional-subtitle">...</span>
        )}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <button
            onClick={() => handlePageChange(totalPages)}
            className={`px-3 py-2 mx-1 rounded-lg ${currentPage === totalPages
              ? 'bg-professional-accent text-white'
              : 'bg-dark-300 dark:bg-professional-gray text-black dark:text-white hover:bg-primary-400 dark:hover:bg-professional-card'}`}
          >
            {totalPages}
          </button>
        )}

        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ml-2 ${currentPage === totalPages
            ? 'bg-dark-300 dark:bg-professional-card text-dark-700 dark:text-professional-subtitle cursor-not-allowed'
            : 'bg-dark-300 dark:bg-professional-gray text-black dark:text-white hover:bg-professional-accent hover:text-white transition-colors'}`}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    );
  };

  const renderField = (value: string | null | undefined, _fieldTitle: string) => {
    if (!value || value.trim() === '') {
      return <span className="text-dark-700 dark:text-professional-subtitle italic">Não informado</span>;
    }
    return <span className="text-dark-700 dark:text-white">{value}</span>;
  };

  if (loading) return <Loader />;
  if (!candPerfil) {
    return (
      <div className="bg-dark-50 dark:bg-dark-900 min-h-screen flex flex-col">
        <HeaderProfiles />
        <div className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="max-w-md w-full text-center">
            {/* Ícone/Ilustração */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto relative">
                <div className="absolute inset-0 bg-professional-accent/10 rounded-full animate-pulse"></div>
                <div className="absolute inset-4 bg-professional-accent/20 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon 
                    icon={faUser} 
                    className="text-5xl text-professional-accent/60" 
                  />
                </div>
              </div>
            </div>

            {/* Título */}
            <h1 className="text-3xl font-bold text-dark-700 dark:text-white mb-4">
              Candidato não encontrado
            </h1>

            {/* Mensagem */}
            <p className="text-lg text-dark-700 dark:text-professional-subtitle mb-8">
              O perfil que você está procurando não existe ou foi removido.
            </p>

            {/* Ações */}
            <div className="space-y-4">
              <button
                onClick={() => navigate(-1)}
                className="w-full px-6 py-3 bg-professional-accent text-white rounded-lg hover:bg-professional-lightaccent transition-colors font-medium"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
                Voltar para página anterior
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full px-6 py-3 border border-professional-accent text-professional-accent rounded-lg hover:bg-professional-accent/10 transition-colors font-medium"
              >
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                Ir para a tela inicial
              </button>
            </div>

            {/* Informações adicionais */}
            <div className="mt-10 pt-8 border-t border-professional-card">
              <p className="text-sm text-dark-700 dark:text-professional-subtitle">
                Se você acredita que isso é um erro, entre em contato com o suporte.
              </p>
              <button
                onClick={() => navigate('/suporte')}
                className="mt-3 inline-flex items-center text-professional-accent hover:text-professional-lightaccent transition-colors text-sm font-medium"
              >
                <FontAwesomeIcon icon={faHeadset} className="mr-1" />
                Suporte
              </button>
            </div>

            {/* Animação sutil */}
            <div className="mt-8">
              <div className="flex items-center justify-center space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-professional-accent/40 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-dark-50 dark:bg-dark-900">
      <HeaderProfiles />
      <div id="main" className="container mx-auto px-4 pt-6 pb-10">
        <div className="relative mb-6">
          <img src={candPerfil.banner==='fundoroxo' ? FundoRoxo : candPerfil.banner} alt="Fundo Roxo" className="w-full h-48 rounded-xl"/>
          <div className="absolute -bottom-12 left-6">
            <div className="flex items-end">
              <img
                id="fotoUsuario"
                src={candPerfil.image === 'genPfp.png' ? genPfp : candPerfil.image}
                alt="Foto do candidato"
                className="w-32 h-32 rounded-full border-4 border-professional-card bg-professional-card object-cover"
              />
            </div>
          </div>
        </div>

        <div className="ml-40 pt-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center gap-4">
                <h1
                  id="nomUsuario"
                  className="text-3xl font-bold text-dark-700 dark:text-dark-50"
                >
                  {candPerfil.name}
                </h1>

                {/* BOTÃO CHAT */}
                {usuario.tipo!=='candidato' && (
                  <button
                    onClick={() => navigate(`/chats?id=${candPerfil.id}`)}
                    className="flex items-center gap-2 px-2 py-2 rounded-full
                              bg-professional-accent text-white
                              hover:bg-professional-lightaccent
                              transition-colors"
                    title="Iniciar conversa"
                  >
                    <FontAwesomeIcon icon={faComment} className="h-[15px] w-[15px]"/>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center mt-2 space-x-4">
                {candPerfil.current_position && (
                  <span className="text-lg font-medium text-professional-accent">
                    {candPerfil.current_position}
                  </span>
                )}
                {candPerfil.current_company && (
                  <span className="text-dark-700 dark:text-professional-subtitle">
                    na {candPerfil.current_company}
                  </span>
                )}
              </div>
              <div className="flex items-center mt-2 space-x-4">
                {candPerfil.personal_site && (
                  <a
                    href={candPerfil.personal_site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-700 dark:text-professional-subtitle hover:text-professional-accent transition-colors"
                  >
                    <FontAwesomeIcon icon={faGlobe} className="mr-1" /> Site Pessoal
                  </a>
                )}
                {candPerfil.instagram && (
                  <a
                    href={candPerfil.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-700 dark:text-professional-subtitle hover:text-professional-accent transition-colors"
                  >
                    <FontAwesomeIcon icon={faInstagram} className="mr-1" /> Instagram
                  </a>
                )}
                {candPerfil.github && (
                  <a
                    href={candPerfil.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-700 dark:text-professional-subtitle hover:text-professional-accent transition-colors"
                  >
                    <FontAwesomeIcon icon={faGithub} className="mr-1" /> GitHub
                  </a>
                )}
                {candPerfil.twitter && (
                  <a
                    href={candPerfil.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-700 dark:text-professional-subtitle hover:text-professional-accent transition-colors"
                  >
                    <FontAwesomeIcon icon={faXTwitter} className="mr-1" /> Twitter 
                  </a>
                )}
                {candPerfil.portfolio && (
                  <a
                    href={candPerfil.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-700 dark:text-professional-subtitle hover:text-professional-accent transition-colors"
                  >
                    <FontAwesomeIcon icon={faGlobe} className="mr-1" /> Portfólio
                  </a>
                )}
              </div>
            </div>

            <div className="flex space-x-6 mt-4 md:mt-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-professional-accent">{customPerfil?.experiencesTotal || 0}</div>
                <div className="text-sm text-dark-700 dark:text-professional-subtitle">Experiências</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-professional-accent">{customPerfil?.candProjectsTotal || 0}</div>
                <div className="text-sm text-dark-700 dark:text-professional-subtitle">Projetos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-professional-accent">{customPerfil?.academicBackgroundsTotal || 0}</div>
                <div className="text-sm text-dark-700 dark:text-professional-subtitle">Formações</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-professional-accent">{customPerfil?.languagesTotal || 0}</div>
                <div className="text-sm text-dark-700 dark:text-professional-subtitle">Idiomas</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-professional-card mb-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'sobre' ? 'text-professional-accent border-b-2 border-professional-accent' : 'text-dark-700 dark:text-professional-subtitle hover:text-primary-800 dark:hover:text-white'}`}
              onClick={() => setActiveTab('sobre')}
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" /> Sobre
            </button>
            <button
              className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'experiencias' ? 'text-professional-accent border-b-2 border-professional-accent' : 'text-dark-700 dark:text-professional-subtitle hover:text-primary-800 dark:hover:text-white'}`}
              onClick={() => setActiveTab('experiencias')}
            >
              <FontAwesomeIcon icon={faBriefcase} className="mr-2" /> Experiências
            </button>
            <button
              className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'projetos' ? 'text-professional-accent border-b-2 border-professional-accent' : 'text-dark-700 dark:text-professional-subtitle hover:text-primary-800 dark:hover:text-white'}`}
              onClick={() => setActiveTab('projetos')}
            >
              <FontAwesomeIcon icon={faProjectDiagram} className="mr-2" /> Projetos
            </button>
            <button
              className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'formacoes' ? 'text-professional-accent border-b-2 border-professional-accent' : 'text-dark-700 dark:text-professional-subtitle hover:text-primary-800 dark:hover:text-white'}`}
              onClick={() => setActiveTab('formacoes')}
            >
              <FontAwesomeIcon icon={faGraduationCap} className="mr-2" /> Formações
            </button>
            <button
              className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'certificacoes' ? 'text-professional-accent border-b-2 border-professional-accent' : 'text-dark-700 dark:text-professional-subtitle hover:text-primary-800 dark:hover:text-white'}`}
              onClick={() => setActiveTab('certificacoes')}
            >
              <FontAwesomeIcon icon={faCertificate} className="mr-2" /> Certificações
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div>
            {activeTab === 'sobre' && (
              <div className="space-y-6">
                <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500 transition-all duration-500 ease-out">
                  <h2 className="text-xl font-bold mb-4 text-professional-accent">Sobre Mim</h2>
                  <p className="text-dark-700 dark:text-professional-subtitle whitespace-pre-line">
                    {candPerfil.description || "Não há informação neste campo: Descrição"}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500 transition-all duration-500 ease-out">
                    <h2 className="text-xl font-bold mb-4 text-professional-accent">
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      Informações Pessoais
                    </h2>
                    <div className="space-y-4">
                      {candPerfil.pronouns && (
                        <div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium">Pronomes</div>
                          <div className="text-dark-700 dark:text-white">{candPerfil.pronouns}</div>
                        </div>
                      )}
                      {candPerfil.current_position && (
                        <div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium">Cargo Atual</div>
                          <div className="text-dark-700 dark:text-white">{candPerfil.current_position}</div>
                        </div>
                      )}
                      {candPerfil.current_company && (
                        <div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium">Empresa Atual</div>
                          <div className="text-dark-700 dark:text-white">{candPerfil.current_company}</div>
                        </div>
                      )}
                      {(candPerfil.state) && (
                        <div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium">Localização</div>
                          <div className="text-dark-700 dark:text-white">
                            {candPerfil.state}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500 transition-all duration-500 ease-out">
                    <h2 className="text-xl font-bold mb-4 text-professional-accent">
                      <FontAwesomeIcon icon={faCodeBranch} className="mr-2" />
                      Habilidades & Competências
                    </h2>
                    {customPerfil?.candTags && customPerfil.candTags.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-3">
                          {currentTags.map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center gap-1.5 py-2 px-4 bg-dark-100 dark:bg-professional-gray text-dark-700 dark:text-professional-text text-sm font-medium rounded-lg border border-professional-card"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>

                        {isLoadingMoreTags && (
                          <div className="text-sm italic text-dark-700 dark:text-professional-subtitle mt-3">
                            Carregando mais habilidades...
                          </div>
                        )}

                        {totalPages > 1 && (
                          <div className="pt-4 border-t border-professional-card">
                            <div className="flex flex-col items-center justify-between space-y-3 sm:flex-row sm:space-y-0">
                              <div className="text-sm text-dark-700 dark:text-professional-subtitle">
                                Mostrando {((currentPage - 1) * tagsPerPage) + 1} - {Math.min(currentPage * tagsPerPage, customPerfil.candTags.length)} de {customPerfil.candTagsTotal} habilidades
                              </div>
                              {renderPagination()}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-dark-700 dark:text-professional-subtitle italic">Habilidades não fornecidas</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500 transition-all duration-500 ease-out">
                    <h2 className="text-xl font-bold mb-4 text-professional-accent">
                      <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                      Métricas Profissionais
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-dark-100 dark:bg-professional-gray rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-professional-accent">{customPerfil?.experiencesTotal || 0}</div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle">Experiências</div>
                      </div>
                      <div className="bg-dark-100 dark:bg-professional-gray rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-professional-accent">{customPerfil?.candProjectsTotal || 0}</div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle">Projetos</div>
                      </div>
                      <div className="bg-dark-100 dark:bg-professional-gray rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-professional-accent">{customPerfil?.academicBackgroundsTotal || 0}</div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle">Formações</div>
                      </div>
                      <div className="bg-dark-100 dark:bg-professional-gray rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-professional-accent">{customPerfil?.languagesTotal || 0}</div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle">Idiomas</div>
                      </div>
                    </div>
                  </div>

                  <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500 transition-all duration-500 ease-out">
                    <h2 className="text-xl font-bold mb-4 text-professional-accent">
                      <FontAwesomeIcon icon={faLanguage} className="mr-2" />
                      Idiomas
                    </h2>
                    <div className="space-y-4">
                      {customPerfil?.languages && customPerfil.languages.length > 0 ? (
                        customPerfil.languages.map((idioma) => (
                          <div key={idioma.id} className="bg-dark-100 dark:bg-professional-gray rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium text-dark-700 dark:text-white">{idioma.name}</h3>
                              <span className="text-sm text-dark-700 dark:text-professional-subtitle">
                                {idioma.level}
                              </span>
                            </div>

                            <div className="w-full bg-dark-300 dark:bg-professional-card rounded-full h-2">
                              <div
                                className="bg-professional-accent h-2 rounded-full"
                                style={{
                                  width:
                                    `${idioma.percentage}%`
                                }}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-dark-700 dark:text-professional-subtitle italic">
                          Idiomas não fornecidos
                        </p>
                      )}
                      {customPerfil &&
                        customPerfil.languages.length < customPerfil.languagesTotal && (
                          <div className="flex justify-center pt-4">
                            <button
                              onClick={carregarRestoDosIdiomas}
                              disabled={isLoadingMoreIdiomas}
                              className={`px-6 py-2 rounded-lg font-medium transition-colors
                                ${isLoadingMoreIdiomas
                                  ? 'bg-dark-300 dark:bg-professional-card cursor-not-allowed'
                                  : 'bg-professional-accent text-white hover:bg-professional-lightaccent'}
                              `}
                            >
                              {isLoadingMoreIdiomas
                                ? 'Carregando idiomas...'
                                : `Ver mais idiomas (${customPerfil.languagesTotal - customPerfil.languages.length})`}
                            </button>
                          </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500 transition-all duration-500 ease-out">
                  <h2 className="text-xl font-bold mb-4 text-professional-accent">Informações de Contato</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-3">
                      <FontAwesomeIcon icon={faEnvelope} className="text-professional-accent mr-3" />
                    </div>

                    <div className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-3">
                      <FontAwesomeIcon icon={faFileAlt} className="text-professional-accent mr-3" />
                      <div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium">Portfólio</div>
                        {candPerfil.portfolio ? (
                          <div className="text-dark-700 dark:text-white">
                            <a href={candPerfil.portfolio}>
                              {renderField(candPerfil.portfolio, "Portfólio")}
                            </a>
                          </div>
                        ):(
                          <span className="text-dark-700 dark:text-professional-subtitle italic">Não informado</span>
                        )}
                        
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card de Currículo */}
                {(candPerfil.resume || candPerfil.resume_file) && (
                  <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500 transition-all duration-500 ease-out">
                    <h2 className="text-xl font-bold mb-4 text-professional-accent">
                      <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                      Currículo
                    </h2>
                    <div className="flex flex-col md:flex-row md:items-center justify-between bg-dark-100 dark:bg-professional-gray rounded-lg p-4">
                      <div className="flex items-center mb-4 md:mb-0">
                        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-professional-accent/20 mr-4">
                          <FontAwesomeIcon icon={faFileAlt} className="text-professional-accent text-xl" />
                        </div>
                        <div>
                          <h3 className="font-medium text-dark-700 dark:text-white">Currículo Profissional</h3>
                          <p className="text-sm text-dark-700 dark:text-professional-subtitle">
                            {candPerfil.resume_file ? `${(parseFloat(candPerfil.resume_file.split('|')[1])/1024).toFixed(2)} MB` : 'Documento'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        {candPerfil.resume && (
                          <a
                            href={candPerfil.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg border border-professional-accent text-professional-accent hover:bg-professional-accent hover:text-white transition-colors"
                          >
                            <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                            Visualizar
                          </a>
                        )}
                        
                        
                        {candPerfil.resume_file && (() => {
                          const curriculo_fileSplited = candPerfil.resume_file.split('|');
                          return (
                            <button
                              onClick={() => fileDownload(curriculo_fileSplited[0], 'raw')}
                              className="px-4 py-2 rounded-lg bg-professional-accent hover:bg-professional-lightaccent transition-colors text-white flex items-center"
                            >
                              <FontAwesomeIcon icon={faDownload} className="mr-2" />
                              Download
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500 transition-all duration-500 ease-out">
                  <h2 className="text-xl font-bold mb-4 text-professional-accent">Redes Sociais & Portfólio</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {candPerfil.github ? (
                      <a
                        href={candPerfil.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-4 hover:bg-professional-accent/20 transition-colors"
                      >
                        <FontAwesomeIcon icon={faGithub} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-dark-700 dark:text-white font-medium">GitHub</div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle">
                            {candPerfil.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-4">
                        <FontAwesomeIcon icon={faGithub} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-dark-700 dark:text-white font-medium">GitHub</div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle italic">
                            GitHub não informado
                          </div>
                        </div>
                      </div>
                    )}

                    {candPerfil.portfolio ? (
                      <a
                        href={candPerfil.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-4 hover:bg-professional-accent/20 transition-colors"
                      >
                        <FontAwesomeIcon icon={faGlobe} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-dark-700 dark:text-white font-medium">Portfólio</div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle">
                            {candPerfil.portfolio.replace(/^https?:\/\//, '')}
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-4">
                        <FontAwesomeIcon icon={faGlobe} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-dark-700 dark:text-white font-medium">Portfólio</div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle italic">
                            Portfólio não informado
                          </div>
                        </div>
                      </div>
                    )}

                    {candPerfil.instagram ? (
                      <a
                        href={candPerfil.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-4 hover:bg-professional-accent/20 transition-colors"
                      >
                        <FontAwesomeIcon icon={faInstagram} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-dark-700 dark:text-white font-medium">Instagram</div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle">
                            {candPerfil.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '@')}
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-4">
                        <FontAwesomeIcon icon={faInstagram} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-dark-700 dark:text-white font-medium">Instagram</div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle italic">
                            Instagram não informado
                          </div>
                        </div>
                      </div>
                    )}

                    {candPerfil.twitter ? (
                      <a
                        href={candPerfil.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-4 hover:bg-professional-accent/20 transition-colors"
                      >
                        <FontAwesomeIcon icon={faXTwitter} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-dark-700 dark:text-white font-medium">Twitter/X</div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle">
                            {candPerfil.twitter.replace(/^https?:\/\/(www\.)?twitter\.com\//, '@')}
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-4">
                        <FontAwesomeIcon icon={faXTwitter} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-dark-700 dark:text-white font-medium">Twitter/X</div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle italic">
                            Twitter/X não informado
                          </div>
                        </div>
                      </div>
                    )}

                    {candPerfil.personal_site ? (
                      <a
                        href={candPerfil.personal_site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-4 hover:bg-professional-accent/20 transition-colors"
                      >
                        <FontAwesomeIcon icon={faGlobe} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-dark-700 dark:text-white font-medium">Site Pessoal</div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle">
                            {candPerfil.personal_site.replace(/^https?:\/\//, '')}
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-4">
                        <FontAwesomeIcon icon={faGlobe} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-dark-700 dark:text-white font-medium">Site Pessoal</div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle italic">
                            Site Pessoal não informado
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'experiencias' && (
              <div className="space-y-6">
                <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500 transition-all duration-500 ease-out">
                  <h2 className="text-xl font-bold mb-6 text-professional-accent">Experiências Profissionais</h2>
                  
                  {/* Loader da primeira página */}
                  {isLoadingExperiencias && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-12 h-12 border-4 border-professional-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-dark-700 dark:text-professional-subtitle">Carregando experiências...</p>
                    </div>
                  )}
                  
                  {/* Conteúdo após carregar */}
                  {!isLoadingExperiencias && customPerfil?.experiences && customPerfil.experiences.length > 0 ? (
                    <div className="space-y-6">
                      {customPerfil.experiences.map((exp) => (
                        <div key={exp.id} className="bg-dark-100 dark:bg-professional-gray rounded-lg p-6 border border-professional-card">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-dark-700 dark:text-white">{exp.title}</h3>
                              <p className="text-professional-accent font-medium">{exp.name}</p>
                            </div>
                            {exp.period && (
                              <div className="flex items-center text-dark-700 dark:text-professional-subtitle">
                                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                <span>{exp.period}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-dark-700 dark:text-professional-subtitle mb-4 whitespace-pre-line">
                            {exp.description}
                          </p>
                          {exp.experiences_tags && exp.experiences_tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {exp.experiences_tags.map(tag => (
                                <span
                                  key={tag.id}
                                  className="inline-flex items-center gap-1.5 py-1 px-3 bg-dark-200 dark:bg-professional-card text-dark-700 dark:text-professional-text text-sm font-medium rounded-lg border border-professional-card"
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : !isLoadingExperiencias && (
                    <div className="text-center py-10 text-dark-700 dark:text-professional-subtitle">
                      <FontAwesomeIcon icon={faBriefcase} className="text-4xl mb-3 opacity-50" />
                      <p>Nenhuma experiência profissional cadastrada.</p>
                    </div>
                  )}
                  
                  {/* Botão Ver Mais (só aparece se não estiver carregando a primeira página) */}
                  {!isLoadingExperiencias && customPerfil &&
                    customPerfil.experiences.length < customPerfil.experiencesTotal && (
                      <div className="flex justify-center pt-6">
                        <button
                          onClick={carregarMaisExperiencias}
                          disabled={isLoadingMoreExperiencias}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors
                            ${isLoadingMoreExperiencias
                              ? 'bg-dark-300 dark:bg-professional-card cursor-not-allowed'
                              : 'bg-professional-accent text-white hover:bg-professional-lightaccent'}
                          `}
                        >
                          {isLoadingMoreExperiencias
                            ? 'Carregando experiências...'
                            : 'Ver mais experiências'}
                        </button>
                      </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'projetos' && (
              <div className="space-y-6">
                <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500 transition-all duration-500 ease-out">
                  <h2 className="text-xl font-bold mb-6 text-professional-accent">Projetos</h2>
                  
                  {/* Loader da primeira página */}
                  {isLoadingProjetos && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-12 h-12 border-4 border-professional-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-dark-700 dark:text-professional-subtitle">Carregando projetos...</p>
                    </div>
                  )}
                  
                  {/* Conteúdo após carregar */}
                  {!isLoadingProjetos && customPerfil?.candProjects && customPerfil.candProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {customPerfil.candProjects.map((proj) => (
                        <div key={proj.id} className="bg-dark-100 dark:bg-professional-gray rounded-lg p-6 border border-professional-card">
                          {/* Imagem do projeto */}
                          <div className="relative mb-4">
                            {proj.image ? (
                              <img 
                                src={proj.image} 
                                alt={`Imagem do projeto ${proj.title}`}
                                className="w-full h-48 object-contain rounded-lg bg-professional-gray/10"
                              />
                            ) : (
                              <div className="w-full h-48 flex items-center justify-center bg-professional-gray/10 rounded-lg">
                                <FontAwesomeIcon icon={faProjectDiagram} className="text-5xl text-professional-subtitle/30" />
                              </div>
                            )}
                            
                            {/* Link do projeto como ícone flutuante */}
                            {proj.link && (
                              <a 
                                href={proj.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute bottom-2 right-2 bg-professional-accent text-white p-2 rounded-full shadow-md hover:bg-professional-accent/80 transition-colors"
                                title="Visitar projeto"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 0 1 0 5.656l-3.535 3.535a4 4 0 0 1-5.656-5.656l1.414-1.414m4.95-4.95a4 4 0 0 1 5.657 5.657l-3.535 3.535a4 4 0 0 1-5.657-5.657l1.414-1.414" />
                                </svg>
                              </a>
                            )}
                          </div>
                          
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-dark-700 dark:text-white">{proj.title}</h3>
                              <p className="text-professional-accent font-medium">{proj.name}</p>
                            </div>
                            {proj.status && (
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                proj.status === 'Concluído' ? 'bg-green-500/20 text-green-400' :
                                proj.status === 'Em andamento' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {proj.status}
                              </span>
                            )}
                          </div>
                          
                          {proj.period && (
                            <div className="flex items-center text-dark-700 dark:text-professional-subtitle mb-3">
                              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                              <span>{proj.period}</span>
                            </div>
                          )}
                          
                          <p className="text-dark-700 dark:text-professional-subtitle mb-4 line-clamp-3">
                            {proj.description}
                          </p>
                          
                          {/* Link como texto (opcional - pode remover se preferir só o ícone) */}
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-professional-accent hover:text-professional-lightaccent transition-colors mb-4 text-sm"
                            >
                              <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                              {proj.link.replace(/^https?:\/\/(www\.)?/, '').substring(0, 30)}...
                            </a>
                          )}
                          
                          {proj.cand_projects_tags && proj.cand_projects_tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {proj.cand_projects_tags.map(tag => (
                                <span
                                  key={tag.id}
                                  className="inline-flex items-center gap-1.5 py-1 px-3 bg-dark-200 dark:bg-professional-card text-dark-700 dark:text-professional-text text-sm font-medium rounded-lg border border-professional-card"
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : !isLoadingProjetos && (
                    <div className="text-center py-10 text-dark-700 dark:text-professional-subtitle">
                      <FontAwesomeIcon icon={faProjectDiagram} className="text-4xl mb-3 opacity-50" />
                      <p>Nenhum projeto cadastrado.</p>
                    </div>
                  )}
                  
                  {/* Botão Ver Mais (só aparece se não estiver carregando a primeira página) */}
                  {!isLoadingProjetos && customPerfil &&
                    customPerfil.candProjects.length < customPerfil.candProjectsTotal && (
                      <div className="flex justify-center pt-6">
                        <button
                          onClick={carregarMaisProjetos}
                          disabled={isLoadingMoreProjetos}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors
                            ${isLoadingMoreProjetos
                              ? 'bg-dark-300 dark:bg-professional-card cursor-not-allowed'
                              : 'bg-professional-accent text-white hover:bg-professional-lightaccent'}
                          `}
                        >
                          {isLoadingMoreProjetos
                            ? 'Carregando projetos...'
                            : 'Ver mais projetos'}
                        </button>
                      </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'formacoes' && (
              <div className="space-y-6">
                <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500 transition-all duration-500 ease-out">
                  <h2 className="text-xl font-bold mb-6 text-professional-accent">Formações Acadêmicas</h2>
                  
                  {/* Loader da primeira página */}
                  {isLoadingFormacoes && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-12 h-12 border-4 border-professional-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-dark-700 dark:text-professional-subtitle">Carregando formações acadêmicas...</p>
                    </div>
                  )}
                  
                  {/* Conteúdo após carregar */}
                  {!isLoadingFormacoes && customPerfil?.academicBackgrounds && customPerfil.academicBackgrounds.length > 0 ? (
                    <div className="space-y-6">
                      {customPerfil.academicBackgrounds.map((form) => (
                        <div key={form.id} className="bg-dark-100 dark:bg-professional-gray rounded-xl p-6 border border-professional-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                          
                          {/* Header com imagem e informações principais */}
                          <div className="flex flex-col md:flex-row gap-4 mb-4">
                            {/* Imagem da formação */}
                            <div className="relative w-full md:w-32 h-32 flex-shrink-0">
                              {form.image ? (
                                <img 
                                  src={form.image} 
                                  alt={form.name}
                                  className="w-full h-full object-cover rounded-lg bg-professional-gray/10"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-professional-gray to-professional-card rounded-lg">
                                  <FontAwesomeIcon icon={faGraduationCap} className="text-4xl text-professional-subtitle/50" />
                                </div>
                              )}
                              
                              {/* Badge de status sobreposto na imagem */}
                              {form.status && (
                                <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium shadow-lg ${
                                  form.status === 'Concluído' ? 'bg-green-500 text-white' :
                                  form.status === 'Em andamento' ? 'bg-blue-500 text-white' :
                                  'bg-yellow-500 text-white'
                                }`}>
                                  {form.status}
                                </span>
                              )}
                            </div>

                            {/* Título e instituição */}
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-dark-700 dark:text-white mb-1">{form.name}</h3>
                              <p className="text-professional-accent font-medium flex items-center gap-2">
                                <FontAwesomeIcon icon={faBuilding} className="text-sm" />
                                {form.instituition}
                              </p>
                              
                              {/* Link da instituição */}
                              {form.instituition_link && (
                                <a
                                  href={form.instituition_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-sm text-professional-accent hover:text-professional-lightaccent transition-colors mt-2"
                                >
                                  <FontAwesomeIcon icon={faGlobe} className="mr-1" />
                                  {form.instituition_link.replace(/^https?:\/\/(www\.)?/, '').substring(0, 30)}
                                  {form.instituition_link.length > 30 && '...'}
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Grid de informações detalhadas */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                            {form.category && (
                              <div className="bg-dark-200 dark:bg-professional-card rounded-lg p-2">
                                <div className="text-xs text-dark-700 dark:text-professional-subtitle font-medium mb-1">Categoria</div>
                                <div className="text-sm text-dark-700 dark:text-white font-medium truncate" title={form.category}>
                                  {form.category}
                                </div>
                              </div>
                            )}
                            
                            {form.period && (
                              <div className="bg-dark-200 dark:bg-professional-card rounded-lg p-2">
                                <div className="text-xs text-dark-700 dark:text-professional-subtitle font-medium mb-1 flex items-center gap-1">
                                  <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
                                  Período
                                </div>
                                <div className="text-sm text-dark-700 dark:text-white font-medium">{form.period}</div>
                              </div>
                            )}
                            
                            {form.workload && (
                              <div className="bg-dark-200 dark:bg-professional-card rounded-lg p-2">
                                <div className="text-xs text-dark-700 dark:text-professional-subtitle font-medium mb-1">Carga Horária</div>
                                <div className="text-sm text-dark-700 dark:text-white font-medium">{form.workload}h</div>
                              </div>
                            )}
                            
                            {form.cra && (
                              <div className="bg-dark-200 dark:bg-professional-card rounded-lg p-2">
                                <div className="text-xs text-dark-700 dark:text-professional-subtitle font-medium mb-1">CRA</div>
                                <div className="text-sm text-dark-700 dark:text-white font-medium">{form.cra}</div>
                              </div>
                            )}
                          </div>

                          {/* Descrição */}
                          {form.description && (
                            <div className="mb-4">
                              <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium mb-2">Descrição</div>
                              <p className="text-dark-700 dark:text-professional-subtitle text-sm leading-relaxed">
                                {form.description}
                              </p>
                            </div>
                          )}

                          {/* Tags */}
                          {form.academic_backgrounds_tags && form.academic_backgrounds_tags.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-professional-card">
                              <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium mb-3">Tags relacionadas</div>
                              <div className="flex flex-wrap gap-2">
                                {form.academic_backgrounds_tags.map(tag => (
                                  <span
                                    key={tag.id}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-professional-accent/10 text-professional-accent text-xs font-medium rounded-full border border-professional-accent/20 hover:bg-professional-accent/20 transition-colors"
                                  >
                                    <FontAwesomeIcon icon={faTag} className="text-[10px]" />
                                    {tag.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : !isLoadingFormacoes && (
                    <div className="text-center py-10 text-dark-700 dark:text-professional-subtitle">
                      <FontAwesomeIcon icon={faGraduationCap} className="text-4xl mb-3 opacity-50" />
                      <p>Nenhuma formação acadêmica cadastrada.</p>
                    </div>
                  )}
                  
                  {/* Botão Ver Mais (só aparece se não estiver carregando a primeira página) */}
                  {!isLoadingFormacoes && customPerfil &&
                    customPerfil.academicBackgrounds.length < customPerfil.academicBackgroundsTotal && (
                      <div className="flex justify-center pt-6">
                        <button
                          onClick={carregarMaisFormacoes}
                          disabled={isLoadingMoreFormacoes}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors
                            ${isLoadingMoreFormacoes
                              ? 'bg-dark-300 dark:bg-professional-card cursor-not-allowed'
                              : 'bg-professional-accent text-white hover:bg-professional-lightaccent'}
                          `}
                        >
                          {isLoadingMoreFormacoes
                            ? 'Carregando formações...'
                            : 'Ver mais formações'}
                        </button>
                      </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'certificacoes' && (
              <div className="space-y-6">
                <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500 transition-all duration-500 ease-out">
                  <h2 className="text-xl font-bold mb-6 text-professional-accent">Certificações</h2>
                  <div className="text-center py-10 text-dark-700 dark:text-professional-subtitle">
                    <FontAwesomeIcon icon={faCertificate} className="text-4xl mb-3 opacity-50" />
                    <p>Nenhuma certificação cadastrada.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}