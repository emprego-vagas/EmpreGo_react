import type { MouseEvent, FormEvent } from 'react';
import axiosWe from '../utils/axiosInstance';
import { DadosUsuario } from '../utils/globalFunctions';

export async function candidatoLogin(e: MouseEvent<HTMLButtonElement>, candLogin: {email: string, senha: string, lembreMe: boolean}): Promise<boolean> {
    e.preventDefault();
    const target = e.target as HTMLButtonElement;
    target.disabled = true;
    target.textContent = "Entrando...";
    console.log(candLogin);

    try {
        const response = await axiosWe.post("/login", { email: candLogin.email, senha: candLogin.senha, lembreMe: candLogin.lembreMe });
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
    //target.disabled = true;
    //target.textContent = "Cadastrando...";

    const { nome, sobrenome, senha, senhaConfirm, data_nasc, genero, outroGenero } = candRegister;

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

    return {success: true}
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