import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { reenviarCodigo, validarCodigo } from "../ts/confirmEmailFunctions";
import { DadosUsuario, mostrarErroTopo } from "../utils/globalFunctions";
import axiosWe from "../utils/axiosInstance";
import { getFingerprint } from "../utils/fingerprint";

export default function ConfirmEmail(){
    const navigate = useNavigate();
    const [validado, setValidado] = useState(false);
    const [podeEnviar, setPodeEnviar] = useState(true);
    const [msgReenvio, setMsgReenvio] = useState("");
    const [codigo, setCodigo] = useState("");

    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');

    useEffect(() => {
        if (!email) {
            navigate('/');
        } else {
            setValidado(true);
        }
    }, [navigate, email]);

    if (!validado) return null;
    return (
        <>
            <section id="home" className="min-h-screen flex items-center pt-20 bg-grid-pattern relative overflow-hidden">
            {/* <!-- particulas de fundo --> */}
            <div id="particles-js" className="fixed inset-0 z-0"></div>

            {/* <!-- particulas flutuando --> */}
            <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary-500 opacity-10 animate-float"></div>
            <div className="absolute bottom-40 right-32 w-40 h-40 rounded-full bg-primary-600 opacity-10 animate-float [animation-delay:2s]"></div>
            
            {/* <!-- Formulário Container --> */}
            <div className="container mx-auto px-6 py-20 relative z-10">
                {/* <!-- Formulário --> */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-10" id="hero-title">
                    Código de verificação <span className="text-gradient">enviado!</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 mb-2" id="hero-subtitle">
                    Um email com um código de verificação foi enviado para <span className="text-primary-500" id="email">{email}</span>
                </p>            
                <p className="text-xl md:text-1x4 text-gray-400 mb-4" id="hero-subtitle">
                    O Código expira em <span className="text-gradient" id="timer">15 minutos</span>.
                </p>

                <input name="inputCodigo" id="inputCodigo" type="text" placeholder="Digite aqui o seu código" maxLength={6} className="relative z-10 mb-4 p-2 border rounded text-black" value={codigo}
                    onChange={async(e)=>{
                        setCodigo(e.target.value.replace(/[^0-9]/g, ''));
                        const validado = await validarCodigo(e, email);
                        if(validado.notFound){
                            setTimeout(()=>{
                                navigate('/');
                            }, 3000);
                        } else if(validado.sucesso) {
                            try {
                                const visitorId = await getFingerprint();
                                const response = await axiosWe.post('/auth/login', {email, visitorId, firstAccessToken: validado.firstAccess, rememberMe: true });
                                const user = response.data.user;
                                console.log(user);
                                DadosUsuario.setarUsuario(user.id, user.name, user.type, user.level, user.image, user.email);
                            } catch {
                                mostrarErroTopo('Erro ao fazer login automático, use seu email e senha na tela de Login.');
                                setTimeout(()=>{
                                    window.location.href = '/login';
                                })
                            }
                            window.location.href = '/'
                        }; // * Importante deixar o location.href para direcionar corretamente o usuário para a tela de ver empresas
                    }}/>

                <p><a id="reenvio" className="text-primary-100">Não recebeu o email?<span className="text-primary-500 cursor-pointer" onClick={async()=>{
                    if(podeEnviar){
                        setPodeEnviar(false);
                        const reenvio = await reenviarCodigo(email);
                        if(reenvio.notfound){
                            setMsgReenvio(reenvio.mensagem);
                            setTimeout(()=>{
                                navigate('/');
                            }, 3000);
                        } else{
                            setMsgReenvio(reenvio.mensagem);
                            setPodeEnviar(true);
                        }
                    }
                }}> Clique aqui para reenviar.</span> </a></p>
                <p id="mensagem">{msgReenvio}</p>
            </div>
        </section>
        </>
    )
}