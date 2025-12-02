// import { useState, useRef, useEffect } from "react";
// import gsap from "gsap";
// import ThemeTogleConfig from "./ThemeTogleConfig";
// import Filters from "./Filtragem";
// import logo from './../assets/imgs/BIGSlogo.png'
// import lupa from './../assets/imgs/lupa.png'
// import filtro from './../assets/imgs/filtro.png'

// type Props = {
//     isSidebarOpen: boolean;
//     setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
// };

// interface FiltroRecomendado {
//     id: number;
//     nome: string;
//     categoria: string;
// }

// // *Filtros recomendados
// const filtrosRecomendados: FiltroRecomendado[] = [
//     { id: 1, nome: "Programação de computadores", categoria: "Tecnologia" },
//     { id: 2, nome: "Música", categoria: "Entretenimento" },
//     { id: 3, nome: "Notícias", categoria: "Informação" },
//     { id: 4, nome: "Yu-Gi-Oh! Duel Monsters", categoria: "Games" },
//     { id: 5, nome: "Mixes", categoria: "Música" },
//     { id: 6, nome: "Jogos de cartas", categoria: "Games" },
//     { id: 7, nome: "Música medieval", categoria: "Música" },
//     { id: 8, nome: "Chefes", categoria: "Culinária" },
//     { id: 9, nome: "Música ao vivo", categoria: "Música" },
//     { id: 10, nome: "Lista", categoria: "Organização" },
//     { id: 11, nome: "Desenvolvimento Web", categoria: "Tecnologia" },
//     { id: 12, nome: "React", categoria: "Tecnologia" },
//     { id: 13, nome: "TypeScript", categoria: "Tecnologia" },
//     { id: 14, nome: "UI/UX Design", categoria: "Design" },
// ];

// export default function HeaderVagas({ isSidebarOpen, setIsSidebarOpen }: Props) {
//     const [isFilterOpen, setIsFilterOpen] = useState(false);
//     const [isProfileOpen, setIsProfileOpen] = useState(false);

//     const headerRef = useRef<HTMLDivElement>(null);
//     const profileRef = useRef<HTMLDivElement>(null);
//     const filtrosContainerRef = useRef<HTMLDivElement>(null);

    

//     useEffect(() => {
//         const handleClick = (e: MouseEvent) => {
//             if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
//                 setIsProfileOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClick);
//         return () => document.removeEventListener("mousedown", handleClick);
//     }, []);

//     const handleFiltroClick = (f: FiltroRecomendado) => {
//         f.nome;
//     };

//     const scrollFiltros = (direction: "left" | "right") => {
//         if (!filtrosContainerRef.current) return;

//         const container = filtrosContainerRef.current;
//         const scrollAmount = 300;
//         const target =
//             direction === "left"
//                 ? container.scrollLeft - scrollAmount
//                 : container.scrollLeft + scrollAmount;

//         gsap.to(container, {
//             scrollLeft: target,
//             duration: 0.5,
//             ease: "power2.out",
//         });
//     };

//     return (
//         <>
//             <aside className={`sidebar-container fixed top-12 left-0 h-screen z-[999] bg-white dark:dark:bg-dark-600 flex flex-col pt-6 transition-all duration-300 ease-in-out
//                     ${isSidebarOpen ? "open" : "closed"}`}>
//                 <nav className="sidebar-itens flex flex-col gap-3 px-3">
//                     <a className="flex items-center gap-4 px-3 py-2 rounded-full hover:bg-gray-700 transition">
//                         <i className="bx bx-home text-2xl dark:text-gray-200 text-dark-900"></i>
//                         <span className="dark:text-gray-200 text-dark-900 text-sm font-medium">Início</span>
//                     </a>

//                     <a href="/chats" className="flex items-center gap-4 px-3 py-2 rounded-full hover:bg-gray-700 transition">
//                         <i className="bx bx-message-rounded text-2xl dark:text-gray-200 text-dark-900"></i>
//                         <span className="dark:text-gray-200 text-dark-900 text-sm font-medium whitespace-nowrap">
//                             Chat Geral
//                         </span>
//                     </a>

//                     <a className="flex items-center gap-4 px-3 py-2 rounded-full hover:bg-gray-700 transition">
//                         <i className="bx bx-group text-2xl dark:text-gray-200 text-dark-900"></i>
//                         <span className="dark:text-gray-200 text-dark-900 text-sm font-medium">Fórum</span>
//                     </a>

