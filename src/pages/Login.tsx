// * Pacotes
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding, faEye, faEyeSlash, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import ParticlesBackgroundComponent from './ParticlesBackground';
import backgroundroxo from '../assets/imgs/purpleBG.png'

// * Funções
import { candidatoLogin, candidatoRegister, empresaLogin, empresaRegister, formatarCep, formatarCnpj, formatarData, formatarTelefone, validarCep } from '../ts/loginFunctions'

// * CSS
import '../css/login.css'

export default function Login() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState<"user-login" | "user-register" | "company-login" | "company-register">("user-login");
    const switchTab = (tabId: typeof activeTab) => {
        setActiveTab(tabId);
    };
    const [showOtherGender, setShowOtherGender] = useState(false);

    const [errorInputCand, setErrorInputCand] = useState({ campo: "", mensagem: "" });
    function limparErroCand(): void {
        setErrorInputCand({ campo: "", mensagem: "" });
    };
    const [erroInputEmp, setErroInputEmp] = useState({ campo: "", mensagem: "" });
    function limparErroEmp(): void {
        setErroInputEmp({ campo: "", mensagem: "" });
    }

    const [userLogin, setUserLogin] = useState({ email: "", senha: "", lembreMe: false });
    const [userRegister, setUserRegister] = useState({ nome: "", sobrenome: "", email: "", senha: "", senhaConfirm: "", data_nasc: "", genero: "", outroGenero: "" });
    const [companyLogin, setCompanyLogin] = useState({ cnpj: "", senha: "" });
    const [companyRegister, setCompanyRegister] = useState({ email: "", razao_soci: "", nome_fant: "", cnpj: "", telefone: "", senha: "", senhaConfirm: "", cep: "", rua: "", bairro: "", cidade: "", estado: "", numero: "", complemento: "" });

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 flex justify-center items-center p-5">
            <ParticlesBackgroundComponent />
            <div className="w-full max-w-md bg-gray-800/95 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                {/* Abas de navegação */}
                <div className="flex bg-black/30 border-b border-white/10">
                    <button
                        className={`flex-1 px-4 py-4 flex items-center justify-center gap-2 transition-all duration-300 ${activeTab.includes("user")
                                ? "bg-gradient-to-br from-purple-600 to-purple-500 text-white"
                                : "text-white/60 hover:text-white/80 hover:bg-white/5"
                            }`}
                        onClick={() => switchTab("user-login")}
                    >
                        <FontAwesomeIcon icon={faUser} /> Candidato
                    </button>
                    <button
                        className={`flex-1 px-4 py-4 flex items-center justify-center gap-2 transition-all duration-300 ${activeTab.includes("company")
                                ? "bg-gradient-to-br from-purple-600 to-purple-500 text-white"
                                : "text-white/60 hover:text-white/80 hover:bg-white/5"
                            }`}
                        onClick={() => switchTab("company-login")}
                    >
                        <FontAwesomeIcon icon={faBuilding} /> Empresa
                    </button>
                </div>

                <div className="p-8">
                    {/* Login de Usuário */}
                    {activeTab === "user-login" && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-semibold text-white text-center mb-6">Entrar como candidato</h2>

                            <form id="loginForm" action="#">
                                <div className="mb-4">
                                    <label htmlFor="username" className="block text-white text-sm font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        id="username"
                                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors"
                                        placeholder="seu@email.com"
                                        required
                                        value={userLogin.email}
                                        onChange={(e) => setUserLogin({ ...userLogin, email: e.target.value })}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password" className="block text-white text-sm font-medium mb-2">Senha</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors pr-12"
                                            placeholder="Digite sua senha"
                                            required
                                            value={userLogin.senha}
                                            onChange={(e) => setUserLogin({ ...userLogin, senha: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-1 text-white/60 hover:text-white transition-colors"
                                            onClick={() => setShowPassword((p) => !p)}
                                        >
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer text-white text-sm mb-4 relative">
                                    <input
                                        type="checkbox"
                                        className="absolute opacity-0 cursor-pointer"
                                        onChange={(e) => setUserLogin({ ...userLogin, lembreMe: e.target.checked })}
                                    />
                                    <span className="w-4 h-4 bg-gray-700 border-2 border-purple-500 rounded transition-all duration-300 flex items-center justify-center">
                                        {userLogin.lembreMe && (
                                            <div className="w-1.5 h-2.5 border-r-2 border-b-2 border-white transform rotate-45 -translate-y-0.5" />
                                        )}
                                    </span>
                                    Lembre-me
                                </label>

                                <button
                                    type="submit"
                                    className="w-full py-3.5 bg-gradient-to-br from-purple-600 to-purple-500 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-600 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 mb-4"
                                    onClick={async (e) => {
                                        const logado = await candidatoLogin(e, userLogin);
                                        if (logado) navigate('/');
                                    }}
                                >
                                    Entrar
                                </button>
                            </form>

                            <div className="text-center">
                                <Link
                                    to="#"
                                    className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                                    onClick={(e) => { e.preventDefault(); switchTab("user-register") }}
                                >
                                    Não tem uma conta? Cadastre-se
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Cadastro de Usuário */}
                    {activeTab === "user-register" && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-semibold text-white text-center mb-6">Cadastre-se como candidato</h2>

                            <form id="registerForm" action="#">
                                <div className="mb-4">
                                    <label htmlFor="regUsername" className="block text-white text-sm font-medium mb-2">Nome</label>
                                    <input
                                        type="text"
                                        id="regUsername"
                                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors"
                                        placeholder="Seu nome"
                                        required
                                        maxLength={100}
                                        value={userRegister.nome}
                                        onChange={(e) => { limparErroCand(); setUserRegister({ ...userRegister, nome: e.target.value }) }}
                                    />
                                    {errorInputCand.campo === "nome" && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded-lg animate-fade-in">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> {errorInputCand.mensagem}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="regUsernameSobre" className="block text-white text-sm font-medium mb-2">Sobrenome</label>
                                    <input
                                        type="text"
                                        id="regUsernameSobre"
                                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors"
                                        placeholder="Seu sobrenome"
                                        required
                                        maxLength={100}
                                        value={userRegister.sobrenome}
                                        onChange={(e) => { limparErroCand(); setUserRegister({ ...userRegister, sobrenome: e.target.value }) }}
                                    />
                                    {errorInputCand.campo === "sobrenome" && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded-lg animate-fade-in">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> {errorInputCand.mensagem}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-white text-sm font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors"
                                        placeholder="seu@email.com"
                                        required
                                        maxLength={254}
                                        value={userRegister.email}
                                        onChange={(e) => { limparErroCand(); setUserRegister({ ...userRegister, email: e.target.value }) }}
                                    />
                                    {errorInputCand.campo === "email" && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded-lg animate-fade-in">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> {errorInputCand.mensagem}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="registerPassword" className="block text-white text-sm font-medium mb-2">Senha</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="registerPassword"
                                            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors pr-12"
                                            placeholder="Crie uma senha forte"
                                            required
                                            value={userRegister.senha}
                                            onChange={(e) => { limparErroCand(); setUserRegister({ ...userRegister, senha: e.target.value }) }}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-1 text-white/60 hover:text-white transition-colors"
                                            onClick={() => setShowPassword((p) => !p)}
                                        >
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                    {errorInputCand.campo === "senha" && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded-lg animate-fade-in">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> {errorInputCand.mensagem}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="block text-white text-sm font-medium mb-2">Confirmar senha</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors pr-12"
                                            placeholder="Confirme sua senha"
                                            required
                                            value={userRegister.senhaConfirm}
                                            onChange={(e) => { limparErroCand(); setUserRegister({ ...userRegister, senhaConfirm: e.target.value }) }}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-1 text-white/60 hover:text-white transition-colors"
                                            onClick={() => setShowPassword((p) => !p)}
                                        >
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                    {errorInputCand.campo === "senhaConfirm" && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded-lg animate-fade-in">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> {errorInputCand.mensagem}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="dob" className="block text-white text-sm font-medium mb-2">Data de nascimento</label>
                                    <input
                                        type="text"
                                        id="dob"
                                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors"
                                        placeholder="DD/MM/AAAA"
                                        maxLength={10}
                                        required
                                        value={userRegister.data_nasc}
                                        onChange={(e) => { limparErroCand(); formatarData(e); setUserRegister({ ...userRegister, data_nasc: e.target.value }) }}
                                    />
                                    {errorInputCand.campo === "data_nasc" && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded-lg animate-fade-in">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> {errorInputCand.mensagem}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="genderSelect" className="block text-white text-sm font-medium mb-2">Gênero</label>
                                    <select
                                        id="genderSelect"
                                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors"
                                        required
                                        value={userRegister.genero}
                                        onChange={(e) => {
                                            limparErroCand();
                                            const value = e.target.value;
                                            setUserRegister({ ...userRegister, genero: value });
                                            setShowOtherGender(value === "Outro");
                                        }}
                                    >
                                        <option value="" disabled>Selecione</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Feminino">Feminino</option>
                                        <option value="Não-binário">Não-binário</option>
                                        <option value="Outro">Outro</option>
                                        <option value="Prefiro não dizer">Prefiro não dizer</option>
                                    </select>
                                    {errorInputCand.campo === "genero" && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded-lg animate-fade-in">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> {errorInputCand.mensagem}
                                        </div>
                                    )}
                                    {showOtherGender && (
                                        <div className="mt-3 transition-all duration-300 animate-fade-in">
                                            <input
                                                type="text"
                                                id="outroGeneroInput"
                                                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors"
                                                placeholder="Especifique seu gênero"
                                                maxLength={30}
                                                value={userRegister.outroGenero}
                                                onChange={(e) => { limparErroCand(); setUserRegister({ ...userRegister, outroGenero: e.target.value }) }}
                                            />
                                            {errorInputCand.campo === "outroGenero" && (
                                                <div className="flex items-center gap-2 text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded-lg animate-fade-in">
                                                    <FontAwesomeIcon icon={faExclamationCircle} /> {errorInputCand.mensagem}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3.5 bg-gradient-to-br from-purple-600 to-purple-500 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-600 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 mb-4"
                                    onClick={async (e) => {
                                        const emailRedirect = userRegister.email;
                                        const registro = await candidatoRegister(e, userRegister);
                                        if (!registro.success) {
                                            if (registro.inputError?.campo === 'general') return;
                                            setErrorInputCand({ campo: registro.inputError?.campo || "", mensagem: registro.inputError?.mensagem || "" });
                                            return;
                                        } else navigate(`/confirmar?email=${emailRedirect}`);
                                    }}
                                >
                                    Cadastrar
                                </button>
                            </form>

                            <div className="text-center">
                                <Link
                                    to="#"
                                    className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                                    onClick={(e) => { e.preventDefault(); switchTab("user-login") }}
                                >
                                    Já tem uma conta? Faça login
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Login de Empresa */}
                    {activeTab === "company-login" && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-semibold text-white text-center mb-6">Entrar como empresa</h2>

                            <form id="loginEmpresaForm" action="#">
                                <div className="mb-4">
                                    <label htmlFor="empresaCNPJ" className="block text-white text-sm font-medium mb-2">CNPJ</label>
                                    <input
                                        type="text"
                                        id="empresaCNPJ"
                                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors"
                                        placeholder="00.000.000/0000-00"
                                        required
                                        value={companyLogin.cnpj}
                                        onChange={(e) => { formatarCnpj(e); setCompanyLogin({ ...companyLogin, cnpj: e.target.value }) }}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="empresaSenha" className="block text-white text-sm font-medium mb-2">Senha</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="empresaSenha"
                                            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors pr-12"
                                            placeholder="Digite sua senha"
                                            required
                                            value={companyLogin.senha}
                                            onChange={(e) => setCompanyLogin({ ...companyLogin, senha: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-1 text-white/60 hover:text-white transition-colors"
                                            onClick={() => setShowPassword((p) => !p)}
                                        >
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3.5 bg-gradient-to-br from-purple-600 to-purple-500 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-600 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 mb-4"
                                    onClick={async (e) => {
                                        const logado = await empresaLogin(e, companyLogin);
                                        if (logado) navigate('/');
                                    }}
                                >
                                    Entrar
                                </button>
                            </form>

                            <div className="text-center">
                                <Link
                                    to="#"
                                    className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                                    onClick={(e) => { e.preventDefault(); switchTab("company-register") }}
                                >
                                    Não tem uma conta? Cadastre-se
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Cadastro de Empresa */}
                    {activeTab === "company-register" && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-semibold text-white text-center mb-6">Cadastre-se como empresa</h2>

                            <form id="registerEmpresaForm" action="#">
                                <div className="mb-4">
                                    <label htmlFor="empresaEmail" className="block text-white text-sm font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        id="empresaEmail"
                                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors"
                                        placeholder="empresa@email.com"
                                        required
                                        value={companyRegister.email}
                                        onChange={(e) => { limparErroEmp(); setCompanyRegister({ ...companyRegister, email: e.target.value }) }}
                                    />
                                    {erroInputEmp.campo === "email" && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded-lg animate-fade-in">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> {erroInputEmp.mensagem}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="empresaRazao" className="block text-white text-sm font-medium mb-2">Razão Social</label>
                                    <input
                                        type="text"
                                        id="empresaRazao"
                                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors"
                                        placeholder="Nome legal da empresa"
                                        required
                                        value={companyRegister.razao_soci}
                                        onChange={(e) => { limparErroEmp(); setCompanyRegister({ ...companyRegister, razao_soci: e.target.value }) }}
                                    />
                                    {erroInputEmp.campo === "razao_soci" && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded-lg animate-fade-in">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> {erroInputEmp.mensagem}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="empresaFantasia" className="block text-white text-sm font-medium mb-2">Nome Fantasia</label>
                                    <input
                                        type="text"
                                        id="empresaFantasia"
                                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors"
                                        placeholder="Nome comercial da empresa"
                                        required
                                        value={companyRegister.nome_fant}
                                        onChange={(e) => { limparErroEmp(); setCompanyRegister({ ...companyRegister, nome_fant: e.target.value }) }}
                                    />
                                    {erroInputEmp.campo === "nome_fant" && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded-lg animate-fade-in">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> {erroInputEmp.mensagem}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="empresaCNPJRegister" className="block text-white text-sm font-medium mb-2">CNPJ</label>
                                    <input
                                        type="text"
                                        id="empresaCNPJRegister"
                                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors"
                                        placeholder="00.000.000/0000-00"
                                        required
                                        value={companyRegister.cnpj}
                                        onChange={(e) => { limparErroEmp(); formatarCnpj(e); setCompanyRegister({ ...companyRegister, cnpj: e.target.value }) }}
                                    />
                                    {erroInputEmp.campo === "cnpj" && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded-lg animate-fade-in">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> {erroInputEmp.mensagem}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="empresaTelefone" className="block text-white text-sm font-medium mb-2">Telefone</label>
                                    <input
                                        type="tel"
                                        id="empresaTelefone"
                                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors"
                                        placeholder="+55 11 12345-6789"
                                        required
                                        value={companyRegister.telefone}
                                        onChange={(e) => { limparErroEmp(); formatarTelefone(e); setCompanyRegister({ ...companyRegister, telefone: e.target.value }) }}
                                    />
                                    {erroInputEmp.campo === "telefone" && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded-lg animate-fade-in">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> {erroInputEmp.mensagem}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="empresaRegisterPassword" className="block text-white text-sm font-medium mb-2">Senha</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="empresaRegisterPassword"
                                            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors pr-12"
                                            placeholder="Crie uma senha forte"
                                            required
                                            value={companyRegister.senha}
                                            onChange={(e) => { limparErroEmp(); setCompanyRegister({ ...companyRegister, senha: e.target.value }) }}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-1 text-white/60 hover:text-white transition-colors"
                                            onClick={() => setShowPassword((p) => !p)}
                                        >
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                    {erroInputEmp.campo === "senha" && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded-lg animate-fade-in">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> {erroInputEmp.mensagem}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="empresaConfirmPassword" className="block text-white text-sm font-medium mb-2">Confirmar senha</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="empresaConfirmPassword"
                                            className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors pr-12"
                                            placeholder="Confirme sua senha"
                                            required
                                            value={companyRegister.senhaConfirm}
                                            onChange={(e) => { limparErroEmp(); setCompanyRegister({ ...companyRegister, senhaConfirm: e.target.value }) }}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-1 text-white/60 hover:text-white transition-colors"
                                            onClick={() => setShowPassword((p) => !p)}
                                        >
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                    {erroInputEmp.campo === "senhaConfirm" && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded-lg animate-fade-in">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> {erroInputEmp.mensagem}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="empresaCep" className="block text-white text-sm font-medium mb-2">CEP</label>
                                    <input
                                        type="text"
                                        id="empresaCep"
                                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors"
                                        placeholder="00000-000"
                                        required
                                        value={companyRegister.cep}
                                        onChange={async (e) => {
                                            limparErroEmp();
                                            formatarCep(e);
                                            const newCep = e.target.value
                                            setCompanyRegister({ ...companyRegister, cep: newCep });
                                            if (newCep.length === 9) {
                                                const cepVali = await validarCep(newCep);
                                                if (!cepVali.sucesso) {
                                                    setErroInputEmp({ campo: "cep", mensagem: "CEP inválido." });
                                                    setCompanyRegister({ ...companyRegister, cep: newCep, rua: "", bairro: "", cidade: "", estado: "" });
                                                    return;
                                                } else setCompanyRegister({ ...companyRegister, cep: newCep, rua: cepVali.rua, bairro: cepVali.bairro, cidade: cepVali.cidade, estado: cepVali.estado })
                                            } else setCompanyRegister({ ...companyRegister, cep: newCep, rua: "", bairro: "", cidade: "", estado: "" });
                                        }}
                                    />
                                    {erroInputEmp.campo === "cep" && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded-lg animate-fade-in">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> {erroInputEmp.mensagem}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="empresaRua" className="block text-white text-sm font-medium mb-2">Rua</label>
                                    <input
                                        type="text"
                                        id="empresaRua"
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white/70 cursor-not-allowed"
                                        placeholder="Nome da rua"
                                        readOnly
                                        value={companyRegister.rua}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="empresaBairro" className="block text-white text-sm font-medium mb-2">Bairro</label>
                                    <input
                                        type="text"
                                        id="empresaBairro"
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white/70 cursor-not-allowed"
                                        placeholder="Nome do bairro"
                                        readOnly
                                        value={companyRegister.bairro}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="empresaCidade" className="block text-white text-sm font-medium mb-2">Cidade</label>
                                    <input
                                        type="text"
                                        id="empresaCidade"
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white/70 cursor-not-allowed"
                                        placeholder="Nome da cidade"
                                        readOnly
                                        value={companyRegister.cidade}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="empresaEstado" className="block text-white text-sm font-medium mb-2">Estado</label>
                                    <input
                                        type="text"
                                        id="empresaEstado"
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white/70 cursor-not-allowed"
                                        placeholder="UF"
                                        readOnly
                                        value={companyRegister.estado}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="empresaNumero" className="block text-white text-sm font-medium mb-2">Número</label>
                                    <input
                                        type="text"
                                        id="empresaNumero"
                                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors"
                                        placeholder="Número ou S/N"
                                        required
                                        value={companyRegister.numero}
                                        onChange={(e) => { limparErroEmp(); setCompanyRegister({ ...companyRegister, numero: e.target.value }) }}
                                    />
                                    {erroInputEmp.campo === "numero" && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded-lg animate-fade-in">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> {erroInputEmp.mensagem}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="empresaComplemento" className="block text-white text-sm font-medium mb-2">Complemento</label>
                                    <input
                                        type="text"
                                        id="empresaComplemento"
                                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors"
                                        placeholder="Complemento (opcional)"
                                        value={companyRegister.complemento}
                                        onChange={(e) => { limparErroEmp(); setCompanyRegister({ ...companyRegister, complemento: e.target.value }) }}
                                    />
                                    {erroInputEmp.campo === "complemento" && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded-lg animate-fade-in">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> {erroInputEmp.mensagem}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3.5 bg-gradient-to-br from-purple-600 to-purple-500 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-600 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 mb-4"
                                    onClick={async (e) => {
                                        const registro = await empresaRegister(e, companyRegister);
                                        if (!registro.success) {
                                            if (registro.inputError?.campo === 'general') return;
                                            setErroInputEmp({ campo: registro.inputError?.campo || "", mensagem: registro.inputError?.mensagem || "" });
                                            return;
                                        } else {
                                            setTimeout(() => {
                                                navigate('/');
                                            }, 1000);
                                        }
                                    }}
                                >
                                    Cadastrar Empresa
                                </button>
                            </form>

                            <div className="text-center">
                                <Link
                                    to="#"
                                    className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                                    onClick={(e) => { e.preventDefault(); switchTab("company-login") }}
                                >
                                    Já tem uma conta? Faça login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}