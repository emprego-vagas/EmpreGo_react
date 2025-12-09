// import { useState, useRef, useEffect } from "react";
// import '../css/filtragem.css'

// export default function Filters({ isFilterOpen, setIsFilterOpen, onApply }) {
//     const filterRef = useRef(null);

//     const [filters, setFilters] = useState({
//         setor: [],
//         estado: [],
//         porte: [],
//     });

//     const [openCategory, setOpenCategory] = useState(null);

//     useEffect(() => {
//         function handleClickOutside(e) {
//             if (filterRef.current && !filterRef.current.contains(e.target)) {
//                 setIsFilterOpen(false);
//             }
//         }
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const toggleChip = (category, value) => {
//         setFilters(prev => {
//             const current = prev[category];
//             const exists = current.includes(value);

//             return {
//                 ...prev,
//                 [category]: exists
//                     ? current.filter(v => v !== value)
//                     : [...current, value]
//             };
//         });
//     };

//     const clearFilters = () => {
//         setFilters({
//             setor: [],
//             estado: [],
//             porte: [],
//         });
//     };

//     const confirmFilters = () => {
//         onApply(filters);
//         setIsFilterOpen(false);
//     };
//     //* Vamos manter os filtros dessa forma, é mais organizado!
//     const setores = ["Alimentício", "Varejo", "Turismo", "Energia", "Agronegócio", "Saúde"];
//     const portes = ["Pequeno", "Médio", "Grande"];

//     const estados = [
//         "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
//         "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
//     ];

//     return (
//         <>
//             {isFilterOpen && (
//                 <div
//                     ref={filterRef}
//                     className={`filter-container absolute top-14 right-64 bg-white dark:bg-twitch-gray p-4 rounded-xl shadow-xl border border-gray-300 dark:border-gray-700 w-72 z-50 ${isFilterOpen ? "open" : "closed"}`}>
//                     {/* SETOR */}
//                     <div className="filter-category">
//                         <button className="filter-category-header flex justify-between w-full mb-1 dark:bg-twitch-gray bg-white"
//                         onClick={() => setOpenCategory(openCategory === "setor" ? null : "setor")}>
//                             <span className="text-twitch-gray dark:text-dark-300 text-sm font-medium ">Setor</span>
//                             <i className="bx bx-chevron-down text-twitch-gray dark:text-dark-300"></i>
//                         </button>   

//                         {openCategory === "setor" && (
//                             <div className=" flex flex-wrap gap-2 max-h-36 overflow-y-auto mb-3 pr-2 p-1 custom-scrollbar text-twitch-gray dark:text-dark-300">
//                                 {setores.map(s => (
//                                     <button
//                                         key={s}
//                                         onClick={() => toggleChip("setor", s)}
//                                         className={`filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none
//                                             ${filters.setor.includes(s)
//                                                 ? "bg-twitch-purple text-white"
//                                                 : "bg-dark-600 text-white/80"
//                                             }`}>
//                                         {s}
//                                     </button>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     {/* ESTADO */}
//                     <div className="filter-category">
//                         <button
//                             className="filter-category-header flex justify-between w-full mb-1 dark:bg-twitch-gray bg-white"
//                             onClick={() => setOpenCategory(openCategory === "estado" ? null : "estado")}>
//                             <span className="text-sm font-medium text-twitch-gray dark:text-dark-300">Estado</span>
//                             <i className="bx bx-chevron-down text-twitch-gray dark:text-dark-300"></i>
//                         </button>

//                         {openCategory === "estado" && (
//                             <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto mb-3 pr-2 p-1 custom-scrollbar">
//                                 {estados.map(uf => (
//                                     <button
//                                         key={uf}
//                                         onClick={() => toggleChip("estado", uf)}
//                                         className={`filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none 
//                                             ${filters.estado.includes(uf)
//                                                 ? "bg-twitch-purple text-white"
//                                                 : "bg-dark-600 text-white/80"
//                                             }
//                                         `}>
//                                         {uf}
//                                     </button>
//                                 ))}
//                             </div>
//                         )}
//                     </div>


//                     {/* PORTE */}
//                     <div className="filter-category">
//                         <button
//                             className="filter-category-header flex justify-between w-full mb-1 dark:bg-twitch-gray bg-white"
//                             onClick={() => setOpenCategory(openCategory === "porte" ? null : "porte")}
//                         >
//                             <span className="text-twitch-gray dark:text-dark-300 text-sm font-medium">Porte</span>
//                             <i className="bx bx-chevron-down text-twitch-gray dark:text-dark-300"></i>
//                         </button>

//                         {openCategory === "porte" && (
//                             <div className=" flex flex-wrap gap-2 max-h-36 overflow-y-auto mb-3 pr-2 p-1 custom-scrollbar">
//                                 {portes.map(p => (
//                                     <button
//                                         key={p}
//                                         onClick={() => toggleChip("porte", p)}
//                                         className={`filter-chip px-2.5 py-1 rounded-full text-xs 
//                                             transition-colors select-none 
//                                             ${filters.porte.includes(p)
//                                                 ? "bg-twitch-purple text-white"
//                                                 : "bg-dark-600 text-white/80"
//                                             }`}>
//                                         {p}
//                                     </button>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     {/* AÇÕES */}
//                     <div className="filter-actions flex justify-between gap-2 mt-3">
//                         <button
//                             onClick={confirmFilters}
//                             className="bg-dark-900 text-white btn-primary px-3 py-1.5 text-xs rounded hover:bg-dark-500 flex-1">
//                             Confirmar filtros
//                         </button>

//                         <button
//                             onClick={clearFilters}
//                             className="bg-gray-600 text-white btn-primary px-3 py-1.5 text-xs rounded hover:bg-gray-700 flex-1">
//                             Limpar filtros
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }
