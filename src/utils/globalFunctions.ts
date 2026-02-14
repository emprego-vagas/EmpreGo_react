import axiosWe from "./axiosInstance";
import socket from "./socketsConnection";

export function mostrarErroTopo(mensagem: string) {
    const old = document.querySelector('.erro-mensagem-geral2');
    if (old) old.remove();

    const erroDiv = document.createElement('div');
    erroDiv.className = 'erro-mensagem-geral2';

    const contrasteDiv = document.createElement('div');
    contrasteDiv.className = 'erro-mensagem-contraste2';
    contrasteDiv.innerHTML = `
        <div class="fixed top-0 left-0 w-full flex justify-center z-[9999]">
            <div class="max-w-lg mx-auto">
                <div class="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 shadow-md rounded-b mb-4">
                    <i class="fas fa-exclamation-circle mr-3"></i>
                    <div>
                        <strong class="font-bold">Erro: </strong>
                        <span class="block sm:inline">${mensagem}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    erroDiv.appendChild(contrasteDiv);
    document.body.prepend(erroDiv);

    setTimeout(() => {
        if (erroDiv.parentNode) erroDiv.remove();
    }, 3000);
}

export function mostrarSucessoTopo(mensagem: string) {
    const old = document.querySelector('.sucesso-mensagem-geral');
    if (old) old.remove();

    const sucessoDiv = document.createElement('div');
    sucessoDiv.className = 'sucesso-mensagem-geral';

    const contrasteDiv = document.createElement('div');
    contrasteDiv.className = 'sucesso-mensagem-contraste';
    contrasteDiv.innerHTML = `
        <div class="fixed top-0 left-0 w-full flex justify-center z-[9999]">
            <div class="max-w-lg mx-auto">
                <div class="flex items-center bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 shadow-md rounded-b mb-4">
                    <i class="fas fa-check-circle mr-3"></i>
                    <div>
                        <strong class="font-bold">Sucesso: </strong>
                        <span class="block sm:inline">${mensagem}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    sucessoDiv.appendChild(contrasteDiv);
    document.body.prepend(sucessoDiv);

    setTimeout(() => {
        if (sucessoDiv.parentNode) sucessoDiv.remove();
    }, 3000);
};

