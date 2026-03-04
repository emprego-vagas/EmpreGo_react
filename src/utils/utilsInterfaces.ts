export interface Candidato {
    resume: string | null;
    name: string;
    gender: string;
    id: string;
    image: string;
    resume_file: string | null;
    banner: string;
    description: string | null;
    state: string | null;
    instagram: string | null;
    github: string | null;
    portfolio: string | null;
    twitter: string | null;
    pronouns: string | null;
    personal_site: string | null;
    current_position: string | null;
    current_company: string | null;
    created_at: Date;
    contact_email: string | null;
    city: string | null;
}

export interface CustomCand {
    experiences: Experiencia[];
    experiencesTotal: number;
    candProjects: ProjetoCand[];
    candProjectsTotal: number;
    candTags: Tag[];
    candTagsTotal: number;
    languages: Idioma[];
    languagesTotal: number;
}

export interface Experiencia {
    name: string;
    id: string;
    description: string;
    experiences_tags: {
        name: string;
        id: string;
    }[];
    title: string;
    period: string;
};

export interface ProjetoCand {
    name: string;
    id: string;
    image: string | null;
    description: string;
    cand_projects_tags: {
        name: string;
        id: string;
    }[];
    link: string | null;
    title: string;
    status: string;
    period: string;
};

export interface Tag {
    id: string;
    name: string;
};

export interface Idioma {
    name: string;
    id: string;
    level: string;
    percentage: number;
}

export interface Empresa {
    name: string;
    id: string;
    created_at: Date;
    image: string;
    description: string | null;
    state: string;
    city: string;
    instagram: string | null;
    github: string | null;
    twitter: string | null;
    banner: string;
    values: string | null;
    sector: string | null;
    company_size: string | null;
    contact: string | null;
    site: string | null;
    youtube: string | null;
    linkedin: string | null;
    address_link: string | null;
    facebook: string | null;
    mission: string | null;
    vision: string | null;
}

export interface CustomEmp {
    compTags: Tag_empresa[];
    compTagsTotal: number;
    branches: Filial[];
    branchesTotal: number;
}

export interface Tag_empresa {
    id: string;
    name: string;
}

export interface Filial { 
    id: string;
    category: string | null;
    state: string;
    city: string;
}