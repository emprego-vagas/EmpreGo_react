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