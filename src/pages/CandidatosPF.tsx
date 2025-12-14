import {faGithub, faInstagram, faXTwitter} from "@fortawesome/free-brands-svg-icons";
import {faBriefcase, faCodeBranch, faChevronLeft, faChevronRight, faEnvelope, faGlobe, faProjectDiagram, faChartLine, faUser, faGraduationCap, faCertificate, faLanguage, faFileAlt, faCalendarAlt, faPhone, faDownload} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import { DadosUsuario, fileDownload } from "../utils/globalFunctions";
import HeaderProfiles from "../components/HeaderProfiles";
import { useEffect, useState, useMemo } from "react";
import axiosWe from "../utils/axiosInstance";
import type { Candidato, CustomCand, Tag, Experiencia, ProjetoCand, Idioma } from "../utils/utilsInterfaces";
import Loader from "../components/Loader";
import genPfp from '../assets/imgs/genPfp.png';
import "../App.css";

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
  const [customPerfil, setCustomPerfil] = useState<CustomCand | null>(null);
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
  const [isLoadingMoreExperiencias, setIsLoadingMoreExperiencias] = useState(false);

  // PROJETOS
  const [pageProjetos, setPageProjetos] = useState(1);
  const [isLoadingMoreProjetos, setIsLoadingMoreProjetos] = useState(false);

  const carregarMaisExperiencias = async () => {
    if (
      !customPerfil ||
      !candPerfil ||
      isLoadingMoreExperiencias ||
      customPerfil.experiencias.length >= customPerfil.experiencias_count
    ) return;

    try {
      setIsLoadingMoreExperiencias(true);

      const nextPage = pageExperiencias + 1;

      const response = await axiosWe(
        `/experiencias/candidato/${candPerfil.id}?page=${nextPage}`
      ) as { data: Experiencia[] };

      setCustomPerfil(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          experiencias: [...prev.experiencias, ...response.data],
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
      customPerfil.projetos_cand.length >= customPerfil.projetos_count
    ) return;

    try {
      setIsLoadingMoreProjetos(true);

      const nextPage = pageProjetos + 1;

      const response = await axiosWe(
        `/projeto/${candPerfil.id}?page=${nextPage}`
      ) as { data: ProjetoCand[] };

      setCustomPerfil(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          projetos_cand: [...prev.projetos_cand, ...response.data],
        };
      });

      setPageProjetos(nextPage);
    } catch (err) {
      console.error('Erro ao carregar projetos', err);
    } finally {
      setIsLoadingMoreProjetos(false);
    }
  };

  const carregarRestoDosIdiomas = async () => {
    if (
      !customPerfil ||
      !candPerfil ||
      allIdiomasLoaded ||
      isLoadingMoreIdiomas ||
      customPerfil.idiomas.length >= customPerfil.idiomas_count
    ) return;

    try {
      setIsLoadingMoreIdiomas(true);

      const response = await axiosWe(
        `/idioma?offset=${customPerfil.idiomas.length}&candidato_id=${candPerfil.id}`
      ) as { data: Idioma[] };

      setCustomPerfil(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          idiomas: [...prev.idiomas, ...response.data],
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
      customPerfil.tags.length >= customPerfil.tags_count
    ) return;

    try {
      setIsLoadingMoreTags(true);
      const response = await axiosWe(
        `/tags?offset=${customPerfil.tags.length}&candidato_id=${candPerfil?.id}`
      ) as { data: Tag[] };

      setCustomPerfil(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          tags: [...prev.tags, ...response.data],
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
          const response = await axiosWe(`/perfil/candidato/${candidatoId}`) as {
            data: { usua: Candidato, custom: CustomCand }
          };
          const data = response.data;
          const { usua, custom } = data;
          setCandPerfil(usua);
          setCustomPerfil(custom);
          console.log(data)
          return;
        }

        if (usuario.tipo === 'candidato') {
          const response = await axiosWe(`/custom/perfil-candidato`) as { data: { usua: Candidato, custom: CustomCand } };
          const data = response.data;
          const { usua, custom } = data;
          setCandPerfil(usua);
          setCustomPerfil(custom);
          return;
        }

        const fallbackCandidato: Candidato = {
          id: '',
          foto: genPfp,
          descricao: '',
          instagram: '',
          github: '',
          twitter: '',
          data_criacao: new Date(0),
          nome: 'Nome do Candidato',
          cargo_atual: '',
          empresa_atual: '',
          site_pessoal: '',
          genero: 'Masculino',
          // youtube: '',
          // linkedin: '',
          // facebook: '',
          cidade: '',
          estado: '',
          email: '',
          cpf: '',
          data_nasc: '',
          pronomes: '',
          portifolio: '',
          curriculo: '',
          curriculo_file: '',
          // curriculo_filename: ''
        };
        setCandPerfil(fallbackCandidato);
        setCustomPerfil({
          tags: [],
          tags_count: 0,
          experiencias: [],
          experiencias_count: 0,
          projetos_cand: [],
          projetos_count: 0,
          idiomas: [],
          idiomas_count: 0,
          // formacoes: [],
          // formacoes_count: 0,
          // certificacoes: [],
          // certificacoes_count: 0
        });
      } catch (erro) {
        console.error("Erro ao carregar perfil público do candidato:", erro);
        setCandPerfil(null);
      } finally {
        setLoading(false);
      }
    };
    loadCand();
  }, [candidatoId, usuario]);

  useEffect(() => {
    setCurrentPage(1);
    setAllIdiomasLoaded(false);
    setPageExperiencias(1);
    setPageProjetos(1);
  }, [activeTab, candidatoId]);

  const currentTags = useMemo(() => {
    if (!customPerfil?.tags || customPerfil.tags.length === 0) {
      return [];
    }
    const startIndex = (currentPage - 1) * tagsPerPage;
    const endIndex = startIndex + tagsPerPage;
    return customPerfil.tags.slice(startIndex, endIndex);
  }, [customPerfil?.tags, currentPage, tagsPerPage]);

  const totalPages = useMemo(() => {
    if (!customPerfil) return 0;
    return Math.ceil(customPerfil.tags_count / tagsPerPage);
  }, [customPerfil, tagsPerPage]);

  const handlePageChange = (pageNumber: number) => {
    const precisaCarregarMais =
      pageNumber > 1 &&
      customPerfil &&
      customPerfil.tags.length < customPerfil.tags_count;

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

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const calcularIdade = (dataNasc: string) => {
    if (!dataNasc) return '';
    const nasc = new Date(dataNasc);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const mes = hoje.getMonth() - nasc.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) {
      idade--;
    }
    return `${idade} anos`;
  };

  if (loading) return <Loader />;
  if (!candPerfil) {
    console.log(candPerfil)
    return (
      <div className="container mx-auto px-4 pt-10 pb-10 text-center">
        <h2 className="text-2xl font-bold text-professional-accent">Candidato não encontrado</h2>
      </div>
    )
  };

  return (
    <div className="bg-dark-50 dark:bg-dark-900">
      <HeaderProfiles />
      <div id="main" className="container mx-auto px-4 pt-6 pb-10">
        <div className="relative mb-6">
          <div className="w-full h-48 bg-gradient-to-r from-professional-accent to-professional-lightaccent rounded-xl"></div>
          <div className="absolute -bottom-12 left-6">
            <div className="flex items-end">
              <img
                id="fotoUsuario"
                src={candPerfil.foto === '/assets/imgs/genPfp.png' ? genPfp : candPerfil.foto}
                alt="Foto do candidato"
                className="w-32 h-32 rounded-full border-4 border-professional-card bg-professional-card object-cover"
              />
            </div>
          </div>
        </div>

        <div className="ml-40 pt-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 id="nomUsuario" className="text-3xl font-bold text-dark-700 dark:text-dark-50">
                {candPerfil.nome}
              </h1>
              <div className="flex flex-wrap items-center mt-2 space-x-4">
                {candPerfil.cargo_atual && (
                  <span className="text-lg font-medium text-professional-accent">
                    {candPerfil.cargo_atual}
                  </span>
                )}
                {candPerfil.empresa_atual && (
                  <span className="text-dark-700 dark:text-professional-subtitle">
                    na {candPerfil.empresa_atual}
                  </span>
                )}
              </div>
              <div className="flex items-center mt-2 space-x-4">
                {candPerfil.site_pessoal && (
                  <a
                    href={candPerfil.site_pessoal}
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
                {/* {candPerfil.linkedin && (
                  <a
                    href={candPerfil.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-700 dark:text-professional-subtitle hover:text-professional-accent transition-colors"
                  >
                    <FontAwesomeIcon icon={faLinkedin} className="mr-1" /> LinkedIn
                  </a>
                )} */}
                {candPerfil.portifolio && (
                  <a
                    href={candPerfil.portifolio}
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
                <div className="text-2xl font-bold text-professional-accent">{customPerfil?.experiencias_count || 0}</div>
                <div className="text-sm text-dark-700 dark:text-professional-subtitle">Experiências</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-professional-accent">{customPerfil?.projetos_count || 0}</div>
                <div className="text-sm text-dark-700 dark:text-professional-subtitle">Projetos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-professional-accent">{0}</div>
                <div className="text-sm text-dark-700 dark:text-professional-subtitle">Certificações</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-professional-accent">{customPerfil?.idiomas_count || 0}</div>
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
                    {candPerfil.descricao || "Não há informação neste campo: Descrição"}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500 transition-all duration-500 ease-out">
                    <h2 className="text-xl font-bold mb-4 text-professional-accent">
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      Informações Pessoais
                    </h2>
                    <div className="space-y-4">
                      {candPerfil.data_nasc && (
                        <div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium">Idade</div>
                          <div className="text-dark-700 dark:text-white">
                            {calcularIdade(candPerfil.data_nasc)} ({formatDate(candPerfil.data_nasc)})
                          </div>
                        </div>
                      )}
                      {candPerfil.pronomes && (
                        <div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium">Pronomes</div>
                          <div className="text-dark-700 dark:text-white">{candPerfil.pronomes}</div>
                        </div>
                      )}
                      {candPerfil.cargo_atual && (
                        <div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium">Cargo Atual</div>
                          <div className="text-dark-700 dark:text-white">{candPerfil.cargo_atual}</div>
                        </div>
                      )}
                      {candPerfil.empresa_atual && (
                        <div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium">Empresa Atual</div>
                          <div className="text-dark-700 dark:text-white">{candPerfil.empresa_atual}</div>
                        </div>
                      )}
                      {(candPerfil.cidade || candPerfil.estado) && (
                        <div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium">Localização</div>
                          <div className="text-dark-700 dark:text-white">
                            {candPerfil.cidade && candPerfil.estado ? `${candPerfil.cidade}, ${candPerfil.estado}` : candPerfil.cidade || candPerfil.estado}
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
                    {customPerfil?.tags && customPerfil.tags.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-3">
                          {currentTags.map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center gap-1.5 py-2 px-4 bg-dark-100 dark:bg-professional-gray text-dark-700 dark:text-professional-text text-sm font-medium rounded-lg border border-professional-card"
                            >
                              {tag.nome}
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
                                Mostrando {((currentPage - 1) * tagsPerPage) + 1} - {Math.min(currentPage * tagsPerPage, customPerfil.tags.length)} de {customPerfil.tags_count} habilidades
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
                        <div className="text-2xl font-bold text-professional-accent">{customPerfil?.experiencias_count || 0}</div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle">Experiências</div>
                      </div>
                      <div className="bg-dark-100 dark:bg-professional-gray rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-professional-accent">{customPerfil?.projetos_count || 0}</div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle">Projetos</div>
                      </div>
                      <div className="bg-dark-100 dark:bg-professional-gray rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-professional-accent">{0}</div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle">Certificações</div>
                      </div>
                      <div className="bg-dark-100 dark:bg-professional-gray rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-professional-accent">{0}</div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle">Formações</div>
                      </div>
                    </div>
                  </div>

                  <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500 transition-all duration-500 ease-out">
                    <h2 className="text-xl font-bold mb-4 text-professional-accent">
                      <FontAwesomeIcon icon={faLanguage} className="mr-2" />
                      Idiomas
                    </h2>
                    <div className="space-y-4">
                      {customPerfil?.idiomas && customPerfil.idiomas.length > 0 ? (
                        customPerfil.idiomas.map((idioma) => (
                          <div key={idioma.id} className="bg-dark-100 dark:bg-professional-gray rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium text-dark-700 dark:text-white">{idioma.nome}</h3>
                              <span className="text-sm text-dark-700 dark:text-professional-subtitle">
                                {idioma.nivel}
                              </span>
                            </div>

                            <div className="w-full bg-dark-300 dark:bg-professional-card rounded-full h-2">
                              <div
                                className="bg-professional-accent h-2 rounded-full"
                                style={{
                                  width:
                                    idioma.nivel === 'A1' ? '20%' :
                                    idioma.nivel === 'A2' ? '40%' :
                                    idioma.nivel === 'B1' ? '60%' :
                                    idioma.nivel === 'B2' ? '80%' :
                                    idioma.nivel === 'C1' ? '90%' : '100%'
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
                        customPerfil.idiomas.length < customPerfil.idiomas_count && (
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
                                : `Ver mais idiomas (${customPerfil.idiomas_count - customPerfil.idiomas.length})`}
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
                      <div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium">Email</div>
                        <div className="text-dark-700 dark:text-white">{renderField(candPerfil.email, "Email")}</div>
                      </div>
                    </div>

                    {/* {candPerfil.telefone && (
                      <div className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-3">
                        <FontAwesomeIcon icon={faPhone} className="text-professional-accent mr-3" />
                        <div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium">Telefone</div>
                          <div className="text-dark-700 dark:text-white">{candPerfil.telefone}</div>
                        </div>
                      </div>
                    )} */}

                    {candPerfil.portifolio && (
                      <div className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-3">
                        <FontAwesomeIcon icon={faFileAlt} className="text-professional-accent mr-3" />
                        <div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium">Portfólio</div>
                          <a
                            href={candPerfil.portifolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-dark-700 dark:text-white hover:text-professional-accent transition-colors"
                          >
                            Visualizar Portfólio
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card de Currículo */}
                {(candPerfil.curriculo || candPerfil.curriculo_file) && (
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
                            {candPerfil.curriculo_file ? `${(parseFloat(candPerfil.curriculo_file.split('|')[1])/1024).toFixed(2)} MB` : 'Documento'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        {candPerfil.curriculo && (
                          <a
                            href={candPerfil.curriculo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg border border-professional-accent text-professional-accent hover:bg-professional-accent hover:text-white transition-colors"
                          >
                            <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                            Visualizar
                          </a>
                        )}
                        
                        
                        {candPerfil.curriculo_file && (() => {
                          const curriculo_fileSplited = candPerfil.curriculo_file.split('|');
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

                    {/* {candPerfil.linkedin ? (
                      <a
                        href={candPerfil.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-4 hover:bg-professional-accent/20 transition-colors"
                      >
                        <FontAwesomeIcon icon={faLinkedin} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-dark-700 dark:text-white font-medium">LinkedIn</div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle">
                            {candPerfil.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-4">
                        <FontAwesomeIcon icon={faLinkedin} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-dark-700 dark:text-white font-medium">LinkedIn</div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle italic">
                            LinkedIn não informado
                          </div>
                        </div>
                      </div>
                    )} */}

                    {candPerfil.portifolio ? (
                      <a
                        href={candPerfil.portifolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-4 hover:bg-professional-accent/20 transition-colors"
                      >
                        <FontAwesomeIcon icon={faGlobe} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-dark-700 dark:text-white font-medium">Portfólio</div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle">
                            {candPerfil.portifolio.replace(/^https?:\/\//, '')}
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

                    {candPerfil.site_pessoal ? (
                      <a
                        href={candPerfil.site_pessoal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-4 hover:bg-professional-accent/20 transition-colors"
                      >
                        <FontAwesomeIcon icon={faGlobe} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-dark-700 dark:text-white font-medium">Site Pessoal</div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle">
                            {candPerfil.site_pessoal.replace(/^https?:\/\//, '')}
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
                  {customPerfil?.experiencias && customPerfil.experiencias.length > 0 ? (
                    <div className="space-y-6">
                      {customPerfil.experiencias.map((exp) => (
                        <div key={exp.id} className="bg-dark-100 dark:bg-professional-gray rounded-lg p-6 border border-professional-card">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-dark-700 dark:text-white">{exp.titulo}</h3>
                              <p className="text-professional-accent font-medium">{exp.nome}</p>
                            </div>
                            {exp.periodo && (
                              <div className="flex items-center text-dark-700 dark:text-professional-subtitle">
                                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                <span>{exp.periodo}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-dark-700 dark:text-professional-subtitle mb-4 whitespace-pre-line">
                            {exp.descricao}
                          </p>
                          {exp.tags_experiencias && exp.tags_experiencias.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {exp.tags_experiencias.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1.5 py-1 px-3 bg-dark-200 dark:bg-professional-card text-dark-700 dark:text-professional-text text-sm font-medium rounded-lg border border-professional-card"
                                >
                                  {tag.nome}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-dark-700 dark:text-professional-subtitle">
                      <FontAwesomeIcon icon={faBriefcase} className="text-4xl mb-3 opacity-50" />
                      <p>Nenhuma experiência profissional cadastrada.</p>
                    </div>
                  )}
                  {customPerfil &&
                    customPerfil.experiencias.length < customPerfil.experiencias_count && (
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
                  {customPerfil?.projetos_cand && customPerfil.projetos_cand.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {customPerfil.projetos_cand.map((proj) => (
                        <div key={proj.id} className="bg-dark-100 dark:bg-professional-gray rounded-lg p-6 border border-professional-card">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-dark-700 dark:text-white">{proj.titulo}</h3>
                              <p className="text-professional-accent font-medium">{proj.nome}</p>
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
                          {proj.periodo && (
                            <div className="flex items-center text-dark-700 dark:text-professional-subtitle mb-3">
                              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                              <span>{proj.periodo}</span>
                            </div>
                          )}
                          <p className="text-dark-700 dark:text-professional-subtitle mb-4 line-clamp-3">
                            {proj.descricao}
                          </p>
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-professional-accent hover:text-professional-lightaccent transition-colors mb-4"
                            >
                              <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                              Ver projeto
                            </a>
                          )}
                          {proj.tags_projetos_cand && proj.tags_projetos_cand.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {proj.tags_projetos_cand.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1.5 py-1 px-3 bg-dark-200 dark:bg-professional-card text-dark-700 dark:text-professional-text text-sm font-medium rounded-lg border border-professional-card"
                                >
                                  {tag.nome}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-dark-700 dark:text-professional-subtitle">
                      <FontAwesomeIcon icon={faProjectDiagram} className="text-4xl mb-3 opacity-50" />
                      <p>Nenhum projeto cadastrado.</p>
                    </div>
                  )}
                  {customPerfil &&
                    customPerfil.projetos_cand.length < customPerfil.projetos_count && (
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
                  {customPerfil?.formacoes && customPerfil.formacoes.length > 0 ? (
                    <div className="space-y-6">
                      {customPerfil.formacoes.map((form) => (
                        <div key={form.id} className="bg-dark-100 dark:bg-professional-gray rounded-lg p-6 border border-professional-card">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-dark-700 dark:text-white">{form.titulo}</h3>
                              <p className="text-professional-accent font-medium">{form.instituicao}</p>
                            </div>
                            {form.periodo && (
                              <div className="flex items-center text-dark-700 dark:text-professional-subtitle">
                                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                <span>{form.periodo}</span>
                              </div>
                            )}
                          </div>
                          {form.descricao && (
                            <p className="text-dark-700 dark:text-professional-subtitle mb-4">
                              {form.descricao}
                            </p>
                          )}
                          {form.nivel && (
                            <div className="mt-4">
                              <span className="inline-block px-3 py-1 bg-professional-accent/20 text-professional-accent rounded-full text-sm">
                                {form.nivel}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-dark-700 dark:text-professional-subtitle">
                      <FontAwesomeIcon icon={faGraduationCap} className="text-4xl mb-3 opacity-50" />
                      <p>Nenhuma formação acadêmica cadastrada.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'certificacoes' && (
              <div className="space-y-6">
                <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500 transition-all duration-500 ease-out">
                  <h2 className="text-xl font-bold mb-6 text-professional-accent">Certificações</h2>
                  {customPerfil?.certificacoes && customPerfil.certificacoes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {customPerfil.certificacoes.map((cert) => (
                        <div key={cert.id} className="bg-dark-100 dark:bg-professional-gray rounded-lg p-6 border border-professional-card">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-dark-700 dark:text-white">{cert.titulo}</h3>
                              <p className="text-professional-accent font-medium">{cert.instituicao}</p>
                            </div>
                            {cert.data_emissao && (
                              <div className="flex items-center text-dark-700 dark:text-professional-subtitle">
                                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                <span>{formatDate(cert.data_emissao)}</span>
                              </div>
                            )}
                          </div>
                          {cert.descricao && (
                            <p className="text-dark-700 dark:text-professional-subtitle mb-4">
                              {cert.descricao}
                            </p>
                          )}
                          {cert.link && (
                            <a
                              href={cert.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-professional-accent hover:text-professional-lightaccent transition-colors"
                            >
                              <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                              Ver certificado
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-dark-700 dark:text-professional-subtitle">
                      <FontAwesomeIcon icon={faCertificate} className="text-4xl mb-3 opacity-50" />
                      <p>Nenhuma certificação cadastrada.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}