export function mostrarAvisoTopo(mensagem: string) {
    const old = document.querySelector('.aviso-mensagem-geral');
    if (old) old.remove();

    const avisoDiv = document.createElement('div');
    avisoDiv.className = 'aviso-mensagem-geral';

    const contrasteDiv = document.createElement('div');
    contrasteDiv.className = 'aviso-mensagem-contraste';
    contrasteDiv.innerHTML = `
        <div class="fixed top-0 left-0 w-full flex justify-center z-[9999]">
            <div class="max-w-lg mx-auto">
                <div class="flex items-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 px-4 py-3 shadow-md rounded-b mb-4">
                    <i class="fas fa-exclamation-triangle mr-3"></i>
                    <div>
                        <strong class="font-bold">Aviso: </strong>
                        <span class="block sm:inline">${mensagem}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    avisoDiv.appendChild(contrasteDiv);
    document.body.prepend(avisoDiv);

    setTimeout(() => {
        if (avisoDiv.parentNode) avisoDiv.remove();
    }, 3000);
}

export function logout(){
  axiosWe.post('/auth/logout')
  .then(()=>{
    // ? alert('Você foi desconectado.'); Se achar necessario bota um alert pro logout
    DadosUsuario.clearUsuario();
    localStorage.removeItem('NotificacoesEmpreGo');
    sessionStorage.clear();
    window.location.href = '/';
  })
}

export class DadosUsuario {
    
    static setarUsuario(id: string, nome: string, tipo: string, nivel: string, foto: string, email: string){
        const userJson = {id, nome, tipo, nivel, foto, email};
        const userString = JSON.stringify(userJson);
        localStorage.setItem('dadosUsuario', userString);
    }

    static setarFoto(foto: string){
        const oldUserString = localStorage.getItem('dadosUsuario');
        if (!oldUserString) return;
        const userJson = JSON.parse(oldUserString);
        userJson.foto = foto;
        const newUserString = JSON.stringify(userJson);
        localStorage.setItem('dadosUsuario', newUserString);
    }

    static setarNome(nome: string){
        const oldUserString = localStorage.getItem('dadosUsuario');
        if (!oldUserString) return;
        const userJson = JSON.parse(oldUserString);
        userJson.nome = nome;
        const newUserString = JSON.stringify(userJson);
        localStorage.setItem('dadosUsuario', newUserString);
    }

    static getUsuario(exigeLogin: boolean = false, restricao: string | null = null){
        const userString = localStorage.getItem('dadosUsuario');
        if(!userString){
            if(exigeLogin){
                mostrarErroTopo('Você não está logado');
            }
            return false;
        } else {
            const userJson = JSON.parse(userString);
            if(restricao&&userJson.tipo!==restricao&&userJson.nivel!==restricao){
                mostrarErroTopo(`Acesso apenas para ${restricao}s`);
                return false;
            }
            return userJson;
        }
    }

    static clearUsuario(){
        localStorage.removeItem('dadosUsuario');
    }

    static setarLoginKey(loginKey: string){
        localStorage.setItem('VSLoginKey', loginKey);
    }

    static getLoginKey(): string{
        const loginKey = localStorage.getItem('VSLoginKey');
        return loginKey;
    }

}

export async function fileDownload(url: string, tipo: string){
    const hostName = window.location.hostname.includes('localhost') ? 'http://localhost:2923' : 'https://api.emprego-vagas.com.br';
    const link = document.createElement('a');   // * Cria um link temporário
    link.href = `${hostName}/custom/download?url=${encodeURIComponent(url)}&type=${tipo}`;   // * Seta a rota de download como href do link
    document.body.appendChild(link);   // * Insere o link temporário na Árvore DOM
    link.click();   // * Clica no link temporário automaticamente para iniciar o download
    document.body.removeChild(link);   // * Remove o link temporário da Árvore DOM (OBS: fui eu q comentei isso tá? foi chat nn)
};

type NotificationContent =
    | {
        solicitacao_conversa: {
            action: string;
            id?: string;
            newChatId?: string;
        };
    }
    | {
        conversa: {
            action: string;
            id: string;
        };
    };

export function sendNotification(recipient: {id: string, type: 'empresa' | 'candidato'}, content: NotificationContent){
    const usuario = DadosUsuario.getUsuario(true);
    if(!usuario) return;
    socket.emit('sendNotification',{
        remetente: {
            id: usuario.id,
            nome: usuario.nome,
            tipo: usuario.tipo,
            foto: usuario.foto
        },
        destinatario: {
            id: recipient.id,
            tipo: recipient.type
        },
        ...(content as NotificationContent)
    });
}

const formatacoes: Record<string, string> = {
  "energia": "Energia",
  "construcao civil": "Construção Civil",
  "imobiliario": "Imobiliário",
  "construcao": "Construção",
  "midia e comunicacao": "Mídia e Comunicação",
  "consultoria": "Consultoria",
  "escritorio": "Escritório",
  "joalheria": "Joalheria",
  "artes": "Artes",
  "vestuario": "Vestuário",
  "varejo": "Varejo",
  "musica": "Música",
  "livros": "Livros",
  "tecnologia": "Tecnologia",
  "celulares": "Celulares",
  "esportes": "Esportes",
  "automotivo": "Automotivo",
  "transporte": "Transporte",
  "games": "Games",
  "moveis": "Móveis",
  "setor publico": "Setor Público",
  "meio ambiente": "Meio Ambiente",
  "financeiro": "Financeiro",
  "pets": "Pets",
  "educacao": "Educação",
  "metalurgica": "Metalúrgica",
  "agricultura": "Agricultura",
  "saude": "Saúde",
  "moda": "Moda",
  "turismo": "Turismo",
  "saude e bem-estar": "Saúde e Bem-Estar",
  "eletronicos": "Eletrônicos",
  "marketing": "Marketing",
  "recursos humanos": "Recursos Humanos",
  "informatica": "Informática",
  "ferramentas": "Ferramentas",
  "entretenimento": "Entretenimento",
  "beleza": "Beleza",
  "quimica": "Química",
  "industria": "Indústria",
  "alimentacao": "Alimentação",
  "seguranca": "Segurança",
  "brinquedos": "Brinquedos",
  "telecomunicacoes": "Telecomunicações",
  "bebidas": "Bebidas",
  "eventos": "Eventos",
  "juridico": "Jurídico",
  "materiais": "Materiais",
  "limpeza": "Limpeza",
  "fotografia": "Fotografia",
  "servicos gerais": "Serviços Gerais"
};

export function formatarCategoria(palavra: string) {
  return formatacoes[palavra.toLowerCase()] ?? palavra;
}

const estadosFormatados: Record<string, string> = {
  "ac": "Acre",
  "al": "Alagoas",
  "ap": "Amapá",
  "am": "Amazonas",
  "ba": "Bahia",
  "ce": "Ceará",
  "df": "Distrito Federal",
  "es": "Espírito Santo",
  "go": "Goiás",
  "ma": "Maranhão",
  "mt": "Mato Grosso",
  "ms": "Mato Grosso do Sul",
  "mg": "Minas Gerais",
  "pa": "Pará",
  "pb": "Paraíba",
  "pr": "Paraná",
  "pe": "Pernambuco",
  "pi": "Piauí",
  "rj": "Rio de Janeiro",
  "rn": "Rio Grande do Norte",
  "rs": "Rio Grande do Sul",
  "ro": "Rondônia",
  "rr": "Roraima",
  "sc": "Santa Catarina",
  "sp": "São Paulo",
  "se": "Sergipe",
  "to": "Tocantins",
};

export function formatarEstado(sigla: string) {
  return estadosFormatados[sigla.toLowerCase()] ?? sigla;
}

export function validarLink(link: string, campo = 'Link') {
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

export function validarEmail(email: string): boolean {
    if (!email) return false;

    const emailLimpo = email.trim();

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;

    return emailRegex.test(emailLimpo);
}