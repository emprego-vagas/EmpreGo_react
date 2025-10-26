import axiosWe from "./axiosInstance";

export function mostrarErroTopo(mensagem: string) {
    const old = document.querySelector('.erro-mensagem-geral2');
    if (old) old.remove();

    const erroDiv = document.createElement('div');
    erroDiv.className = 'erro-mensagem-geral2';

    const contrasteDiv = document.createElement('div');
    contrasteDiv.className = 'erro-mensagem-contraste2';
    contrasteDiv.innerHTML = `
        <div class="fixed top-0 left-0 w-full flex justify-center z-9999">
            <div class="max-w-lg mx-auto">
            <div class="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 shadow-md rounded-b mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="mr-3" width="16" height="16" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 110c23.6 0 42.7 19.1 42.7 42.7s-19.1 42.7-42.7 42.7-42.7-19.1-42.7-42.7S232.4 118 256 118zm56 270c0 6.6-5.4 12-12 12h-88c-6.6 0-12-5.4-12-12v-24c0-6.6 5.4-12 12-12h12v-88h-12c-6.6 0-12-5.4-12-12v-24c0-6.6 5.4-12 12-12h88c6.6 0 12 5.4 12 12v124h12c6.6 0 12 5.4 12 12v24z"/>
                </svg>
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

export function logout(){
  axiosWe.post('/logout')
  .then(()=>{
    // ? alert('Você foi desconectado.'); Se achar necessario bota um alert pro logout
    DadosUsuario.clearUsuario();
    window.location.href = '/';
  })
}

export class DadosUsuario {
    
    static setarUsuario(id: string, nome: string, tipo: string, nivel: string, foto: string | null = null){
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
                setTimeout(()=>{
                    window.location.href = '/login';
                }, 3*1000);
            }
            return false;
        } else {
            const userJson = JSON.parse(userString);
            if(restricao&&userJson.tipo!==restricao&&userJson.nivel!==restricao){
                mostrarErroTopo(`Acesso apenas para ${restricao}s`);
                setTimeout(()=>{
                    window.location.href = '/';
                }, 3*1000);
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
    const hostName = window.location.hostname.includes('localhost') ? 'http://localhost:3001' : 'urlDeployBack';
    const link = document.createElement('a');   // * Cria um link temporário
    link.href = `${hostName}/mensagens/download?link=${encodeURIComponent(url)}&tipo=${tipo}`;   // * Seta a rota de download como href do link
    document.body.appendChild(link);   // * Insere o link temporário na Árvore DOM
    link.click();   // * Clica no link temporário automaticamente para iniciar o download
    document.body.removeChild(link);   // * Remove o link temporário da Árvore DOM (OBS: fui eu q comentei isso tá? foi chat nn)
};