import axios from "axios";
import { mostrarErroTopo, DadosUsuario } from "./globalFunctions";
import { getFingerprint } from "./fingerprint";

declare module 'axios' {
  export interface AxiosResponse {
    message?: string;
    meta?: {
      total?: number;
      page?: number;
      perPage?: number;
      skip?: number;
      take?: number;
      totalPages?: number;
      cached?: boolean;
      hasNextPage?: boolean;
      words?: string[];
    };
  }
}

// * Configurando axios
const axiosWe = axios.create();
axiosWe.defaults.withCredentials = true;

const hostName = window.location.hostname;
axiosWe.defaults.baseURL = hostName.includes('localhost') ? 'http://localhost:2923' : 'https://api.emprego-vagas.com.br';

axiosWe.interceptors.request.use(async (config) => {
  const fingerprint = await getFingerprint();
  config.headers['X-Fingerprint-VisitorId'] = fingerprint;
  return config;
});

axiosWe.interceptors.response.use(function (config) {
  const { data, message, meta } = config.data;
  return {
    ...config,
    data, message, meta
  };
}, function (erro) {

  const requestUrl: string = erro.config?.url ?? '';
  const status = erro.response?.status || erro.status;
  const originalError = erro.response?.data?.error || erro.message;
  const type = erro.response?.data?.type || 'UNDEFINED_ERROR'
  let msg = originalError;
  let erroTopo = true;

  switch (type) {
    case 'VS_AUTH_REQUIRED':

      DadosUsuario.clearUsuario();
      erroTopo = false;

      break;

    case 'VS_AUTH_INVALID':
    case 'VS_AUTH_EXPIRED':

      msg = 'Sessão expirada. Faça login novamente.';
      DadosUsuario.clearUsuario();
      setTimeout(() => {
        window.location.href = '/login';
      }, 3*1000);

      break;
    
    case 'VS_AUTH_LIMITED_ACCESS':

      setTimeout(() => {
        window.location.href = '/';
      }, 3*1000);

      break;

    case 'VS_NOT_FOUND':

      // * Regex para identificar as URLs de perfil (/candidate/id/:id/profile ou /company/id/:id/profile)
      if(/^\/(candidate|company)\/id\/[^/]+\/profile$/.test(requestUrl)){
        erroTopo = false;
      }

      break;

    case 'VS_DB_UNAVAILABLE':
    case 'VS_SERVER_ERROR':

      msg = 'Erro do servidor, tente novamente.';
      break;
  
    default:
      break;
  }

  // switch (status) {
  //   case 409:

  //     erroTopo = false;

  //     break;
  //   case 500:
  //     console.log(msg)
  //     if(msg.includes('Erro ao enviar mensagem')) erroTopo = false;
  //     if(msg.includes('Erro ao verificar token')) msg = 'Erro ao validar sessão, tente recarregar a página.';
  //     else msg = 'Erro do servidor, tente novamente.';

  //     break;
  //   default:
  //     break;
  // }

  if(erroTopo) mostrarErroTopo(msg);
  return Promise.reject({ message: msg, status: status, originalError: originalError });
});

export interface AxiosWeError {
  message: string;
  status: number;
  originalError: string;
}

export default axiosWe;