//                     <a className="flex items-center gap-4 px-3 py-2 rounded-full hover:bg-gray-700 transition">
//                         <i className="bx bx-star text-2xl dark:text-gray-200 text-dark-900"></i>
//                         <span className="dark:text-gray-200 text-dark-900 text-sm font-medium">Favoritos</span>
//                     </a>
//                 </nav>
//             </aside>

//             <header ref={headerRef} className={`fixed top-0 left-0 right-0 bg-white dark:bg-dark-600 z-50 flex flex-col`}>
//                 <div className="w-full flex items-center justify-between px-4 h-14">
//                     <div className="flex items-center gap-4">
//                         <button className="bx bx-menu text-3xl text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 w-10 h-10 flex items-center justify-center rounded-full transition" onClick={() => setIsSidebarOpen(!isSidebarOpen)}/>
//                         <a href="/" className="flex items-center gap-1">
//                             <img src={logo} alt="Logo" className="h-10 w-auto" />
//                             <span className="font-black text-xl text-gray-800 dark:text-white">
//                                 Empre<span className="text-twitch-purple">Go</span>
//                             </span>
//                         </a>
//                     </div>

//                     <div className="flex flex-1 justify-center px-4">
//                         <div className="search-bar flex items-center w-full max-w-2xl bg-white dark:bg-twitch-gray rounded-full overflow-hidden border border-gray-300 dark:border-gray-700">
//                             <input type="text" placeholder="Pesquisar empresas..." className="flex-1 px-4 py-2 bg-transparent outline-none text-sm text-gray-800 dark:text-white"/>

//                             <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="px-3 flex items-center justify-center">
//                                 <img src={filtro} className="w-6 h-6 filter brightness-0 invert" />
//                             </button>

//                             <button className="bg-twitch-purple text-white px-4 py-2 flex items-center justify-center hover:bg-twitch-lightpurple transition">
//                                 <img src={lupa} className="w-5 h-5 filter brightness-0 invert" />
//                             </button>
//                         </div>

//                         <Filters isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} onApply={() => { }} />
//                     </div>

//                     {/* Profile */}
//                     <div className="relative " ref={profileRef}>
//                         <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 cursor-pointer px-1 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ">
//                             <img src={logo} alt="Foto" className="w-9 h-9 rounded-full object-cover"/>
//                         </div>

//                         {isProfileOpen && (
//                             <div className="absolute top-14 right-0 w-60 bg-white dark:bg-twitch-gray text-gray-800 dark:text-white rounded-lg shadow-xl border border-gray-300 dark:border-gray-700 p-2 flex flex-col z-[999]">
//                                 <div className="p-3">
//                                     <p className="font-bold">nome VISIVEL</p>
//                                     <a href="/perfil/candidato" className="text-twitch-purple text-sm">
//                                         Acessar perfil
//                                     </a>
//                                 </div>

//                                 <hr className="border-gray-300 dark:border-gray-700" />

//                                 <button className="text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Editar perfil</button>
//                                 <button className="text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Sair</button>

//                                 <hr className="border-gray-300 dark:border-gray-700" />

//                                 <button className="text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Notificações</button>
//                                 <button className="text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Chats</button>

//                                 <hr className="border-gray-300 dark:border-gray-700" />

//                                 <button className="text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Configurações</button>

//                                 <ThemeTogleConfig />

//                                 <button className="text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Ajuda</button>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <div
//                     className={`recommended-filters-wrapper relative flex gap-6 overflow-x-auto scrollbar-hide pl-28 pr-6 py-2 transition-all duration-300
//                         ${isSidebarOpen ? "ml-[8rem]" : "ml-0"}`}>
//                     <button onClick={() => scrollFiltros("left")} className="absolute left-24 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white  hover:bg-black/80 hover:scale-110 transition">
//                         <i className="bx bx-chevron-left text-xl"></i>
//                     </button>

//                     <div
//                         ref={filtrosContainerRef}
//                         className="flex gap-3 overflow-x-auto scrollbar-hide px-8 py-2"
//                         style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
//                         {filtrosRecomendados.map((f) => (
//                             <button key={f.id} onClick={() => handleFiltroClick(f)} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all  border border-gray-600 hover:border-gray-500 hover:scale-105 flex-shrink-0">
//                                 {f.nome}
//                             </button>
//                         ))}
//                     </div>

//                     <button onClick={() => scrollFiltros("right")} className="absolute right-2 top-1/2 -translate-y-1/2 z-20  w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white  hover:bg-black/80 hover:scale-110 transition">
//                         <i className="bx bx-chevron-right text-xl"></i>
//                     </button>
//                 </div>
//             </header>
//         </>
//     );
// }
