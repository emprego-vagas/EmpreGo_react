import { faGithub, faInstagram, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import {
  faBriefcase, faCodeBranch, faBuilding,
  faChevronLeft, faChevronRight, faEnvelope,
  faGlobe, faHandshake, faMapMarkerAlt,
  faProjectDiagram, faUser,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom"
import { DadosUsuario } from "../utils/globalFunctions";
import HeaderProfiles from "../components/HeaderProfiles";
import { useEffect, useState, useMemo } from "react";
import axiosWe from "../utils/axiosInstance";
import type { CustomEmp, Empresa, Tag } from "../utils/utilsInterfaces";
import Loader from "../components/Loader";
import genPfp from '../assets/imgs/genPfp.png';
import "../App.css";

// Função auxiliar para renderizar campos com verificação
// const renderField = (value: string | null | undefined, fieldTitle: string) => {
//   if (!value || value.trim() === '') {
//     return <span className="text-dark-700 dark:text-professional-subtitle italic">Não há informação neste campo: {fieldTitle}</span>;
//   }
//   return <span className="text-white">{value}</span>;
// };

export default function PerfilEmpresaPublico() {
  const params = useParams<{ empresaId?: string; id?: string }>();
  const empresaId = params.empresaId ?? params.id;
  const [empPerfil, setEmpPerfil] = useState<Empresa | null>(null);
  const [customPerfil, setCustomPerfil] = useState<CustomEmp | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sobre');
  const [currentPage, setCurrentPage] = useState(1);


  const [tagsCarregadasCompletas, setTagsCarregadasCompletas] = useState(false);
  const [tagsPerPage] = useState(15);
  const carregarTodasTagsAutomatico = async () => {
    if (tagsCarregadasCompletas) return;

    try {
      if (!customPerfil) return;

      if (customPerfil.tags_empresas.length >= customPerfil.tags_count) {
        setTagsCarregadasCompletas(true);
        return;
      }

      const response = await axiosWe(`/tags/empresas?offset=${customPerfil.tags_empresas.length}`) as { data: Tag[] };

      setCustomPerfil(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          tags_empresas: [...prev.tags_empresas, ...response.data]
        };
      });

      setTagsCarregadasCompletas(true);
    } catch (erro) {
      console.error("Erro ao carregar todas as tags automaticamente:", erro);
    }
  };


  useEffect(() => {
    async function loadEmp() {
      try {
        setLoading(true);
        if (empresaId) {
          const response = await axiosWe(`/empresa/public/${empresaId}`) as {
            data: { usua: Empresa, custom: CustomEmp }
          };
          const data = response.data;
          const { usua, custom } = data;
          setEmpPerfil(usua);
          setCustomPerfil(custom);
          return;
        }

        const user = DadosUsuario.getUsuario(false, 'empresa');
        if (user) {
          const response = await axiosWe(`/custom/perfil-empresa`) as { data: { usua: Empresa, custom: CustomEmp } };
          const data = response.data;
          const { usua, custom } = data;
          setEmpPerfil(usua);
          setCustomPerfil(custom);
          return;
        }

        const fallbackEmpresa: Empresa = {
          id: '',
          foto: genPfp,
          descricao: '',
          instagram: '',
          github: '',
          twitter: '',
          data_criacao: new Date(0),
          nome_fant: 'Nome da Empresa',
          setor: '',
          porte: '',
          contato: '',
          site: '',
          youtube: '',
          linkedin: '',
          link_endereco: '',
          facebook: '',
          cidade: '',
          estado: '',
          email: '',
          telefone: '',
          cnpj: '',
        };
        setEmpPerfil(fallbackEmpresa);
        setCustomPerfil({ tags_empresas: [], tags_count: 0, filiais: [], filiais_count: 0 });
      } catch (erro) {
        console.error("Erro ao carregar perfil público da empresa:", erro);
      } finally {
        setLoading(false);
      }
    };
    loadEmp();
  }, [empresaId]);
  useEffect(() => {
    if (
      !customPerfil ||
      tagsCarregadasCompletas ||
      customPerfil.tags_empresas.length !== 6
    ) return;

    carregarTodasTagsAutomatico();
  }, [customPerfil, tagsCarregadasCompletas]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, customPerfil?.tags_empresas]);

  const currentTags = useMemo(() => {
    if (!customPerfil?.tags_empresas || customPerfil.tags_empresas.length === 0) {
      return [];
    }
    const startIndex = (currentPage - 1) * tagsPerPage;
    const endIndex = startIndex + tagsPerPage;
    return customPerfil.tags_empresas.slice(startIndex, endIndex);
  }, [customPerfil?.tags_empresas, currentPage, tagsPerPage]);

  const totalPages = useMemo(() => {
    if (!customPerfil?.tags_empresas) return 0;
    return Math.ceil(customPerfil.tags_empresas.length / tagsPerPage);
  }, [customPerfil?.tags_empresas, tagsPerPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
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
  // useEffect(() => {
  //   console.log("TOTAL TAGS:", customPerfil?.tags_empresas?.length);
  //   console.log("TAGS:", customPerfil?.tags_empresas);
  // }, [customPerfil]);
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = getPageNumbers();
    const showStartEllipsis = pageNumbers[0] > 2;
    const showEndEllipsis = pageNumbers[pageNumbers.length - 1] < totalPages - 1;

    return (
      <div className="flex items-center justify-center mt-4 ">
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
                : 'bg-dark-300 dark:bg-professional-gray text-black  dark:text-white hover:bg-primary-400 dark:hover:bg-professional-card'}`}
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
      return (
        <span className="italic">
          Contato Não informado
        </span>
      );
    }
    return <span>{value}</span>;
  };

  if (loading) return <Loader />;
  if (!empPerfil) return (
    <div className="container mx-auto px-4 pt-10 pb-10 text-center">
      <h2 className="text-2xl font-bold text-professional-accent">Empresa não encontrada</h2>
    </div>
  );

  return (
    <div className="bg-dark-50 dark:bg-dark-900">
      <HeaderProfiles />
      <div id="main" className="container mx-auto px-4 pt-6 pb-10">
        <div className="relative mb-6">
          <div className="w-full h-48 bg-gradient-to-r from-professional-accent to-professional-lightaccent rounded-xl">
          </div>
          <div className="absolute -bottom-12 left-6">
            <div className="flex items-end">
              <img
                id="fotoUsuario"
                src={empPerfil.foto === '/assets/imgs/genPfp.png' ? genPfp : empPerfil.foto}
                alt="Logo da empresa"
                className="w-32 h-32 rounded-full border-4 border-professional-card bg-professional-card object-cover"
              />
            </div>
          </div>
        </div>

        <div className="ml-40 pt-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 id="nomUsuario" className="text-3xl font-bold text-dark-700 dark:text-dark-50">{empPerfil.nome_fant}</h1>
              <div className="flex items-center mt-2 space-x-4">
                {empPerfil.site && (
                  <a
                    href={empPerfil.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-700 dark:text-professional-subtitle hover:text-professional-accent transition-colors"
                  >
                    <FontAwesomeIcon icon={faGlobe} className="mr-1" /> Site Oficial
                  </a>
                )}
                {empPerfil.instagram && (
                  <a
                    href={empPerfil.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-700 dark:text-professional-subtitle hover:text-professional-accent transition-colors"
                  >
                    <FontAwesomeIcon icon={faInstagram} className="mr-1" /> Instagram
                  </a>
                )}
              </div>
            </div>

            <div className="flex space-x-6 mt-4 md:mt-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-professional-accent">12</div>
                <div className="text-sm text-dark-700 dark:text-professional-subtitle">Vagas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-professional-accent">15</div>
                <div className="text-sm text-dark-700 dark:text-professional-subtitle">Projetos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-professional-accent">4</div>
                <div className="text-sm text-dark-700 dark:text-professional-subtitle">Certificações</div>
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
              <FontAwesomeIcon icon={faBuilding} className="mr-2" /> Sobre
            </button>
            <button
              className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'vagas' ? 'text-professional-accent border-b-2 border-professional-accent' : 'text-dark-700 dark:text-professional-subtitle hover:text-primary-800 dark:hover:text-white'}`}
              onClick={() => setActiveTab('vagas')}
            >
              <FontAwesomeIcon icon={faBriefcase} className="mr-2" /> Vagas
            </button>
            <button
              className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'projetos' ? 'text-professional-accent border-b-2 border-professional-accent' : 'text-dark-700 dark:text-professional-subtitle hover:text-primary-800 dark:hover:text-white'}`}
              onClick={() => setActiveTab('projetos')}
            >
              <FontAwesomeIcon icon={faProjectDiagram} className="mr-2" /> Projetos
            </button>
            <button
              className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'localizacoes' ? 'text-professional-accent border-b-2 border-professional-accent' : 'text-dark-700 dark:text-professional-subtitle hover:text-primary-800 dark:hover:text-white'}`}
              onClick={() => setActiveTab('localizacoes')}
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" /> Localizações
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 ">
          <div>
            {activeTab === 'sobre' && (
              <div className="space-y-6">
                <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500  transition-all duration-500 ease-out">
                  <h2 className="text-xl font-bold mb-4 text-professional-accent">Sobre a Empresa</h2>
                  <p className="text-dark-700 dark:text-professional-subtitle whitespace-pre-line">
                    {empPerfil.descricao || "Não há informação neste campo: Descrição da Empresa"}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500  transition-all duration-500 ease-out">
                    <h2 className="text-xl font-bold mb-4 text-professional-accent">
                      <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                      Informações
                    </h2>
                    <div className="space-y-4 ">
                      <div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium">Setor</div>
                        <div className="text-dark-700 dark:text-professional-subtitle">{renderField(empPerfil.setor, "Setor")}</div>
                      </div>

                      <div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium">Porte</div>
                        <div className="text-dark-700 dark:text-professional-subtitle">{renderField(empPerfil.porte, "Porte")}</div>
                      </div>

                      {/* <div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle">CNPJ</div>
                        <div className="text-white">
                          {empPerfil.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}
                        </div>
                      </div> */}

                      {/* <div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle">Fundação</div>
                        {empPerfil.data_fund ? (
                          <div className="text-dark-700 dark:text-professional-subtitle">
                            {(() => {
                              const dataISO = empPerfil.data_fund.split('T')[0];
                              const [anoNasc, mesNasc, diaNasc] = String(dataISO).split('-');
                              return `${diaNasc}/${mesNasc}/${anoNasc}`;
                            })()}
                          </div>
                        ) : (
                          <span className="text-dark-700 dark:text-professional-subtitle italic">Não há informação neste campo: Data de Fundação</span>
                        )}
                      </div> */}

                      <div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium">Localização Sede</div>
                        {empPerfil.cidade && empPerfil.estado ? (
                          <div className="text-dark-700 dark:text-professional-subtitle">{empPerfil.cidade}, {empPerfil.estado}</div>
                        ) : (
                          <span className="text-dark-700 dark:text-professional-subtitle italic">Não há informação neste campo: Localização</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500  transition-all duration-500 ease-out">
                    <h2 className="text-xl font-bold mb-4 text-professional-accent">
                      <FontAwesomeIcon icon={faCodeBranch} className="mr-2" />
                      Especializações
                    </h2>
                    {customPerfil?.tags_empresas && customPerfil.tags_empresas.length > 0 ? (
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

                        {totalPages > 1 && (
                          <div className="pt-4 border-t border-professional-card">
                            <div className="flex flex-col items-center justify-between space-y-3 sm:flex-row sm:space-y-0">
                              <div className="text-sm text-dark-700 dark:text-professional-subtitle">
                                Mostrando {((currentPage - 1) * tagsPerPage) + 1} - {Math.min(currentPage * tagsPerPage, customPerfil.tags_empresas.length)} de {customPerfil.tags_empresas.length} especializações
                              </div>

                              {renderPagination()}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-dark-700 dark:text-professional-subtitle italic">Não há informação neste campo: Especializações</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500  transition-all duration-500 ease-out">
                    <h2 className="text-xl font-bold mb-4 text-professional-accent">
                      <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                      Métricas Empresariais
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-dark-100 dark:bg-professional-gray rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-professional-accent">12</div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle">Vagas Ativas</div>
                      </div>
                      <div className="bg-dark-100 dark:bg-professional-gray rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-professional-accent">15</div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle">Colaboradores</div>
                      </div>
                      <div className="bg-dark-100 dark:bg-professional-gray rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-professional-accent">15</div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle">Projetos Ativos</div>
                      </div>
                      <div className="bg-dark-100 dark:bg-professional-gray rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-professional-accent">4</div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle">Certificações</div>
                      </div>
                    </div>
                  </div>

                  <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500  transition-all duration-500 ease-out">
                    <h2 className="text-xl font-bold mb-4 text-professional-accent">
                      <FontAwesomeIcon icon={faHandshake} className="mr-2" />
                      Cultura e Valores
                    </h2>
                    <div className="space-y-4">
                      <div className="bg-dark-100 dark:bg-professional-gray rounded-lg p-4">
                        <h3 className="font-medium text-dark-700 dark:text-white mb-2">Missão</h3>
                        <p className="text-dark-700 dark:text-professional-subtitle text-sm italic">
                          Missão não informado
                        </p>
                      </div>
                      <div className="bg-dark-100 dark:bg-professional-gray rounded-lg p-4">
                        <h3 className="font-medium text-dark-700 dark:text-white mb-2">Visão</h3>
                        <p className="text-dark-700 dark:text-professional-subtitle text-sm italic">
                          Visão não informado
                        </p>
                      </div>
                      <div className="bg-dark-100 dark:bg-professional-gray rounded-lg p-4">
                        <h3 className="font-medium text-dark-700 dark:text-white mb-2">Valores</h3>
                        <p className="text-dark-700 dark:text-professional-subtitle text-sm italic">
                          Valores não informado
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500  transition-all duration-500 ease-out">
                  <h2 className="text-xl font-bold mb-4 text-professional-accent">Informações de Contato</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-3">
                      <FontAwesomeIcon icon={faEnvelope} className="text-professional-accent mr-3" />
                      <div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium">Email</div>
                        <div className="text-dark-700 dark:text-professional-subtitle">{renderField(empPerfil.contato, "Email")}</div>
                      </div>
                    </div>

                    {/* <div className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-3">
                      <FontAwesomeIcon icon={faPhone} className="text-professional-accent mr-3" />
                      <div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium">Telefone</div>
                        {empPerfil.telefone ? (
                          <div className="text-dark-700 dark:text-professional-subtitle">
                            {empPerfil.telefone.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, '+$1 ($2) $3-$4')}
                          </div>
                        ) : (
                          <span className="text-dark-700 dark:text-professional-subtitle italic">Telefone não informado</span>
                        )}
                      </div>
                    </div> */}

                    <div className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-3">
                      <FontAwesomeIcon icon={faGlobe} className="text-professional-accent mr-3" />
                      <div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium">Site</div>
                        {empPerfil.site ? (
                          <a
                            href={empPerfil.site}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-dark-700 dark:text-white hover:text-professional-accent transition-colors"
                          >
                            {empPerfil.site.replace(/^https?:\/\//, '')}
                          </a>
                        ) : (
                          <span className="text-dark-700 dark:text-professional-subtitle italic">Site não informado</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-3">
                      <FontAwesomeIcon icon={faUser} className="text-professional-accent mr-3" />
                      <div>
                        <div className="text-sm text-dark-700 dark:text-professional-subtitle font-medium">Contato</div>
                        <div className="text-dark-700 dark:text-professional-subtitle">{renderField(empPerfil.contato, "Pessoa de Contato")}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500  transition-all duration-500 ease-out">
                  <h2 className="text-xl font-bold mb-4 text-professional-accent">Redes Sociais</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {empPerfil.instagram ? (
                      <a
                        href={empPerfil.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-4 hover:bg-professional-accent/20 transition-colors"
                      >
                        <FontAwesomeIcon icon={faInstagram} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-dark-700 dark:text-white  font-medium">Instagram</div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle">
                            {empPerfil.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '@')}
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-4">
                        <FontAwesomeIcon icon={faInstagram} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-dark-700 dark:text-white  font-medium">Instagram</div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle italic">
                            Instagram não informado
                          </div>
                        </div>
                      </div>
                    )}

                    {empPerfil.github ? (
                      <a
                        href={empPerfil.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-4 hover:bg-professional-accent/20 transition-colors"
                      >
                        <FontAwesomeIcon icon={faGithub} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-dark-700 dark:text-white font-medium">GitHub</div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle">
                            {empPerfil.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
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

                    {empPerfil.twitter ? (
                      <a
                        href={empPerfil.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-4 hover:bg-professional-accent/20 transition-colors"
                      >
                        <FontAwesomeIcon icon={faXTwitter} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-dark-700 dark:text-white  font-medium">Twitter/X</div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle">
                            {empPerfil.twitter.replace(/^https?:\/\/(www\.)?twitter\.com\//, '@')}
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-4">
                        <FontAwesomeIcon icon={faXTwitter} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-dark-700 dark:text-white  font-medium">Twitter/X</div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle italic">
                            Twitter/X não informado
                          </div>
                        </div>
                      </div>
                    )}

                    {empPerfil.youtube ? (
                      <a
                        href={empPerfil.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-4 hover:bg-professional-accent/20 transition-colors"
                      >
                        <FontAwesomeIcon icon={faYoutube} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-dark-700 dark:text-white  font-medium">YouTube</div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle">
                            {empPerfil.youtube.replace(/^https?:\/\/(www\.)?youtube\.com\//, '')}
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center bg-dark-100 dark:bg-professional-gray rounded-lg p-4">
                        <FontAwesomeIcon icon={faYoutube} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-dark-700 dark:text-white  font-medium">YouTube</div>
                          <div className="text-sm text-dark-700 dark:text-professional-subtitle italic">
                            YouTube não informado
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vagas' && (
              <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500  transition-all duration-500 ease-out">
                <h2 className="text-xl font-bold mb-4 text-professional-accent">Vagas Disponíveis</h2>
                <div className="text-center py-10 text-dark-700 dark:text-professional-subtitle">
                  <FontAwesomeIcon icon={faBriefcase} className="text-4xl mb-3 opacity-50" />
                  <p>Nenhuma vaga publicada no momento.</p>
                </div>
              </div>
            )}

            {activeTab === 'projetos' && (
              <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500  transition-all duration-500 ease-out">
                <h2 className="text-xl font-bold mb-4 text-professional-accent">Projetos</h2>
                <div className="text-center py-10 text-dark-700 dark:text-professional-subtitle">
                  <FontAwesomeIcon icon={faProjectDiagram} className="text-4xl mb-3 opacity-50" />
                  <p>Nenhum projeto público disponível.</p>
                </div>
              </div>
            )}

            {activeTab === 'localizacoes' && (
              <div className="card-hover bg-dark-50 dark:bg-professional-card rounded-xl p-6 border border-professional-card hover:border-primary-500  transition-all duration-500 ease-out">
                <h2 className="text-xl font-bold mb-4 text-professional-accent">Nossas Localizações</h2>
                <div className="space-y-4">
                  <div className="bg-dark-100 dark:bg-professional-gray rounded-lg p-4">
                    <div className="flex items-start">
                      <FontAwesomeIcon icon={faBuilding} className="text-professional-accent mr-3 mt-1" />
                      <div>
                        <h3 className="font-bold text-white">Sede Principal</h3>
                        {empPerfil.cidade && empPerfil.estado ? (
                          <p className="text-dark-700 dark:text-professional-subtitle">{empPerfil.cidade}, {empPerfil.estado}</p>
                        ) : (
                          <p className="text-dark-700 dark:text-professional-subtitle italic">Não há informação neste campo: Localização da Sede</p>
                        )}
                        {empPerfil.setor && (
                          <p className="text-sm text-dark-700 dark:text-professional-subtitle">Setor: {empPerfil.setor}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {customPerfil?.filiais && customPerfil.filiais.length > 0 ? (
                    customPerfil.filiais.map((filial, idx) => (
                      <div key={idx} className="bg-dark-100 dark:bg-professional-gray rounded-lg p-4">
                        <div className="flex items-start">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-professional-accent mr-3 mt-1" />
                          <div>
                            <h3 className="font-bold text-white">
                              {filial.tipo || 'Unidade'} - {filial.cidade}
                            </h3>
                            <p className="text-dark-700 dark:text-professional-subtitle">{filial.estado}</p>
                            {filial.tipo && (
                              <p className="text-sm text-dark-700 dark:text-professional-subtitle">Tipo: {filial.tipo}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-dark-700 dark:text-professional-subtitle">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-2xl mb-2 opacity-50" />
                      <p className="italic">Não há informação neste campo: Filiais</p>
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