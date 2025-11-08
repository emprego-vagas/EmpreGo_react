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
    if(!isValidURL(linkProjeto)){
        mostrarErroTopo('Por favor, insira uma URL válida');
        return false;
    }
    if (status === 'Concluído' && !dataFim) {
        mostrarErroTopo('Projetos concluídos devem ter uma data de conclusão');
        return false;
    }

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('nome', nome);
    formData.append('periodo', `${formatarData(dataInicio)} - ${checkAtual?'Presente':formatarData(dataFim)}`);
    formData.append('descricao', descricao);
    formData.append('tags', JSON.stringify(tags));
    formData.append('link', linkProjeto);
    formData.append('status', status);
    if(imagem) formData.append('imagem', imagem);

    try {
        await axiosWe.post('/projeto', formData);
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