import axiosWe from "./axiosInstance";

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
  axiosWe.post('/logout')
  .then(()=>{
    // ? alert('Você foi desconectado.'); Se achar necessario bota um alert pro logout
    DadosUsuario.clearUsuario();
    localStorage.removeItem('NotificacoesEmpreGo');
    sessionStorage.clear();
    window.location.href = '/';
  })
}

export class DadosUsuario {
    
    static setarUsuario(id: string, nome: string, tipo: string, nivel: string, foto: string){
        const userJson = {id, nome, tipo, nivel, foto};
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

}

export async function fileDownload(url: string, tipo: string){
    const hostName = window.location.hostname.includes('localhost') ? 'http://localhost:3002' : 'https://api.emprego-vagas.com.br';
    const link = document.createElement('a');   // * Cria um link temporário
    link.href = `${hostName}/mensagens/download?link=${encodeURIComponent(url)}&tipo=${tipo}`;   // * Seta a rota de download como href do link
    document.body.appendChild(link);   // * Insere o link temporário na Árvore DOM
    link.click();   // * Clica no link temporário automaticamente para iniciar o download
    document.body.removeChild(link);   // * Remove o link temporário da Árvore DOM (OBS: fui eu q comentei isso tá? foi chat nn)
};