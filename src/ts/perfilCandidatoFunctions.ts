export interface Usua {
    email: string;
    id: string;
    nome: string;
    genero: string;
    data_nasc: string;
    foto: string | null;
    descricao: string | null;
    cpf: string | null;
    estado: string | null;
    cidade: string | null;
    instagram: string | null;
    github: string | null;
    twitter: string | null;
    pronomes: string | null;
    data_criacao: Date | null;
    site_pessoal: string | null;
    curriculo: string | null;
    cargo_atual: string | null;
    portifolio: string | null;
    empresa_atual: string | null;
    curriculo_file: string | null;
}

export interface Custom {
    experiencias: Experiencia[];
    experiencias_count: number;
    projetos_cand: ProjetosCand[];
    projetos_count: number;
    tags: Tags[];
    tags_count: number;
    idiomas: Idiomas[];
    idiomas_count: number;
};

export interface Experiencia {
    id: string;
    nome: string;
    descricao: string;
    titulo: string;
    periodo: string;
    tags_experiencias: {
        nome: string;
    }[];
};

export interface ProjetosCand {
    id: string;
    nome: string;
    descricao: string;
    link: string | null;
    titulo: string;
    periodo: string;
    status: string;
    imagem: string;
    tags_projetos_cand: {
        nome: string;
    }[];
};

export interface Tags {
    id: string;
    nome: string;
};

export interface Idiomas {
    id: string;
    nome: string;
    nivel: string;
}

export function carregarTextoDoNivel(nivel: string): string{
    let nivelExib = 'Indefinido';
    switch (nivel) {
        case 'A1':
            nivelExib = 'Iniciante';
            break;
        case 'A2':
            nivelExib = 'Básico';
            break;
        case 'B1':
            nivelExib = 'Intermediário';
            break;
        case 'B2':
            nivelExib = 'Intermediário Avançado';
            break;
        case 'C1':
            nivelExib = 'Avançado';
            break;
        case 'C2':
            nivelExib = 'Fluente';
            break;
        default:
            break;
    }
    return `${nivelExib}(${nivel})`;
}

export function carregarPorcentagemPeloNivel(nivel: string): string{
    let porcentagem = '0';
    switch (nivel) {
        case 'A1':
            porcentagem = '20';
            break;
        case 'A2':
            porcentagem = '35';
            break;
        case 'B1':
            porcentagem = '55';
            break;
        case 'B2':
            porcentagem = '70';
            break;
        case 'C1':
            porcentagem = '85';
            break;
        case 'C2':
            porcentagem = '100';
            break;
        default:
            break;
    }
    return porcentagem;
}