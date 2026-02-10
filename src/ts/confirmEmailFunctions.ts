import type { ChangeEvent } from "react";
import axiosWe from "../utils/axiosInstance";

interface ValidarCodigoResponse {
    sucesso: boolean;
    notFound?: boolean;
    firstAccess?: string;
}
export async function validarCodigo(e: ChangeEvent<HTMLInputElement>, email: string): Promise<ValidarCodigoResponse>{
    const target = e.target as HTMLInputElement;
    const codigo = target.value;
    if(codigo.length < 6) return;
    target.disabled = true;

    try{
        const response = await axiosWe.post('/candidate/confirm', { code: codigo, email });
        return {sucesso: true, firstAccess: response.data.firstAccessToken};
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
        const response = await axiosWe.post('/candidate/resend', { email });
        console.log(response);
        return {sucesso: true, mensagem: response.message ?? 'Sucesso'};
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