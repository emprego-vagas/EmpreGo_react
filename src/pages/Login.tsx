// * Pacotes
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding, faEye, faEyeSlash, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";

// * Funções
import {candidatoLogin, candidatoRegister, empresaLogin, empresaRegister, formatarCep, formatarCnpj, formatarData, formatarTelefone, validarCep} from '../ts/loginFunctions'

// * CSS
import '../css/login.css'

export default function Login(){
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState<"user-login" | "user-register" | "company-login" | "company-register">("user-login");
    const switchTab = (tabId: typeof activeTab) => {
        setActiveTab(tabId);
    };
    const [showOtherGender, setShowOtherGender] = useState(false);

    const [errorInputCand, setErrorInputCand] = useState({campo: "", mensagem: ""});
    function limparErroCand():void {
        setErrorInputCand({campo: "", mensagem: ""});
    };
    const [erroInputEmp, setErroInputEmp] = useState({campo: "", mensagem: ""});
    function limparErroEmp():void {
        setErroInputEmp({campo: "", mensagem: ""});
    }

    const [userLogin, setUserLogin] = useState({ email: "", senha: "", lembreMe: false });
    const [userRegister, setUserRegister] = useState({ nome: "", sobrenome: "", email: "", senha: "", senhaConfirm: "", data_nasc: "", genero: "", outroGenero: "" });
    const [companyLogin, setCompanyLogin] = useState({ cnpj: "", senha: "" });
    const [companyRegister, setCompanyRegister] = useState({ email: "", razao_soci: "", nome_fant: "", cnpj: "", telefone: "", senha: "", senhaConfirm: "", cep: "", rua: "", bairro: "", cidade: "", estado: "", numero: "", complemento: "" });

    return (
        <div className="containerLogin">
        <div className="login-card">
        {/* Abas de navegação */}
        <div className="tab-header">
            <button className={`tab-btn ${activeTab.includes("user") ? "active" : ""}`} onClick={() => switchTab("user-login")}>
            <FontAwesomeIcon icon={faUser} /> Candidato
            </button>
            <button className={`tab-btn ${activeTab.includes("company") ? "active" : ""}`} onClick={() => switchTab("company-login")}>
            <FontAwesomeIcon icon={faBuilding} /> Empresa
            </button>
        </div>

        <div className="form-container">
            {/* <!-- Login de Usuário --> */}
            {activeTab === "user-login" && (
                <div className="form-content active" id="user-login">
                <h2 className="title">Entrar como candidato</h2>

                <form id="loginForm" action="#">
                    <div className="input-group">
                    <label htmlFor="username" className="input-label">Email</label>
                    <input type="email" id="username" className="input-field" placeholder="seu@email.com" required 
                        value={userLogin.email}
                        onChange={(e) => setUserLogin({ ...userLogin, email: e.target.value })} />
                    </div>

                    <div className="input-group">
                    <label htmlFor="password" className="input-label">Senha</label>
                    <div className="password-container">
                        <input type={showPassword ? "text" : "password"} id="password" className="input-field" placeholder="Digite sua senha" required 
                            value={userLogin.senha} onChange={(e) => setUserLogin({ ...userLogin, senha: e.target.value })}/>
                        <button type="button" id="togglePassword" className="password-toggle rounded-full"
                            onClick={() => setShowPassword((p) => !p)}>
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} id="eyeIcon"/>
                        </button>
                    </div>
                    </div>
                    <label htmlFor="lembreMe" className="remember-label">
                    <input type="checkbox" name="lembreMe" id="lembreMe" onChange={(e) => setUserLogin({ ...userLogin, lembreMe: e.target.checked })}/>
                    <span className="checkmark"></span>
                        Lembre-me
                    </label>
                    <button type="submit" id="loginBtn" className="submit-btn" onClick={async (e)=>{
                        const logado = await candidatoLogin(e, userLogin);
                        if(logado) navigate('/');
                    }}>Entrar</button>
                </form>

                <div className="form-footer">
                    <Link to="#" id="showSignInCand" className="form-link" onClick={(e) => {e.preventDefault(); switchTab("user-register")}}>Não tem uma conta? Cadastre-se</Link>
                </div>
                </div>
            )}

            {/* <!-- Cadastro de Usuário --> */}
            {activeTab === "user-register" && (
                <div className={`form-content active`} id="user-register">
                <h2 className="title">Cadastre-se como candidato</h2>

                <form id="registerForm" action="#">
                    <div className="input-group">
                    <label htmlFor="regUsername" className="input-label">Nome</label>
                    <input type="text" id="regUsername" className="input-field" placeholder="Seu nome" required maxLength={100}
                        value={userRegister.nome} onChange={(e) => {limparErroCand();setUserRegister({ ...userRegister, nome: e.target.value})}} />
                    {errorInputCand.campo==="nome" && (
                        <div className="erro-mensagem">
                            <FontAwesomeIcon icon={faExclamationCircle} /> {errorInputCand.mensagem}
                        </div>
                    )}
                    </div>

                    <div className="input-group">
                    <label htmlFor="regUsernameSobre" className="input-label">Sobrenome</label>
                    <input type="text" id="regUsernameSobre" className="input-field" placeholder="Seu sobrenome" required maxLength={100}
                        value={userRegister.sobrenome} onChange={(e) => {limparErroCand();setUserRegister({ ...userRegister, sobrenome: e.target.value})}} />
                    {errorInputCand.campo==="sobrenome" && (
                        <div className="erro-mensagem">
                            <FontAwesomeIcon icon={faExclamationCircle} /> {errorInputCand.mensagem}
                        </div>
                    )}
                    </div>

                    <div className="input-group">
                    <label htmlFor="email" className="input-label">Email</label>
                    <input type="email" id="email" className="input-field" placeholder="seu@email.com" required maxLength={254}
                        value={userRegister.email} onChange={(e) => {limparErroCand();setUserRegister({ ...userRegister, email: e.target.value})}}/>
                    </div>

                    <div className="input-group">
                    <label htmlFor="registerPassword" className="input-label">Senha</label>
                    <div className="password-container">
                        <input type={showPassword ? "text" : "password"} id="registerPassword" className="input-field" placeholder="Crie uma senha forte"
                        required value={userRegister.senha} onChange={(e) => {limparErroCand();setUserRegister({ ...userRegister, senha: e.target.value})}}/>
                        <button type="button" id="toggleRegisterPassword" className="password-toggle" onClick={() => setShowPassword((p) => !p)}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} id="eyeIconRegister"/>
                        </button>
                        {errorInputCand.campo==="senha" && (
                            <div className="erro-mensagem">
                                <FontAwesomeIcon icon={faExclamationCircle} /> {errorInputCand.mensagem}
                            </div>
                        )}
                    </div>
                    </div>

                    <div className="input-group">
                    <label htmlFor="confirmPassword" className="input-label">Confirmar senha</label>
                    <div className="password-container">
                        <input type={showPassword ? "text" : "password"} id="confirmPassword" className="input-field" placeholder="Confirme sua senha"
                        required value={userRegister.senhaConfirm} onChange={(e) => {limparErroCand();setUserRegister({ ...userRegister, senhaConfirm: e.target.value})}}/>
                        <button type="button" id="toggleConfirmPassword" className="password-toggle" onClick={() => setShowPassword((p) => !p)}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} id="eyeIconConfirm"/>
                        </button>
                        {errorInputCand.campo==="senhaConfirm" && (
                            <div className="erro-mensagem">
                                <FontAwesomeIcon icon={faExclamationCircle} /> {errorInputCand.mensagem}
                            </div>
                        )}
                    </div>
                    </div>

                    <div className="input-group">
                    <label htmlFor="dob" className="input-label">Data de nascimento</label>
                    <input type="text" id="dob" className="input-field" placeholder="DD/MM/AAAA" maxLength={10} required 
                        value={userRegister.data_nasc} onChange={(e) => {limparErroCand();formatarData(e); setUserRegister({ ...userRegister, data_nasc: e.target.value})}} />
                    {errorInputCand.campo==="data_nasc" && (
                        <div className="erro-mensagem">
                            <FontAwesomeIcon icon={faExclamationCircle} /> {errorInputCand.mensagem}
                        </div>
                    )}
                    </div>

                    <div className="input-group">
                    <label htmlFor="genderSelect" className="input-label">Gênero</label>
                    <select id="genderSelect" className="input-field" required
                        value={userRegister.genero}
                        onChange={(e)=>{
                            limparErroCand();
                            const value = e.target.value;
                            setUserRegister({ ...userRegister, genero: value });
                            setShowOtherGender(value === "Outro");
                        }}>
                        <option value="" disabled>Selecione</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Não-binário">Não-binário</option>
                        <option value="Outro">Outro</option>
                        <option value="Prefiro não dizer">Prefiro não dizer</option>
                    </select>
                    {errorInputCand.campo==="genero" && (
                        <div className="erro-mensagem">
                            <FontAwesomeIcon icon={faExclamationCircle} /> {errorInputCand.mensagem}
                        </div>
                    )}
                    {showOtherGender && (
                        <>
                            <div className="other-gender-input-container show">
                                <input type="text" id="outroGeneroInput" className="input-field" placeholder="Especifique seu gênero" maxLength={30}
                                    value={userRegister.outroGenero} onChange={(e)=>{limparErroCand();setUserRegister({ ...userRegister, outroGenero: e.target.value })}} />
                            </div>
                            {errorInputCand.campo==="outroGenero" && (
                                <div className="erro-mensagem">
                                    <FontAwesomeIcon icon={faExclamationCircle} /> {errorInputCand.mensagem}
                                </div>
                            )}
                        </>
                    )}
                    </div>

                    <button type="submit" id="registerBtn" className="submit-btn" onClick={async (e)=>{
                        const emailRedirect = userRegister.email;
                        const registro = await candidatoRegister(e, userRegister);
                        if(!registro.success) {
                            if(registro.inputError?.campo==='general') return;
                            setErrorInputCand({campo: registro.inputError?.campo || "", mensagem: registro.inputError?.mensagem || ""});
                            return;
                        } else navigate(`/confirmar?email=${emailRedirect}`);
                    }}>Cadastrar</button>
                </form>

                <div className="form-footer">
                    <Link to="#" id="showLogInCand" className="form-link" onClick={(e) => {e.preventDefault(); switchTab("user-login")}}>Já tem uma conta? Faça login</Link>
                </div>
                </div>
            )}

            {/* <!-- Login de Empresa --> */}
            {activeTab === "company-login" && (
                <div className="form-content active" id="company-login">
                <h2 className="title">Entrar como empresa</h2>

                <form id="loginEmpresaForm" action="#">
                    <div className="input-group">
                    <label htmlFor="empresaCNPJ" className="input-label">CNPJ</label>
                    <input type="text" id="empresaCNPJ" className="input-field" placeholder="00.000.000/0000-00" required 
                        value={companyLogin.cnpj} onChange={(e)=>{formatarCnpj(e); setCompanyLogin({...companyLogin, cnpj: e.target.value})}} />
                    </div>

                    <div className="input-group">
                    <label htmlFor="empresaSenha" className="input-label">Senha</label>
                    <div className="password-container">
                        <input type={showPassword ? "text" : "password"} id="empresaSenha" className="input-field" placeholder="Digite sua senha" required 
                            value={companyLogin.senha} onChange={(e)=>setCompanyLogin({...companyLogin, senha: e.target.value})} />
                        <button type="button" id="toggleEmpresaPassword" className="password-toggle" onClick={() => setShowPassword((p) => !p)}>
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} id="eyeIconEmpresa"/>
                        </button>
                    </div>
                    </div>

                    <button type="submit" id="empresaLoginBtn" className="submit-btn" onClick={async (e)=>{
                        const logado = await empresaLogin(e, companyLogin);
                        if(logado) navigate('/');
                    }}>Entrar</button>
                </form>

                <div className="form-footer">
                    <Link to="#" id="showSignInEnte" className="form-link" onClick={(e) => {e.preventDefault(); switchTab("company-register")}}>Não tem uma conta? Cadastre-se</Link>
                </div>
                </div>
            )}

            {/* <!-- Cadastro de Empresa --> */}
            {activeTab === "company-register" && (
                <div className="form-content active" id="company-register">
                <h2 className="title">Cadastre-se como empresa</h2>

                <form id="registerEmpresaForm" action="#">
                    <div className="input-group">
                        <label htmlFor="empresaEmail" className="input-label">Email</label>
                        <input type="email" id="empresaEmail" className="input-field" placeholder="empresa@email.com" required 
                            value={companyRegister.email} onChange={(e)=>{limparErroEmp();setCompanyRegister({...companyRegister, email: e.target.value})}} />
                        {erroInputEmp.campo==="email" && (
                            <div className="erro-mensagem">
                                <FontAwesomeIcon icon={faExclamationCircle} /> {erroInputEmp.mensagem}
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                    <label htmlFor="empresaRazao" className="input-label">Razão Social</label>
                    <input type="text" id="empresaRazao" className="input-field" placeholder="Nome legal da empresa" required 
                        value={companyRegister.razao_soci} onChange={(e)=>{limparErroEmp();setCompanyRegister({...companyRegister, razao_soci: e.target.value})}} />
                        {erroInputEmp.campo==="razao_soci" && (
                            <div className="erro-mensagem">
                                <FontAwesomeIcon icon={faExclamationCircle} /> {erroInputEmp.mensagem}
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                    <label htmlFor="empresaFantasia" className="input-label">Nome Fantasia</label>
                    <input type="text" id="empresaFantasia" className="input-field" placeholder="Nome comercial da empresa"
                        required value={companyRegister.nome_fant} onChange={(e)=>{limparErroEmp();setCompanyRegister({...companyRegister, nome_fant: e.target.value})}} />
                        {erroInputEmp.campo==="nome_fant" && (
                            <div className="erro-mensagem">
                                <FontAwesomeIcon icon={faExclamationCircle} /> {erroInputEmp.mensagem}
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                    <label htmlFor="empresaCNPJRegister" className="input-label">CNPJ</label>
                    <input type="text" id="empresaCNPJRegister" className="input-field" placeholder="00.000.000/0000-00" required 
                        value={companyRegister.cnpj} onChange={(e)=>{limparErroEmp();formatarCnpj(e);setCompanyRegister({...companyRegister, cnpj: e.target.value})}} />
                        {erroInputEmp.campo==="cnpj" && (
                            <div className="erro-mensagem">
                                <FontAwesomeIcon icon={faExclamationCircle} /> {erroInputEmp.mensagem}
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                    <label htmlFor="empresaTelefone" className="input-label">Telefone</label>
                    <input type="tel" id="empresaTelefone" className="input-field" placeholder="+55 11 12345-6789" required 
                        value={companyRegister.telefone} onChange={(e)=>{limparErroEmp();formatarTelefone(e);setCompanyRegister({...companyRegister, telefone: e.target.value})}} />
                        {erroInputEmp.campo==="telefone" && (
                            <div className="erro-mensagem">
                                <FontAwesomeIcon icon={faExclamationCircle} /> {erroInputEmp.mensagem}
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                    <label htmlFor="empresaRegisterPassword" className="input-label">Senha</label>
                    <div className="password-container">
                        <input type={showPassword ? "text" : "password"} id="empresaRegisterPassword" className="input-field"
                        placeholder="Crie uma senha forte" required value={companyRegister.senha} onChange={(e)=>{limparErroEmp();setCompanyRegister({...companyRegister, senha: e.target.value})}} />
                            {erroInputEmp.campo==="senha" && (
                                <div className="erro-mensagem">
                                    <FontAwesomeIcon icon={faExclamationCircle} /> {erroInputEmp.mensagem}
                                </div>
                            )}
                        <button type="button" id="toggleEmpresaRegisterPassword" className="password-toggle" onClick={() => setShowPassword((p) => !p)}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} id="eyeIconEmpresaRegister"/>
                        </button>
                    </div>
                    </div>

                    <div className="input-group">
                    <label htmlFor="empresaConfirmPassword" className="input-label">Confirmar senha</label>
                    <div className="password-container">
                        <input type={showPassword ? "text" : "password"} id="empresaConfirmPassword" className="input-field" placeholder="Confirme sua senha"
                        required value={companyRegister.senhaConfirm} onChange={(e)=>{limparErroEmp();setCompanyRegister({...companyRegister, senhaConfirm: e.target.value})}} />
                            {erroInputEmp.campo==="senhaConfirm" && (
                                <div className="erro-mensagem">
                                    <FontAwesomeIcon icon={faExclamationCircle} /> {erroInputEmp.mensagem}
                                </div>
                            )}
                        <button type="button" id="toggleEmpresaConfirmPassword" className="password-toggle" onClick={() => setShowPassword((p) => !p)}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} id="eyeIconEmpresaConfirm"/>
                        </button>
                    </div>
                    </div>

                    <div className="input-group">
                    <label htmlFor="empresaCep" className="input-label">CEP</label>
                    <input type="text" id="empresaCep" className="input-field" placeholder="00000-000" required 
                        value={companyRegister.cep} onChange={async(e)=>{
                            limparErroEmp();
                            formatarCep(e);
                            const newCep = e.target.value
                            setCompanyRegister({...companyRegister, cep: newCep});
                            if(newCep.length===9){
                                const cepVali = await validarCep(newCep);
                                if(!cepVali.sucesso) {
                                    setErroInputEmp({campo:"cep", mensagem:"CEP inválido."});
                                    setCompanyRegister({...companyRegister, cep: newCep, rua: "", bairro: "", cidade: "", estado: ""});
                                    return;
                                }
                                else setCompanyRegister({...companyRegister, cep: newCep, rua: cepVali.rua, bairro: cepVali.bairro, cidade: cepVali.cidade, estado: cepVali.estado})
                            } else setCompanyRegister({...companyRegister, cep: newCep, rua: "", bairro: "", cidade: "", estado: ""});
                        }} />
                        {erroInputEmp.campo==="cep" && (
                            <div className="erro-mensagem">
                                <FontAwesomeIcon icon={faExclamationCircle} /> {erroInputEmp.mensagem}
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                    <label htmlFor="empresaRua" className="input-label">Rua</label>
                    <input type="text" id="empresaRua" className="input-field" placeholder="Nome da rua" readOnly 
                        value={companyRegister.rua} />
                    </div>

                    <div className="input-group">
                    <label htmlFor="empresaBairro" className="input-label">Bairro</label>
                    <input type="text" id="empresaBairro" className="input-field" placeholder="Nome do bairro" readOnly
                        value={companyRegister.bairro} />
                    </div>

                    <div className="input-group">
                    <label htmlFor="empresaCidade" className="input-label">Cidade</label>
                    <input type="text" id="empresaCidade" className="input-field" placeholder="Nome da cidade" readOnly 
                        value={companyRegister.cidade} />
                    </div>

                    <div className="input-group">
                    <label htmlFor="empresaEstado" className="input-label">Estado</label>
                    <input type="text" id="empresaEstado" className="input-field" placeholder="UF" readOnly 
                        value={companyRegister.estado}/>
                    </div>

                    <div className="input-group">
                    <label htmlFor="empresaNumero" className="input-label">Número</label>
                    <input type="text" id="empresaNumero" className="input-field" placeholder="Número ou S/N" required 
                        value={companyRegister.numero} onChange={(e)=>{limparErroEmp();setCompanyRegister({...companyRegister, numero: e.target.value})}} />
                        {erroInputEmp.campo==="numero" && (
                            <div className="erro-mensagem">
                                <FontAwesomeIcon icon={faExclamationCircle} /> {erroInputEmp.mensagem}
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                    <label htmlFor="empresaComplemento" className="input-label">Complemento</label>
                    <input type="text" id="empresaComplemento" className="input-field" placeholder="Complemento (opcional)" 
                        value={companyRegister.complemento} onChange={(e)=>{limparErroEmp();setCompanyRegister({...companyRegister, complemento: e.target.value})}} />
                        {erroInputEmp.campo==="complemento" && (
                            <div className="erro-mensagem">
                                <FontAwesomeIcon icon={faExclamationCircle} /> {erroInputEmp.mensagem}
                            </div>
                        )}
                    </div>

                    <button type="submit" id="empresaRegisterBtn" className="submit-btn" onClick={async (e)=>{
                        const registro = await empresaRegister(e, companyRegister);
                        if(!registro.success) {
                            if(registro.inputError?.campo==='general') return;
                            setErroInputEmp({campo: registro.inputError?.campo || "", mensagem: registro.inputError?.mensagem || ""});
                            return;
                        } else {
                            setTimeout(()=>{
                                navigate('/');
                            }, 1000);
                        }
                    }}>Cadastrar Empresa</button>
                </form>

                <div className="form-footer">
                    <Link to="#" id="showLogInEnte" className="form-link" onClick={(e) => {e.preventDefault(); switchTab("company-login")}}>Já tem uma conta? Faça login</Link>
                </div>
                </div>
            )}
        </div>
        </div>
    </div>
    )
}