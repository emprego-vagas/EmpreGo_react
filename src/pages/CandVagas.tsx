import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import JoaoAzevedo from './../assets/imgs/JoaoAzevedo.jpeg';
import { Link, useNavigate } from 'react-router-dom';
import { DadosUsuario, logout, mostrarAvisoTopo } from '../utils/globalFunctions';
import axiosWe from '../utils/axiosInstance';
import genPfp from '../assets/imgs/genPfp.png';
import Loader from '../components/Loader';
import ThemeTogleConfig from '../components/ThemeTogleConfig';
import logo from './../assets/imgs/BIGSlogo.png';
import lupa from './../assets/imgs/lupa.png';
import '../css/filtragem.css';
import SinoNotificacoes from '../components/SinoNotificacoes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faComment, faSliders } from '@fortawesome/free-solid-svg-icons';

// interfaces
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
}

interface Empresa {
    id: string;
    logo: string;
    nome: string;
    descricao: string;
    setor: string;
    favoritada: boolean;
    tags: string[];
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

// Interfaces do Header
interface FiltroRecomendado {
    id: number;
    nome: string;
    categoria: string;
}

// Filtros recomendados
const filtrosRecomendados: FiltroRecomendado[] = [
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
];

// Constantes do Filtro
const setoresFilter = ["Alimentício", "Varejo", "Turismo", "Energia", "Agronegócio", "Saúde"];
const portesFilter = ["Pequeno", "Médio", "Grande"];
const estadosFilter = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
    "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const EmpresaCard: React.FC<EmpresaCardProps> = ({ logo, nome, descricao, tags, onClickFavorito, onClickVerMais, favoritada }) => {
    const [favorito, setFavorito] = useState(favoritada);

    const handleFavorito = () => {
        if (onClickFavorito) onClickFavorito();
    };

    useEffect(() => {
        setFavorito(favoritada);
    }, [favoritada]);

    return (
        <article
            className={"empresa-card bg-gray-200 dark:bg-twitch-gray rounded-lg overflow-hidden shadow-md transition-all relative border border-gray-700 h-full flex flex-col hover:-translate-y-1 hover:shadow-lg hover:border-twitch-purple min-h-[380px]"}>
            <div className="card-header relative h-40 bg-gray-800 flex items-center justify-center overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-br before:from-twitch-purple/30 before:to-transparent">
                <img src={logo} alt={nome} className="empresa-logo w-28 h-28 rounded-full object-cover border-4 border-gray-800 bg-white shadow-md z-10 transition-transform" />

                <button onClick={handleFavorito} className="favorite-btn absolute top-3 right-3 bg-black/40 border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-gray-300 transition-all z-20 backdrop-blur-sm hover:bg-black/60 hover:scale-110">
                    <i className={favorito ? 'bx bxs-star text-xl text-yellow-400' : 'bx bx-star text-xl'} />
                </button>
            </div>

            <div className="card-body p-6 flex-1">
                <h3 className="empresa-nome text-xl font-semibold mb-3 dark:text-gray-200 text-twitch-gray">{nome}</h3>
                <p className="empresa-descricao dark:text-gray-400 text-twitch-gray text-sm mb-4 line-clamp-3 leading-relaxed ">{descricao}</p>
            </div>

            <div className="card-footer flex justify-between items-center p-5 border-t border-gray-700 bg-black/10 flex-wrap gap-2">
                <div className="card-meta flex items-center gap-2 flex-1 min-w-[150px]">
                    <div className="tag-chips flex flex-wrap gap-1">
                        {tags.map((tag, index) => (
                            <span key={index} className="tag-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer transition-all bg-gray-700 hover:bg-twitch-purple">{tag}</span>
                        ))}
                    </div>
                </div>

                <button onClick={onClickVerMais} className="ver-mais-btn bg-twitch-purple btn-primary text-white border-none px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all hover:bg-twitch-lightpurple hover:-translate-y-0.5 hover:shadow">Ver mais</button>
            </div>
        </article>
    );
};

