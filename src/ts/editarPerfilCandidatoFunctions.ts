import axios from "axios";
import { mostrarErroTopo } from "../utils/globalFunctions";
import axiosWe from "../utils/axiosInstance";

export interface FileEditCandFace {
    cached: string;
    value: File | null;
    disabled: boolean;
    truncate: boolean;
}

export interface CampoEditCandFace {
    cached: string;
    value: string;
    disabled: boolean;
}

export async function salvarEdicaoCandidato(nomeInfo: CampoEditCandFace, cpfInfo: CampoEditCandFace, pronomesInfo: CampoEditCandFace, pronomesPersonalizadosInfo: CampoEditCandFace, portfolioInfo: CampoEditCandFace, githubInfo: CampoEditCandFace, curriculoInfo: CampoEditCandFace, instagramInfo: CampoEditCandFace, site_pessoalInfo: CampoEditCandFace, twitterInfo: CampoEditCandFace, cidadeInfo: CampoEditCandFace, estadoInfo: CampoEditCandFace, cargo_atualInfo: CampoEditCandFace, empresa_atualInfo: CampoEditCandFace, descricaoInfo: CampoEditCandFace, fotoInfo: FileEditCandFace, curriculo_fileInfo: FileEditCandFace): Promise<boolean> {
    const formData = new FormData();
    if(!nomeInfo.disabled && nomeInfo.value && nomeInfo.value!==nomeInfo.cached) {
        const newName = nomeInfo.value;
        if (newName.length < 3){
            mostrarErroTopo('O seu nome deve ter no mínimo 3 caracteres');
            return false;
        }
        formData.append('nome', newName);
    };
    if(!cpfInfo.disabled && cpfInfo.value && cpfInfo.value!==cpfInfo.cached) {
        const newCpf = cpfInfo.value
        if(!validarCPF(newCpf)) {
            mostrarErroTopo("CPF inválido");
            return false;
        }
        formData.append('cpf', newCpf);
    };
    if(!pronomesInfo.disabled && pronomesInfo.value && pronomesInfo.value!==pronomesInfo.cached && pronomesPersonalizadosInfo.value!==pronomesPersonalizadosInfo.cached) {
        const pronSelect = pronomesInfo.value;
        const pronPersnlzd = pronomesPersonalizadosInfo.value;
        if (pronSelect==='Outro') {
            // * Se escolheu o campo outro vê se ja tem cached, se não tem e não forneceu o personalizado da erro
            if(!pronPersnlzd && !pronomesInfo.cached) {
                mostrarErroTopo('O campo de pronome personalizado deve ser preenchido');
                return false;
            }
            // * Se ja tinha cached e quis remover seta como null
            formData.append('pronomes', pronPersnlzd?.trim() || 'null');
        } else formData.append('pronomes', pronSelect);
    }
    if(!portfolioInfo.disabled && (portfolioInfo.value || portfolioInfo.cached) && portfolioInfo.value!==portfolioInfo.cached) {
        const valor = portfolioInfo.value?.trim() || 'null';
        if (valor !== 'null' && !validarLink(valor)) return false;
        formData.append('portifolio', valor);
    };
    if(!curriculoInfo.disabled && (curriculoInfo.value || curriculoInfo.cached) && curriculoInfo.value!==curriculoInfo.cached) {
        const valor = curriculoInfo.value?.trim() || 'null';
        if (valor !== 'null' && !validarLink(valor)) return false;
        formData.append('curriculo', valor);
    };
    if(!site_pessoalInfo.disabled && (site_pessoalInfo.value || site_pessoalInfo.cached) && site_pessoalInfo.value!==site_pessoalInfo.cached) {
        const valor = site_pessoalInfo.value?.trim() || 'null';
        if (valor !== 'null' && !validarLink(valor)) return false;
        formData.append('site_pessoal', valor);
    };
    if(!githubInfo.disabled && (githubInfo.value || githubInfo.cached) && githubInfo.value!==githubInfo.cached) {
        const valor = githubInfo.value?.trim() || 'null';
        if (valor !== 'null' && !validarLink(valor, 'Github')) return false;
        formData.append('github', valor);
    };
    if(!instagramInfo.disabled && (instagramInfo.value || instagramInfo.cached) && instagramInfo.value!==instagramInfo.cached) {
        const valor = instagramInfo.value?.trim() || 'null';
        if (valor !== 'null' && !validarLink(valor, 'Instagram')) return false;
        formData.append('instagram', valor);
    };
    if(!twitterInfo.disabled && (twitterInfo.value || twitterInfo.cached) && twitterInfo.value!==twitterInfo.cached) {
        const valor = twitterInfo.value?.trim() || 'null';
        if (valor !== 'null' && !validarLink(valor, 'X')) return false;
        formData.append('twitter', valor);
    };
    if(!estadoInfo.disabled && (estadoInfo.value || estadoInfo.cached) && estadoInfo.value!==estadoInfo.cached) {
        formData.append('estado', estadoInfo.value || 'null');
    };
    if(!cidadeInfo.disabled && (cidadeInfo.value || cidadeInfo.cached) && cidadeInfo.value!==cidadeInfo.cached) {
        const valor = cidadeInfo.value?.trim() || 'null';
        if (valor !== 'null') {
            if(!estadoInfo.value) {
                mostrarErroTopo('Para alterar a cidade você precisa fornecer um estado')
                return false
            };
            const cidadeValida = await validarCidadePorEstado(valor, estadoInfo.value);
            if(!cidadeValida) return false;
        };
        formData.append('cidade', valor);
    };
    if(fotoInfo.value || (fotoInfo.cached!=='/assets/imgs/genPfp.png' && fotoInfo.truncate)) {
        formData.append('foto', fotoInfo.value || 'null');
    };
    if(!cargo_atualInfo.disabled && (cargo_atualInfo.value || cargo_atualInfo.cached) && cargo_atualInfo.value!==cargo_atualInfo.cached) {
        formData.append('cargo_atual', cargo_atualInfo.value?.trim() || 'null');
    };
    if(!empresa_atualInfo.disabled && (empresa_atualInfo.value || empresa_atualInfo.cached) && empresa_atualInfo.value!==empresa_atualInfo.cached) {
        formData.append('empresa_atual', empresa_atualInfo.value?.trim() || 'null');
    };
    if(!descricaoInfo.disabled && (descricaoInfo.value || descricaoInfo.cached) && descricaoInfo.value!==descricaoInfo.cached) {
        formData.append('descricao', descricaoInfo.value?.trim() || 'null');
    };
    if(curriculo_fileInfo.value || (curriculo_fileInfo.cached && curriculo_fileInfo.truncate)) {
        formData.append('curriculo_file', curriculo_fileInfo.value || 'null');
    };
    if (formData.entries().next().done) return true;

    try {
        await axiosWe.post('/perfil/candidato', formData);
        return true;
    } catch (erro) {
        console.error('Erro ao salvar edição do perfil:', erro);
        return false;
    }
};

