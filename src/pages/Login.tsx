import '../css/login.css'

export default function Login(){
    return (
        <div className="containerLogin">
        <div className="login-card">
        {/* Abas de navegação */}
        <div className="tab-header">
            <button className="tab-btn active" data-tab="user-login">
            <i className="fas fa-user"></i> Candidato
            </button>
            <button className="tab-btn" data-tab="company-login">
            <i className="fas fa-building"></i> Empresa
            </button>
        </div>

        <div className="form-container">
            {/* <!-- Login de Usuário --> */}
            <div className="form-content active" id="user-login">
            <h2 className="title">Entrar como candidato</h2>

            <form id="loginForm" action="#">
                <div className="input-group">
                <label htmlFor="username" className="input-label">Email</label>
                <input type="email" id="username" className="input-field" placeholder="seu@email.com" required />
                </div>

                <div className="input-group">
                <label htmlFor="password" className="input-label">Senha</label>
                <div className="password-container">
                    <input type="password" id="password" className="input-field" placeholder="Digite sua senha" required />
                    <button type="button" id="togglePassword" className="password-toggle">
                    <i className="fas fa-eye" id="eyeIcon"></i>
                    </button>
                </div>
                </div>
                <label htmlFor="lembreMe" className="remember-label">
                <input type="checkbox" name="lembreMe" id="lembreMe" />
                <span className="checkmark"></span>
                Lembre-me
                </label>
                <button type="submit" id="loginBtn" className="submit-btn">Entrar</button>
            </form>

            <div className="form-footer">
                <a href="#" id="showSignInCand" className="form-link">Não tem uma conta? Cadastre-se</a>
            </div>
            </div>

            {/* <!-- Cadastro de Usuário --> */}
            <div className="form-content" id="user-register">
            <h2 className="title">Cadastre-se como candidato</h2>

            <form id="registerForm" action="#">
                <div className="input-group">
                <label htmlFor="regUsername" className="input-label">Nome</label>
                <input type="text" id="regUsername" className="input-field" placeholder="Seu nome" required />
                </div>

                <div className="input-group">
                <label htmlFor="regUsernameSobre" className="input-label">Sobrenome</label>
                <input type="text" id="regUsernameSobre" className="input-field" placeholder="Seu sobrenome" required />
                </div>

                <div className="input-group">
                <label htmlFor="email" className="input-label">Email</label>
                <input type="email" id="email" className="input-field" placeholder="seu@email.com" required />
                </div>

                <div className="input-group">
                <label htmlFor="registerPassword" className="input-label">Senha</label>
                <div className="password-container">
                    <input type="password" id="registerPassword" className="input-field" placeholder="Crie uma senha forte"
                    required />
                    <button type="button" id="toggleRegisterPassword" className="password-toggle">
                    <i className="fas fa-eye" id="eyeIconRegister"></i>
                    </button>
                </div>
                </div>

                <div className="input-group">
                <label htmlFor="confirmPassword" className="input-label">Confirmar senha</label>
                <div className="password-container">
                    <input type="password" id="confirmPassword" className="input-field" placeholder="Confirme sua senha"
                    required />
                    <button type="button" id="toggleConfirmPassword" className="password-toggle">
                    <i className="fas fa-eye" id="eyeIconConfirm"></i>
                    </button>
                </div>
                </div>

                <div className="input-group">
                <label htmlFor="dob" className="input-label">Data de nascimento</label>
                <input type="text" id="dob" className="input-field" placeholder="DD/MM/AAAA" maxLength={10} required />
                </div>

                <div className="input-group">
                <label htmlFor="genderSelect" className="input-label">Gênero</label>
                <select id="genderSelect" className="input-field" required>
                    <option value="" selected disabled>Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Não-binário">Não-binário</option>
                    <option value="Outro">Outro</option>
                    <option value="Prefiro não dizer">Prefiro não dizer</option>
                </select>
                <div className="other-gender-input-container">
                    <input type="text" id="outroGeneroInput" className="input-field" placeholder="Especifique seu gênero" />
                </div>
                </div>

                <button type="submit" id="registerBtn" className="submit-btn">Cadastrar</button>
            </form>

            <div className="form-footer">
                <a href="#" id="showLogInCand" className="form-link">Já tem uma conta? Faça login</a>
            </div>
            </div>

            {/* <!-- Login de Empresa --> */}
            <div className="form-content" id="company-login">
            <h2 className="title">Entrar como empresa</h2>

            <form id="loginEmpresaForm" action="#">
                <div className="input-group">
                <label htmlFor="empresaCNPJ" className="input-label">CNPJ</label>
                <input type="text" id="empresaCNPJ" className="input-field" placeholder="00.000.000/0000-00" required />
                </div>

                <div className="input-group">
                <label htmlFor="empresaSenha" className="input-label">Senha</label>
                <div className="password-container">
                    <input type="password" id="empresaSenha" className="input-field" placeholder="Digite sua senha" required />
                    <button type="button" id="toggleEmpresaPassword" className="password-toggle">
                    <i className="fas fa-eye" id="eyeIconEmpresa"></i>
                    </button>
                </div>
                </div>

                <button type="submit" id="empresaLoginBtn" className="submit-btn">Entrar</button>
            </form>

            <div className="form-footer">
                <a href="#" id="showSignInEnte" className="form-link">Não tem uma conta? Cadastre-se</a>
            </div>
            </div>

            {/* <!-- Cadastro de Empresa --> */}
            <div className="form-content" id="company-register">
            <h2 className="title">Cadastre-se como empresa</h2>

            <form id="registerEmpresaForm" action="#">
                <div className="input-group">
                <label htmlFor="empresaEmail" className="input-label">Email</label>
                <input type="email" id="empresaEmail" className="input-field" placeholder="empresa@email.com" required />
                </div>

                <div className="input-group">
                <label htmlFor="empresaRazao" className="input-label">Razão Social</label>
                <input type="text" id="empresaRazao" className="input-field" placeholder="Nome legal da empresa" required />
                </div>

                <div className="input-group">
                <label htmlFor="empresaFantasia" className="input-label">Nome Fantasia</label>
                <input type="text" id="empresaFantasia" className="input-field" placeholder="Nome comercial da empresa"
                    required />
                </div>

                <div className="input-group">
                <label htmlFor="empresaCNPJRegister" className="input-label">CNPJ</label>
                <input type="text" id="empresaCNPJRegister" className="input-field" placeholder="00.000.000/0000-00" required />
                </div>

                <div className="input-group">
                <label htmlFor="empresaTelefone" className="input-label">Telefone</label>
                <input type="tel" id="empresaTelefone" className="input-field" placeholder="+55 11 12345-6789" required />
                </div>

                <div className="input-group">
                <label htmlFor="empresaRegisterPassword" className="input-label">Senha</label>
                <div className="password-container">
                    <input type="password" id="empresaRegisterPassword" className="input-field"
                    placeholder="Crie uma senha forte" required />
                    <button type="button" id="toggleEmpresaRegisterPassword" className="password-toggle">
                    <i className="fas fa-eye" id="eyeIconEmpresaRegister"></i>
                    </button>
                </div>
                </div>

                <div className="input-group">
                <label htmlFor="empresaConfirmPassword" className="input-label">Confirmar senha</label>
                <div className="password-container">
                    <input type="password" id="empresaConfirmPassword" className="input-field" placeholder="Confirme sua senha"
                    required />
                    <button type="button" id="toggleEmpresaConfirmPassword" className="password-toggle">
                    <i className="fas fa-eye" id="eyeIconEmpresaConfirm"></i>
                    </button>
                </div>
                </div>

                <div className="input-group">
                <label htmlFor="empresaCep" className="input-label">CEP</label>
                <input type="text" id="empresaCep" className="input-field" placeholder="00000-000" required />
                </div>

                <div className="input-group">
                <label htmlFor="empresaRua" className="input-label">Rua</label>
                <input type="text" id="empresaRua" className="input-field" placeholder="Nome da rua" readOnly />
                </div>

                <div className="input-group">
                <label htmlFor="empresaBairro" className="input-label">Bairro</label>
                <input type="text" id="empresaBairro" className="input-field" placeholder="Nome do bairro" readOnly/>
                </div>

                <div className="input-group">
                <label htmlFor="empresaCidade" className="input-label">Cidade</label>
                <input type="text" id="empresaCidade" className="input-field" placeholder="Nome da cidade" readOnly />
                </div>

                <div className="input-group">
                <label htmlFor="empresaEstado" className="input-label">Estado</label>
                <input type="text" id="empresaEstado" className="input-field" placeholder="UF" readOnly />
                </div>

                <div className="input-group">
                <label htmlFor="empresaNumero" className="input-label">Número</label>
                <input type="text" id="empresaNumero" className="input-field" placeholder="Número ou S/N" required />
                </div>

                <div className="input-group">
                <label htmlFor="empresaComplemento" className="input-label">Complemento</label>
                <input type="text" id="empresaComplemento" className="input-field" placeholder="Complemento (opcional)" />
                </div>

                <button type="submit" id="empresaRegisterBtn" className="submit-btn">Cadastrar Empresa</button>
            </form>

            <div className="form-footer">
                <a href="#" id="showLogInEnte" className="form-link">Já tem uma conta? Faça login</a>
            </div>
            </div>
        </div>
        </div>
    </div>
    )
}