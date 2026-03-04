import { Link, useNavigate } from "react-router-dom";
import HeaderProfiles from "../components/HeaderProfiles";
import { useEffect, useRef, useState } from "react";
import { mostrarErroTopo, mostrarSucessoTopo } from "../utils/globalFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
// Função que deve ser implementada para salvar a certificação
// import { cadastrarCertificacao } from "../ts/criarCertificacoesFunctions";

export default function CriarCertificacoes() {
    const navigate = useNavigate();

    const [nomeCertificacao, setNomeCertificacao] = useState('');
    const [instituicao, setInstituicao] = useState('');
    const [nivel, setNivel] = useState('');
    const [status, setStatus] = useState('');
    const [dataEmissao, setDataEmissao] = useState('');
    const [dataExpiracao, setDataExpiracao] = useState('');
    const [semExpiracao, setSemExpiracao] = useState(false);
    const [credentialId, setCredentialId] = useState('');
    const [linkValidacao, setLinkValidacao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [competencias, setCompetencias] = useState<string[]>([]);
    const [cargaHoraria, setCargaHoraria] = useState<number | ''>('');

    const [cadastrando, setCadastrando] = useState(false);
    const descricaoLength = descricao.length;
    let corDescricaoLength = 'text-black dark:text-professional-subtitle';
    if (descricaoLength > 2990) corDescricaoLength = 'text-red-500';
    else if (descricaoLength > 2900) corDescricaoLength = 'text-yellow-500';

    const checkSemExpiracaoRef = useRef<HTMLInputElement>(null);
    const dataExpiracaoRef = useRef<HTMLInputElement>(null);
    const [dataExpiracaoContainerOpacity, setDataExpiracaoContainerOpacity] = useState("opacity-100");
    const handleCheckSemExpiracao = () => {
        const checked = checkSemExpiracaoRef.current?.checked || false;
        if (checked) {
            setDataExpiracaoContainerOpacity('opacity-50');
            if (dataExpiracaoRef.current) {
                dataExpiracaoRef.current.disabled = true;
            }
            setDataExpiracao('');
        } else {
            setDataExpiracaoContainerOpacity('opacity-100');
            if (dataExpiracaoRef.current) {
                dataExpiracaoRef.current.disabled = false;
            }
        }
    };

    useEffect(() => {

    }, [status]);

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
                    mostrarErroTopo("A certificação só pode ter até 25 competências.");
                    return;
                }
                setCompetencias(prev => [...prev, tag]);
            }
            input.value = '';
        }
    };

    const [imagem, setImagem] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!imagem) return;
        const objectUrl = URL.createObjectURL(imagem);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [imagem]);

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            mostrarErroTopo("Por favor, selecione uma imagem.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            mostrarErroTopo("O arquivo deve ter no máximo 5MB.");
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

    const anoAtual = new Date().getFullYear();
    const anoMinimo = anoAtual - 100;

    const handleSalvar = async () => {
        const regexNome = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\-()]+$/;
        const regexInstituicao = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\-.&()]+$/;
        const regexUrl = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-./?%&=]*)?$/;
        const regexCredential = /^[A-Za-z0-9\-]+$/;

        if (!nomeCertificacao.trim()) {
            mostrarErroTopo("O nome da certificação é obrigatório.");
            return;
        }
        if (!regexNome.test(nomeCertificacao.trim())) {
            mostrarErroTopo("Nome da certificação contém caracteres inválidos.");
            return;
        }
        if (!instituicao.trim()) {
            mostrarErroTopo("A instituição certificadora é obrigatória.");
            return;
        }
        if (!regexInstituicao.test(instituicao.trim())) {
            mostrarErroTopo("A instituição contém caracteres inválidos.");
            return;
        }
        if (credentialId && !regexCredential.test(credentialId.trim())) {
            mostrarErroTopo("Código de verificação inválido (apenas letras, números e hífen).");
            return;
        }
        if (linkValidacao && !regexUrl.test(linkValidacao)) {
            mostrarErroTopo("Link de validação inválido.");
            return;
        }
        if (!nivel) {
            mostrarErroTopo("Selecione o nível da certificação.");
            return;
        }
        if (!status) {
            mostrarErroTopo("Selecione o status da certificação.");
            return;
        }
        if (!dataEmissao) {
            mostrarErroTopo("A data de emissão é obrigatória.");
            return;
        }
        if (!semExpiracao && !dataExpiracao) {
            mostrarErroTopo("Informe a data de expiração ou marque 'Sem expiração'.");
            return;
        }
        if (!semExpiracao && dataExpiracao && dataExpiracao < dataEmissao) {
            mostrarErroTopo("A data de expiração não pode ser anterior à data de emissão.");
            return;
        }
        if (status === 'Concluída' && !dataEmissao) {
            mostrarErroTopo("Para certificações concluídas, a data de emissão é obrigatória.");
            return;
        }
        if (status === 'Expirada' && (!dataExpiracao || semExpiracao)) {
            mostrarErroTopo("Certificações expiradas devem ter uma data de expiração.");
            return;
        }

        setCadastrando(true);
        // aqui é so para simulação, boa sorte com o backend
        const cadastrou = true; 

        if (!cadastrou) {
            setCadastrando(false);
        } else {
            mostrarSucessoTopo('Certificação cadastrada com sucesso!');
            setTimeout(() => { navigate('/perfil/candidato'); }, 3000);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-dark-600 transition-colors duration-300">
            <HeaderProfiles />
            <div id="main" className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
                <div className="page-header text-center mb-10">
                    <h1 className="text-4xl font-bold text-black dark:text-white gradient-text mb-2">Criar Nova Certificação</h1>
                    <p className="text-black dark:text-professional-subtitle text-lg max-w-2xl mx-auto">
                        Adicione certificações profissionais para fortalecer seu perfil e destacar suas competências técnicas.
                    </p>
                </div>

                <div id="caixaNova"
                    className="gradient-bg rounded-2xl p-10 border border-professional-card shadow-xl mb-8 animate-fade-in">
                    
                    {/* Nome da Certificação */}
                    <div className="mb-6">
                        <label htmlFor="inputNome" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                            Nome da Certificação *
                        </label>
                        <input
                            id="inputNome"
                            type="text"
                            maxLength={100}
                            placeholder="Ex: AWS Certified Solutions Architect"
                            value={nomeCertificacao}
                            onChange={(e) => setNomeCertificacao(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-professional-card border border-professional-dark rounded-xl text-black dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-gray dark:placeholder-professional-subtitleText"
                        />
                    </div>

                    {/* Instituição Certificadora */}
                    <div className="mb-6">
                        <label htmlFor="inputInstituicao" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                            Instituição Certificadora *
                        </label>
                        <input
                            id="inputInstituicao"
                            type="text"
                            maxLength={80}
                            placeholder="Ex: SENAI, Microsoft, AWS, Cisco, PMI"
                            value={instituicao}
                            onChange={(e) => setInstituicao(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-professional-card border border-professional-dark rounded-xl text-black dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-gray dark:placeholder-professional-subtitleText"
                        />
                    </div>

                    {/* Nível e Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="selectNivel" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                                Nível da Certificação *
                            </label>
                            <select
                                id="selectNivel"
                                value={nivel}
                                onChange={(e) => setNivel(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-professional-card border border-professional-dark rounded-xl text-black dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20"
                            >
                                <option value="" disabled>Selecione o nível</option>
                                <option value="Fundamental" className="bg-white dark:bg-professional-dark">Fundamental</option>
                                <option value="Associate" className="bg-white dark:bg-professional-dark">Associate</option>
                                <option value="Professional" className="bg-white dark:bg-professional-dark">Professional</option>
                                <option value="Specialist" className="bg-white dark:bg-professional-dark">Specialist</option>
                                <option value="Expert" className="bg-white dark:bg-professional-dark">Expert</option>
                                <option value="Outro" className="bg-white dark:bg-professional-dark">Outro</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="selectStatus" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                                Status da Certificação *
                            </label>
                            <select
                                id="selectStatus"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-professional-card border border-professional-dark rounded-xl text-black dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20"
                            >
                                <option value="" disabled>Selecione o status</option>
                                <option value="Concluída" className="bg-white dark:bg-professional-dark">Concluída</option>
                                <option value="Em andamento" className="bg-white dark:bg-professional-dark">Em andamento</option>
                                <option value="Expirada" className="bg-white dark:bg-professional-dark">Expirada</option>
                                <option value="Cancelada" className="bg-white dark:bg-professional-dark">Cancelada</option>
                            </select>
                        </div>
                    </div>

                    {/* Datas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label htmlFor="dataEmissao" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                                Data de Emissão *
                            </label>
                            <input
                                id="dataEmissao"
                                type="month"
                                value={dataEmissao}
                                onChange={(e) => setDataEmissao(e.target.value)}
                                min={`${anoMinimo}-01`}
                                max={`${anoAtual}-12`}
                                className="w-full px-4 py-3 bg-white dark:bg-professional-card border border-professional-dark rounded-xl text-black dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20"
                            />
                        </div>

                        <div id="dataExpiracaoContainer" className={dataExpiracaoContainerOpacity}>
                            <label htmlFor="dataExpiracao" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                                Data de Expiração {!semExpiracao && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                id="dataExpiracao"
                                type="month"
                                ref={dataExpiracaoRef}
                                value={dataExpiracao}
                                onChange={(e) => setDataExpiracao(e.target.value)}
                                min={`${anoMinimo}-01`}
                                max={`${anoAtual + 20}-12`} 
                                className="w-full px-4 py-3 bg-white dark:bg-professional-card border border-professional-dark rounded-xl text-black dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20"
                            />
                        </div>

                        <div className="flex items-end">
                            <div className="flex items-center">
                                <input
                                    id="checkSemExpiracao"
                                    type="checkbox"
                                    ref={checkSemExpiracaoRef}
                                    checked={semExpiracao}
                                    onChange={(e) => {
                                        setSemExpiracao(e.target.checked);
                                        handleCheckSemExpiracao();
                                    }}
                                    className="w-5 h-5 appearance-none rounded-full border border-professional-card checked:bg-professional-accent checked:border-professional-accent transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-professional-accent/50 transform -translate-y-4"
                                />
                                <label htmlFor="checkSemExpiracao"
                                    className="ml-2 text-black dark:text-professional-subtitle font-medium select-none transform -translate-y-4">
                                    Certificação sem expiração
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Código de Verificação e Link de Validação */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="credentialId" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                                Código de Verificação / Credential ID (Opcional)
                            </label>
                            <input
                                id="credentialId"
                                type="text"
                                placeholder="Ex: ABC123XYZ"
                                value={credentialId}
                                onChange={(e) => setCredentialId(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-professional-card border border-professional-dark rounded-xl text-black dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-gray dark:placeholder-professional-subtitleText"
                            />
                        </div>
                        <div>
                            <label htmlFor="linkValidacao" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                                Link de Validação (Opcional)
                            </label>
                            <input
                                id="linkValidacao"
                                type="url"
                                placeholder="https://www.credly.com/..."
                                value={linkValidacao}
                                onChange={(e) => setLinkValidacao(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-professional-card border border-professional-dark rounded-xl text-black dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-gray dark:placeholder-professional-subtitleText"
                            />
                        </div>
                    </div>

                    {/* Carga Horária (diferencial) */}
                    <div className="mb-6">
                        <label htmlFor="cargaHoraria" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                            Carga Horária (opcional, em horas)
                        </label>
                        <input
                            id="cargaHoraria"
                            type="number"
                            min="1"
                            max="2000"
                            placeholder="Ex: 40"
                            value={cargaHoraria}
                            onChange={(e) => setCargaHoraria(e.target.value ? Number(e.target.value) : '')}
                            onKeyDown={(e) => {
                                if (['e', 'E', '+', '-'].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                                className="w-full px-4 py-3 bg-white dark:bg-professional-card border border-professional-dark rounded-xl text-black dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20 placeholder-professional-gray dark:placeholder-professional-subtitleText"
                        />
                    </div>

                    {/* Descrição */}
                    <div className="mb-6">
                        <label htmlFor="descricao" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                            Descrição da Certificação *
                        </label>
                        <textarea
                            id="descricao"
                            placeholder="Descreva os conhecimentos adquiridos, habilidades desenvolvidas e o contexto da certificação."
                            maxLength={3000}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            className="w-full h-48 px-6 py-4 bg-white dark:bg-professional-card border border-professional-dark rounded-xl text-black dark:text-professional-text transition-all focus:outline-none focus:border-professional-accent focus:ring-3 focus:ring-professional-accent/20"
                        />
                        <div className={`char-counter text-right ${corDescricaoLength} text-sm mt-2`}>
                            {descricaoLength}/3000 caracteres
                        </div>
                    </div>

                    {/* Competências (Tags) */}
                    <div className="mb-6">
                        <label htmlFor="inputCompetencias" className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                            Competências Desenvolvidas (Opcional)
                        </label>
                        <div className="flex flex-wrap items-center bg-white dark:bg-professional-card border border-professional-dark rounded-xl px-4 py-3 transition-all focus-within:border-professional-accent focus-within:ring-3 focus-within:ring-professional-accent/20">
                            <div className="flex flex-wrap items-center">
                                {competencias.map((tag, index) => (
                                    <div key={tag} className="tag inline-flex items-center bg-professional-gray text-slate-300 px-3 py-1 rounded-md text-xs mr-2 mb-2">
                                        {tag}
                                        <span
                                            className="tag-remove ml-2 cursor-pointer text-slate-300 hover:text-slate-50"
                                            onClick={() => setCompetencias(prev => prev.filter((_, i) => i !== index))}
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

                    {/* Upload de Imagem */}
                    <div className="mb-6">
                        <label className="block text-black dark:text-professional-subtitle mb-2 font-medium">
                            Logo ou Certificado (Imagem opcional)
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

                {/* Botões de ação */}
                <div id="btns" className="flex justify-center gap-6 mt-8">
                    <button
                        disabled={cadastrando}
                        className="btn flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-xl transition-all bg-gradient-to-r from-professional-accent to-professional-lightaccent text-white shadow-lg shadow-professional-accent/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-professional-accent/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        id="btnSalvar"
                        onClick={handleSalvar}
                    >
                        <i className='bx bx-save'></i> {cadastrando ? 'Cadastrando...' : 'Salvar Certificação'}
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