import type { MouseEvent, FormEvent } from 'react';
import axiosWe from '../utils/axiosInstance';
import type {AxiosWeError} from '../utils/axiosInstance';
import { DadosUsuario, mostrarErroTopo, mostrarSucessoTopo } from '../utils/globalFunctions';
import { getFingerprint } from '../utils/fingerprint';

export async function candidatoLogin(e: MouseEvent<HTMLButtonElement>, candLogin: {email: string, senha: string, lembreMe: boolean}): Promise<boolean> {
    e.preventDefault();
    const target = e.target as HTMLButtonElement;

    const email = candLogin.email;
    const senha = candLogin.senha;

    if(!email||!senha){
        mostrarErroTopo("Preencha todas as credenciais.");
        return false;
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        mostrarErroTopo("Digite um email válido.");
        return false;
    }

    target.disabled = true;
    target.textContent = "Entrando...";

    try {
        const visitorId = await getFingerprint();
        const response = await axiosWe.post("/auth/login", { email, password: senha, rememberMe: candLogin.lembreMe, visitorId });
        const user = response.data.user;
        DadosUsuario.setarUsuario(user.id, user.name, 'candidato', user.level, user.image, user.email);
        DadosUsuario.setarLoginKey(response.data.loginKey);

        return true;
    } catch (erro) {
        console.error(erro);
        target.disabled = false;
        target.textContent = "Entrar";
        return false;
    }
}

interface CandRegisterResponse {
    success: boolean;
    inputError? : {
        campo: string,
        mensagem: string
    }
}
export async function candidatoRegister(e: MouseEvent<HTMLButtonElement>, candRegister: {nome: string, sobrenome: string, email: string, senha: string, senhaConfirm: string, data_nasc: string, genero: string, outroGenero: string}): Promise<CandRegisterResponse> {
    e.preventDefault();
    const target = e.target as HTMLButtonElement;

    const { nome, sobrenome, email, senha, senhaConfirm, data_nasc, genero, outroGenero } = candRegister;

    if(nome.length < 3){
        return {success: false, inputError: {campo:"nome", mensagem: "O nome deve ter pelo menos 3 caracteres"}}
    }
    if(sobrenome.length < 3){
        return {success: false, inputError: {campo:"sobrenome", mensagem: "O sobrenome deve ter pelo menos 3 caracteres"}}
    }
    
    if(!email){
        return {success: false, inputError: {campo:"email", mensagem:"Preencha o email."}};
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        return {success: false, inputError: {campo:"email", mensagem:"Digite um email válido."}};
    }

    if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(senha)){
        return {success: false, inputError: {campo:"senha", mensagem:"A senha deve conter 8 caracteres, letra maiúscula, minúscula, número e símbolo."}}
    }
    if(senha !== senhaConfirm){
        return {success: false, inputError: {campo:"senhaConfirm", mensagem:"As senhas não coincidem."}}
    }
    if (!data_nasc.match(/^\d{2}\/\d{2}\/\d{4}$/)){
        return {success: false, inputError: {campo:"data_nasc", mensagem:"Formato de data inválido (use DD/MM/AAAA)."}}
    }
    if(!validarDataNascimento(data_nasc)){
        return {success: false, inputError: {campo:"data_nasc", mensagem:"Data inválida (idade: 14 a 120 anos)."}}
    }
    if(!genero){
        return {success: false, inputError: {campo:"genero", mensagem:"Selecione um gênero."}}
    }
    if(genero==="Outro" && !outroGenero){
        return {success: false, inputError: {campo:"outroGenero", mensagem:"Preencha o campo de gênero personalizado."}}
    }

    const nomeFormat = `${nome} ${sobrenome}`;
    const [dia, mes, ano] = data_nasc.split("/");
    const data_nascFormat = `${ano}-${mes}-${dia}`;

    target.disabled = true;
    target.textContent = "Cadastrando...";
    try {
        await axiosWe.post('/candidate', { name: nomeFormat, email, password: senha, gender: genero, birth_date: data_nascFormat });
        return {success: true}
    } catch (erro: unknown) {
        const err = erro as AxiosWeError;
        if(err.status===409){
            if(err.originalError.includes("Email já cadastrado")){
                mostrarErroTopo('Email já cadastrado.');
            }
            else{
                mostrarErroTopo('Email aguardando confirmação.');
            };
        };
        target.disabled = false;
        target.textContent = "Cadastrar";
        return {success: false, inputError: {campo:"general", mensagem:""}}
    }
}

