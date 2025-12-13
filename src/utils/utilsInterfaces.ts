export interface Candidato {
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

export interface CustomCand {
    experiencias: Experiencia[];
    experiencias_count: number;
    projetos_cand: ProjetoCand[];
    projetos_count: number;
    tags: Tag[];
    tags_count: number;
    idiomas: Idioma[];
    idiomas_count: number;
}

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

export interface ProjetoCand {
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

export interface Tag {
    id: string;
    nome: string;
};

export interface Idioma {
    id: string;
    nome: string;
    nivel: string;
}

export interface Empresa {
    id: string;
    foto: string;
    descricao: string | null;
    instagram: string | null;
    github: string | null;
    twitter: string | null;
    data_criacao: Date | null;
    nome_fant: string;
    setor: string | null;
    porte: string | null;
    contato: string | null;
    site: string | null;
    youtube: string | null;
    linkedin: string | null;
    link_endereco: string | null;
    facebook: string | null;
}

export interface CustomEmp {
    tags_empresas: Tag_empresa[];
    tags_count: number;
    filiais: Filial[];
    filiais_count: number;
}

export interface Tag_empresa {
    id: string;
    nome: string;
}

export interface Filial { 
    cidade: string;
    estado: string;
    tipo: string;
    id: string
}