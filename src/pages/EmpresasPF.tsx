import { faGithub, faInstagram, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import {
  faAward, faBell, faBriefcase, faCity, faFlag, faCodeBranch, faSearch, faBuilding,
  faCalendarAlt, faChevronLeft, faChevronRight, faCogs, faCommentAlt, faEnvelope,
  faGlobe, faHandshake, faIdCard, faIndustry, faMap, faMapMarkerAlt, faPhone,
  faProjectDiagram, faStar, faUser, faUserPlus, faUsers,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams } from "react-router-dom"
import { DadosUsuario } from "../utils/globalFunctions";
import HeaderProfiles from "../components/HeaderProfiles";
import { useEffect, useState } from "react";
import axiosWe from "../utils/axiosInstance";
import type { CustomEmp, Empresa, Tag } from "../utils/utilsInterfaces";
import Loader from "../components/Loader";
import genPfp from '../assets/imgs/genPfp.png';

export default function PerfilEmpresaPublico() {
  const params = useParams<{ empresaId?: string; id?: string }>();
  const empresaId = params.empresaId ?? params.id;
  const [empPerfil, setEmpPerfil] = useState<Empresa | null>(null);
  const [customPerfil, setCustomPerfil] = useState<CustomEmp | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sobre');

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
          email: '',
          foto: genPfp,
          descricao: null,
          estado: '',
          cidade: '',
          instagram: null,
          github: null,
          twitter: null,
          cnpj: '',
          nome_fant: 'Nome da Empresa',
          telefone: '',
          razao_soci: '',
          cep: '',
          complemento: null,
          numero: '',
          setor: null,
          porte: null,
          data_fund: null,
          contato: null,
          site: null,
          youtube: null,
          filiais: []
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

  if (loading) return <Loader />;
  if (!empPerfil) return (
    <div className="container mx-auto px-4 pt-10 pb-10 text-center">
      <h2 className="text-2xl font-bold text-professional-accent">Empresa não encontrada</h2>
    </div>
  );

  return (
    <>
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
              <h1 id="nomUsuario" className="text-3xl font-bold text-white">{empPerfil.nome_fant}</h1>
              <div className="flex items-center mt-2 space-x-4">
                {empPerfil.site && (
                  <a 
                    href={empPerfil.site} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-professional-subtitle hover:text-professional-accent transition-colors"
                  >
                    <FontAwesomeIcon icon={faGlobe} className="mr-1" /> Site Oficial
                  </a>
                )}
                {empPerfil.instagram && (
                  <a 
                    href={empPerfil.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-professional-subtitle hover:text-professional-accent transition-colors"
                  >
                    <FontAwesomeIcon icon={faInstagram} className="mr-1" /> Instagram
                  </a>
                )}
              </div>
            </div>

            <div className="flex space-x-6 mt-4 md:mt-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-professional-accent">12</div>
                <div className="text-sm text-professional-subtitle">Vagas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-professional-accent">15</div>
                <div className="text-sm text-professional-subtitle">Projetos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-professional-accent">4</div>
                <div className="text-sm text-professional-subtitle">Certificações</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-professional-card mb-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'sobre' ? 'text-professional-accent border-b-2 border-professional-accent' : 'text-professional-subtitle hover:text-white'}`}
              onClick={() => setActiveTab('sobre')}
            >
              <FontAwesomeIcon icon={faBuilding} className="mr-2" /> Sobre
            </button>
            <button
              className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'vagas' ? 'text-professional-accent border-b-2 border-professional-accent' : 'text-professional-subtitle hover:text-white'}`}
              onClick={() => setActiveTab('vagas')}
            >
              <FontAwesomeIcon icon={faBriefcase} className="mr-2" /> Vagas
            </button>
            <button
              className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'projetos' ? 'text-professional-accent border-b-2 border-professional-accent' : 'text-professional-subtitle hover:text-white'}`}
              onClick={() => setActiveTab('projetos')}
            >
              <FontAwesomeIcon icon={faProjectDiagram} className="mr-2" /> Projetos
            </button>
            <button
              className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'localizacoes' ? 'text-professional-accent border-b-2 border-professional-accent' : 'text-professional-subtitle hover:text-white'}`}
              onClick={() => setActiveTab('localizacoes')}
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" /> Localizações
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div>
            {activeTab === 'sobre' && (
              <div className="space-y-6">
                <div className="bg-professional-card rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-4 text-professional-accent">Sobre a Empresa</h2>
                  <p className="text-professional-subtitle whitespace-pre-line">
                    {empPerfil.descricao || "Esta empresa ainda não adicionou uma descrição."}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-professional-card rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4 text-professional-accent">
                      <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                      Informações
                    </h2>
                    <div className="space-y-4">
                      {empPerfil.setor && (
                        <div>
                          <div className="text-sm text-professional-subtitle">Setor</div>
                          <div className="text-white">{empPerfil.setor}</div>
                        </div>
                      )}
                      
                      {empPerfil.porte && (
                        <div>
                          <div className="text-sm text-professional-subtitle">Porte</div>
                          <div className="text-white">{empPerfil.porte}</div>
                        </div>
                      )}
                      
                      {/* {empPerfil.cnpj && (
                        <div>
                          <div className="text-sm text-professional-subtitle">CNPJ</div>
                          <div className="text-white">
                            {empPerfil.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}
                          </div>
                        </div>
                      )} */}

                      {empPerfil.data_fund && (
                        <div>
                          <div className="text-sm text-professional-subtitle">Fundação</div>
                          <div className="text-white">
                            {(() => {
                              const dataISO = empPerfil.data_fund.split('T')[0];
                              const [anoNasc, mesNasc, diaNasc] = String(dataISO).split('-');
                              return `${diaNasc}/${mesNasc}/${anoNasc}`;
                            })()}
                          </div>
                        </div>
                      )}

                      {empPerfil.cidade && empPerfil.estado && (
                        <div>
                          <div className="text-sm text-professional-subtitle">Localização Sede</div>
                          <div className="text-white">{empPerfil.cidade}, {empPerfil.estado}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-professional-card rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4 text-professional-accent">
                      <FontAwesomeIcon icon={faCodeBranch} className="mr-2" />
                      Especializações
                    </h2>
                    {customPerfil?.tags_empresas && customPerfil.tags_empresas.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {customPerfil.tags_empresas.map((tag) => (
                          <span 
                            key={tag.id}
                            className="inline-flex items-center gap-1.5 py-2 px-4 bg-professional-gray text-professional-text text-sm font-medium rounded-lg border border-professional-card"
                          >
                            {tag.nome}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-professional-subtitle">Nenhuma especialização informada.</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-professional-card rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4 text-professional-accent">
                      <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                      Métricas Empresariais
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-professional-gray rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-professional-accent">12</div>
                        <div className="text-sm text-professional-subtitle">Vagas Ativas</div>
                      </div>
                      <div className="bg-professional-gray rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-professional-accent">15</div>
                        <div className="text-sm text-professional-subtitle">Colaboradores</div>
                      </div>
                      <div className="bg-professional-gray rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-professional-accent">15</div>
                        <div className="text-sm text-professional-subtitle">Projetos Ativos</div>
                      </div>
                      <div className="bg-professional-gray rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-professional-accent">4</div>
                        <div className="text-sm text-professional-subtitle">Certificações</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-professional-card rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4 text-professional-accent">
                      <FontAwesomeIcon icon={faHandshake} className="mr-2" />
                      Cultura e Valores
                    </h2>
                    <div className="space-y-4">
                      <div className="bg-professional-gray rounded-lg p-4">
                        <h3 className="font-medium text-white mb-2">Missão</h3>
                        <p className="text-professional-subtitle text-sm">
                          Missão da empresa - propósito fundamental
                        </p>
                      </div>
                      <div className="bg-professional-gray rounded-lg p-4">
                        <h3 className="font-medium text-white mb-2">Visão</h3>
                        <p className="text-professional-subtitle text-sm">
                          Visão de futuro da empresa
                        </p>
                      </div>
                      <div className="bg-professional-gray rounded-lg p-4">
                        <h3 className="font-medium text-white mb-2">Valores</h3>
                        <p className="text-professional-subtitle text-sm">
                          Valores e princípios da empresa
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-professional-card rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-4 text-professional-accent">Informações de Contato</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {empPerfil.email && (
                      <div className="flex items-center bg-professional-gray rounded-lg p-3">
                        <FontAwesomeIcon icon={faEnvelope} className="text-professional-accent mr-3" />
                        <div>
                          <div className="text-sm text-professional-subtitle">Email</div>
                          <div className="text-white">{empPerfil.email}</div>
                        </div>
                      </div>
                    )}
                    
                    {empPerfil.telefone && (
                      <div className="flex items-center bg-professional-gray rounded-lg p-3">
                        <FontAwesomeIcon icon={faPhone} className="text-professional-accent mr-3" />
                        <div>
                          <div className="text-sm text-professional-subtitle">Telefone</div>
                          <div className="text-white">
                            {empPerfil.telefone.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, '+$1 ($2) $3-$4')}
                          </div>
                        </div>
                      </div>
                    )}

                    {empPerfil.site && (
                      <div className="flex items-center bg-professional-gray rounded-lg p-3">
                        <FontAwesomeIcon icon={faGlobe} className="text-professional-accent mr-3" />
                        <div>
                          <div className="text-sm text-professional-subtitle">Site</div>
                          <a 
                            href={empPerfil.site}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-professional-accent transition-colors"
                          >
                            {empPerfil.site.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      </div>
                    )}

                    {empPerfil.contato && (
                      <div className="flex items-center bg-professional-gray rounded-lg p-3">
                        <FontAwesomeIcon icon={faUser} className="text-professional-accent mr-3" />
                        <div>
                          <div className="text-sm text-professional-subtitle">Contato</div>
                          <div className="text-white">{empPerfil.contato}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Redes Sociais */}
                <div className="bg-professional-card rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-4 text-professional-accent">Redes Sociais</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {empPerfil.instagram && (
                      <a 
                        href={empPerfil.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-professional-gray rounded-lg p-4 hover:bg-professional-accent/20 transition-colors"
                      >
                        <FontAwesomeIcon icon={faInstagram} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-white font-medium">Instagram</div>
                          <div className="text-sm text-professional-subtitle">
                            {empPerfil.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '@')}
                          </div>
                        </div>
                      </a>
                    )}
                    
                    {empPerfil.github && (
                      <a 
                        href={empPerfil.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-professional-gray rounded-lg p-4 hover:bg-professional-accent/20 transition-colors"
                      >
                        <FontAwesomeIcon icon={faGithub} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-white font-medium">GitHub</div>
                          <div className="text-sm text-professional-subtitle">
                            {empPerfil.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                          </div>
                        </div>
                      </a>
                    )}
                    
                    {empPerfil.twitter && (
                      <a 
                        href={empPerfil.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-professional-gray rounded-lg p-4 hover:bg-professional-accent/20 transition-colors"
                      >
                        <FontAwesomeIcon icon={faXTwitter} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-white font-medium">Twitter/X</div>
                          <div className="text-sm text-professional-subtitle">
                            {empPerfil.twitter.replace(/^https?:\/\/(www\.)?twitter\.com\//, '@')}
                          </div>
                        </div>
                      </a>
                    )}

                    {empPerfil.youtube && (
                      <a 
                        href={empPerfil.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-professional-gray rounded-lg p-4 hover:bg-professional-accent/20 transition-colors"
                      >
                        <FontAwesomeIcon icon={faYoutube} className="text-professional-accent mr-3 text-xl" />
                        <div>
                          <div className="text-white font-medium">YouTube</div>
                          <div className="text-sm text-professional-subtitle">
                            {empPerfil.youtube.replace(/^https?:\/\/(www\.)?youtube\.com\//, '')}
                          </div>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vagas' && (
              <div className="bg-professional-card rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 text-professional-accent">Vagas Disponíveis</h2>
                <div className="text-center py-10 text-professional-subtitle">
                  <FontAwesomeIcon icon={faBriefcase} className="text-4xl mb-3 opacity-50" />
                  <p>Nenhuma vaga publicada no momento.</p>
                </div>
              </div>
            )}

            {activeTab === 'projetos' && (
              <div className="bg-professional-card rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 text-professional-accent">Projetos</h2>
                <div className="text-center py-10 text-professional-subtitle">
                  <FontAwesomeIcon icon={faProjectDiagram} className="text-4xl mb-3 opacity-50" />
                  <p>Nenhum projeto público disponível.</p>
                </div>
              </div>
            )}

            {activeTab === 'localizacoes' && (
              <div className="bg-professional-card rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 text-professional-accent">Nossas Localizações</h2>
                <div className="space-y-4">
                  <div className="bg-professional-gray rounded-lg p-4">
                    <div className="flex items-start">
                      <FontAwesomeIcon icon={faBuilding} className="text-professional-accent mr-3 mt-1" />
                      <div>
                        <h3 className="font-bold text-white">Sede Principal</h3>
                        <p className="text-professional-subtitle">{empPerfil.cidade}, {empPerfil.estado}</p>
                        {empPerfil.setor && (
                          <p className="text-sm text-professional-subtitle">Setor: {empPerfil.setor}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {customPerfil?.filiais && customPerfil.filiais.length > 0 ? (
                    customPerfil.filiais.map((filial, idx) => (
                      <div key={idx} className="bg-professional-gray rounded-lg p-4">
                        <div className="flex items-start">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-professional-accent mr-3 mt-1" />
                          <div>
                            <h3 className="font-bold text-white">
                              {filial.tipo || 'Unidade'} - {filial.cidade}
                            </h3>
                            <p className="text-professional-subtitle">{filial.estado}</p>
                            {filial.tipo && (
                              <p className="text-sm text-professional-subtitle">Tipo: {filial.tipo}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-professional-subtitle">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-2xl mb-2 opacity-50" />
                      <p>A empresa possui apenas a sede principal.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}