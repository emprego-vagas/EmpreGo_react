import axiosWe from '../utils/axiosInstance';
import { DadosUsuario } from '../utils/globalFunctions';

export interface NotificationEG {
    sender: {
        id: string;
        name: string;
        type: 'candidato' | 'empresa';
        image: string;
    };
    recipient: {
        id: string;
        type: 'candidato' | 'empresa';
    };
    data: NotificationData;
    event?: {
        chat_request?: {
            action: 'create'|'accept'|'refuse'|'cancel';
            id?: string;
            chatId?: string;
        };
        chat?: {
            action: 'delete';
            id: string;
        };
    };
}

export interface NotificationData {
    id: string;
    title: string;
    category: string;
    text: string;
    read: boolean;
    image: string | null;
    createdAt: Date;
}

export async function carregarNotificacoes(): Promise<NotificationData[]>{
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
        const notifCachedJson: {updatedAt: number, ownerId: string, notifs: NotificationData[]} = JSON.parse(notifCachedString);
        console.log(notifCachedJson);
        const { updatedAt, notifs, ownerId } = notifCachedJson;
        const response = await axiosWe(`/notification?skiptime=${updatedAt}`);
        console.log(response);
        const notifsBack: NotificationData[] = response.data.map(nt=>({
            id: nt.id,
            title: nt.title,
            category: nt.category,
            text: nt.text,
            read: nt.read,
            image: nt.image,
            createdAt: nt.created_at,
        }));
        notifCachedJson.updatedAt = new Date(notifsBack[0]?.createdAt).getTime() || 0;
        const notifsIds = notifs?.map(n=>n.id) || '';
        notifCachedJson.notifs = [ ...notifsBack.filter(n=>!notifsIds.includes(n.id)), ...(ownerId===user.id ? notifs : []) ];
        notifCachedJson.ownerId = user.id;
        console.log(notifCachedJson);
        const newNotifsString = JSON.stringify(notifCachedJson);
        localStorage.setItem('NotificacoesEmpreGo', newNotifsString);
        return notifCachedJson.notifs;
    } else {
        console.log('Buscando pela primeira vez.');
        const response = await axiosWe('/notification');
        const notifsBack: NotificationData[] = response.data.map(nt=>({
            id: nt.id,
            title: nt.title,
            category: nt.category,
            text: nt.text,
            read: nt.read,
            image: nt.image,
            createdAt: nt.created_at,
        }));;
        console.log(notifsBack)
        const notifCachedJson = {
            updatedAt: new Date(notifsBack[0]?.createdAt).getTime() || 0,
            notifs: notifsBack,
            ownerId: user.id
        };
        console.log(notifCachedJson)
        const newNotifsString = JSON.stringify(notifCachedJson);
        localStorage.setItem('NotificacoesEmpreGo', newNotifsString);
        return notifCachedJson.notifs;
    }
}

export async function lerNotificacao(idNotif: string) {
    try {
        const notifCachedString = localStorage.getItem('NotificacoesEmpreGo');
        const notifJson: {updatedAt: number, ownerId: string, notifs: NotificationData[]} = JSON.parse(notifCachedString);
        const notifJsonUpdated = {...notifJson, notifs: notifJson.notifs.map(n=> n.id===idNotif ? {...n, read: true} : n)};
        const newNotifString = JSON.stringify(notifJsonUpdated);
        localStorage.setItem('NotificacoesEmpreGo', newNotifString);
        await axiosWe.post('/notification/read', {ids: [idNotif]});
    } catch (erro) {
        console.error('Erro ao ler notificação:',erro);
    }
}

export async function lerTodasNotificacoes() {
    try {
        const notifCachedString = localStorage.getItem('NotificacoesEmpreGo');
        const notifJson: {updatedAt: number, ownerId: string, notifs: NotificationData[]} = JSON.parse(notifCachedString);
        const idsToRead = notifJson.notifs.filter(nt=>!nt.read).map(n=>n.id);
        const notifJsonUpdated = {...notifJson, notifs: notifJson.notifs.map(n=> ({...n, read: true}))};
        const newNotifString = JSON.stringify(notifJsonUpdated);
        localStorage.setItem('NotificacoesEmpreGo', newNotifString);
        await axiosWe.post('/notification/read', {ids: idsToRead});
    } catch (erro) {
        console.error('Erro ao ler notificações:',erro);
    }
}

export function novaNotificacaoLocalStorage(newNotif: NotificationData){
    const notifCachedString = localStorage.getItem('NotificacoesEmpreGo');
    if(notifCachedString){
        const notifCachedJson: {updatedAt: number, ownerId: string, notifs: NotificationData[]} = JSON.parse(notifCachedString);
        notifCachedJson.notifs = [newNotif, ...notifCachedJson.notifs];
        notifCachedJson.updatedAt = new Date(newNotif.createdAt).getTime();
        const newNotifString = JSON.stringify(notifCachedJson);
        localStorage.setItem('NotificacoesEmpreGo', newNotifString);
    }
}