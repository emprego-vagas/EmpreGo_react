import type { ChangeEvent } from "react";
import axiosWe from "../utils/axiosInstance";
import { DadosUsuario } from "../utils/globalFunctions";

interface ValidarCodigoResponse {
    sucesso: boolean;
    notFound?: boolean
}
export async function validarCodigo(e: ChangeEvent<HTMLInputElement>, email: string): Promise<ValidarCodigoResponse>{
    const target = e.target as HTMLInputElement;
    const codigo = target.value;
    if(codigo.length < 4) return;
    target.disabled = true;

    try{
        const response = await axiosWe.post('/candidatos/confirmar', { codigo, email });
        const user = response.data.user;
        DadosUsuario.setarUsuario(user.id, user.nome, user.tipo, user.nivel, user.foto);
        return {sucesso: true};
    } 
    catch(erro){
        console.error(erro);
        target.value = '';
        if(erro.status === 404){
            return {sucesso: false, notFound: true}
        } else{
            target.disabled = false;
            return {sucesso: false};
        }
    }
}

interface ReenviarCodigoResponse{
    sucesso: boolean;
    mensagem: string;
    notfound?: boolean;
}
export async function reenviarCodigo(email: string): Promise<ReenviarCodigoResponse>{
    try{
        const response = await axiosWe.post('/candidatos/reenviar', { email });
        return {sucesso: true, mensagem: response.data.message};
    }
    catch(erro){
        let mensagem = erro.message;
        if(erro.status === 404){
            mensagem += ' Redirecionando...';
            return {sucesso: false, mensagem, notfound: true};
        }
        return {sucesso: false, mensagem};
    }
}