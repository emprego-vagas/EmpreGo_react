import { Link, useNavigate } from "react-router-dom";
import HeaderProfiles from "../components/HeaderProfiles";
import { useEffect, useRef, useState } from "react";
import { mostrarErroTopo, mostrarSucessoTopo } from "../utils/globalFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { cadastrarProjeto } from "../ts/criarProjetosFunctions";

export default function CriarProjetos() {
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
    const [status, setStatus] = useState('');
    const [linkProjeto, setLinkProjeto] = useState('');

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
    };

    const [imagem, setImagem] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Gera e limpa o preview
    useEffect(() => {
        if (!imagem) return;

        const objectUrl = URL.createObjectURL(imagem);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [imagem]);

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            alert("Por favor, selecione uma imagem.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("O arquivo deve ter no máximo 5MB.");
            return;
        }
        setImagem(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const handleRemove = () => {
        setImagem(null);
        setPreview(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    useEffect(()=>{
        const checkBox = checkAtualRef.current as HTMLInputElement;
        if (status==='Concluído'){
            setCheckAtual(false);
            checkBox.disabled = true;
            if(dataFimRef.current.disabled) {
                setDataFimContainerOpacity('opacity-100');
                dataFimRef.current.disabled = false;
            }
        } else {
            checkBox.disabled = false;
        }
    }, [status])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <HeaderProfiles />
            <div id="main" className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
                <div className="page-header text-center mb-10">
                    <h1 className="text-4xl font-bold gradient-text mb-2">Criar Novo Projeto</h1>
                    <p className="text-professional-subtitle text-lg max-w-2xl mx-auto">Apresente seus projetos de forma
                        profissional, destacando tecnologias, resultados e seu papel no desenvolvimento</p>
                </div>

                <div id="caixaNova"
                    className="gradient-bg rounded-2xl p-10 border border-professional-card shadow-xl mb-8 animate-fade-in">
                    {/* <!-- Título do Projeto --> */}
                    <div className="mb-6">
                        <label htmlFor="inputTitulo" className="block text-professional-subtitle mb-2 font-medium">Título do Projeto
                            *</label>
                        <input id="inputTitulo" type="text" maxLength={50} placeholder="Ex: Sistema de Gestão Empresarial" value={titulo} onChange={(e)=>setTitulo(e.target.value)}
                            className="w-full px-6 py-4 bg-professional-dark border border-professional-card rounded-xl text-professional-text text-xl font-semibold transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText "/>
                    </div>

                    {/* <!-- Empresa/Cliente --> */}
                    <div className="mb-6">
                        <label htmlFor="inputEmpresa" className="block text-professional-subtitle mb-2 font-medium">Empresa/Cliente
                            *</label>
                        <input id="inputEmpresa" type="text" maxLength={50} placeholder="Ex: Tech Solutions Ltda" value={nome} onChange={(e)=>setNome(e.target.value)}
                            className="w-full px-6 py-4 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"/>
                    </div>

                    {/* <!-- Status do Projeto --> */}
                    <div className="mb-6">
                        <label htmlFor="selectStatus" className="block text-professional-subtitle mb-2 font-medium">
                            Status do Projeto *
                        </label>
                        <select id="selectStatus" value={status} onChange={(e)=>setStatus(e.target.value)}
                            className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20">

                            {/* <!-- Opção padrão --> */}
                            <option value="" disabled selected className="text-professional-subtitle">Adicione os status do seu projeto</option>

                            <option value="Concluído" className="bg-professional-dark">Concluído</option>
                            <option value="Em Andamento" className="bg-professional-dark">Em Andamento</option>
                            <option value="Em Planejamento" className="bg-professional-dark">Em Planejamento</option>
                            <option value="Pausado" className="bg-professional-dark">Pausado</option>
                            <option value="Cancelado" className="bg-professional-dark">Cancelado</option>
                        </select>
                    </div>

                    {/* <!-- Datas --> */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label htmlFor="dataInicio" className="block text-professional-subtitle mb-2 font-medium">
                                Data de Início *
                            </label>
                            <input id="dataInicio" type="month" value={dataInicio} onChange={(e)=>setDataInicio(e.target.value)} min={`${anoMinimo}-01`} max={`${anoAtual}-12`}
                                className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20" />
                        </div>

                        <div id="dataFimContainer" className={dataFimContainerOpacity}>
                            <label htmlFor="dataFim"  className="block text-professional-subtitle mb-2 font-medium">
                                Data de Fim <span id="labelASt">*</span>
                            </label>
                            <input id="dataFim" type="month" ref={dataFimRef} value={dataFim} onChange={(e)=>setDataFim(e.target.value)} min={`${anoMinimo}-01`} max={`${anoAtual}-12`}
                                className="w-full px-4 py-3 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20" />
                        </div>

                        <div className="flex items-end">
                            <div className="flex items-center">
                                <input id="checkAtual" type="checkbox" ref={checkAtualRef} checked={checkAtual} onChange={(e)=>{handleCheckAtual();setCheckAtual(e.target.checked)}}
                                    className="w-5 h-5 appearance-none rounded-full border border-professional-card bg-professional-dark checked:bg-professional-accent checked:border-professional-accent transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-professional-accent/50 transform -translate-y-4" />
                                <label htmlFor="checkAtual"
                                    className="ml-2 text-professional-subtitle font-medium select-none transform -translate-y-4">Sem data de conclusão</label>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Descrição --> */}
                    <div className="mb-6">
                        <label htmlFor="caixaText" className="block text-professional-subtitle mb-2 font-medium">Descrição do Projeto
                            *</label>
                        <textarea id="caixaText"
                            placeholder="Descreva o projeto, suas funcionalidades, seu papel no desenvolvimento, tecnologias utilizadas e resultados alcançados. Seja específico e use métricas quando possível."
                            maxLength={3000} value={descricao} onChange={(e=>setDescricao(e.target.value))}
                            className="w-full h-48 p-6 bg-professional-dark border border-professional-card rounded-xl text-professional-text resize-y transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText"></textarea>
                        <div className={`char-counter text-right ${corDescricaoLength} text-sm mt-2`} id="charCounter">{`${descricaoLength}/3000
                            caracteres`}</div>
                    </div>

                    {/* <!-- Tecnologias/Habilidades --> */}
                    <div className="mb-6">
                        <label htmlFor="inputHabilidades" className="block text-professional-subtitle mb-2 font-medium">Tecnologias
                            Utilizadas (Opcional)</label>
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
                            <input id="inputHabilidades" type="text" placeholder="Digite uma tecnologia e pressione Enter" onKeyDown={(e)=>handleKeyDownTag(e)}
                                className="flex-1 bg-transparent border-0 outline-0 text-professional-text placeholder-professional-subtitleText" />
                        </div>
                        <p className="text-professional-subtitle text-xs mt-2">Pressione Enter ou vírgula para adicionar uma
                            tecnologia</p>
                    </div>

                    {/* <!-- Link do Projeto --> */}
                    <div className="mb-6">
                        <label htmlFor="inputLink" className="block text-professional-subtitle mb-2 font-medium">Link do Projeto
                            (Opcional)</label>
                        <input id="inputLink" type="url" placeholder="https://meuprojeto.com" value={linkProjeto} onChange={(e)=>setLinkProjeto(e.target.value)}
                            className="w-full px-6 py-4 bg-professional-dark border border-professional-card rounded-xl text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-subtitleText" />
                    </div>

                    {/* <!-- Imagem --> */}
                    <div className="mb-6">
                        <label className="block text-professional-subtitle mb-2 font-medium">
                            Imagem do Projeto (Opcional)
                        </label>

                        {/* Área de Upload */}
                        <div
                            onClick={() => inputRef.current?.click()}
                            onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                            }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer min-h-[200px] flex flex-col justify-center items-center
                            ${preview
                                ? "border-professional-accent bg-professional-accent/5"
                                : dragOver
                                ? "border-professional-accent bg-professional-accent/10"
                                : "border-professional-card bg-professional-dark/50 hover:border-professional-accent hover:bg-professional-accent/5"
                            }`}
                        >
                            {!preview ? (
                            <div className="flex flex-col items-center pointer-events-none">
                                <i className="bx bx-cloud-upload text-5xl text-professional-accent mb-4"></i>
                                <div className="text-professional-subtitle mb-4">
                                <h3 className="text-xl font-medium mb-2">Adicionar Imagem</h3>
                                <p className="text-sm">Arraste uma imagem ou clique para selecionar</p>
                                <p className="text-sm">Formatos: JPG, PNG, GIF (Máx. 5MB)</p>
                                </div>
                                <button
                                type="button"
                                className="bg-professional-accent hover:bg-professional-lightaccent text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                >
                                Procurar Arquivos
                                </button>
                            </div>
                            ) : (
                            <div className="relative w-full h-full rounded-xl overflow-hidden">
                                <img
                                src={preview}
                                alt="Pré-visualização"
                                className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center gap-2 bg-black/40 backdrop-blur-md">
                                <button
                                    type="button"
                                    className="bg-white/20 text-white px-4 py-2 rounded-md text-sm hover:bg-white/30 cursor-pointer"
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    inputRef.current?.click();
                                    }}
                                >
                                    Alterar
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-500/70 hover:bg-red-500/90 text-white px-4 py-2 rounded-md text-sm cursor-pointer"
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                    }}
                                >
                                    Remover
                                </button>
                                </div>
                            </div>
                            )}

                            <input
                            ref={inputRef}
                            id="imgPlaceholder"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                            />
                        </div>

                        {/* Infos do arquivo */}
                        {imagem && (
                            <div className="flex items-center gap-2 mt-4 p-3 bg-professional-accent/10 rounded-lg border-l-4 border-professional-accent">
                            <i className="bx bx-file text-professional-accent"></i>
                            <div className="flex-1 text-sm text-professional-subtitle truncate">
                                {imagem.name}
                            </div>
                            <div className="text-xs text-professional-subtitle">
                                {(imagem.size / 1024).toFixed(1)} KB
                            </div>
                            </div>
                        )}
                    </div>
                </div>

                <div id="btns" className="flex justify-center gap-6 mt-8">
                    <button disabled={cadastrando}
                        className="btn flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-xl transition-all bg-linear-to-r from-professional-accent to-professional-lightaccent text-white shadow-lg shadow-professional-accent/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-professional-accent/40 cursor-pointer"
                        id="btnSalvar" onClick={async()=>{
                            setCadastrando(true);
                            const cadastrou = await cadastrarProjeto(titulo, nome, dataInicio, dataFim, checkAtual, descricao, tags, linkProjeto, status, imagem);
                            if(!cadastrou){
                                setCadastrando(false);
                            } else {
                                mostrarSucessoTopo('Projeto cadastrado com sucesso!')
                                setTimeout(()=>{navigate('/perfil/candidato')}, 3000);
                            }
                        }}>
                        <i className='bx bx-save'></i> {cadastrando? 'Cadastrando...' : 'Salvar Projeto'}
                    </button>
                    <Link to="/perfil/candidato">
                        <button
                            className="btn flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-xl transition-all bg-professional-card text-professional-subtitle hover:bg-professional-card/80 hover:-translate-y-1 cursor-pointer"
                            id="btnVoltar">
                            <i className='bx bx-arrow-back'></i> Retornar ao Perfil
                        </button>
                    </Link>
                </div>
            </div>
        </>
    )
}