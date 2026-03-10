import React, { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import { gsap } from 'gsap';
import * as THREE from 'three';
// import JoaoAzevedo from './..JoaoAzevedo.jpeg';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { DadosUsuario, formatarCategoria, formatarEstado, logout, mostrarAvisoTopo } from '../utils/globalFunctions';
import axiosWe from '../utils/axiosInstance';
import genPfp from '../assets/imgs/genPfp.png';
import Loader from '../components/Loader';
import ThemeTogleConfig from '../components/ThemeTogleConfig';
import lupa from './../assets/imgs/lupa.png';
import logo from './../assets/imgs/BIGSlogo.png';
import '../css/filtragem.css';
import SinoNotificacoes from '../components/SinoNotificacoes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faComment, faSliders, faStar } from '@fortawesome/free-solid-svg-icons';
import { AnimatedItem } from '../animation/favoritoAnimation';
import FundoRoxo from '../assets/imgs/FundoRoxo.png';
import Slider from '../components/Slider';

interface Slide {
  empresa: string;
  titulo: string;
  texto: string;
  autor: string;
  data: string;
  background?: string;
  fotoEmpresa?: string;
}

interface EmpresaCardProps {
  logo: string;
  nome: string;
  descricao: string;
  favoritada: boolean;
  tags: string[];
  onClickFavorito?: () => void;
  onClickVerMais?: () => void;
  setor: string;
  estado: string;
  banner: string;
}

interface Empresa {
  id: string;
  logo: string;
  nome: string;
  descricao: string;
  setor: string;
  favoritada: boolean;
  estado: string;
  tags: string[];
  banner: string;
}

interface EmpresasPorCategoria {
  [key: string]: {
    pagina: number;
    chegouNoLimite: boolean;
    recolher: boolean;
    semRecolher?: boolean;
    empresasRecolhidas: () => Empresa[];
    empresas: Empresa[];
  }
}

interface EmpresaFavoritada {
  id: string;
  nome_fant: string;
  setor: string | null;
  foto: string | null;
}

interface FiltroRecomendado {
  id: number;
  nome: string;
  categoria: string;
}

interface FiltroAtual {
  name: string;
  page: number;
  loading: boolean;
  loadingMore: boolean;
  limit: boolean;
  empresas: Empresa[];
}

// Constantes do Filtro
const setoresFilter = ["Alimentação", "Vestuário", "Saúde", "Educação", "Consultoria", "Tecnologia", "Construção Civil", "Informática", "Marketing", "Advocacia", "Energia", "Transporte", "Engenharia"];
const portesFilter = ["Pequeno", "Médio", "Grande"];
const estadosFilter = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const EmpresaCard: React.FC<EmpresaCardProps> = ({
  logo,
  nome,
  descricao,
  tags,
  onClickFavorito,
  onClickVerMais,
  favoritada,
  setor,
  estado,
  banner
}) => {
  const [favorito, setFavorito] = useState(favoritada);

  const handleFavorito = () => {
    if (onClickFavorito) onClickFavorito();
  };

  useEffect(() => {
    setFavorito(favoritada);
  }, [favoritada]);

  return (
    <article
      className={"empresa-card  bg-dark-50 dark:bg-twitch-gray rounded-lg overflow-hidden shadow-md transition-all relative border border-gray-700 h-full flex flex-col hover:-translate-y-1 hover:shadow-lg hover:border-twitch-purple min-h-[400px]"}>

      {/* Header com logo e botão favorito */}
      <div className="card-header relative h-36 flex items-center justify-center overflow-hidden">

        {/* Background */}
        <img
          src={banner === 'fundoroxo' ? FundoRoxo : banner || FundoRoxo}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradiente por cima */}
        <div className="absolute inset-0 bg-gradient-to-br from-twitch-purple/30 to-transparent" />

        {/* Logo da empresa */}
        <img
          src={logo}
          alt={nome}
          className="empresa-logo relative z-10 w-28 h-28 rounded-full object-cover border-4 border-gray-800 bg-white shadow-md transition-transform"
        />

        {/* Botão favorito */}
        <button
          onClick={handleFavorito}
          className="favorite-btn absolute top-3 right-3 z-20
                            bg-black/40 w-10 h-10 rounded-full
                            flex items-center justify-center
                            text-gray-300 backdrop-blur-sm
                            transition-all hover:bg-black/60 hover:scale-110"
        >
          <i className={favorito ? 'bx bxs-star text-xl text-yellow-400' : 'bx bx-star text-xl'} />
        </button>

      </div>

      {/* Corpo do card */}
      <div className="card-body p-6 flex-1 ">
        {/* Nome da empresa e informações de localização/setor */}
        <div className="empresa-info mb-3">
          <h3 className="empresa-nome text-xl font-semibold dark:text-dark-200 text-twitch-gray mb-2">{nome}</h3>

          <div className="empresa-meta flex items-center text-sm dark:text-gray-400 text-twitch-gray ">
            {/* Setor */}
            {setor?.trim() && (
              <div className="setor-container flex items-center gap-1">
                <i className="bx bx-buildings text-base"></i>
                <span className="setor-text font-medium truncate max-w-[200px]" title={setor}>
                  {setor}
                </span>
              </div>
            )}

            {/* Estado - SEMPRE à direita */}
            {estado?.trim() && (
              <div className="estado-container flex items-center gap-1 ml-auto">
                <i className="bx bx-map text-base"></i>
                <span className="estado-sigla font-semibold px-2 py-0.5 text-dark-700 bg-dark-400 dark:text-dark-400 dark:bg-dark-700 rounded-md">
                  {estado}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Descrição */}
        <p className="empresa-descricao dark:text-gray-400 text-twitch-gray text-sm mb-4 line-clamp-3 leading-relaxed">{descricao}</p>
      </div>

      {/* Footer com tags e botão */}
      <div className="card-footer  flex justify-between items-center p-5 border-t border-gray-700 flex-wrap gap-2">
        <div className="card-meta flex items-center gap-2 flex-1 min-w-[150px]">
          <div className="tag-chips flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <span key={index} className="tag-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer transition-all bg-gray-700 hover:bg-twitch-purple">{tag}</span>
            ))}
          </div>
        </div>

        <button onClick={onClickVerMais} className="ver-mais-btn bg-twitch-purple btn-primary text-white border-none px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all hover:bg-twitch-lightpurple hover:-translate-y-0.5 hover:shadow">Ver perfil</button>
      </div>
    </article>
  );
};