export async function empresaLogin(e: MouseEvent<HTMLButtonElement>, empLogin: {cnpj: string, senha: string, lembreMe: boolean}): Promise<boolean> {
    const target = e.target as HTMLButtonElement;

    const cnpj = empLogin.cnpj;
    const senha = empLogin.senha;

    if (cnpj.length !== 18 || !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(cnpj)) {
        mostrarErroTopo("CNPJ inválido.")
        return false;
    }
    if (!senha) {
        mostrarErroTopo("Digite a sua senha.");
        return false;
    }

    target.disabled = true;
    target.textContent = "Entrando...";

    try {
        const cnpjClean = cnpj.replace(/[^\d]/g, "");
        const visitorId = await getFingerprint();
        const response = await axiosWe.post('/auth/logincompany', { cnpj: cnpjClean, password: senha, rememberMe: empLogin.lembreMe, visitorId });
        const user = response.data.user;
        DadosUsuario.setarUsuario(user.id, user.name, 'empresa', user.level, user.image, user.email);
        DadosUsuario.setarLoginKey(response.data.loginKey);

        return true;
    } catch (erro) {
        console.error(erro);
        target.disabled = false;
        target.textContent = "Entrar";
        
        return false;
    }
}

interface EmpRegisterResponse {
    success: boolean;
    inputError? : {
        campo: string,
        mensagem: string
    }
}
export async function empresaRegister(e: MouseEvent<HTMLButtonElement>, empRegister: {email: string, razao_soci: string, nome_fant: string, cnpj: string, telefone: string, senha: string, senhaConfirm: string, cep: string, rua: string, bairro: string, cidade: string, estado: string, numero: string, complemento: string}): Promise<EmpRegisterResponse>{
    e.preventDefault();
    const target = e.target as HTMLButtonElement;
    const {email, razao_soci, nome_fant, cnpj, telefone, senha, senhaConfirm, cep, rua, estado, cidade, numero, complemento} = empRegister;

    if (!email) return { success: false, inputError: {campo:"email", mensagem:"Preencha o email." }};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, inputError: {campo:"email", mensagem:"Digite um email válido." }};
    if (!razao_soci) return { success: false, inputError: { campo: "razao_soci", mensagem: "Preencha a razão social." }};
    if (!nome_fant) return { success: false, inputError: { campo: "nome_fant", mensagem: "Preencha o nome fantasia." }};
    if (!cnpj) return { success: false, inputError: { campo: "cnpj", mensagem: "Preencha o CNPJ." }};
    if (cnpj.length !== 18 || !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(cnpj)) return { success: false, inputError: { campo: "cnpj", mensagem: "CNPJ inválido. Formato 00.000.000/0000-00." }};
    if (!telefone) return { success: false, inputError: { campo: "telefone", mensagem: "Preencha o telefone." }};
    if (!/^\+55 \d{2} \d{4,5}-\d{4}$/.test(telefone)) return { success: false, inputError: { campo: "telefone", mensagem: "Telefone inválido (use +55 XX XXXXX-XXXX)." }};
    if (!senha) return { success: false, inputError: { campo: "senha", mensagem: "Preencha a senha." }};
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(senha)) return { success: false, inputError: { campo: "senha", mensagem: "Senha deve conter letra maiúscula, minúscula, número e símbolo." }};
    if (!senhaConfirm) return { success: false, inputError: { campo: "senhaConfirm", mensagem: "Confirme a senha." }};
    if (senha !== senhaConfirm) return { success: false, inputError: { campo: "senhaConfirm", mensagem: "As senhas não coincidem." }};
    if (!cep) return { success: false, inputError: { campo: "cep", mensagem: "Preencha o CEP." }};
    if (!/^\d{5}-\d{3}$/.test(cep)||!rua) return { success: false, inputError: { campo: "cep", mensagem: "CEP inválido (use XXXXX-XXX)." }};
    if (!numero) return { success: false, inputError: { campo: "numero", mensagem: "Preencha o número." }};

    target.textContent = 'Cadastrando...';
    target.disabled = true;

    try {
        const cnpjClean = cnpj.replace(/[^\d]/g, "");
        const visitorId = await getFingerprint();

        await axiosWe.post("/company", {
            cnpj: cnpjClean,
            name: nome_fant,
            phone: telefone,
            email,
            password: senha,
            legal_name: razao_soci,
            zip_code: cep,
            address_complement: complemento,
            address_number: numero,
            state: estado,
            city: cidade
        });

        const response = await axiosWe.post('/auth/logincompany', { cnpj: cnpjClean, password: senha, rememberMe: true, visitorId });
        const user = response.data.user;
        DadosUsuario.setarUsuario(user.id, user.name, 'empresa', user.level, user.image, user.email);
        DadosUsuario.setarLoginKey(response.data.loginKey);

        mostrarSucessoTopo("Empresa cadastrada com SUCESSO!");
        return {success: true};
    } catch (erro) {
        target.disabled = false;
        target.textContent = "Cadastrar Empresa";
        if (erro.status === 409) {
            mostrarErroTopo("Empresa já cadastrada.");
        }
        return {success: false, inputError: {campo: "general", mensagem:""}};
    }
}

