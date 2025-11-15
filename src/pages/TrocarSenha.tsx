// * Pacotes
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useSearchParams } from "react-router-dom";
import ParticlesBackgroundComponent from './ParticlesBackground';

// * CSS
import '../css/login.css';
import axiosWe from '../utils/axiosInstance';
import { mostrarErroTopo, mostrarSucessoTopo } from '../utils/globalFunctions';

export default function TrocarSenha() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [params] = useState({t: searchParams.get('t'), p: searchParams.get('p'), c: searchParams.get('c'), i: searchParams.get('i')});

    useEffect(()=>{
        const {t, p, c, i} = params;
        if(!t || !p || !c || !i) navigate('/');
    })

    const [showPassword, setShowPassword] = useState({
        senha: false,
        senhaConfirm: false
    });

    const [senhaData, setSenhaData] = useState({
        senha: "",
        senhaConfirm: ""
    });

    const [errorInput, setErrorInput] = useState({ campo: "", mensagem: "" });
    const [sucessoInput, setSucessoInput] = useState({ campo: "", mensagem: "" });
    const [enviando, setEnviando] = useState(false);

    function limparErro(): void {
        setErrorInput({ campo: "", mensagem: "" });
    }

    function limparSucesso(): void {
        setSucessoInput({ campo: "", mensagem: "" });
    }

    const validarSenha = (senha: string): boolean => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(senha);
    };

    const handleTrocarSenha = async (e: React.FormEvent) => {
        e.preventDefault();
        limparErro();
        limparSucesso();

        // Validações
        if (!senhaData.senha) {
            setErrorInput({ campo: "senha", mensagem: "Digite a nova senha." });
            return;
        }

        if (!validarSenha(senhaData.senha)) {
            setErrorInput({ campo: "senha", mensagem: "A senha deve conter 8 caracteres, letra maiúscula, minúscula, número e símbolo." });
            return;
        }

        if (!senhaData.senhaConfirm) {
            setErrorInput({ campo: "senhaConfirm", mensagem: "Confirme a nova senha." });
            return;
        }

        if (senhaData.senha !== senhaData.senhaConfirm) {
            setErrorInput({ campo: "senhaConfirm", mensagem: "As senhas não coincidem." });
            return;
        }

        try {
            setEnviando(true);
            const {t, p, c, i} = params;
            await axiosWe.post('/candidatos/senha/redefinir', {
                t, p, c, i,
                novaSenha: senhaData.senha
            });

            setSucessoInput({ 
                campo: "success", 
                mensagem: "Senha alterada com sucesso! Agora você já pode fechar esta guia e fazer login com sua nova senha!" 
            });
            
            mostrarSucessoTopo("Senha alterada com sucesso!");
            setSenhaData({senha: '', senhaConfirm: ''});
        } catch (erro) {
            console.error(erro);
            if(erro.status && erro.status===404) {
                mostrarErroTopo('Não existe solicitação de troca de senha para este candidato ou ela já expirou. Redirecionando...');
                setTimeout(()=>{
                    navigate('/');
                }, 3000);
            }
            const mensagemErro = erro.message || "Erro ao alterar senha. Tente novamente.";
            setErrorInput({ campo: "general", mensagem: mensagemErro });
            
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 flex justify-center items-center p-5">
            <ParticlesBackgroundComponent />
            <div className="w-full max-w-md bg-gray-800/95 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-8">
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-semibold text-white text-center mb-6">
                            Redefinir Senha
                        </h2>

                        <form onSubmit={handleTrocarSenha}>
                            <div className="mb-4">
                                <label htmlFor="novaSenha" className="block text-white text-sm font-medium mb-2">
                                    Nova Senha
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword.senha ? "text" : "password"}
                                        id="novaSenha"
                                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors pr-12"
                                        placeholder="Digite sua nova senha"
                                        required
                                        value={senhaData.senha}
                                        onChange={(e) => { limparErro(); setSenhaData({ ...senhaData, senha: e.target.value }) }}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-1 text-white/60 hover:text-white transition-colors cursor-pointer"
                                        onClick={() => setShowPassword({ ...showPassword, senha: !showPassword.senha })}
                                    >
                                        <FontAwesomeIcon icon={showPassword.senha ? faEyeSlash : faEye} />
                                    </button>
                                </div>
                                {errorInput.campo === "senha" && (
                                    <div className="flex items-center gap-2 text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded-lg animate-fade-in">
                                        <FontAwesomeIcon icon={faExclamationCircle} /> {errorInput.mensagem}
                                    </div>
                                )}
                            </div>

                            <div className="mb-6">
                                <label htmlFor="confirmarSenha" className="block text-white text-sm font-medium mb-2">
                                    Confirmar Nova Senha
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword.senhaConfirm ? "text" : "password"}
                                        id="confirmarSenha"
                                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:bg-black/50 transition-colors pr-12"
                                        placeholder="Confirme sua nova senha"
                                        required
                                        value={senhaData.senhaConfirm}
                                        onChange={(e) => { limparErro(); setSenhaData({ ...senhaData, senhaConfirm: e.target.value }) }}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-1 text-white/60 hover:text-white transition-colors cursor-pointer"
                                        onClick={() => setShowPassword({ ...showPassword, senhaConfirm: !showPassword.senhaConfirm })}
                                    >
                                        <FontAwesomeIcon icon={showPassword.senhaConfirm ? faEyeSlash : faEye} />
                                    </button>
                                </div>
                                {errorInput.campo === "senhaConfirm" && (
                                    <div className="flex items-center gap-2 text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded-lg animate-fade-in">
                                        <FontAwesomeIcon icon={faExclamationCircle} /> {errorInput.mensagem}
                                    </div>
                                )}
                            </div>

                            {errorInput.campo === "general" && (
                                <div className="flex items-center gap-2 text-red-400 text-sm mt-2 p-2 bg-red-400/10 rounded-lg animate-fade-in mb-4">
                                    <FontAwesomeIcon icon={faExclamationCircle} /> {errorInput.mensagem}
                                </div>
                            )}

                            {sucessoInput.campo === "success" && (
                                <div className="flex items-center gap-2 text-green-400 text-sm mt-2 p-2 bg-green-400/10 rounded-lg animate-fade-in mb-4">
                                    <FontAwesomeIcon icon={faExclamationCircle} /> {sucessoInput.mensagem}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={enviando}
                                className="w-full py-3.5 bg-gradient-to-br from-purple-600 to-purple-500 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-600 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 mb-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {enviando ? 'Alterando...' : 'Alterar Senha'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}