function validarCPF(cpf: string): boolean {
    if (!cpf) {
        return false;
    };

    cpf = cpf.replace(/[^\d]+/g, ""); // Remove pontos e traços

    if (cpf.length !== 11) {
        return false;
    } else if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digito1 = 11 - (soma % 11);
    if (digito1 > 9) digito1 = 0;
    if (digito1 != parseInt(cpf.charAt(9))) {
        return false;
    };

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let digito2 = 11 - (soma % 11);
    if (digito2 > 9) digito2 = 0;
    if (digito2 != parseInt(cpf.charAt(10))) {
        return false;
    };

    return true;
}

function validarLink(link: string, campo = 'Link') {
    if (campo !== 'Link' && !link.includes(campo.toLowerCase())) {
        mostrarErroTopo(`${campo} inválido`);
        return false
    };
    try {
        new URL(link.includes("://") ? link : "https://" + link);
        return true;
    } catch {
        mostrarErroTopo(`${campo} inválido`);
        return false;
    };
}

async function validarCidadePorEstado(cidade: string, estado: string): Promise<boolean>{
    try {
        const response = await axios(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`) as {data: { nome: string; }[]};
        const cidades = response.data.map((ci) => ci.nome.toLowerCase());
        if (!cidades.includes(cidade.toLowerCase())) {
            mostrarErroTopo(`Cidade inválida para o estado ${estado}`);
            return false;
        };
        return true;
    } catch (erro) {
        console.error('Erro ao validae cidade:',erro);
        mostrarErroTopo('Erro ao validar cidade');
        return false;
    }
}