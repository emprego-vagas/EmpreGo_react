import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import HeaderVagas from '../components/HeaderVagas';
import JoaoAzevedo from './../assets/imgs/JoaoAzevedo.jpeg';
import { useNavigate } from 'react-router-dom';
import { DadosUsuario, mostrarAvisoTopo } from '../utils/globalFunctions';
import axiosWe from '../utils/axiosInstance';
import genPfp from '../assets/imgs/genPfp.png';
import Loader from '../components/Loader';

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

const Main: React.FC = () => {
    const navigate = useNavigate();
    const [usuario] = useState(DadosUsuario.getUsuario(true, 'candidato'));
    if(!usuario) {
        setTimeout(()=>{
            navigate('/')
        }, 3000)
    };

    const [carregandoDados, setCarregandoDados] = useState(true);
    const [palavrasBusca, setPalavrasBusca] = useState<string[]>([]);

    const palavrasBuscaRef = useRef<string[]>([]);

    useEffect(() => {
        palavrasBuscaRef.current = palavrasBusca;
    }, [palavrasBusca]);

    useEffect(()=>{
        if(!usuario) return;
        async function carregarDados(){
            try {
                const response = await axiosWe('/custom/vizualizar-empresas');
                const data = response.data;
                console.log(data);
                console.log('Setores recomendados:', data.empresasRecomendadas.map(e=>e.setor));

                console.log(data.palavrasPraBusca)
                setPalavrasBusca(data.palavrasPraBusca);
                palavrasBuscaRef.current = data.palavrasPraBusca;
                setEmpresasFavoritadas(data.empresasFavoritadas.map(e=>e.empresas));

                const isFavoritada = (id: string) => {
                    return data.empresasFavoritadas.some((e) => e.empresas.id === id);
                };
                setEmpresasPorCategoria({
                    ["Empresas Recomendadas"]: {
                        pagina: 1,
                        chegouNoLimite: false,
                        recolher: true,
                        empresasRecolhidas(){
                            return this.empresas.slice(0,3)
                        },
                        empresas: data.empresasRecomendadas.map(emp=>({
                            id: emp.id,
                            logo: emp.foto === '/assets/imgs/genPfp.png' ? genPfp : emp.foto,
                            nome: emp.nome_fant,
                            descricao: emp.descricao,
                            tags: emp.tags_empresas.map(t=>t.nome),
                            setor: emp.setor,
                            favoritada: isFavoritada(emp.id),
                        }))
                        },
                    ["Empresas Recentes"]: {
                        pagina: 1,
                        chegouNoLimite: false,
                        recolher: true,
                        empresasRecolhidas(){
                            return this.empresas.slice(0,3)
                        },
                        empresas: data.empresasRecentes.map(emp=>({
                            id: emp.id,
                            logo: emp.foto === '/assets/imgs/genPfp.png' ? genPfp : emp.foto,
                            nome: emp.nome_fant,
                            descricao: emp.descricao,
                            tags: emp.tags_empresas.map(t=>t.nome),
                            setor: emp.setor,
                            favoritada: isFavoritada(emp.id),
                        }))
                        },
                    ["Empresas Principais"]: {
                        pagina: 1,
                        chegouNoLimite: false,
                        recolher: true,
                        empresasRecolhidas(){
                            return this.empresas.slice(0,3)
                        },
                        empresas: data.empresasPrincipais.map(emp=>({
                            id: emp.id,
                            logo: emp.foto === '/assets/imgs/genPfp.png' ? genPfp : emp.foto,
                            nome: emp.nome_fant,
                            descricao: emp.descricao,
                            tags: emp.tags_empresas.map(t=>t.nome),
                            setor: emp.setor,
                            favoritada: isFavoritada(emp.id),
                        }))
                    }
                })
                setEmpresasSemLabel(data.empresasSemLabel.map(emp=>({
                    id: emp.id,
                    logo: emp.foto === '/assets/imgs/genPfp.png' ? genPfp : emp.foto,
                    nome: emp.nome_fant,
                    descricao: emp.descricao,
                    setor: emp.setor,
                    favoritada: isFavoritada(emp.id),
                    tags: emp.tags_empresas.map(t=>t.nome)
                })));
                setCarregandoDados(false);
            } catch (erro) {
                console.error("Erro ao carregar empresas:",erro)
            }
            
        }
        carregarDados();
    }, [usuario])

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
    // const dateTimeNow = Date.now();

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

    const handleAlterarStatusFavorito = async(favoritada: boolean, empresa: EmpresaFavoritada)=>{
        console.log('atualizar')
        function atualizarStatus(){
            setEmpresasSemLabel(empresasSemLabel.map(emp=>{
                if (emp.id===empresa.id){
                    return {...emp, favoritada: !favoritada}
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
            setEmpresasFavoritadas(prev=>prev.filter(e=>e.id!==empresa.id));
            atualizarStatus();
            try {
                await axiosWe.delete(`/favoritos/empresa/${empresa.id}`);
            } catch (erro) {
                console.error("Erro ao remover empresa dos favoritos: ", erro);
            };
        }
        else {
            if(empresasFavoritadas.length >= 20){
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

    // const [empresasExpandidas, setEmpresasExpandidas] = useState<{ [key: string]: boolean }>({});
    //! const [empresasSemLabelExpandidas, setEmpresasSemLabelExpandidas] = useState(false);  FORA DE USO
    const [carregando, setCarregando] = useState(false);
    const carregandoRef = useRef(false);

    useEffect(()=>{
        carregandoRef.current = carregando
    }, [carregando])

    // const toggleExpandir = (categoria: string) => {
    //     setEmpresasExpandidas(prev => ({
    //         ...prev,
    //         [categoria]: !prev[categoria]
    //     }));
    // };

    const carregarMaisEmpresas = async() => {
        console.log(empresasSemLabel.length)
        if(empresasSemLabelRef.current.length % 9 !== 0 || carregandoRef.current){
            return;
        }
        setCarregando(true);
        try {
            const response = await axiosWe.post(`/empresas/recommendedlow?page=${semLabelPage+1}`, { palavras: palavrasBuscaRef.current });
            setSemLabelPage(prev=>prev+1);
            const novasEmpresas = response.data;
            const isFavoritada = (id: string) => {
                return empresasFavoritadas.some((e) => e.id === id);
            };
            setEmpresasSemLabel(prev=>
                [...prev, ...novasEmpresas.map(emp=>({
                    id: emp.id,
                    logo: emp.foto === '/assets/imgs/genPfp.png' ? genPfp : emp.foto,
                    nome: emp.nome_fant,
                    descricao: emp.descricao,
                    setor: emp.setor,
                    favoritada: isFavoritada(emp.id),
                    tags: emp.tags_empresas.map(t=>t.nome)
                }))]
            );
            setCarregando(false);
        } catch (erro) {
            console.error("Erro ao carregar mais empresas:",erro)
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

    if(carregandoDados) return (<Loader/>)

    return (
        <>
            <div className={`app-wrapper ${isSidebarOpen ? 'sidebar-open' : ''} relative bg-white dark:bg-dark-600`}>
                <HeaderVagas isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
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
                                    className={`absolute inset-0 w-full h-full transition-opacity duration-300 bg-cover bg-center bg-no-repeat rounded-xl overflow-hidden
                                    ${index === currentSlide ? 'opacity-100 pointer-events-auto' : 'opacity-50 pointer-events-none'}`}>
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
                                            return(
                                                <EmpresaCard
                                                    key={empresa.id}
                                                    logo={empresa.logo}
                                                    nome={empresa.nome}
                                                    descricao={empresa.descricao}
                                                    tags={empresa.tags}
                                                    favoritada={empresa.favoritada}
                                                    onClickFavorito={() => handleAlterarStatusFavorito(empresa.favoritada, {id: empresa.id, foto: empresa.logo, nome_fant: empresa.nome, setor: empresa.setor})}
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
                                        onClickFavorito={() => handleAlterarStatusFavorito(empresa.favoritada, {id: empresa.id, foto: empresa.logo, nome_fant: empresa.nome, setor: empresa.setor})}
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