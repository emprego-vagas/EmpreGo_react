import axiosWe from "../utils/axiosInstance";
import { mostrarErroTopo } from "../utils/globalFunctions";
import { formatarData, validarData } from "./criarExperienciasFunctions";

export async function cadastrarProjeto(titulo: string, nome: string, dataInicio: string, dataFim: string, checkAtual: boolean, descricao: string, tags: string[], linkProjeto: string, status: string, imagem: File | null): Promise<boolean> {
    if (!titulo || !nome || !dataInicio || (!checkAtual&&!dataFim) || !descricao || !status) {
        mostrarErroTopo('Por favor, preencha todos os campos obrigatórios (*)');
        return false;
    }
    if(!validarData(dataInicio)||(!checkAtual&&!validarData(dataFim))){
        mostrarErroTopo('Datas inválidas');
        return false;
    }
    if(linkProjeto && !isValidURL(linkProjeto)){
        mostrarErroTopo('Por favor, insira uma URL válida');
        return false;
    }
    if (status === 'Concluído' && !dataFim) {
        mostrarErroTopo('Projetos concluídos devem ter uma data de conclusão');
        return false;
    }

    const formData = new FormData();
    formData.append('title', titulo);
    formData.append('name', nome);
    formData.append('period', `${formatarData(dataInicio)} - ${checkAtual?'Presente':formatarData(dataFim)}`);
    formData.append('description', descricao);
    formData.append('status', status);
    if(tags.length>0) formData.append('tags', JSON.stringify(tags));
    if(linkProjeto) formData.append('link', linkProjeto);
    if(imagem) formData.append('image', imagem);

    try {
        await axiosWe.post('/candproject', formData);
        return true;
    } catch (erro) {
        console.error('Erro ao cadastrar projeto:',erro);
        return false;
    }
}

function isValidURL(link: string): boolean {
    try {
        new URL(link);
        return true;
    } catch (_) {
        console.log(_);
        return false;
    }
}