export function formatarData(e: FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    let value = target.value.replace(/\D/g, "");
    value = value.slice(0, 8);

    if (value.length >= 5) {
        value = value.slice(0, 2) + "/" + value.slice(2, 4) + "/" + value.slice(4);
    } else if (value.length >= 3) {
        value = value.slice(0, 2) + "/" + value.slice(2);
    }

    target.value = value;
}

export function formatarCnpj(e: FormEvent<HTMLInputElement>) {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    let value = target.value.replace(/\D/g, "").slice(0, 14);

    if (value.length >= 3) value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    if (value.length >= 6) value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    if (value.length >= 9) value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4");
    if (value.length >= 13) value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5");

    target.value = value;
}

export function formatarTelefone(e: FormEvent<HTMLInputElement>){
    e.preventDefault();
    const target = e.target as HTMLInputElement;

    let raw = target.value.replace(/\D/g, "");
    if (raw.startsWith("55")) {
        raw = raw.slice(2);
    }
    raw = raw.slice(0, 11);

    let formatted = "+55";
    if (raw.length > 0) {
        formatted += " " + raw.slice(0, 2);
    }
    if (raw.length > 2) {
        formatted += " " + raw.slice(2, 7);
    }
    if (raw.length > 7) {
        formatted += "-" + raw.slice(7, 11);
    }

    target.value = formatted;
}

export function formatarCep(e: FormEvent<HTMLInputElement>): void{
    const target = e.target as HTMLInputElement;

    let value = target.value.replace(/\D/g, "").slice(0, 8);
    if (value.length > 5) {
        value = value.slice(0, 5) + "-" + value.slice(5);
    }
    target.value = value;
}

interface CepValidationtResponse {
    sucesso: boolean;
    rua?: string;
    bairro?: string;
    cidade?:string;
    estado?: string
}
export async function validarCep(cep: string): Promise<CepValidationtResponse>{
    const cepLimpo = cep.replace(/\D/g, "");

    try {
        console.log(cepLimpo)
        const response = await axiosWe(`/custom/viacep/${cepLimpo}`);
        const data = response.data;

        if(data.erro==='true') throw new Error("Erro")

        return {
            sucesso: true,
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf
        }
    } catch (erro) {
        console.error(erro);
        return {sucesso: false}
    }
}

function validarDataNascimento(dobStr: string): boolean {
    const partes = dobStr.split("/");
    if (partes.length !== 3) return false;

    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const ano = parseInt(partes[2], 10);

    const data = new Date(ano, mes, dia);

    if (data.getFullYear() !== ano || data.getMonth() !== mes || data.getDate() !== dia) {
        return false;
    }

    const hoje = new Date();
    let idade = hoje.getFullYear() - ano;

    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();
    if (mesAtual < mes || (mesAtual === mes && diaAtual < dia)) {
        idade--;
    }

    return idade >= 14 && idade <= 120;
}