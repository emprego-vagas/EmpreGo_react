import axiosWe from '../utils/axiosInstance';
import { DadosUsuario } from '../utils/globalFunctions';

export interface NotificationEG {
    id: string;
    titulo: string;
    tipo: string;
    texto: string;
    lida: boolean;
    imagem?: string;
    data_criacao: Date;
    object?: {
        [key: string]: unknown;
    };
}

export async function carregarNotificacoes(): Promise<NotificationEG[]>{
    const notifCachedString = localStorage.getItem('NotificacoesEmpreGo');
    const user = DadosUsuario.getUsuario();
    const firstTime = sessionStorage.getItem('FirstTimeGetNotifications');
    if(firstTime && firstTime==='false'){
        const notifJson = JSON.parse(notifCachedString);
        console.log(notifJson)
        return notifJson.notifs || [];
    };
    sessionStorage.setItem('FirstTimeGetNotifications', 'false');
    console.log("Buscando no back")
    if(notifCachedString) {
        const notifCachedJson: {updatedAt: number, ownerId: string, notifs: NotificationEG[]} = JSON.parse(notifCachedString);
        console.log(notifCachedJson);
        const { updatedAt, notifs, ownerId } = notifCachedJson;
        const response = await axiosWe(`/notificacao?skiptime=${updatedAt}`);
        console.log(response);
        const notifsBack: NotificationEG[] = response.data;
        notifCachedJson.updatedAt = new Date(notifsBack[0]?.data_criacao).getTime() || 0;
        const notifsIds = notifs?.map(n=>n.id) || '';
        notifCachedJson.notifs = [ ...notifsBack.filter(n=>!notifsIds.includes(n.id)), ...(ownerId===user.id ? notifs : []) ];
        notifCachedJson.ownerId = user.id;
        console.log(notifCachedJson);
        const newNotifsString = JSON.stringify(notifCachedJson);
        localStorage.setItem('NotificacoesEmpreGo', newNotifsString);
        return notifCachedJson.notifs;
    } else {
        console.log('Buscando pela primeira vez.');
        const response = await axiosWe('/notificacao');
        const notifsBack: NotificationEG[] = response.data;
        console.log(notifsBack)
        const notifCachedJson = {
            updatedAt: new Date(notifsBack[0]?.data_criacao).getTime() || 0,
            notifs: notifsBack,
            ownerId: user.id
        };
        console.log(notifCachedJson)
        const newNotifsString = JSON.stringify(notifCachedJson);
        localStorage.setItem('NotificacoesEmpreGo', newNotifsString);
        return notifCachedJson.notifs;
    }
}

export async function lerNotificacao(idNotif: string): Promise<void> {
    try {
        const notifCachedString = localStorage.getItem('NotificacoesEmpreGo');
        const notifJson: {updatedAt: number, ownerId: string, notifs: NotificationEG[]} = JSON.parse(notifCachedString);
        const notifJsonUpdated = {...notifJson, notifs: notifJson.notifs.map(n=> n.id===idNotif ? {...n, lida: true} : n)};
        const newNotifString = JSON.stringify(notifJsonUpdated);
        localStorage.setItem('NotificacoesEmpreGo', newNotifString);
        await axiosWe.post('/notificacao/ler', {ids: [idNotif]});
    } catch (erro) {
        console.error('Erro ao ler notificação:',erro);
    }
}

export async function lerTodasNotificacoes(): Promise<void> {
    try {
        const notifCachedString = localStorage.getItem('NotificacoesEmpreGo');
        const notifJson: {updatedAt: number, ownerId: string, notifs: NotificationEG[]} = JSON.parse(notifCachedString);
        const idsToRead = notifJson.notifs.filter(nt=>!nt.lida).map(n=>n.id);
        const notifJsonUpdated = {...notifJson, notifs: notifJson.notifs.map(n=> ({...n, lida: true}))};
        const newNotifString = JSON.stringify(notifJsonUpdated);
        localStorage.setItem('NotificacoesEmpreGo', newNotifString);
        await axiosWe.post('/notificacao/ler', {ids: idsToRead});
    } catch (erro) {
        console.error('Erro ao ler notificações:',erro);
    }
}

export function novaNotificacaoLocalStorage(newNotif: NotificationEG){
    const notifCachedString = localStorage.getItem('NotificacoesEmpreGo');
    if(notifCachedString){
        const notifCachedJson: {updatedAt: number, ownerId: string, notifs: NotificationEG[]} = JSON.parse(notifCachedString);
        notifCachedJson.notifs = [newNotif, ...notifCachedJson.notifs];
        notifCachedJson.updatedAt = new Date(newNotif.data_criacao).getTime();
        const newNotifString = JSON.stringify(notifCachedJson);
        localStorage.setItem('NotificacoesEmpreGo', newNotifString);
    }
}