const Main: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [usuario] = useState(DadosUsuario.getUsuario(true, 'candidato'));
  if (!usuario) {
    setTimeout(() => {
      navigate('/inicio')
    }, 3000)
  };

  const [searchParams] = useSearchParams();

  const [carregandoDados, setCarregandoDados] = useState(true);
  const [palavrasBusca, setPalavrasBusca] = useState<string[]>([]);

  const palavrasBuscaRef = useRef<string[]>([]);

  useEffect(() => {
    palavrasBuscaRef.current = palavrasBusca;
  }, [palavrasBusca]);

  const [filtrosRecomendados, setFiltrosRecomendados] = useState<FiltroRecomendado[]>([
    { id: 1, nome: "Programação de computadores", categoria: "Tecnologia" },
    { id: 2, nome: "Música", categoria: "Entretenimento" },
    { id: 3, nome: "Notícias", categoria: "Informação" },
    { id: 4, nome: "Yu-Gi-Oh! Duel Monsters", categoria: "Games" },
    { id: 5, nome: "Mixes", categoria: "Música" },
    { id: 6, nome: "Jogos de cartas", categoria: "Games" },
    { id: 7, nome: "Música medieval", categoria: "Música" },
    { id: 8, nome: "Chefes", categoria: "Culinária" },
    { id: 9, nome: "Música ao vivo", categoria: "Música" },
    { id: 10, nome: "Lista", categoria: "Organização" },
    { id: 11, nome: "Desenvolvimento Web", categoria: "Tecnologia" },
    { id: 12, nome: "React", categoria: "Tecnologia" },
    { id: 13, nome: "TypeScript", categoria: "Tecnologia" },
    { id: 14, nome: "UI/UX Design", categoria: "Design" },
  ]);

  const [filtroAtual, setFiltroAtual] = useState<FiltroAtual>({
    name: 'Tudo',
    page: 1,
    loading: false,
    loadingMore: false,
    limit: false,
    empresas: []
  });
  const filtroAtualPageRef = useRef<number>(1);
  const filtroAtualLoadingRef = useRef<boolean>(false);
  const filtroAtualLoadingMoreRef = useRef<boolean>(false);
  const filtroAtualLimitRef = useRef<boolean>(false);
  const filtroAtualNameRef = useRef<string>('Tudo');
  useEffect(() => {
    filtroAtualPageRef.current = filtroAtual.page;
    filtroAtualLoadingRef.current = filtroAtual.loading;
    filtroAtualLoadingMoreRef.current = filtroAtual.loadingMore;
    filtroAtualLimitRef.current = filtroAtual.limit;
    filtroAtualNameRef.current = filtroAtual.name;
  }, [filtroAtual.page, filtroAtual.loading, filtroAtual.loadingMore, filtroAtual.limit, filtroAtual.name]);

  async function buscarEmpresasCategoria(categoria: string) {
    try {
      const loading = filtroAtualLoadingRef.current;
      const loadingMore = filtroAtualLoadingMoreRef.current;
      const limit = filtroAtualLimitRef.current;

      if (loading || loadingMore || limit) return;

      const pagina = filtroAtualPageRef.current;
      console.log(pagina)
      setFiltroAtual(prev => ({
        ...prev,
        loading: pagina === 1 ? true : false,
        loadingMore: pagina === 1 ? false : true
      }));
      const response = await axiosWe(`/company/list/category/${categoria}?page=${pagina}`);
      const empresas = response.data;
      const isFavoritada = (id: string) => {
        return empresasFavoritadas.some((e) => e.id === id);
      };
      setFiltroAtual(prev => ({
        ...prev,
        page: pagina + 1,

        loading: false,
        loadingMore: false,
        limit: empresas.length < 9,
        empresas: [...prev.empresas, ...empresas.map(emp => ({
          id: emp.id,
          logo: emp.image === 'genPfp.png' ? genPfp : emp.image,
          banner: emp.banner === 'fundoroxo' ? FundoRoxo : (emp.banner || FundoRoxo),
          nome: emp.name,
          descricao: emp.description,
          setor: emp.sector,
          favoritada: isFavoritada(emp.id),
          tags: emp.comp_tags.map(t => t.name),
          estado: emp.state
        }))]
      }))
      console.log(response.data)
    } catch (erro) {
      console.error('Erro ao buscar empresa por categoria:', erro);
    }
  }

  useEffect(() => {
    const categoria = filtroAtual.name;
    if (categoria === 'Tudo') {
      return;
    }

    buscarEmpresasCategoria(categoria)
    console.log("Filtro mudou")
  }, [filtroAtual.name])

  const [erroAoCarregar, setErroAoCarregar] = useState(false);
  useEffect(() => {
    const redirect = setTimeout(() => {
      if (erroAoCarregar) window.location.href = '/';
    }, 3 * 1000);
    return () => clearTimeout(redirect);
  }, [erroAoCarregar])

  useEffect(() => {
    if (!usuario) return;
    async function carregarDados() {
      try {
        const response = await axiosWe('/custom/vizualizar-empresas');
        const { data, meta } = response;
        console.log(data);
        console.log('Setores recomendados:', data.recommendedHighCompanies.map(e => e.sector));

        console.log(meta.words)
        setPalavrasBusca(meta.words);
        palavrasBuscaRef.current = meta.words;
        setEmpresasFavoritadas(data.favoritedCompanies.map(e => ({
          id: e.id,
          nome_fant: e.name,
          setor: e.sector,
          foto: e.image
        })));

        const isFavoritada = (id: string) => {
          return data.favoritedCompanies.some((e) => e.id === id);
        };
        setEmpresasPorCategoria({
          ["Empresas Recomendadas"]: {
            pagina: 1,
            chegouNoLimite: false,
            recolher: true,
            empresasRecolhidas() {
              return this.empresas.slice(0, 3)
            },
            empresas: data.recommendedHighCompanies.map(emp => ({
              id: emp.id,
              logo: emp.image === 'genPfp.png' ? genPfp : emp.image,
              banner: emp.banner === 'fundoroxo' ? FundoRoxo : (emp.banner || FundoRoxo),
              nome: emp.name,
              descricao: emp.description,
              tags: emp.comp_tags.map(t => t.name),
              setor: emp.sector,
              favoritada: isFavoritada(emp.id),
              estado: emp.state
            }))
          },
          ["Empresas Recentes"]: {
            pagina: 1,
            chegouNoLimite: false,
            recolher: true,
            empresasRecolhidas() {
              return this.empresas.slice(0, 3)
            },
            empresas: data.recentCompanies.map(emp => ({
              id: emp.id,
              logo: emp.image === 'genPfp.png' ? genPfp : emp.image,
              banner: emp.banner === 'fundoroxo' ? FundoRoxo : (emp.banner || FundoRoxo),
              nome: emp.name,
              descricao: emp.description,
              tags: emp.comp_tags.map(t => t.name),
              setor: emp.sector,
              favoritada: isFavoritada(emp.id),
              estado: emp.state
            }))
          },
          ["Empresas Principais"]: {
            pagina: 1,
            chegouNoLimite: false,
            recolher: true,
            empresasRecolhidas() {
              return this.empresas.slice(0, 3)
            },
            empresas: data.mainCompanies.map(emp => ({
              id: emp.id,
              logo: emp.image === 'genPfp.png' ? genPfp : emp.image,
              banner: emp.banner === 'fundoroxo' ? FundoRoxo : (emp.banner || FundoRoxo),
              nome: emp.name,
              descricao: emp.description,
              tags: emp.comp_tags.map(t => t.name),
              setor: emp.sector,
              favoritada: isFavoritada(emp.id),
              estado: emp.state
            }))
          }
        })
        setEmpresasSemLabel(data.recommendedLowCompanies.map(emp => ({
          id: emp.id,
          logo: emp.image === 'genPfp.png' ? genPfp : emp.image,
          banner: emp.banner === 'fundoroxo' ? FundoRoxo : (emp.banner || FundoRoxo),
          nome: emp.name,
          descricao: emp.description,
          tags: emp.comp_tags.map(t => t.name),
          setor: emp.sector,
          favoritada: isFavoritada(emp.id),
          estado: emp.state
        })));
        setFiltrosRecomendados(data.randomCategories.map((c, i) => ({ id: i, nome: formatarCategoria(c), categoria: c })));
        setCarregandoDados(false);
      } catch (erro) {
        setErroAoCarregar(true);
        console.error("Erro ao carregar empresas:", erro)
      }

    }
    carregarDados();
  }, [usuario]);

  // * Effect para buscar pela query automaticamente
  useEffect(() => {
    if (carregandoDados) return;

    const pesquisa = searchParams.get('p');
    if (!pesquisa) return;

    setBuscaPesquisa(pesquisa);

    setTimeout(() => {
      searchButtonRef.current?.click();
    }, 100);
  }, [carregandoDados, searchParams]);

  // slider states 
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Estados do Filtro
  const [filters, setFilters] = useState({
    setor: [],
    estado: [],
    porte: [],
  });
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [buscaPesquisa, setBuscaPesquisa] = useState('');
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);
  const [searchData, setSearchData] = useState<{
    active: boolean;
    query: string;
    page: number;
    limit: boolean;
    loading: boolean;
    loadingMore: boolean;
    empresas: Empresa[];
  }>({ active: false, query: '', page: 1, limit: false, loading: false, loadingMore: false, empresas: [] });
  const searchPageRef = useRef(1);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  function clearSearchData() {
    searchPageRef.current = 1;
    setBuscaPesquisa('');
    setFilters({
      setor: [],
      estado: [],
      porte: [],
    });
    setSearchData({ active: false, query: '', page: 1, limit: false, loading: false, loadingMore: false, empresas: [] });
  }

  // Refs do Header
  const headerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const filtrosContainerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  // const dateTimeNow = Date.now();

  // informações
  const slides: Slide[] = [
    {
      empresa: "TechSolutions Inc.",
      titulo: "Parceria Excepcional",
      texto: "Trabalhar com esta equipe foi uma experiência transformadora para nosso negócio. A qualidade do serviço superou todas as expectativas e os resultados foram visíveis já no primeiro mês de colaboração.",
      autor: "Carlos Mendes",
      data: "15 de Março, 2023",
      background: undefined,
      fotoEmpresa: undefined
    },
    {
      empresa: "Global Innovations",
      titulo: "Profissionalismo Notável",
      texto: "Recomendo fortemente os serviços prestados. A equipe demonstrou um nível de profissionalismo raro no mercado, com atenção aos detalhes e prazos rigorosamente cumpridos. Uma parceria que certamente continuaremos no futuro.",
      autor: "Ana Beatriz Silva",
      data: "2 de Abril, 2023",
      background: undefined
    },
    {
      empresa: "Digital Ventures",
      titulo: "Resultados Exponenciais",
      texto: "Em menos de 6 meses, nossa presença online cresceu 300% graças ao trabalho meticuloso desta equipe. A abordagem estratégica e a capacidade de adaptação às necessidades do nosso setor foram impressionantes.",
      autor: "Ricardo Almeida",
      data: "22 de Maio, 2023",
      background: undefined
    },
    {
      empresa: "Future Labs",
      titulo: "Inovação Contínua",
      texto: "O que mais impressiona é a capacidade de inovar constantemente, trazendo soluções que não apenas resolvem problemas imediatos, mas preparam nossa empresa para os desafios futuros. Uma relação de confiança construída ao longo de anos.",
      autor: "Fernanda Oliveira",
      data: "10 de Junho, 2023",
      background: undefined
    }
  ];

  const [empresasPorCategoria, setEmpresasPorCategoria] = useState<EmpresasPorCategoria>({})
  const [semLabelPage, setSemLabelPage] = useState(1);

  const [empresasSemLabel, setEmpresasSemLabel] = useState([
    {
      id: '1',
      logo: undefined,
      nome: 'Alpha Tech',
      descricao: 'Soluções inovadoras em tecnologia e consultoria digital.',
      favoritada: false,
      setor: '',
      estado: '',
      tags: ['Tecnologia', 'Inovação', 'Remoto'],
      banner: FundoRoxo
    },
    {
      id: '2',
      logo: undefined,
      nome: 'Beta Systems',
      descricao: 'Desenvolvimento de sistemas corporativos personalizados.',
      favoritada: false,
      setor: '',
      estado: '',
      tags: ['Sistemas', 'Corporate', 'Híbrido'],
      banner: FundoRoxo
    },
  ]);
  const empresasSemLabelRef = useRef(null);
  const limitEmpresasSemLabelRef = useRef(false);
  useEffect(() => {
    empresasSemLabelRef.current = empresasSemLabel;
  }, [empresasSemLabel]);
  const [empresasFavoritadas, setEmpresasFavoritadas] = useState<EmpresaFavoritada[]>([]);

  // favoritar ou desfavoritar empresa
  const handleAlterarStatusFavorito = async (favoritada: boolean, empresa: EmpresaFavoritada) => {
    console.log('atualizar')
    function atualizarStatus() {
      setEmpresasSemLabel(empresasSemLabel.map(emp => {
        if (emp.id === empresa.id) {
          return { ...emp, favoritada: !favoritada }
        } else return emp
      }));
      setEmpresasPorCategoria(prev => {
        const novo = { ...prev };

        for (const categoria in novo) {
          novo[categoria] = {
            ...novo[categoria],
            empresas: novo[categoria].empresas.map(emp =>
              emp.id === empresa.id
                ? { ...emp, favoritada: !favoritada }
                : emp
            )
          };
        }

        return novo;
      });
      setSearchData(prev => ({
        ...prev,
        empresas: prev.empresas.map(emp => {
          if (emp.id === empresa.id) {
            return { ...emp, favoritada: !favoritada }
          } else return emp
        })
      }))
      setFiltroAtual(prev => ({
        ...prev,
        empresas: prev.empresas.map(emp => {
          if (emp.id === empresa.id) {
            return { ...emp, favoritada: !favoritada }
          } else return emp
        })
      }))
    }
    if (favoritada) {
      setEmpresasFavoritadas(prev => prev.filter(e => e.id !== empresa.id));
      atualizarStatus();
      try {
        await axiosWe.delete(`/favorited/company/${empresa.id}`);
      } catch (erro) {
        console.error("Erro ao remover empresa dos favoritos: ", erro);
      };
    }
    else {
      if (empresasFavoritadas.length >= 20) {
        mostrarAvisoTopo("Você só pode favoritar até 20 empresas");
      } else {
        setEmpresasFavoritadas(prev => {
          if (prev.length >= 20) {
            mostrarAvisoTopo("Você só pode favoritar até 20 empresas");
            return prev;
          }


          return [empresa, ...prev];
        });
        atualizarStatus();
        try {
          await axiosWe.post(`/favorited/company/${empresa.id}`);
        } catch (erro) {
          console.error("Erro ao favoritar empresa:", erro);
        };
      }
    };
  }

  // infinite scroll empresas sem label

  // const [empresasExpandidas, setEmpresasExpandidas] = useState<{ [key: string]: boolean }>({});
  //! const [empresasSemLabelExpandidas, setEmpresasSemLabelExpandidas] = useState(false);  FORA DE USO
  const [carregando, setCarregando] = useState(false);
  const carregandoRef = useRef(false);

  useEffect(() => {
    carregandoRef.current = carregando
  }, [carregando])

  // const toggleExpandir = (categoria: string) => {
  //     setEmpresasExpandidas(prev => ({
  //         ...prev,
  //         [categoria]: !prev[categoria]
  //     }));
  // };

  const carregarMaisEmpresas = async () => {
    console.log(empresasSemLabel.length)
    if (limitEmpresasSemLabelRef.current || empresasSemLabelRef.current.length % 9 !== 0 || carregandoRef.current) {
      return;
    }
    setCarregando(true);
    try {
      const response = await axiosWe.post(`/company/list/recommendedlow?page=${semLabelPage + 1}`, { words: palavrasBuscaRef.current });
      setSemLabelPage(prev => prev + 1);
      const novasEmpresas = response.data;
      if (novasEmpresas.length < 9) limitEmpresasSemLabelRef.current = true;
      const isFavoritada = (id: string) => {
        return empresasFavoritadas.some((e) => e.id === id);
      };
      setEmpresasSemLabel(prev =>
        [...prev, ...novasEmpresas.map(emp => ({
          id: emp.id,
          logo: emp.image === 'genPfp.png' ? genPfp : emp.image,
          banner: emp.banner === 'fundoroxo' ? FundoRoxo : (emp.banner || FundoRoxo),
          nome: emp.name,
          descricao: emp.description,
          setor: emp.sector,
          favoritada: isFavoritada(emp.id),
          tags: emp.comp_tags.map(t => t.name),
          estado: emp.state
        }))]
      );
      setCarregando(false);
    } catch (erro) {
      console.error("Erro ao carregar mais empresas:", erro)
    }
    // setTimeout(() => {
    //     setEmpresasSemLabelExpandidas(true);
    //     setCarregando(false);
    // }, 1500);
  };

  const isLoadingMoreRef = useRef(false);

  async function loadMoreQuery() {
    // Verificar usando a ref para prevenir race conditions
    if (isLoadingMoreRef.current || searchData.limit || !searchData.active) {
      console.log('loadMoreQuery abortado:', {
        isLoadingMoreRef: isLoadingMoreRef.current,
        limit: searchData.limit,
        active: searchData.active
      });
      return;
    }

    try {
      // Marcar que está carregando - IMPORTANTE: fazer isso antes de qualquer await
      isLoadingMoreRef.current = true;
      // Aqui DEFINITIVAMENTE mostrar o loader
      setSearchData(prev => ({ ...prev, loadingMore: true }));

      const nextPage = searchPageRef.current;
      console.log('Carregando página:', nextPage, 'Query:', searchData.query);

      const response = await axiosWe(`/company/list/search?page=${nextPage}&${searchData.query}`);
      const emps = response.data;

      if (emps.length === 0) {
        console.log('Sem mais resultados, marcando como limite');
        setSearchData(prev => ({
          ...prev,
          limit: true,
          loadingMore: false
        }));
        isLoadingMoreRef.current = false;
        return;
      }

      const isFavoritada = (id: string) => {
        return empresasFavoritadas.some((e) => e.id === id);
      };

      setSearchData(prev => ({
        ...prev,
        active: true,
        page: nextPage,
        limit: emps.length < 9,
        loading: false,
        loadingMore: false,
        empresas: [...prev.empresas, ...emps.map(
          emp => ({
            id: emp.id,
            logo: emp.image === 'genPfp.png' ? genPfp : emp.image,
            banner: emp.banner === 'fundoroxo' ? FundoRoxo : (emp.banner || FundoRoxo),
            nome: emp.name,
            descricao: emp.description,
            tags: emp.comp_tags.map(t => t.name),
            setor: emp.sector,
            favoritada: isFavoritada(emp.id),
            estado: emp.state
          })
        )]
      }));

      searchPageRef.current = nextPage + 1;
      console.log('Próxima página será:', searchPageRef.current);

    } catch (erro) {
      console.error("Falha ao carregar mais empresas:", erro);
      setSearchData(prev => ({ ...prev, loadingMore: false }));
    } finally {
      isLoadingMoreRef.current = false;
    }
  }

  useEffect(() => {
    let timeoutId;

    const handleScroll = () => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

        if (atBottom) {
          if (filtroAtualNameRef.current !== 'Tudo') {
            buscarEmpresasCategoria(filtroAtualNameRef.current);
            return;
          }

          if (!searchData.active && !carregando) {
            carregarMaisEmpresas();
          }

          if (searchData.active && !searchData.loading && !isLoadingMoreRef.current && !searchData.limit) {
            loadMoreQuery();
          }
        }
      }, 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [carregando, searchData.active, searchData.loading, searchData.loadingMore, searchData.limit]);

  const handleSearch = async () => {
    if (searchData.loading) return;
    const setoresString = filters.setor.join(',');
    const estadosString = filters.estado.join(',');
    const portesString = filters.porte.join(',');

    if (!buscaPesquisa.trim() && !setoresString && !estadosString && !portesString) {
      clearSearchData();
      return;
    }

    window.scrollTo(0, 0);
    const queryParts: string[] = [];
    if (buscaPesquisa) queryParts.push(`keyword=${buscaPesquisa.trim()}`);
    if (setoresString) queryParts.push(`sectors=${setoresString}`);
    if (estadosString) queryParts.push(`states=${estadosString}`);
    if (portesString) queryParts.push(`company_sizes=${portesString}`);

    const queryJoin = queryParts.join('&');

    if (queryJoin !== searchData.query) {
      setFiltroAtual({ empresas: [], limit: false, loading: false, loadingMore: false, name: 'Tudo', page: 1 })
      try {
        searchPageRef.current = 1;
        isLoadingMoreRef.current = false;

        setSearchData({
          active: true,
          query: queryJoin,
          page: 1,
          limit: false,
          loading: true,
          loadingMore: false,
          empresas: []
        });

        const response = await axiosWe(`/company/list/search?page=1&${queryJoin}`);
        console.log('Busca inicial - Página 1:', response.data.length, 'resultados');
        const emps = response.data;

        if (emps.length === 0) {
          setSearchData(prev => ({
            ...prev,
            limit: true,
            loading: false
          }));
          return;
        }

        const isFavoritada = (id: string) => {
          return empresasFavoritadas.some((e) => e.id === id);
        };

        setSearchData({
          active: true,
          query: queryJoin,
          page: 1,
          limit: emps.length < 9,
          loading: false,
          loadingMore: false,
          empresas: emps.map(emp => ({
            id: emp.id,
            logo: emp.image === 'genPfp.png' ? genPfp : emp.image,
            banner: emp.banner === 'fundoroxo' ? FundoRoxo : (emp.banner || FundoRoxo),
            nome: emp.name,
            descricao: emp.description,
            tags: emp.comp_tags.map(t => t.name),
            setor: emp.sector,
            favoritada: isFavoritada(emp.id),
            estado: emp.state
          }))
        });

        searchPageRef.current = 2;

      } catch (erro) {
        console.error('Erro ao buscar empresas:', erro);
        setSearchData(prev => ({ ...prev, loading: false }));
      }
    }
  };

  // useEffect(() => {
  //     if (searchData.active) {
  //         const setoresString = filters.setor.join(',');
  //         const estadosString = filters.estado.join(',');
  //         const portesString = filters.porte.join(',');

  //         const queryParts: string[] = [];
  //         if(buscaPesquisa) queryParts.push(`keyword=${buscaPesquisa}`);
  //         if(setoresString) queryParts.push(`setor=${setoresString}`);
  //         if(estadosString) queryParts.push(`estado=${estadosString}`);
  //         if(portesString) queryParts.push(`porte=${portesString}`);

  //         const queryJoin = queryParts.join('&');

  //         // Se a query mudou, preparar para uma nova busca
  //         // Mas não executar automaticamente - esperar o clique do usuário
  //         if (queryJoin !== searchData.query) {
  //             // Podemos limpar ou marcar como precisa de atualização
  //             console.log('Query mudou, preparando para nova busca');
  //         }
  //     }
  // }, [buscaPesquisa, filters.setor, filters.estado, filters.porte]);

  // slider three js particles background
  useEffect(() => {
    if (!threeContainerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, threeContainerRef.current.clientWidth / threeContainerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(threeContainerRef.current.clientWidth, threeContainerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    threeContainerRef.current.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 150;

    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xffffff,
      transparent: true,
      opacity: 0.6
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 2;

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    const animateParticles = () => {
      requestAnimationFrame(animateParticles);

      if (particlesMesh) {
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;

        particlesMesh.rotation.x += mouseRef.current.y * 0.0001;
        particlesMesh.rotation.y += mouseRef.current.x * 0.0001;
      }

      renderer.render(scene, camera);
    };

    animateParticles();

    return () => {
      if (threeContainerRef.current && renderer.domElement) {
        threeContainerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // mouse move for three js
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ===== FUNÇÕES E ESTADOS DO HEADER =====

  // useEffect para fechar menu de perfil ao clicar fora
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Função para lidar com clique em filtro recomendado
  // const handleFiltroClick = (f: FiltroRecomendado) => {
  //     f.nome;
  // };

  // Função para scroll dos filtros
  const scrollFiltros = (direction: "left" | "right") => {
    if (!filtrosContainerRef.current) return;

    const container = filtrosContainerRef.current;
    const scrollAmount = 300;
    const target =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    gsap.to(container, {
      scrollLeft: target,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  // useEffect para fechar filtro ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Função para alternar chip de filtro
  const toggleChip = (category: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const current = prev[category];
      const exists = current.includes(value);

      return {
        ...prev,
        [category]: exists
          ? current.filter(v => v !== value)
          : [...current, value]
      };
    });
  };

  // Função para limpar filtros
  const clearFilters = () => {
    setFilters({
      setor: [],
      estado: [],
      porte: [],
    });
  };

  // Função para confirmar filtros
  const confirmFilters = () => {
    // onApply(filters); // descomente quando implementar
    setIsFilterOpen(false);
  };

  const handleInicioBtn = () => {
    clearSearchData();
    window.scrollTo(0, 0);
    homeCategoriaRef.current.click();
  }
  const homeCategoriaRef = useRef<HTMLButtonElement | null>(null);

  if (carregandoDados) return (<Loader />)

  return (
    <>
      <div className={`app-wrapper ${isSidebarOpen ? 'sidebar-open' : ''} relative bg-white dark:bg-dark-600`}>
        {/* ===== SIDEBAR (Mobile e Desktop) ===== */}
        {isMobile ? (<div
          className={`
            fixed inset-0 z-[999] transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          {isSidebarOpen && (
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          <aside className="absolute top-0 left-0 h-screen w-64 bg-white dark:bg-dark-600 shadow-xl pt-6 overflow-y-auto">
            <nav className="sidebar-itens flex flex-col gap-3 px-3">
              {/* Itens da sidebar (igual ao conteúdo original, mas sem lógica de colapso) */}
              <button
                className="flex items-center gap-4 px-3 py-2 rounded-full hover:bg-primary-400 transition"
                onClick={handleInicioBtn}
              >
                <i className="bx bx-home text-2xl dark:text-gray-200 text-dark-900"></i>
                <span className="dark:text-gray-200 text-dark-900 text-sm font-medium">Início</span>
              </button>

              <Link to="/chats" className="flex items-center gap-4 px-3 py-2 rounded-full hover:bg-primary-400 transition">
                <i className="bx bx-message-rounded text-2xl dark:text-gray-200 text-dark-900"></i>
                <span className="dark:text-gray-200 text-dark-900 text-sm font-medium whitespace-nowrap">Chats</span>
              </Link>

              <Link to="/" className="flex items-center gap-4 px-3 py-2 rounded-full hover:bg-primary-400 transition">
                <i className="bx bx-group text-2xl dark:text-gray-200 text-dark-900"></i>
                <span className="dark:text-gray-200 text-dark-900 text-sm font-medium">Fórum</span>
              </Link>

              <div className="relative">
                <button
                  className="flex items-center gap-4 px-3 py-2 rounded-full hover:bg-primary-400 transition cursor-pointer select-none w-full"
                  onClick={() => setMostrarFavoritos(e => !e)}
                >
                  <i className="bx bx-star text-2xl dark:text-gray-200 text-dark-900"></i>
                  <span className="dark:text-gray-200 text-dark-900 text-sm font-medium">Favoritos</span>
                  <FontAwesomeIcon icon={mostrarFavoritos ? faChevronDown : faChevronRight} className="ml-auto w-[10px] h-[10px] text-dark-700" />
                </button>
                {mostrarFavoritos && (
                  <div className="max-h-72 overflow-y-auto px-1 mb-2 custom-scrollbar">
                    {empresasFavoritadas.map((e, i) => (
                      <AnimatedItem key={e.id} index={i} delay={i * 0.03}>
                        <div className="flex items-center gap-2 p-1.5 mb-1.5 bg-white/80 dark:bg-dark-600/90 backdrop-blur-sm rounded-xl transition-all duration-200 border border-gray-100 dark:border-gray-700 hover:border-primary-300/50 hover:shadow-xs hover:shadow-primary-100/50 dark:hover:border-primary-500/30">
                          <img src={e.foto === 'genPfp.png' ? genPfp : e.foto} alt={e.nome_fant} className="w-7 h-7 rounded-full object-cover border-2 border-white dark:border-dark-700 shadow-sm" />
                          <div className="flex-1 min-w-[80px]">
                            <p className="font-semibold text-dark-700 dark:text-light-100 text-xs truncate tracking-tight">{e.nome_fant}</p>
                            <p className="text-xs text-dark-500 dark:text-dark-200 truncate mt-0.5">{e.setor}</p>
                          </div>
                          <div className="flex items-center gap-0.5 ml-auto">
                            <button onClick={() => handleAlterarStatusFavorito(true, e)} className="p-0.5 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-full transition-all duration-200"><FontAwesomeIcon icon={faStar} className="text-sm" /></button>
                            <button onClick={() => navigate(`/chats?id=${e.id}`)} className="p-0.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-full transition-all duration-200"><FontAwesomeIcon icon={faComment} className="text-sm" /></button>
                          </div>
                        </div>
                      </AnimatedItem>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </aside>
        </div>
        ) : (
          <aside
            className={`
            fixed top-14 left-0 h-screen z-40 bg-white dark:bg-dark-600
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'w-64' : 'w-16'}
            overflow-hidden
          `}
          >
            <nav className="sidebar-itens flex flex-col gap-3 px-2 py-4">
              <button
                className="flex items-center gap-4 px-3 py-2 rounded-full hover:bg-primary-400 transition w-full"
                onClick={handleInicioBtn}
              >
                <i className="bx bx-home text-2xl dark:text-gray-200 text-dark-900 flex-shrink-0"></i>
                {isSidebarOpen && <span className="dark:text-gray-200 text-dark-900 text-sm font-medium truncate">Início</span>}
              </button>

              <Link to="/chats" className="flex items-center gap-4 px-3 py-2 rounded-full hover:bg-primary-400 transition w-full">
                <i className="bx bx-message-rounded text-2xl dark:text-gray-200 text-dark-900 flex-shrink-0"></i>
                {isSidebarOpen && <span className="dark:text-gray-200 text-dark-900 text-sm font-medium truncate">Chats</span>}
              </Link>

              <Link to="/" className="flex items-center gap-4 px-3 py-2 rounded-full hover:bg-primary-400 transition w-full">
                <i className="bx bx-group text-2xl dark:text-gray-200 text-dark-900 flex-shrink-0"></i>
                {isSidebarOpen && <span className="dark:text-gray-200 text-dark-900 text-sm font-medium truncate">Fórum</span>}
              </Link>

              <div className="relative w-full">
                <button
                  className="flex items-center gap-4 px-3 py-2 rounded-full hover:bg-primary-400 transition cursor-pointer select-none w-full"
                  onClick={() => {
                    if (isSidebarOpen) setMostrarFavoritos(e => !e);
                    else {
                      setIsSidebarOpen(true);
                      setMostrarFavoritos(true);
                    }
                  }}
                >
                  <i className="bx bx-star text-2xl dark:text-gray-200 text-dark-900 flex-shrink-0"></i>
                  {isSidebarOpen && (
                    <>
                      <span className="dark:text-gray-200 text-dark-900 text-sm font-medium truncate">Favoritos</span>
                      <FontAwesomeIcon icon={mostrarFavoritos ? faChevronDown : faChevronRight} className="ml-auto w-[10px] h-[10px] text-dark-700" />
                    </>
                  )}
                </button>

                {/* Favoritos em modo colapsado (ícones) */}
                {!isSidebarOpen && empresasFavoritadas.length > 0 && (
                  <div className="absolute left-1.5 top-full mt-2 flex flex-col gap-2 z-40">
                    {empresasFavoritadas.slice(0, 6).map((fav) => (
                      <button
                        key={fav.id}
                        onClick={() => navigate(`/empresa/${fav.id}`)}
                        title={fav.nome_fant}
                        className="w-8 h-8 rounded-full overflow-hidden border-2 border-white dark:border-dark-700 shadow-sm bg-white flex items-center justify-center"
                      >
                        <img src={fav.foto === "genPfp.png" ? genPfp : fav.foto} alt={fav.nome_fant} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Lista de favoritos expandida */}
              {mostrarFavoritos && isSidebarOpen && (
                <div className="max-h-72 overflow-y-auto px-1 mb-2 custom-scrollbar">
                  {empresasFavoritadas.map((e, i) => (
                    <AnimatedItem key={e.id} index={i} delay={i * 0.03}>
                      <div className="flex items-center gap-2 p-1.5 mb-1.5 bg-white/80 dark:bg-dark-600/90 backdrop-blur-sm rounded-xl transition-all duration-200 border border-gray-100 dark:border-gray-700 hover:border-primary-300/50 hover:shadow-xs hover:shadow-primary-100/50 dark:hover:border-primary-500/30">
                        <img src={e.foto === 'genPfp.png' ? genPfp : e.foto} alt={e.nome_fant} className="w-7 h-7 rounded-full object-cover border-2 border-white dark:border-dark-700 shadow-sm" />
                        <div className="flex-1 min-w-[80px]">
                          <p className="font-semibold text-dark-700 dark:text-light-100 text-xs truncate tracking-tight">{e.nome_fant}</p>
                          <p className="text-xs text-dark-500 dark:text-dark-200 truncate mt-0.5">{e.setor}</p>
                        </div>
                        <div className="flex items-center gap-0.5 ml-auto">
                          <button onClick={() => handleAlterarStatusFavorito(true, e)} className="p-0.5 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-full transition-all duration-200"><FontAwesomeIcon icon={faStar} className="text-sm" /></button>
                          <button onClick={() => navigate(`/chats?id=${e.id}`)} className="p-0.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-full transition-all duration-200"><FontAwesomeIcon icon={faComment} className="text-sm" /></button>
                        </div>
                      </div>
                    </AnimatedItem>
                  ))}
                </div>
              )}
            </nav>
          </aside>
        )}

        {/* ===== HEADER PRINCIPAL ===== */}
        <header
          ref={headerRef}
          className={`
    fixed top-0 left-0 right-0 z-50
    bg-white dark:bg-dark-600
    flex flex-col
    transition-all duration-300
  `}
        >
          <div className="flex items-center justify-between px-2 sm:px-4 h-14">
            {/* Lado esquerdo: menu, logo e botão voltar */}
            <div className="flex items-center gap-1 sm:gap-4">
              <button
                className="bx bx-menu text-2xl sm:text-3xl text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              />
              <button className="flex items-center gap-1" onClick={handleInicioBtn}>
                <img src={logo} alt="Logo" className="h-8 sm:h-10 w-auto" />
                <span className="hidden sm:inline font-black text-lg sm:text-xl text-gray-800 dark:text-white">
                  Empre<span className="text-twitch-purple">Go</span>
                </span>
              </button>
              {searchData.active && (
                <button
                  onClick={() => {
                    clearSearchData();
                    window.scrollTo(0, 0);
                  }}
                  className="group flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium transition-all duration-200
            bg-gradient-to-r from-twitch-purple to-purple-600 dark:from-twitch-purple dark:to-purple-700
            text-white
            hover:from-twitch-lightpurple hover:to-purple-500 dark:hover:from-twitch-lightpurple dark:hover:to-purple-600
            hover:scale-105 active:scale-95
            shadow hover:shadow-md
            border border-purple-500 dark:border-purple-600"
                >
                  <i className="bx bx-arrow-back text-xs sm:text-sm transition-transform group-hover:-translate-x-0.5"></i>
                  <span className="whitespace-nowrap hidden xs:inline">Voltar</span>
                </button>
              )}
            </div>

            {/* Barra de pesquisa - ocupa espaço flexível */}
            <div className="flex-1 flex justify-center px-1 sm:px-4 max-w-[60%] sm:max-w-none">
              <div className="search-bar flex items-center w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl bg-white dark:bg-twitch-gray rounded-full overflow-hidden border border-gray-300 dark:border-gray-700">
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 bg-transparent outline-none text-xs sm:text-sm text-gray-800 dark:text-white min-w-0"
                  value={buscaPesquisa}
                  onChange={(e) => setBuscaPesquisa(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (buscaPesquisa.trim() === "") return;
                      searchButtonRef.current?.click();
                    }
                  }}
                />
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="px-2 sm:px-3 flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faSliders} className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800 dark:text-white" />
                </button>
                <button
                  className="bg-twitch-purple text-white px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-center hover:bg-twitch-lightpurple transition"
                  onClick={handleSearch}
                  ref={searchButtonRef}
                >
                  <img src={lupa} className="w-4 h-4 sm:w-5 sm:h-5 filter brightness-0 invert" />
                </button>
              </div>
            </div>

            {/* Lado direito: notificações e perfil */}
            <div className="flex items-center gap-1 sm:gap-2">
              <div className='flex justify-center'>
                <SinoNotificacoes />
              </div>
              <div className="relative" ref={profileRef}>
                <div
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center cursor-pointer p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <img
                    src={usuario.foto === 'genPfp.png' ? genPfp : usuario.foto}
                    alt="Foto"
                    className="w-7 h-7 sm:w-9 sm:h-9 rounded-full object-cover"
                  />
                </div>
                <div
                  className={`absolute top-12 right-0 w-48 sm:w-60 bg-white dark:bg-twitch-gray text-gray-800 dark:text-white rounded-lg shadow-xl border border-gray-300 dark:border-gray-700 p-2 flex flex-col z-[999] ${!isProfileOpen ? "hidden" : ""
                    }`}
                >
                  <div className="p-3">
                    <p className="font-bold text-sm sm:text-base truncate">{usuario.nome}</p>
                    <Link to="/perfil/candidato" className="text-twitch-purple text-xs sm:text-sm">
                      Acessar perfil
                    </Link>
                  </div>
                  <hr className="border-gray-300 dark:border-gray-700" />
                  <Link
                    to={`/perfil/${usuario.tipo}/editar`}
                    className="bg-transparent border-none text-left p-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    Editar perfil
                  </Link>
                  <button
                    className="bg-transparent border-none text-left p-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    onClick={() => logout()}
                  >
                    Sair
                  </button>
                  <hr className="border-gray-300 dark:border-gray-700" />
                  <Link
                    to="/chats"
                    className="bg-transparent border-none text-left p-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    Chats
                  </Link>
                  <hr className="border-gray-300 dark:border-gray-700" />
                  <Link
                    to="/"
                    className="bg-transparent border-none text-left p-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    Configurações
                  </Link>
                  <ThemeTogleConfig />
                  <Link
                    to="/suporte"
                    className="bg-transparent border-none text-left p-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    Ajuda
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros recomendados - apenas quando não está em busca */}
          {!searchData.active && (
            <div
              className={`
        recommended-filters-wrapper relative flex gap-2 sm:gap-6 overflow-x-auto scrollbar-hide
        pl-16 sm:pl-28 pr-8 sm:pr-6 py-2 transition-all duration-300
        ${isSidebarOpen ? "ml-[4rem] sm:ml-[8rem]" : "ml-0"}
      `}
            >
              <button
                onClick={() => scrollFiltros("left")}
                className="absolute left-10 sm:left-24 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-8 sm:h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 hover:scale-110 transition"
              >
                <i className="bx bx-chevron-left text-lg sm:text-xl"></i>
              </button>

              <div
                ref={filtrosContainerRef}
                className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide px-6 sm:px-8 py-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <button
                  ref={homeCategoriaRef}
                  className={`
            text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium
            whitespace-nowrap transition-all hover:scale-105 flex-shrink-0
            ${filtroAtual.name === 'Tudo' ? 'bg-primary-500 hover:bg-primary-700' : 'bg-dark-500 hover:bg-dark-400'}
          `}
                  onClick={() => {
                    setFiltroAtual({ empresas: [], limit: false, loading: false, loadingMore: false, name: 'Tudo', page: 1 });
                    window.scrollTo(0, 0);
                  }}
                >
                  Tudo
                </button>
                {filtrosRecomendados.map((f) => (
                  <button
                    key={f.id}
                    className={`
              text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium
              whitespace-nowrap transition-all hover:scale-105 flex-shrink-0
              ${filtroAtual.name === f.categoria ? 'bg-primary-500 hover:bg-primary-700' : 'bg-dark-500 hover:bg-dark-400'}
            `}
                    onClick={() => {
                      if (filtroAtual.name === f.categoria) return;
                      setFiltroAtual({ empresas: [], limit: false, loading: false, loadingMore: false, name: f.categoria, page: 1 });
                      window.scrollTo(0, 0);
                    }}
                  >
                    {f.nome}
                  </button>
                ))}
              </div>

              <button
                onClick={() => scrollFiltros("right")}
                className="absolute right-2 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-8 sm:h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 hover:scale-110 transition"
              >
                <i className="bx bx-chevron-right text-lg sm:text-xl"></i>
              </button>
            </div>
          )}

          {/* Filter dropdown responsivo */}
          {isFilterOpen && (
            <div
              ref={filterRef}
              className={`
        filter-container absolute top-14 right-2 sm:right-4 md:right-64
        w-[calc(100vw-2rem)] sm:w-80 md:w-72
        max-w-sm bg-white dark:bg-twitch-gray p-4 rounded-xl shadow-xl border border-gray-300 dark:border-gray-700 z-50
        ${isFilterOpen ? "open" : "closed"}
      `}
            >
              {/* SETOR */}
              <div className="filter-category">
                <button
                  className="filter-category-header flex justify-between w-full mb-1 dark:bg-twitch-gray bg-white"
                  onClick={() => setOpenCategory(openCategory === "setor" ? null : "setor")}
                >
                  <span className="text-twitch-gray dark:text-dark-300 text-sm font-medium">Setor</span>
                  <i className="bx bx-chevron-down text-twitch-gray dark:text-dark-300"></i>
                </button>
                {openCategory === "setor" && (
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto mb-3 pr-2 p-1 custom-scrollbar">
                    {setoresFilter.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleChip("setor", s)}
                        className={`filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none
                  ${filters.setor.includes(s) ? "bg-twitch-purple text-white" : "bg-dark-500 text-white/80"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ESTADO */}
              <div className="filter-category">
                <button
                  className="filter-category-header flex justify-between w-full mb-1 dark:bg-twitch-gray bg-white"
                  onClick={() => setOpenCategory(openCategory === "estado" ? null : "estado")}
                >
                  <span className="text-sm font-medium text-twitch-gray dark:text-dark-300">Estado</span>
                  <i className="bx bx-chevron-down text-twitch-gray dark:text-dark-300"></i>
                </button>
                {openCategory === "estado" && (
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto mb-3 pr-2 p-1 custom-scrollbar">
                    {estadosFilter.map(uf => (
                      <button
                        key={uf}
                        onClick={() => toggleChip("estado", uf)}
                        className={`filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none
                  ${filters.estado.includes(uf) ? "bg-twitch-purple text-white" : "bg-dark-500 text-white/80"}`}
                      >
                        {formatarEstado(uf)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* PORTE */}
              <div className="filter-category">
                <button
                  className="filter-category-header flex justify-between w-full mb-1 dark:bg-twitch-gray bg-white"
                  onClick={() => setOpenCategory(openCategory === "porte" ? null : "porte")}
                >
                  <span className="text-twitch-gray dark:text-dark-300 text-sm font-medium">Porte</span>
                  <i className="bx bx-chevron-down text-twitch-gray dark:text-dark-300"></i>
                </button>
                {openCategory === "porte" && (
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto mb-3 pr-2 p-1 custom-scrollbar">
                    {portesFilter.map(p => (
                      <button
                        key={p}
                        onClick={() => toggleChip("porte", p)}
                        className={`filter-chip px-2.5 py-1 rounded-full text-xs transition-colors select-none
                  ${filters.porte.includes(p) ? "bg-twitch-purple text-white" : "bg-dark-500 text-white/80"}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* AÇÕES */}
              <div className="filter-actions flex justify-between gap-2 mt-3">
                <button
                  onClick={confirmFilters}
                  className="bg-dark-500 text-white btn-primary px-3 py-1.5 text-xs rounded hover:bg-primary-500 flex-1"
                >
                  Confirmar filtros
                </button>
                <button
                  onClick={clearFilters}
                  className="bg-gray-600 text-white btn-primary px-3 py-1.5 text-xs rounded hover:bg-gray-800 flex-1"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          )}
        </header>

        <main
          className={`
    main-content
    flex-grow overflow-y-auto flex flex-col items-center
    w-full
    px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12
    mt-14
    pt-4 sm:pt-6 lg:pt-8
    transition-all duration-300 ease-in-out
    ${isSidebarOpen ? 'md:pl-64' : ''}
    custom-scrollbar
  `}
        >
          {filtroAtual.name !== 'Tudo' ? (
            /* Seção de categoria específica (filtro ativo) */
            <section className="empresas-section w-full min-h-screen pt-14">
              <div className={`categoria-empresas transition-all duration-300 ${isSidebarOpen ? 'mt-16 md:mt-20' : 'mt-4'}`}>
                {filtroAtual.empresas.length > 0 ? (
                  <>
                    {/* Grid de cards - número de colunas aumenta em telas muito grandes */}
                    <div className="
              empresas-grid
              grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5
              gap-4 sm:gap-5 lg:gap-6
              w-full
            ">
                      {filtroAtual.empresas.map((empresa) => (
                        <EmpresaCard
                          key={empresa.id}
                          logo={empresa.logo}
                          nome={empresa.nome}
                          descricao={empresa.descricao}
                          favoritada={empresa.favoritada}
                          tags={empresa.tags}
                          onClickFavorito={() => handleAlterarStatusFavorito(empresa.favoritada, { id: empresa.id, foto: empresa.logo, nome_fant: empresa.nome, setor: empresa.setor })}
                          onClickVerMais={() => navigate(`/empresa/${empresa.id}`)}
                          setor={empresa.setor}
                          estado={empresa.estado}
                          banner={empresa.banner}
                        />
                      ))}
                    </div>

                    {/* Loader para carregar mais empresas */}
                    {filtroAtual.loadingMore && (
                      <div className="flex justify-center items-center py-8 sm:py-10 lg:py-12">
                        <div className="flex flex-col items-center gap-3 sm:gap-4">
                          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-twitch-purple"></div>
                          <p className="text-xs sm:text-sm text-gray-400">
                            Carregando mais empresas...
                          </p>
                        </div>
                      </div>
                    )}
                    {!searchData.active && (
                      <div
                        className={`recommended-filters-wrapper relative flex gap-6 overflow-x-auto scrollbar-hide pl-28 pr-6 py-2 transition-all duration-300
                            ${isSidebarOpen ? "ml-[8rem]" : "ml-0"}`}>
                        <button onClick={() => scrollFiltros("left")} className="absolute left-24 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white  hover:bg-black/80 hover:scale-110 transition">
                          <i className="bx bx-chevron-left text-xl"></i>
                        </button>

                        <div
                          ref={filtrosContainerRef}
                          className="flex gap-3 overflow-x-auto scrollbar-hide px-8 py-2"
                          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                          <button ref={homeCategoriaRef} className={`text-white px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all hover:scale-105 flex-shrink-0 ${filtroAtual.name === 'Tudo' ? 'bg-primary-500 hover:bg-primary-700' : 'bg-dark-500 hover:bg-dark-400'}`}
                            onClick={() => {
                              setFiltroAtual({ empresas: [], limit: false, loading: false, loadingMore: false, name: 'Tudo', page: 1 })
                              window.scrollTo(0, 0);
                            }} disabled={filtroAtual.loading}>
                            Tudo
                          </button>
                          {filtrosRecomendados.map((f) => (
                            <button key={f.id} className={`text-white px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all hover:scale-105 flex-shrink-0 ${filtroAtual.name === f.categoria ? 'bg-primary-500 hover:bg-primary-700' : 'bg-dark-500 hover:bg-dark-400'}`}
                              onClick={() => {
                                if (filtroAtual.name === f.categoria) return;
                                setFiltroAtual({ empresas: [], limit: false, loading: false, loadingMore: false, name: f.categoria, page: 1 })
                                window.scrollTo(0, 0);
                              }} disabled={filtroAtual.loading}>
                              {f.nome}
                            </button>
                          ))}
                        </div>

                        <button onClick={() => scrollFiltros("right")} className="absolute right-2 top-1/2 -translate-y-1/2 z-20  w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white  hover:bg-black/80 hover:scale-110 transition">
                          <i className="bx bx-chevron-right text-xl"></i>
                        </button>
                      </div>
                      // </div>
                    )}

                {/* Mensagem de fim dos resultados */}
                {filtroAtual.limit && (
                  <div className="text-center py-6 sm:py-8">
                    <p className="text-xs sm:text-sm text-gray-500">Não há mais resultados.</p>
                  </div>
                )}
              </>
              ) : (
              /* Estado vazio ou carregando */
              <div className="text-center py-10 sm:py-12">
                {filtroAtual.loading ? (
                  <div className="flex flex-col items-center gap-3 sm:gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-twitch-purple"></div>
                    <p className="text-xs sm:text-sm text-gray-400">Carregando empresas...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 sm:gap-4">
                    <i className="bx bx-search text-3xl sm:text-4xl text-gray-400"></i>
                    <p className="text-sm sm:text-base text-gray-500">Nenhuma empresa encontrada.</p>
                  </div>
                )}
              </div>
                )}
            </div>
            </section>
        ) : !searchData.active && filtroAtual.name === 'Tudo' ? (
        /* Conteúdo padrão (home) */
        <>
          {/* Slider de depoimentos responsivo */}
          <Slider
            slides={slides}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            threeContainerRef={threeContainerRef}
            slidesContainerRef={slidesContainerRef}
          />

          {/* Seções de empresas por categoria */}
          <section className="empresas-section w-full">
            {Object.entries(empresasPorCategoria).map(([categoria, obj]) => {
              const empresasParaMostrar = obj.recolher ? obj.empresasRecolhidas() : obj.empresas;
              const recolher = obj.recolher;

              return (
                <div key={categoria} className="categoria-empresas mb-8 sm:mb-10 lg:mb-12">
                  <h2 className="categoria-label text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-5 lg:mb-6 dark:text-gray-200 text-dark-900 border-b border-gray-600 pb-2">
                    {categoria}
                  </h2>

                  <div className="
                empresas-grid
                grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5
                gap-4 sm:gap-5 lg:gap-6
                w-full
              ">
                    {empresasParaMostrar.map(empresa => (
                      <EmpresaCard
                        key={empresa.id}
                        logo={empresa.logo}
                        nome={empresa.nome}
                        descricao={empresa.descricao}
                        tags={empresa.tags}
                        favoritada={empresa.favoritada}
                        onClickFavorito={() => handleAlterarStatusFavorito(empresa.favoritada, { id: empresa.id, foto: empresa.logo, nome_fant: empresa.nome, setor: empresa.setor })}
                        onClickVerMais={() => navigate(`/empresa/${empresa.id}`)}
                        setor={empresa.setor}
                        estado={empresa.estado}
                        banner={empresa.banner}
                      />
                    ))}
                  </div>

                  <div className="flex justify-center gap-4 mt-4 sm:mt-5 lg:mt-6">
                    <button
                      onClick={() => {
                        setEmpresasPorCategoria({
                          ...empresasPorCategoria,
                          [categoria]: {
                            ...empresasPorCategoria[categoria],
                            recolher: !recolher,
                          },
                        });
                      }}
                      className="ver-mais-btn flex items-center gap-1 sm:gap-2 hover:bg-dark-600 text-dark-900 dark:text-twitch-purple hover:text-white dark:hover:text-white transition-colors font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg border border-dark-900 hover:border-dark-500 dark:border-twitch-purple dark:hover:border-twitch-lightpurple dark:hover:bg-twitch-purple text-sm sm:text-base"
                    >
                      {recolher ? 'Exibir' : 'Recolher'}
                      <i className={`bx bx-chevron-${recolher ? 'down' : 'up'} text-lg sm:text-xl`} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Seção "Mais Empresas" (sem label) */}
            <div className="categoria-empresas mb-8 sm:mb-10 lg:mb-12">
              <h2 className="categoria-label text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-5 lg:mb-6 dark:text-gray-200 text-dark-900 border-b border-gray-600 pb-2">
                Mais Empresas
              </h2>

              <div className="
            empresas-grid
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5
            gap-4 sm:gap-5 lg:gap-6
            w-full
          ">
                {empresasSemLabel.map((empresa) => (
                  <EmpresaCard
                    key={empresa.id}
                    logo={empresa.logo}
                    nome={empresa.nome}
                    descricao={empresa.descricao}
                    favoritada={empresa.favoritada}
                    tags={empresa.tags}
                    onClickFavorito={() => handleAlterarStatusFavorito(empresa.favoritada, { id: empresa.id, foto: empresa.logo, nome_fant: empresa.nome, setor: empresa.setor })}
                    onClickVerMais={() => navigate(`/empresa/${empresa.id}`)}
                    setor={empresa.setor}
                    estado={empresa.estado}
                    banner={empresa.banner}
                  />
                ))}
              </div>

              {carregando && (
                <div className="flex justify-center items-center py-8 sm:py-10 lg:py-12">
                  <div className="flex flex-col items-center gap-3 sm:gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-twitch-purple"></div>
                    <p className="text-xs sm:text-sm text-gray-400">Carregando mais empresas...</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
        ) : (
        /* Seção de resultados de busca */
        <section className="empresas-section w-full min-h-screen pt-14">
          <div className={`categoria-empresas transition-all duration-300 ${isSidebarOpen ? 'mt-16 md:mt-20' : 'mt-4'
            }`}>
            {searchData.empresas.length > 0 ? (
              <>
                <div className="
              empresas-grid
              grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5
              gap-4 sm:gap-5 lg:gap-6
              w-full
            ">
                  {searchData.empresas.map((empresa) => (
                    <EmpresaCard
                      key={empresa.id}
                      logo={empresa.logo}
                      nome={empresa.nome}
                      descricao={empresa.descricao}
                      favoritada={empresa.favoritada}
                      tags={empresa.tags}
                      onClickFavorito={() => handleAlterarStatusFavorito(empresa.favoritada, { id: empresa.id, foto: empresa.logo, nome_fant: empresa.nome, setor: empresa.setor })}
                      onClickVerMais={() => navigate(`/empresa/${empresa.id}`)}
                      setor={empresa.setor}
                      estado={empresa.estado}
                      banner={empresa.banner}
                    />
                  ))}
                </div>

                {/* Loader more */}
                {searchData.loadingMore && (
                  <div className="flex justify-center items-center py-8 sm:py-10 lg:py-12">
                    <div className="flex flex-col items-center gap-3 sm:gap-4">
                      <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-twitch-purple"></div>
                      <p className="text-xs sm:text-sm text-gray-400">Carregando mais empresas...</p>
                    </div>
                  </div>
                )}

                {/* Fim dos resultados */}
                {searchData.limit && searchData.empresas.length > 0 && (
                  <div className="text-center py-6 sm:py-8">
                    <p className="text-xs sm:text-sm text-gray-500">Não há mais resultados.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10 sm:py-12">
                {searchData.loading ? (
                  <div className="flex flex-col items-center gap-3 sm:gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-twitch-purple"></div>
                    <p className="text-xs sm:text-sm text-gray-400">Carregando empresas...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 sm:gap-4">
                    <i className="bx bx-search text-3xl sm:text-4xl text-gray-400"></i>
                    <p className="text-sm sm:text-base text-gray-500">Nenhuma empresa encontrada.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
          )}
      </main>
    </div >
    </>
  );
};

export default Main;