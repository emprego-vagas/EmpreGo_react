import { Link } from "react-router-dom";
import HeaderProfiles from "../components/HeaderProfiles";
import { useEffect, useRef, useState } from "react";
import { mostrarErroTopo } from "../utils/globalFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
// import { cadastrarFormacao } from "../ts/criarFormacoesFunctions"; // você precisará criar essa função

export default function CriarFormacoes() {
    // const navigate = useNavigate();

    const anoAtual = new Date().getFullYear();
    const anoMinimo = anoAtual - 100;

    const [nomeCurso, setNomeCurso] = useState('');
    const [instituicao, setInstituicao] = useState('');
    const [tipo, setTipo] = useState('');
    const [status, setStatus] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataConclusao, setDataConclusao] = useState('');
    const [cursandoAtual, setCursandoAtual] = useState(false);
    const [cargaHoraria, setCargaHoraria] = useState<number | ''>('');
    const [mediaFinal, setMediaFinal] = useState<number | ''>('');
    const [descricao, setDescricao] = useState('');
    const [competencias, setCompetencias] = useState<string[]>([]);
    const [linkInstituicao, setLinkInstituicao] = useState('');
    const [imagem, setImagem] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [cadastrando, setCadastrando] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const checkCursandoRef = useRef<HTMLInputElement>(null);
    const dataConclusaoRef = useRef<HTMLInputElement>(null);
    const [dataConclusaoContainerOpacity, setDataConclusaoContainerOpacity] = useState("opacity-100");

    const handleCheckCursando = () => {
        const checked = checkCursandoRef.current?.checked || false;
        if (checked) {
            setDataConclusaoContainerOpacity('opacity-50');
            if (dataConclusaoRef.current) {
                dataConclusaoRef.current.disabled = true;
            }
            setDataConclusao('');
        } else {
            setDataConclusaoContainerOpacity('opacity-100');
            if (dataConclusaoRef.current) {
                dataConclusaoRef.current.disabled = false;
            }
        }
        setCursandoAtual(checked);
    };

    useEffect(() => {
        const checkBox = checkCursandoRef.current;
        if (!checkBox) return;

        if (status === 'Concluído') {
            setCursandoAtual(false);
            checkBox.disabled = true;
            if (dataConclusaoRef.current?.disabled) {
                setDataConclusaoContainerOpacity('opacity-100');
                dataConclusaoRef.current.disabled = false;
            }
        } else {
            checkBox.disabled = false;
        }
    }, [status]);

    const descricaoLength = descricao.length;
    let corDescricaoLength = 'text-black dark:text-professional-subtitle';
    if (descricaoLength > 2990) corDescricaoLength = 'text-red-500';
    else if (descricaoLength > 2900) corDescricaoLength = 'text-yellow-500';

    const handleKeyDownTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        const valor = input.value.trim();
        if ((e.key === 'Enter' || e.key === ',') && valor !== '') {
            e.preventDefault();
            const tag = valor.replace(",", "");
            if (tag && !competencias.includes(tag)) {
                const regexTag = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s+#]{1,50}$/;
                if (!regexTag.test(tag)) {
                    mostrarErroTopo("Competência contém caracteres inválidos.");
                    return;
                }
                if (competencias.length >= 25) {
                    mostrarErroTopo("A formação pode ter no máximo 25 competências");
                    return;
                }
                setCompetencias((prev) => [...prev, tag]);
            }
            input.value = '';
        }
    };

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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSalvar = async () => {
        const regexNomeCurso = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\-()]+$/;
        const regexInstituicao = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\-.&()]+$/;
        const regexUrl = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/;

        if (!nomeCurso.trim()) {
            mostrarErroTopo("O nome do curso é obrigatório.");
            return;
        }

        if (!regexNomeCurso.test(nomeCurso.trim())) {
            mostrarErroTopo("Nome do curso contém caracteres inválidos.");
            return;
        }

        if (!instituicao.trim()) {
            mostrarErroTopo("A instituição de ensino é obrigatória.");
            return;
        }

        if (!regexInstituicao.test(instituicao.trim())) {
            mostrarErroTopo("A instituição contém caracteres inválidos.");
            return;
        }

        if (!tipo) {
            mostrarErroTopo("O tipo de formação é obrigatório.");
            return;
        }
        if (!status) {
            mostrarErroTopo("O status da formação é obrigatório.");
            return;
        }
        if (!dataInicio) {
            mostrarErroTopo("A data de início é obrigatória.");
            return;
        }
        if (status === 'Concluído' && !dataConclusao && !cursandoAtual) {
            mostrarErroTopo("Para formações concluídas, a data de conclusão é obrigatória.");
            return;
        }
        if (dataConclusao && dataInicio && dataConclusao < dataInicio) {
            mostrarErroTopo("A data de conclusão não pode ser anterior à data de início.");
            return;
        }
        if (!descricao.trim()) {
            mostrarErroTopo("A descrição da formação é obrigatória.");
            return;
        }

        if (linkInstituicao && !regexUrl.test(linkInstituicao)) {
            mostrarErroTopo("Link da instituição inválido.");
            return;
        }

        setCadastrando(true);
        // boa sorte no backend :) 
        //     tipo,
        //     status,
        //     dataInicio,
        //     dataConclusao,
        //     cursandoAtual,
        //     cargaHoraria || null,
        //     mediaFinal || null,
        //     descricao,
        //     competencias,
        //     linkInstituicao || null,
        //     imagem
        // if (!cadastrou) {
        //     setCadastrando(false);
        // } else {
        //     mostrarSucessoTopo('Formação cadastrada com sucesso!');
        //     setTimeout(() => { navigate('/perfil/candidato'); }, 3000);
        // }
    };

    const getStatusBadge = () => {
        if (status === 'Em andamento') {
            return <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Em andamento</span>;
        }
        if (status === 'Concluído') {
            return <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Concluído</span>;
        }
        return null;
    };

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-dark-600 transition-colors duration-300">
            <HeaderProfiles />
            <div id="main" className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
                <div className="page-header text-center mb-10">
                    <h1 className="text-4xl font-bold text-black dark:text-white gradient-text mb-2 flex items-center justify-center">
                        Criar Nova Formação
                        {getStatusBadge()}
                    </h1>
                    <p className="text-black dark:text-professional-subtitle text-lg max-w-2xl mx-auto">
                        Adicione sua formação acadêmica para fortalecer seu perfil profissional e evidenciar sua trajetória educacional.
                    </p>
                </div>

                <div id="caixaNova"
                    className="gradient-bg rounded-2xl p-10 border border-professional-card shadow-xl mb-8 animate-fade-in">

                    {/* Nome do Curso */}
                    <div className="mb-6">
                        <label htmlFor="inputCurso" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                            Nome do Curso *
                        </label>
                        <input
                            id="inputCurso"
                            type="text"
                            maxLength={100}
                            placeholder="Ex: Técnico em Desenvolvimento de Sistemas"
                            value={nomeCurso}
                            onChange={(e) => setNomeCurso(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-professional-card border border-professional-dark rounded-xl text-black dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-gray dark:placeholder-professional-subtitleText"
                        />
                    </div>

                    {/* Instituição */}
                    <div className="mb-6">
                        <label htmlFor="inputInstituicao" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                            Instituição de Ensino *
                        </label>
                        <input
                            id="inputInstituicao"
                            type="text"
                            maxLength={100}
                            placeholder="Ex: SENAI, Universidade Federal, Estácio"
                            value={instituicao}
                            onChange={(e) => setInstituicao(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-professional-card border border-professional-dark rounded-xl text-black dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-gray dark:placeholder-professional-subtitleText"
                        />
                    </div>

                    {/* Tipo de Formação e Status (lado a lado) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="selectTipo" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                                Tipo de Formação *
                            </label>
                            <select
                                id="selectTipo"
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-professional-card border border-professional-dark rounded-xl text-black dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20"
                            >
                                <option value="" disabled>Selecione o tipo</option>
                                <option value="Ensino Médio" className="bg-white dark:bg-professional-dark">Ensino Médio</option>
                                <option value="Técnico" className="bg-white dark:bg-professional-dark">Técnico</option>
                                <option value="Tecnólogo" className="bg-white dark:bg-professional-dark">Tecnólogo</option>
                                <option value="Bacharelado" className="bg-white dark:bg-professional-dark">Bacharelado</option>
                                <option value="Licenciatura" className="bg-white dark:bg-professional-dark">Licenciatura</option>
                                <option value="Pós-graduação" className="bg-white dark:bg-professional-dark">Pós-graduação</option>
                                <option value="MBA" className="bg-white dark:bg-professional-dark">MBA</option>
                                <option value="Mestrado" className="bg-white dark:bg-professional-dark">Mestrado</option>
                                <option value="Doutorado" className="bg-white dark:bg-professional-dark">Doutorado</option>
                                <option value="Curso Livre" className="bg-white dark:bg-professional-dark">Curso Livre</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="selectStatus" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                                Status *
                            </label>
                            <select
                                id="selectStatus"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-professional-card border border-professional-dark rounded-xl text-black dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20"
                            >
                                <option value="" disabled>Selecione o status</option>
                                <option value="Concluído" className="bg-white dark:bg-professional-dark">Concluído</option>
                                <option value="Em andamento" className="bg-white dark:bg-professional-dark">Em andamento</option>
                                <option value="Trancado" className="bg-white dark:bg-professional-dark">Trancado</option>
                                <option value="Cancelado" className="bg-white dark:bg-professional-dark">Cancelado</option>
                            </select>
                        </div>
                    </div>

                    {/* Datas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label htmlFor="dataInicio" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                                Data de Início *
                            </label>
                            <input
                                id="dataInicio"
                                type="month"
                                value={dataInicio}
                                onChange={(e) => setDataInicio(e.target.value)}
                                min={`${anoMinimo}-01`}
                                max={`${anoAtual}-12`}
                                className="w-full px-4 py-3 bg-white dark:bg-professional-card border border-professional-dark rounded-xl text-black dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20"
                            />
                        </div>

                        <div id="dataConclusaoContainer" className={dataConclusaoContainerOpacity}>
                            <label htmlFor="dataConclusao" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                                Data de Conclusão {status === 'Concluído' && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                id="dataConclusao"
                                type="month"
                                ref={dataConclusaoRef}
                                value={dataConclusao}
                                onChange={(e) => setDataConclusao(e.target.value)}
                                min={`${anoMinimo}-01`}
                                max={`${anoAtual}-12`}
                                className="w-full px-4 py-3 bg-white dark:bg-professional-card border border-professional-dark rounded-xl text-black dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20"
                            />
                        </div>

                        <div className="flex items-end">
                            <div className="flex items-center">
                                <input
                                    id="checkCursando"
                                    type="checkbox"
                                    ref={checkCursandoRef}
                                    checked={cursandoAtual}
                                    onChange={handleCheckCursando}
                                    className="w-5 h-5 appearance-none rounded-full border border-professional-card bg-white dark:bg-professional-dark checked:bg-professional-accent checked:border-professional-accent transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-professional-accent/50 transform -translate-y-4"
                                />
                                <label htmlFor="checkCursando"
                                    className="ml-2 text-black dark:text-professional-subtitle font-medium select-none transform -translate-y-4">
                                    Cursando atualmente
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Carga Horária e Média Final (opcionais) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="cargaHoraria" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                                Carga Horária (opcional)
                            </label>
                            <input
                                id="cargaHoraria"
                                type="number"
                                min={1}
                                max={20000}
                                value={cargaHoraria}
                                onChange={(e) => setCargaHoraria(e.target.value ? Number(e.target.value) : '')}
                                onKeyDown={(e) => {
                                    if (['e', 'E', '+', '-'].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                placeholder="Ex: 360"
                                className="w-full px-4 py-3 bg-white dark:bg-professional-card border border-professional-dark rounded-xl text-black dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-gray dark:placeholder-professional-subtitleText"
                            />
                        </div>
                        <div>
                            <label htmlFor="mediaFinal" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                                Média Final / CRA (opcional)
                            </label>
                            <input
                                id="mediaFinal"
                                type="number"
                                step="0.01"
                                min={0}
                                max={10}
                                value={mediaFinal}
                                onChange={(e) => setMediaFinal(e.target.value ? Number(e.target.value) : '')}
                                onKeyDown={(e) => {
                                    if (['e', 'E', '+', '-'].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                placeholder="Ex: 8.5"
                                className="w-full px-4 py-3 bg-white dark:bg-professional-card border border-professional-dark rounded-xl text-black dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-gray dark:placeholder-professional-subtitleText"
                            />
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="mb-6">
                        <label htmlFor="caixaText" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                            Descrição da Formação *
                        </label>
                        <textarea
                            id="caixaText"
                            placeholder="Descreva as principais disciplinas, projetos acadêmicos relevantes, competências desenvolvidas e foco da formação."
                            maxLength={3000}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            className="w-full h-48 px-6 py-4 bg-white dark:bg-professional-card border border-professional-dark rounded-xl text-black dark:text-professional-text text-xl font-semibold resize-y transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-gray dark:placeholder-professional-subtitleText"
                        ></textarea>
                        <div className={`char-counter text-right ${corDescricaoLength} text-sm mt-2`} id="charCounter">
                            {`${descricaoLength}/3000 caracteres`}
                        </div>
                    </div>

                    {/* Competências (Tags) */}
                    <div className="mb-6">
                        <label htmlFor="inputCompetencias" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                            Competências Desenvolvidas (Opcional)
                        </label>
                        <div
                            className="flex flex-wrap items-center bg-white dark:bg-professional-card border border-professional-dark rounded-xl px-4 py-3 transition-all focus-within:border-professional-accent focus-within:ring-3 focus-within:ring-professional-accent/20"
                        >
                            <div id="tagsContainer" className="flex flex-wrap items-center">
                                {competencias.map((tag, index) => (
                                    <div
                                        className="tag inline-flex items-center bg-black text-slate-300 px-3 py-1 rounded-md text-xs mr-2 mb-2"
                                        key={tag}
                                    >
                                        {tag}
                                        <span
                                            className="tag-remove ml-2 cursor-pointer text-slate-300 hover:text-slate-50"
                                            onClick={() => setCompetencias((prev) => prev.filter((_, i) => i !== index))}
                                        >
                                            <FontAwesomeIcon icon={faXmark} />
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <input
                                id="inputCompetencias"
                                type="text"
                                placeholder="Digite uma competência e pressione Enter"
                                onKeyDown={handleKeyDownTag}
                                className="flex-1 bg-transparent border-0 outline-0 text-black dark:text-professional-text placeholder-professional-gray dark:placeholder-professional-subtitleText"
                            />
                        </div>
                        <p className="text-black dark:text-professional-subtitle text-xs mt-2">
                            Pressione Enter ou vírgula para adicionar uma competência
                        </p>
                    </div>

                    {/* Link da Instituição */}
                    <div className="mb-6">
                        <label htmlFor="inputLink" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                            Link da Instituição (Opcional)
                        </label>
                        <input
                            id="inputLink"
                            type="url"
                            placeholder="https://instituicao.edu.br"
                            value={linkInstituicao}
                            onChange={(e) => setLinkInstituicao(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-professional-card border border-professional-dark rounded-xl text-black dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-gray dark:placeholder-professional-subtitleText"
                        />
                    </div>

                    {/* Imagem (Diploma/Comprovante) */}
                    <div className="mb-6">
                        <label className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                            Diploma ou Comprovante (Opcional)
                        </label>
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
                                    : "border-professional-card bg-white dark:bg-professional-card hover:border-professional-accent hover:bg-professional-accent/5"
                                }`}
                        >
                            {!preview ? (
                                <div className="flex flex-col items-center pointer-events-none">
                                    <i className="bx bx-cloud-upload text-5xl text-professional-accent mb-4"></i>
                                    <div className="text-black dark:text-professional-subtitle mb-4">
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
                        {imagem && (
                            <div className="flex items-center gap-2 mt-4 p-3 bg-professional-accent/10 rounded-lg">
                                <i className="bx bx-file text-professional-accent"></i>
                                <div className="flex-1 text-sm text-black dark:text-professional-subtitle truncate">
                                    {imagem.name}
                                </div>
                                <div className="text-xs text-black dark:text-professional-subtitle">
                                    {(imagem.size / 1024).toFixed(1)} KB
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Botões */}
                <div id="btns" className="flex justify-center gap-6 mt-8">
                    <button
                        disabled={cadastrando}
                        className="btn flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-xl transition-all bg-gradient-to-r from-professional-accent to-professional-lightaccent text-white shadow-lg shadow-professional-accent/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-professional-accent/40 cursor-pointer"
                        id="btnSalvar"
                        onClick={handleSalvar}
                    >
                        <i className='bx bx-save'></i> {cadastrando ? 'Cadastrando...' : 'Salvar Formação'}
                    </button>
                    <Link to="/perfil/candidato">
                        <button
                            className="btn flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-xl transition-all bg-professional-card text-white dark:text-professional-subtitle hover:bg-professional-card/80 hover:-translate-y-1 cursor-pointer"
                            id="btnVoltar"
                        >
                            <i className='bx bx-arrow-back'></i> Retornar ao Perfil
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}