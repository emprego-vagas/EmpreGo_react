import type { MouseEvent, FormEvent } from 'react';
import axiosWe from '../utils/axiosInstance';
import type {AxiosWeError} from '../utils/axiosInstance';
import { DadosUsuario, mostrarErroTopo } from '../utils/globalFunctions';

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
        const response = await axiosWe.post("/login", { email, senha, lembreMe: candLogin.lembreMe });
        const user = response.data.user;
        DadosUsuario.setarUsuario(user.id, user.nome, 'candidato', user.nivel, user.foto);

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
    if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(senha)){
        return {success: false, inputError: {campo:"senha", mensagem:"Senha deve conter letra maiúscula, minúscula, número e símbolo."}}
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
        await axiosWe.post('/candidatos', { nome: nomeFormat, email, senha, genero, data_nasc: data_nascFormat });
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

export async function empresaLogin(e: MouseEvent<HTMLButtonElement>, empLogin: {cnpj: string, senha: string}): Promise<boolean> {
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
        const response = await axiosWe.post('/login-empresa', { cnpj: cnpjClean, senha });
        const user = response.data.user;
        DadosUsuario.setarUsuario(user.id, user.nome, 'empresa', user.nivel, user.foto);

        return true;
    } catch (erro) {
        console.error(erro);
        target.disabled = false;
        target.textContent = "Entrar";
        
        return false;
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