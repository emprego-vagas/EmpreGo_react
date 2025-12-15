import axios from "axios";
import { mostrarErroTopo, DadosUsuario } from "./globalFunctions";

// * Configurando axios
const axiosWe = axios.create();
axiosWe.defaults.withCredentials = true;

const hostName = window.location.hostname;
axiosWe.defaults.baseURL = hostName.includes('localhost') ? 'http://localhost:3002' : 'https://api.emprego-vagas.com.br';

axiosWe.interceptors.response.use(function (config) {
  return config;
}, function (erro) {
  const status = erro.response?.status || erro.status;
  const originalError = erro.response?.data?.error || erro.message;
  let msg = originalError;
  let erroTopo = true;

  switch (status) {
    case 401:

      if(msg.includes("Você não está logado")) {
        DadosUsuario.clearUsuario();
        erroTopo = false;
      };

      break;
    case 403:

      if(msg.includes("Sessão expirada")){
        msg = 'Sessão expirada. Faça login novamente.';
        DadosUsuario.clearUsuario();
        setTimeout(() => {
          window.location.href = '/login';
        }, 3*1000);
      }
      else if(msg.includes("Acesso apenas para")){
        setTimeout(() => {
          window.location.href = '/';
        }, 3*1000);
      }
      else if(msg.includes("Sessão inválida")){
        msg = 'Sessão inválida. Faça login novamente.';
        DadosUsuario.clearUsuario();
        setTimeout(() => {
          window.location.href = '/login';
        }, 3*1000);
      }

      break;
    case 404:
      if(msg.includes('Candidato não encontrado')||msg.includes('Empresa não encontrada')) erroTopo = false;
      break;
    case 409:

      erroTopo = false;

      break;
    case 500:
      console.log(msg)
      if(msg.includes('Erro ao enviar mensagem')) erroTopo = false;
      if(msg.includes('Erro ao verificar token')) msg = 'Erro ao validar sessão, tente recarregar a página.';
      else msg = 'Erro do servidor, tente novamente.';

      break;
    default:
      break;
  }

  if(erroTopo) mostrarErroTopo(msg);
  return Promise.reject({ message: msg, status: status, originalError: originalError });
});

export interface AxiosWeError {
  message: string;
  status: number;
  originalError: string;
}

export default axiosWe;