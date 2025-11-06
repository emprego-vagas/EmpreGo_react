import axiosWe from "../utils/axiosInstance";
import { mostrarErroTopo } from "../utils/globalFunctions";

export async function cadastrarExperiencia(titulo: string, nome: string, dataInicio: string, dataFim: string, checkAtual: boolean, descricao: string, tags: string[]): Promise<boolean> {
    if (!titulo || !nome || !dataInicio || (!checkAtual&&!dataFim) || !descricao) {
        mostrarErroTopo('Por favor, preencha todos os campos obrigatórios (*)');
        return false;
    }
    if(!validarData(dataInicio)||(!checkAtual&&!validarData(dataFim))){
        mostrarErroTopo('Datas inválidas');
        return false;
    }

    const experiencia = {titulo, nome, periodo: `${formatarData(dataInicio)} - ${checkAtual?'Presente':formatarData(dataFim)}`, descricao, tags};

    try {
        await axiosWe.post('/experiencias', experiencia);
        return true;
    } catch (erro) {
        console.error('Erro ao cadastrar experiência:',erro);
        return false;
    }
}

export function formatarData(dataString: string): string {
    if (!dataString) return '';

    const [ano, mes] = dataString.split('-');
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${meses[parseInt(mes, 10) - 1]} ${ano}`;
}

export function validarData(data: string): boolean {
    const anoAtual = new Date().getFullYear();

    const [ano] = data.split('-').map(Number);
    const anoMin = anoAtual - 100;
    const anoMax = anoAtual;

    if (ano < anoMin || ano > anoMax) {
        mostrarErroTopo(`A data deve estar entre ${anoMin} e ${anoMax}.`);
        return false;
    }
    return true;
}