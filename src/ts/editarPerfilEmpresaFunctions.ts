import { mostrarErroTopo, validarEmail, validarLink } from '../utils/globalFunctions';
import axiosWe from '../utils/axiosInstance';

export interface CampoEditEmpFace {
    cached: string;
    value: string;
    disabled: boolean;
}

export interface FileEditEmpFace {
    cached: string;
    value: File | null;
    disabled: boolean;
    truncate: boolean;
}

export async function salvarEdicaoEmpresa(
    nomeFantInfo: CampoEditEmpFace, descricaoInfo: CampoEditEmpFace, instagramInfo: CampoEditEmpFace, githubInfo: CampoEditEmpFace,
    twitterInfo: CampoEditEmpFace, setorInfo: CampoEditEmpFace, porteInfo: CampoEditEmpFace, contatoInfo: CampoEditEmpFace,
    siteInfo: CampoEditEmpFace, youtubeInfo: CampoEditEmpFace, linkedinInfo: CampoEditEmpFace, linkEnderecoInfo: CampoEditEmpFace,
    facebookInfo: CampoEditEmpFace, fotoInfo: FileEditEmpFace
): Promise<boolean>{
    const formData = new FormData();
    if(!nomeFantInfo.disabled && nomeFantInfo.value && nomeFantInfo.value!==nomeFantInfo.cached) {
        const newName = nomeFantInfo.value;
        if (newName.length < 3){
            mostrarErroTopo('O seu nome deve ter no mínimo 3 caracteres');
            return false;
        }
        formData.append('nome', newName);
    };
    if(!descricaoInfo.disabled && (descricaoInfo.value || descricaoInfo.cached) && descricaoInfo.value!==descricaoInfo.cached) {
        formData.append('descricao', descricaoInfo.value?.trim() || null);
    };
    if(!instagramInfo.disabled && (instagramInfo.value || instagramInfo.cached) && instagramInfo.value!==instagramInfo.cached) {
        const valor = instagramInfo.value?.trim() || null;
        if (valor !== null && !validarLink(valor, 'Instagram')) return false;
        formData.append('instagram', valor);
    };
    if(!githubInfo.disabled && (githubInfo.value || githubInfo.cached) && githubInfo.value!==githubInfo.cached) {
        const valor = githubInfo.value?.trim() || null;
        if (valor !== null && !validarLink(valor, 'GitHub')) return false;
        formData.append('github', valor);
    };
    if(!twitterInfo.disabled && (twitterInfo.value || twitterInfo.cached) && twitterInfo.value!==twitterInfo.cached) {
        const valor = twitterInfo.value?.trim() || null;
        if (valor !== null && !validarLink(valor, 'X')) return false;
        formData.append('twitter', valor);
    };
    if(!setorInfo.disabled && (setorInfo.value || setorInfo.cached) && setorInfo.value!==setorInfo.cached) {
        formData.append('setor', setorInfo.value?.trim() || null);
    };
    if(!porteInfo.disabled && (porteInfo.value || porteInfo.cached) && porteInfo.value!==porteInfo.cached) {
        formData.append('porte', porteInfo.value?.trim() || null);
    };
    if(!contatoInfo.disabled && (contatoInfo.value || contatoInfo.cached) && contatoInfo.value!==contatoInfo.cached) {
        const valor = contatoInfo.value?.trim() || null;
        if (valor !== null && !validarEmail(valor)) return false;
        formData.append('contato', valor);
    };
    if(!siteInfo.disabled && (siteInfo.value || siteInfo.cached) && siteInfo.value!==siteInfo.cached) {
        const valor = siteInfo.value?.trim() || null;
        if (valor !== null && !validarLink(valor)) return false;
        formData.append('site', valor);
    };
    if(!youtubeInfo.disabled && (youtubeInfo.value || youtubeInfo.cached) && youtubeInfo.value!==youtubeInfo.cached) {
        const valor = youtubeInfo.value?.trim() || null;
        if (valor !== null && !validarLink(valor, 'Youtube')) return false;
        formData.append('youtube', valor);
    };
    if(!linkedinInfo.disabled && (linkedinInfo.value || linkedinInfo.cached) && linkedinInfo.value!==linkedinInfo.cached) {
        const valor = linkedinInfo.value?.trim() || null;
        if (valor !== null && !validarLink(valor, 'Linkedin')) return false;
        formData.append('linkedin', valor);
    };
    if(!linkEnderecoInfo.disabled && (linkEnderecoInfo.value || linkEnderecoInfo.cached) && linkEnderecoInfo.value!==linkEnderecoInfo.cached) {
        const valor = linkEnderecoInfo.value?.trim() || null;
        if (valor !== null && !validarLink(valor)) return false;
        formData.append('link_endereco', valor);
    };
    if(!facebookInfo.disabled && (facebookInfo.value || facebookInfo.cached) && facebookInfo.value!==facebookInfo.cached) {
        const valor = facebookInfo.value?.trim() || null;
        if (valor !== null && !validarLink(valor)) return false;
        console.log(valor)
        formData.append('facebook', valor);
    };
    if(fotoInfo.value || (fotoInfo.cached!=='/assets/imgs/genPfp.png' && fotoInfo.truncate)) {
        formData.append('foto', fotoInfo.value || null);
    };

    if (formData.entries().next().done) return true;

    try {
        await axiosWe.post('/perfil/empresa', formData);
        return true;
    } catch (erro) {
        console.error('Erro ao salvar edição do perfil:', erro);
        return false;
    }
}