// main componentes
const Main: React.FC = () => {
    const navigate = useNavigate();
    const [usuario] = useState(DadosUsuario.getUsuario(true, 'candidato'));
    if (!usuario) {
        setTimeout(() => {
            navigate('/')
        }, 3000)
    };

    const [carregandoDados, setCarregandoDados] = useState(true);
    const [palavrasBusca, setPalavrasBusca] = useState<string[]>([]);

    const palavrasBuscaRef = useRef<string[]>([]);

    useEffect(() => {
        palavrasBuscaRef.current = palavrasBusca;
    }, [palavrasBusca]);

    useEffect(() => {
        if (!usuario) return;
        async function carregarDados() {
            try {
                const response = await axiosWe('/custom/vizualizar-empresas');
                const data = response.data;
                console.log(data);
                console.log('Setores recomendados:', data.empresasRecomendadas.map(e => e.setor));

                console.log(data.palavrasPraBusca)
                setPalavrasBusca(data.palavrasPraBusca);
                palavrasBuscaRef.current = data.palavrasPraBusca;
                setEmpresasFavoritadas(data.empresasFavoritadas.map(e => e.empresas));

                const isFavoritada = (id: string) => {
                    return data.empresasFavoritadas.some((e) => e.empresas.id === id);
                };
                setEmpresasPorCategoria({
                    ["Empresas Recomendadas"]: {
                        pagina: 1,
                        chegouNoLimite: false,
                        recolher: true,
                        empresasRecolhidas() {
                            return this.empresas.slice(0, 3)
                        },
                        empresas: data.empresasRecomendadas.map(emp => ({
                            id: emp.id,
                            logo: emp.foto === '/assets/imgs/genPfp.png' ? genPfp : emp.foto,
                            nome: emp.nome_fant,
                            descricao: emp.descricao,
                            tags: emp.tags_empresas.map(t => t.nome),
                            setor: emp.setor,
                            favoritada: isFavoritada(emp.id),
                        }))
                    },
                    ["Empresas Recentes"]: {
                        pagina: 1,
                        chegouNoLimite: false,
                        recolher: true,
                        empresasRecolhidas() {
                            return this.empresas.slice(0, 3)
                        },
                        empresas: data.empresasRecentes.map(emp => ({
                            id: emp.id,
                            logo: emp.foto === '/assets/imgs/genPfp.png' ? genPfp : emp.foto,
                            nome: emp.nome_fant,
                            descricao: emp.descricao,
                            tags: emp.tags_empresas.map(t => t.nome),
                            setor: emp.setor,
                            favoritada: isFavoritada(emp.id),
                        }))
                    },
                    ["Empresas Principais"]: {
                        pagina: 1,
                        chegouNoLimite: false,
                        recolher: true,
                        empresasRecolhidas() {
                            return this.empresas.slice(0, 3)
                        },
                        empresas: data.empresasPrincipais.map(emp => ({
                            id: emp.id,
                            logo: emp.foto === '/assets/imgs/genPfp.png' ? genPfp : emp.foto,
                            nome: emp.nome_fant,
                            descricao: emp.descricao,
                            tags: emp.tags_empresas.map(t => t.nome),
                            setor: emp.setor,
                            favoritada: isFavoritada(emp.id),
                        }))
                    }
                })
                setEmpresasSemLabel(data.empresasSemLabel.map(emp => ({
                    id: emp.id,
                    logo: emp.foto === '/assets/imgs/genPfp.png' ? genPfp : emp.foto,
                    nome: emp.nome_fant,
                    descricao: emp.descricao,
                    setor: emp.setor,
                    favoritada: isFavoritada(emp.id),
                    tags: emp.tags_empresas.map(t => t.nome)
                })));
                setCarregandoDados(false);
            } catch (erro) {
                console.error("Erro ao carregar empresas:", erro)
            }

        }
        carregarDados();
    }, [usuario])

    // slider states 
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const prevIndexRef = useRef<number>(0);
    const sliderRef = useRef<HTMLDivElement>(null);
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
            background: JoaoAzevedo,
            fotoEmpresa: JoaoAzevedo
        },
        {
            empresa: "Global Innovations",
            titulo: "Profissionalismo Notável",
            texto: "Recomendo fortemente os serviços prestados. A equipe demonstrou um nível de profissionalismo raro no mercado, com atenção aos detalhes e prazos rigorosamente cumpridos. Uma parceria que certamente continuaremos no futuro.",
            autor: "Ana Beatriz Silva",
            data: "2 de Abril, 2023",
            background: JoaoAzevedo
        },
        {
            empresa: "Digital Ventures",
            titulo: "Resultados Exponenciais",
            texto: "Em menos de 6 meses, nossa presença online cresceu 300% graças ao trabalho meticuloso desta equipe. A abordagem estratégica e a capacidade de adaptação às necessidades do nosso setor foram impressionantes.",
            autor: "Ricardo Almeida",
            data: "22 de Maio, 2023",
            background: JoaoAzevedo
        },
        {
            empresa: "Future Labs",
            titulo: "Inovação Contínua",
            texto: "O que mais impressiona é a capacidade de inovar constantemente, trazendo soluções que não apenas resolvem problemas imediatos, mas preparam nossa empresa para os desafios futuros. Uma relação de confiança construída ao longo de anos.",
            autor: "Fernanda Oliveira",
            data: "10 de Junho, 2023",
            background: JoaoAzevedo
        }
    ];

    const [empresasPorCategoria, setEmpresasPorCategoria] = useState<EmpresasPorCategoria>({})
    const [semLabelPage, setSemLabelPage] = useState(1);

    const [empresasSemLabel, setEmpresasSemLabel] = useState([
        {
            id: '1',
            logo: JoaoAzevedo,
            nome: 'Alpha Tech',
            descricao: 'Soluções inovadoras em tecnologia e consultoria digital.',
            favoritada: false,
            setor: '',
            tags: ['Tecnologia', 'Inovação', 'Remoto']
        },
        {
            id: '2',
            logo: JoaoAzevedo,
            nome: 'Beta Systems',
            descricao: 'Desenvolvimento de sistemas corporativos personalizados.',
            favoritada: false,
            setor: '',
            tags: ['Sistemas', 'Corporate', 'Híbrido']
        },
    ]);
    const empresasSemLabelRef = useRef(null);
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
        }
        if (favoritada) {
            setEmpresasFavoritadas(prev => prev.filter(e => e.id !== empresa.id));
            atualizarStatus();
            try {
                await axiosWe.delete(`/favoritos/empresa/${empresa.id}`);
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
                    await axiosWe.post(`/favoritos/empresa`, {
                        id: empresa.id,
                    });
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
        if (empresasSemLabelRef.current.length % 9 !== 0 || carregandoRef.current) {
            return;
        }
        setCarregando(true);
        try {
            const response = await axiosWe.post(`/empresas/recommendedlow?page=${semLabelPage + 1}`, { palavras: palavrasBuscaRef.current });
            setSemLabelPage(prev => prev + 1);
            const novasEmpresas = response.data;
            const isFavoritada = (id: string) => {
                return empresasFavoritadas.some((e) => e.id === id);
            };
            setEmpresasSemLabel(prev =>
                [...prev, ...novasEmpresas.map(emp => ({
                    id: emp.id,
                    logo: emp.foto === '/assets/imgs/genPfp.png' ? genPfp : emp.foto,
                    nome: emp.nome_fant,
                    descricao: emp.descricao,
                    setor: emp.setor,
                    favoritada: isFavoritada(emp.id),
                    tags: emp.tags_empresas.map(t => t.nome)
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

    useEffect(() => {
        const handleScroll = () => {
            const atBottom =
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

            if (atBottom && !carregando) {
                carregarMaisEmpresas();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [carregando]);

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

    useEffect(() => {
        if (!slidesContainerRef.current) return;

        const slideElements = slidesContainerRef.current.children;

        const incomingIndex = currentSlide;
        const outgoingIndex = prevIndexRef.current;

        const incomingEl = slideElements[incomingIndex];
        const outgoingEl = slideElements[outgoingIndex];

        const fromX = direction === 'right' ? 100 : -100;
        const outToX = direction === 'right' ? -100 : 100;

        if (incomingEl) {
            gsap.set(incomingEl, { x: fromX, opacity: 0, zIndex: 2 });
            gsap.to(incomingEl, {
                x: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out'
            });

            try {
                const elems = (incomingEl as Element).querySelectorAll('.slide-content > *');
                if (elems && elems.length) {
                    gsap.fromTo(elems, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out' });
                }
            } catch (e) {
                console.error('Erro ao animar elementos internos do slide:', e);
            }
        }

        if (outgoingEl && outgoingIndex !== incomingIndex) {
            gsap.to(outgoingEl, {
                x: outToX,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.out',
                onComplete: () => gsap.set(outgoingEl, { zIndex: 1 })
            });
        }

        prevIndexRef.current = incomingIndex;

    }, [currentSlide, direction]);

    const nextSlide = () => {
        prevIndexRef.current = currentSlide;
        setDirection('right');
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        prevIndexRef.current = currentSlide;
        setDirection('left');
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

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

    // ===== FUNÇÕES E ESTADOS DO FILTRO =====

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

    if (carregandoDados) return (<Loader />)

    return (
        <>
            <div className={`app-wrapper ${isSidebarOpen ? 'sidebar-open' : ''} relative bg-white dark:bg-dark-600`}>
                {/* ===== HEADER SIDEBAR ===== */}
                <aside className={`sidebar-container fixed top-12 left-0 h-screen z-[999] bg-white dark:dark:bg-dark-600 flex flex-col pt-6 transition-all duration-300 ease-in-out
                    ${isSidebarOpen ? "open" : "closed"}`}>
                    <nav className="sidebar-itens flex flex-col gap-3 px-3">
                        <Link to="/" className="flex items-center gap-4 px-3 py-2 rounded-full hover:bg-gray-700 transition">
                            <i className="bx bx-home text-2xl dark:text-gray-200 text-dark-900"></i>
                            <span className="dark:text-gray-200 text-dark-900 text-sm font-medium">Início</span>
                        </Link>

                        <Link to="/chats" className="flex items-center gap-4 px-3 py-2 rounded-full hover:bg-gray-700 transition">
                            <i className="bx bx-message-rounded text-2xl dark:text-gray-200 text-dark-900"></i>
                            <span className="dark:text-gray-200 text-dark-900 text-sm font-medium whitespace-nowrap">
                                Chat Geral
                            </span>
                        </Link>

                        <Link to="/" className="flex items-center gap-4 px-3 py-2 rounded-full hover:bg-gray-700 transition">
                            <i className="bx bx-group text-2xl dark:text-gray-200 text-dark-900"></i>
                            <span className="dark:text-gray-200 text-dark-900 text-sm font-medium">Fórum</span>
                        </Link>

                        <a className="flex items-center gap-4 px-3 py-2 rounded-full hover:bg-gray-700 transition cursor-pointer select-none" onClick={() => setMostrarFavoritos(e => !e)}>
                            <i className="bx bx-star text-2xl dark:text-gray-200 text-dark-900"></i>
                            <span className="dark:text-gray-200 text-dark-900 text-sm font-medium">Favoritos</span>
                            <FontAwesomeIcon icon={(mostrarFavoritos ? faChevronDown : faChevronRight)} className='ml-auto w-[10px] h-[10px]' />
                        </a>
                        {(mostrarFavoritos && isSidebarOpen) && (
                            <div className="max-h-72 overflow-y-auto px-1 mb-2 scrollbar ">
                                {empresasFavoritadas.map(e => (
                                    <div
                                        key={e.id}
                                        className="flex items-center gap-2 p-1 mb-1 bg-light-100 dark:bg-dark-600 rounded-[13px] transition-colors duration-150 border border-gray-200"
                                    >
                                        {/* Avatar da empresa */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={e.foto === "/assets/imgs/genPfp.png" ? genPfp : e.foto}
                                                alt={e.nome_fant}
                                                className="w-7 h-7 rounded-full object-cover border border-gray-300"
                                            />
                                        </div>

                                        {/* Informações da empresa */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-dark-600 dark:text-light-100 text-xs truncate">
                                                {e.nome_fant}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {e.setor}
                                            </p>
                                        </div>

                                        {/* Ícones de ação */}
                                        <div className="flex items-center gap-2 ml-auto">
                                            <button
                                                onClick={() => handleAlterarStatusFavorito(true, e)}
                                                className="text-yellow-500 hover:text-yellow-800 transition-colors"
                                                aria-label="Desfavoritar"
                                            >
                                                <i className='bx bxs-star text-lg' />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/chats?id=${e.id}`)}
                                                className="text-gray-600 hover:text-primary-500 transition-colors "
                                                aria-label="Abrir chat"
                                            >
                                                <FontAwesomeIcon icon={faComment} className="text-base" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </nav>
                </aside>

                {/* ===== HEADER PRINCIPAL ===== */}
                <header ref={headerRef} className={`fixed top-0 left-0 right-0 bg-white dark:bg-dark-600 z-50 flex flex-col`}>
                    <div className="w-full flex items-center justify-between px-4 h-14">
                        <div className="flex items-center gap-4">
                            <button className="bx bx-menu text-3xl text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 w-10 h-10 flex items-center justify-center rounded-full transition" onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                            <Link to="/" className="flex items-center gap-1">
                                <img src={logo} alt="Logo" className="h-10 w-auto" />
                                <span className="font-black text-xl text-gray-800 dark:text-white">
                                    Empre<span className="text-twitch-purple">Go</span>
                                </span>
                            </Link>
                        </div>

                        <div className="flex flex-1 justify-center px-4">
                            <div className="search-bar flex items-center w-full max-w-2xl bg-white dark:bg-twitch-gray rounded-full overflow-hidden border border-gray-300 dark:border-gray-700">
                                <input type="text" placeholder="Pesquisar empresas..." className="flex-1 px-4 py-2 bg-transparent outline-none text-sm text-gray-800 dark:text-white" value={buscaPesquisa} onChange={(e) => setBuscaPesquisa(e.target.value)} />

                                <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="px-3 flex items-center justify-center">
                                    {/* <img src={filtro} className="w-6 h-6 filter brightness-0 invert" /> */}
                                    <FontAwesomeIcon icon={faSliders} className="w-5 h-5 text-gray-800 dark:text-white" />
                                </button>

                                <button className="bg-twitch-purple text-white px-4 py-2 flex items-center justify-center hover:bg-twitch-lightpurple transition">
                                    <img src={lupa} className="w-5 h-5 filter brightness-0 invert" />
                                </button>
                            </div>

                            {/* ===== FILTER DROPDOWN ===== */}
                            {isFilterOpen && (
                                <div
                                    ref={filterRef}
                                    className={`filter-container absolute top-14 right-64 bg-white dark:bg-twitch-gray p-4 rounded-xl shadow-xl border border-gray-300 dark:border-gray-700 w-72 z-50 ${isFilterOpen ? "open" : "closed"}`}>

                                    {/* SETOR */}
                                    <div className="filter-category">
                                        <button className="filter-category-header flex justify-between w-full mb-1 dark:bg-twitch-gray bg-white"
                                            onClick={() => setOpenCategory(openCategory === "setor" ? null : "setor")}>
                                            <span className="text-twitch-gray dark:text-dark-300 text-sm font-medium ">Setor</span>
                                            <i className="bx bx-chevron-down text-twitch-gray dark:text-dark-300"></i>
                                        </button>

                                        {openCategory === "setor" && (
                                            <div className=" flex flex-wrap gap-2 max-h-36 overflow-y-auto mb-3 pr-2 p-1 custom-scrollbar text-twitch-gray dark:text-dark-300">
                                                {setoresFilter.map(s => (
                                                    <button
                                                        key={s}
                                                        onClick={() => toggleChip("setor", s)}
                                                        className={`filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none
                                                            ${filters.setor.includes(s)
                                                                ? "bg-twitch-purple text-white"
                                                                : "bg-dark-500 text-white/80"
                                                            }`}>
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
                                            onClick={() => setOpenCategory(openCategory === "estado" ? null : "estado")}>
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
                                                            ${filters.estado.includes(uf)
                                                                ? "bg-twitch-purple text-white"
                                                                : "bg-dark-500 text-white/80"
                                                            }
                                                        `}>
                                                        {uf}
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
                                            <div className=" flex flex-wrap gap-2 max-h-36 overflow-y-auto mb-3 pr-2 p-1 custom-scrollbar">
                                                {portesFilter.map(p => (
                                                    <button
                                                        key={p}
                                                        onClick={() => toggleChip("porte", p)}
                                                        className={`filter-chip px-2.5 py-1 rounded-full text-xs 
                                                            transition-colors select-none 
                                                            ${filters.porte.includes(p)
                                                                ? "bg-twitch-purple text-white"
                                                                : "bg-dark-500 text-white/80"
                                                            }`}>
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
                                            className="bg-dark-500  text-white btn-primary px-3 py-1.5 text-xs rounded hover:bg-primary-500 flex-1">
                                            Confirmar filtros
                                        </button>

                                        <button
                                            onClick={clearFilters}
                                            className="bg-gray-600 text-white btn-primary px-3 py-1.5 text-xs rounded hover:bg-gray-800 flex-1">
                                            Limpar filtros
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>

                        <div className='flex mt-1 justify-center px-2'>
                            <SinoNotificacoes />
                        </div>

                        {/* Profile */}
                        <div className="relative " ref={profileRef}>

                            <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 cursor-pointer px-1 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ">
                                <img src={usuario.foto === '/assets/imgs/genPfp.png' ? genPfp : usuario.foto} alt="Foto" className="w-9 h-9 rounded-full object-cover" />
                            </div>

                            {isProfileOpen && (
                                <div className="absolute top-14 right-0 w-60 bg-white dark:bg-twitch-gray text-gray-800 dark:text-white rounded-lg shadow-xl border border-gray-300 dark:border-gray-700 p-2 flex flex-col z-[999]">
                                    <div className="p-3">
                                        <p className="font-bold">{usuario.nome}</p>
                                        <Link to="/perfil/candidato" className="text-twitch-purple text-sm">
                                            Acessar perfil
                                        </Link>
                                    </div>

                                    <hr className="border-gray-300 dark:border-gray-700" />

                                    <Link to={`/perfil/${usuario.tipo}/editar`} className="bg-transparent border-none text-left p-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Editar perfil</Link>
                                    <button className="bg-transparent border-none text-left p-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded" onClick={() => logout()}>Sair</button>

                                    <hr className="border-gray-300 dark:border-gray-700" />

                                    {/* <button className="text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Notificações</button> */}
                                    <Link to="/chats" className="bg-transparent border-none text-left p-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Chats</Link>

                                    {/* <hr className="border-gray-300 dark:border-gray-700" /> */}

                                    <Link to="/" className="bg-transparent border-none text-left p-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Configurações</Link>

                                    <ThemeTogleConfig />

                                    <Link to="/suporte" className="bg-transparent border-none text-left p-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Ajuda</Link>
                                </div>
                            )}
                        </div>
                    </div>

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
                            <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all  border border-gray-600 hover:border-gray-500 hover:scale-105 flex-shrink-0">
                                Tudo
                            </button>
                            {filtrosRecomendados.map((f) => (
                                <button key={f.id} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all  border border-gray-600 hover:border-gray-500 hover:scale-105 flex-shrink-0">
                                    {f.nome}
                                </button>
                            ))}
                        </div>

                        <button onClick={() => scrollFiltros("right")} className="absolute right-2 top-1/2 -translate-y-1/2 z-20  w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white  hover:bg-black/80 hover:scale-110 transition">
                            <i className="bx bx-chevron-right text-xl"></i>
                        </button>
                    </div>
                </header>

                <main className={`main-content ${isSidebarOpen ? "sidebar-open" : ""} flex-grow overflow-y-auto flex flex-col items-center w-full max-w-6xl mx-auto mt-14 pt-[80px]  `} >
                    <section ref={sliderRef} className="relative w-full max-w-6xl mx-auto my-8 px-4 rounded-xl overflow-hidden" aria-label="Recomendações de clientes">
                        <div ref={threeContainerRef} className="absolute inset-0 -z-10" />

                        {/* Slides */}
                        <div ref={slidesContainerRef} className="relative overflow-hidden w-full h-80 min-h-0">
                            {slides.map((slide, index) => (
                                <div
                                    key={index}
                                    style={
                                        slide.background
                                            ? { backgroundImage: `url(${slide.background})` }
                                            : undefined
                                    }
                                    className={`absolute inset-0 w-full h-full transition-opacity duration-300 bg-cover bg-center bg-no-repeat rounded-xl overflow-hidden ${index === currentSlide ? 'opacity-100 pointer-events-auto z-20' : 'opacity-0 pointer-events-none z-10'}`}>
                                    <div className="slide-content bg-zinc-900/80 backdrop-blur-sm p-8 rounded-xl h-full box-border flex flex-col justify-center overflow-hidden">
                                        <span className="slide-empresa text-sm uppercase tracking-[2px]  text-gray-400 mb-2 block">
                                            {slide.empresa}
                                        </span>

                                        <h3 className=" slide-titulo text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                                            {slide.titulo}
                                        </h3>

                                        <blockquote className="slide-texto text-lg md:text-xl text-gray-200 italic leading-relaxed mb-6 flex-grow">
                                            "{slide.texto}"
                                        </blockquote>

                                        <div className="slide-meta flex justify-between items-center text-sm text-gray-400">
                                            <div className="flex items-center gap-3">
                                                {slide.fotoEmpresa && (
                                                    <img
                                                        src={slide.fotoEmpresa}
                                                        alt={slide.empresa}
                                                        className="w-10 h-10 rounded-full object-cover shadow-md"
                                                    />
                                                )}
                                                <span className="slide-autor font-medium">{slide.autor}</span>
                                            </div>

                                            <span className="slide-data">{slide.data}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={prevSlide} aria-label="Slide anterior" className="swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-5 h-[315px] bg-black/50 rounded-lg flex items-center justify-center text-white transition-all group hover:bg-black/40 hover:[box-shadow:inset_120px_0_100px_rgba(000,000,000,0.8)]"> <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /> </svg>
                        </button>

                        <button onClick={nextSlide} aria-label="Próximo slide" className="swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-5 h-[315px] bg-black/50 rounded-full flex items-center justify-center text-white transition-all group hover:bg-black/40 hover:[box-shadow:inset_-120px_0_100px_rgba(000,000,000,0.8)]">
                            <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /> </svg>
                        </button>

                        <div className="swiper-pagination absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                            {slides.map((_, index) => (
                                <button key={index} onClick={() => goToSlide(index)} aria-label={`Ir para slide ${index + 1}`} className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300 
                            ${index === currentSlide ? 'bg-primary-100 scale-125 shadow-[0_0_6px_rgba(255,255,255,0.8)]' : 'bg-transparent hover:bg-primary-500'}`} />
                            ))}
                        </div>
                    </section>

                    <section className="empresas-section w-full px-5 py-6 mt-2">
                        {Object.entries(empresasPorCategoria).map(([categoria, obj]) => {
                            // const mostrarTodas = empresasExpandidas[categoria];
                            const empresasParaMostrar = obj.recolher ? obj.empresasRecolhidas() : obj.empresas;
                            const recolher = obj.recolher;

                            return (
                                <div key={categoria} className="categoria-empresas mb-12">
                                    <h2 className="categoria-label text-2xl font-bold mb-6 dark:text-gray-200 text-dark-900 border-b border-gray-600 pb-2">
                                        {categoria}
                                    </h2>

                                    <div className="empresas-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                        {empresasParaMostrar.map(empresa => {
                                            return (
                                                <EmpresaCard
                                                    key={empresa.id}
                                                    logo={empresa.logo}
                                                    nome={empresa.nome}
                                                    descricao={empresa.descricao}
                                                    tags={empresa.tags}
                                                    favoritada={empresa.favoritada}
                                                    onClickFavorito={() => handleAlterarStatusFavorito(empresa.favoritada, { id: empresa.id, foto: empresa.logo, nome_fant: empresa.nome, setor: empresa.setor })}
                                                    onClickVerMais={() => console.log('Ver mais', empresa.nome)}
                                                />
                                            )
                                        })}
                                    </div>

                                    <div className="flex justify-center gap-4 mt-6">

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
                                            className="ver-mais-btn flex items-center gap-2 hover:bg-dark-600 text-dark-900 dark:text-twitch-purple hover:text-white dark:hover:text-white transition-colors font-medium py-2 px-4 rounded-lg border border-dark-900 hover:border-dark-500 dark:border-twitch-purple dark:hover:border-twitch-lightpurple dark:hover:bg-twitch-purple"
                                        >
                                            {recolher ? "Exibir" : "Recolher"}
                                            <i className={`bx bx-chevron-${recolher ? "down" : "up"} text-xl`} />
                                        </button>

                                    </div>
                                </div>
                            );
                        })}

                        {/* empresas recomendadas*/}
                        <div className="categoria-empresas mb-12">
                            <div className="empresas-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full ">
                                {empresasSemLabel.map((empresa) => {
                                    return (
                                        <EmpresaCard
                                            key={empresa.id}
                                            logo={empresa.logo}
                                            nome={empresa.nome}
                                            descricao={empresa.descricao}
                                            favoritada={empresa.favoritada}
                                            tags={empresa.tags}
                                            onClickFavorito={() => handleAlterarStatusFavorito(empresa.favoritada, { id: empresa.id, foto: empresa.logo, nome_fant: empresa.nome, setor: empresa.setor })}
                                            onClickVerMais={() => console.log('Ver mais', empresa.nome)}
                                        />
                                    )
                                })}
                            </div>
                            {/* carregar empresas */}
                            {carregando && (
                                <div className="carregando-empresas flex justify-center items-center py-12">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-twitch-purple"></div>
                                        <p className="text-gray-400">Carregando mais empresas...</p>
                                    </div>
                                </div>
                            )}


                            {/* so para testar */}
                            {/* {empresasSemLabelExpandidas && (
                                <>
                                    <div className="empresas-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8">
                                        {empresasSemLabel.map((empresa, idx) => {
                                            return(
                                            <EmpresaCard
                                                key={`sem-label-expandida-${idx}`}
                                                logo={empresa.logo}
                                                nome={`${empresa.nome} ${idx + 1}`}
                                                descricao={`${empresa.descricao} - Nova leva de empresas carregadas.`}
                                                favoritada={empresa.favoritada}
                                                tags={[...empresa.tags, 'Nova']}
                                                onClickFavorito={() => handleAlterarStatusFavorito(empresa.favoritada, {id: empresa.id, foto: empresa.logo, nome_fant: empresa.nome, setor: empresa.setor})}
                                                onClickVerMais={() => console.log('Ver mais', empresa.nome)}
                                            />
                                        )})}
                                    </div>

                                    {carregando && (
                                        <div className="carregando-empresas flex justify-center items-center py-12">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-twitch-purple"></div>
                                                <p className="text-gray-400">Carregando mais empresas...</p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )} */}
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
};

export default Main;