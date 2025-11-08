import { useRef, useState } from "react";
import HeaderProfiles from "../components/HeaderProfiles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { mostrarErroTopo, mostrarSucessoTopo } from "../utils/globalFunctions";
import { cadastrarExperiencia } from "../ts/criarExperienciasFunctions";
import { useNavigate } from "react-router-dom";

export default function CriarExperiencias() {
    const navigate = useNavigate();

    const anoAtual = new Date().getFullYear();
    const anoMinimo = anoAtual - 100;

    const [descricao, setDescricao] = useState('');
    const descricaoLength = descricao.length;
    let corDescricaoLength = 'text-professional-subtitle';
    if(descricaoLength>2990) corDescricaoLength = 'text-red-500';
    else if (descricaoLength>2900) corDescricaoLength = 'text-yellow-500';

    const checkAtualRef = useRef(null);
    const dataFimRef = useRef(null);
    const [dataFimContainerOpacity, setDataFimContainerOpacity] = useState("opacity-100");
    const handleCheckAtual = ()=>{
        const checked = checkAtualRef.current.checked;
        if(checked) {
            setDataFimContainerOpacity('opacity-50');
            dataFimRef.current.disabled = true;
            setDataFim('');
        } else {
            setDataFimContainerOpacity('opacity-100');
            dataFimRef.current.disabled = false;
        }
    }
    const [checkAtual, setCheckAtual] = useState(false);

    const [titulo, setTitulo] = useState('');
    const [nome, setNome] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const [cadastrando, setCadastrando] = useState(false);

    const handleKeyDownTag = (e)=>{
        const valor = e.target.value.trim();
        if((e.key === 'Enter' || e.key === ',') && e.target.value.trim() !== ''){
            e.preventDefault();
            const tag = valor.replace(",", "");
            if (tag && !tags.includes(tag)) {
                if(tags.length>=25) return mostrarErroTopo("A experiência só pode ter até 25 tags");
                setTags((prev)=>[...prev, tag]);
            }
            e.target.value = '';
        }
    }

    return (
        <>
        <HeaderProfiles />
        <div id="main" className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
            <div className="page-header text-center mb-10">
                <h1 className="text-4xl font-bold gradient-text mb-2">Nova Experiência Profissional</h1>
                <p className="text-professional-subtitle text-lg max-w-2xl mx-auto">Descreva sua experiência de forma detalhada
                    para impressionar recrutadores e aumentar suas chances no mercado</p>
            </div>

            <div id="caixaNova"
                className="gradient-bg rounded-2xl p-10 border border-professional-card shadow-xl mb-8 animate-fade-in">
                {/* <!-- Título --> */}
                <div className="mb-6">
                    <label htmlFor="inputTitulo" className="block text-professional-subtitle mb-2 font-medium">Título Profissional
                        *</label>
                    <input id="inputTitulo" type="text" maxLength={50} placeholder="Ex: Gerente de Projetos" value={titulo} onChange={(e)=>setTitulo(e.target.value)}
                        className="w-full px-6 py-4 bg-professional-dark border border-professional-card rounded-xl text-professional-text text-xl font-semibold transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText "/>
                </div>

                {/* <!-- Empresa --> */}
                <div className="mb-6">
                    <label htmlFor="inputEmpresa" className="block text-professional-subtitle mb-2 font-medium">Empresa *</label>
                    <input id="inputEmpresa" type="text" maxLength={50} placeholder="Ex: Tech Solutions Ltda" value={nome} onChange={(e)=>setNome(e.target.value)}
                        className="w-full px-6 py-4 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText" />
                </div>

                {/* <!-- Datas e Atual --> */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label htmlFor="dataInicio" className="block text-professional-subtitle mb-2 font-medium">
                            Data de Início *
                        </label>
                        <input id="dataInicio" type="month" value={dataInicio} onChange={(e)=>setDataInicio(e.target.value)} min={`${anoMinimo}-01`} max={`${anoAtual}-12`}
                            className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20" />
                    </div>

                    <div id="dataFimContainer" className={dataFimContainerOpacity}>
                        <label htmlFor="dataFim" className="block text-professional-subtitle mb-2 font-medium">
                            Data de Fim *
                        </label>
                        <input id="dataFim" type="month" ref={dataFimRef} value={dataFim} onChange={(e)=>setDataFim(e.target.value)} min={`${anoMinimo}-01`} max={`${anoAtual}-12`}
                            className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20" />
                    </div>

                    <div className="flex items-end">
                        <div className="flex items-center">
                            <input id="checkAtual" type="checkbox" ref={checkAtualRef} checked={checkAtual} onChange={(e)=>{handleCheckAtual();setCheckAtual(e.target.checked)}}
                                className="w-5 h-5 appearance-none rounded-full border border-professional-card bg-professional-dark checked:bg-professional-accent checked:border-professional-accent transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-professional-accent/50 transform -translate-y-4" />
                            <label htmlFor="checkAtual"
                                className="ml-2 text-professional-subtitle font-medium select-none transform -translate-y-4">Atualmente
                                trabalho aqui</label>
                        </div>
                    </div>
                </div>

                {/* <!-- Descrição --> */}
                <div className="mb-6">
                    <label htmlFor="caixaText" className="block text-professional-subtitle mb-2 font-medium">Descrição *</label>
                    <textarea id="caixaText"
                        placeholder="Descreva suas responsabilidades, conquistas, tecnologias utilizadas e resultados alcançados nesta experiência. Seja específico e use métricas quando possível."
                        maxLength={3000} value={descricao} onChange={(e)=>setDescricao(e.target.value)}
                        className="w-full h-48 p-6 bg-professional-dark border border-professional-card rounded-xl text-professional-text resize-y transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"></textarea>
                    <div className={`char-counter text-right ${corDescricaoLength} text-sm mt-2`} id="charCounter">{`${descricaoLength}/3000
                        caracteres`}</div>
                </div>

                {/* <!-- Habilidades --> */}
                <div className="mb-6">
                    <label htmlFor="inputHabilidades"
                        className="block text-professional-subtitle mb-2 font-medium">Habilidades</label>
                    <div
                        className="flex flex-wrap items-center bg-professional-dark border border-professional-card rounded-xl px-4 py-3 transition-all focus-within:border-professional-accent focus-within:ring-3 focus-within:ring-professional-accent/20">
                        <div id="tagsContainer" className="flex flex-wrap items-center">
                            {tags.length>0 && tags.map((tag, index)=>(
                                <div className="tag inline-flex items-center bg-professional-gray text-slate-300 px-3 py-1 rounded-md text-xs mr-2 mb-2" key={tag}>
                                    {tag} 
                                    <span className="tag-remove ml-2 cursor-pointer text-slate-300 hover:text-slate-50" onClick={()=>setTags((prev)=>prev.filter((_, i)=>i!==index))}>
                                        <FontAwesomeIcon icon={faXmark} />
                                    </span>
                                </div>
                            ))}
                        </div>
                        <input id="inputHabilidades" type="text" placeholder="Digite uma habilidade e pressione Enter" onKeyDown={(e)=>handleKeyDownTag(e)}
                            className="flex-1 bg-transparent border-0 outline-0 text-professional-text placeholder-professional-subtitleText" />
                    </div>
                    <p className="text-professional-subtitle text-xs mt-2">Pressione Enter ou vírgula para adicionar uma
                        habilidade</p>
                </div>
                </div>

            <div id="btns" className="flex justify-center gap-6 mt-8">
                <button disabled={cadastrando}
                    className="btn flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-xl transition-all bg-linear-to-r from-professional-accent to-professional-lightaccent text-white shadow-lg shadow-professional-accent/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-professional-accent/40 cursor-pointer"
                    id="btnSalvar" onClick={async()=>{
                        setCadastrando(true);
                        const cadastrou = await cadastrarExperiencia(titulo, nome, dataInicio, dataFim, checkAtual, descricao, tags);
                        if(!cadastrou){
                            setCadastrando(false);
                        } else {
                            mostrarSucessoTopo('Experiência cadastrada com sucesso!')
                            setTimeout(()=>{navigate('/perfil/candidato')}, 3000);
                        }
                    }}>
                    <i className='bx bx-save'></i> {cadastrando ? 'Cadastrando...' : 'Salvar Experiência'}
                </button>
                <a href="/perfil/candidato">
                    <button
                        className="btn flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-xl transition-all bg-professional-card text-professional-subtitle hover:bg-professional-card/80 hover:-translate-y-1 cursor-pointer"
                        id="btnVoltar">
                        <i className='bx bx-arrow-back'></i> Retornar ao Perfil
                    </button>
                </a>
            </div>
        </div>
        </>
    )
}