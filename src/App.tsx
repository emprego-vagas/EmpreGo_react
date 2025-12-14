import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ConfirmEmail from './pages/ConfirmEmail';
import Teste from './pages/teste';
import Chats from './pages/Chats';
import PerfilCandidato from './pages/PerfilCandidato';
import CriarExperiencias from './pages/CriarExperiencias';
import CriarProjetos from './pages/CriarProjetos';
import EditarPerfilCandidato from './pages/EditarPerfilCandidato';
import Suporte from './pages/Suporte';
import Loader from './components/Loader';
import Sobre from './pages/Sobre';
import PerfilEmpresa from './pages/PerfilEmpresa';
import EditarPerfilEmpresa from './pages/EditarPerfilEmpresa';
import TimeOut from './pages/TimeOut';
import ScrollToHash from './components/ScrollToHash';
import TrocarSenha from './pages/TrocarSenha';
import socket from './utils/socketsConnection';
import { novaNotificacaoLocalStorage, type NotificationEG } from './ts/sinoNotificacoesFunctions';
import { useEffect } from 'react';
import CandVagas from './pages/CandVagas';
import ViewCandidatos from './pages/ViewCandidatos';
import { DadosUsuario } from './utils/globalFunctions'
import EmpresasPF from './pages/EmpresasPF';
import CandidatosPF from './pages/CandidatosPF'

function App() {
  const usuario = DadosUsuario.getUsuario();
  useEffect(()=>{
    function receivedNotification(newNotification: NotificationEG){
      novaNotificacaoLocalStorage(newNotification);
    }

    socket.on('receivedNotification', receivedNotification);

    return () => {
      socket.off('receivedNotification', receivedNotification);
    };
  }, [])
  
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path='*' element={<NotFound />} />
        <Route path='/timeout' element={<TimeOut />} />
        <Route path='/' element={usuario?.tipo==='candidato' ? <CandVagas /> : usuario?.tipo==='empresa'? <ViewCandidatos /> : <Index />} />
        <Route path='/inicio' element={<Index />} />
        <Route path='/login' element={<Login />} />
        <Route path='/suporte' element={<Suporte />} />
        <Route path='/sobre' element={<Sobre />} />
        <Route path='/confirmar' element={<ConfirmEmail/>} />
        <Route path='/trocarsenha' element={<TrocarSenha />} />
        <Route path='/teste' element={<Teste/>} />
        <Route path='/loader' element={<Loader/>} />
        <Route path='/chats' element={<Chats/>} />
        <Route path='/perfil/candidato' element={<PerfilCandidato/>} />
        <Route path='/perfil/candidato/editar' element={<EditarPerfilCandidato/>} />
        <Route path='/perfil/empresa' element={<PerfilEmpresa />} />
        <Route path='/perfil/empresa/editar' element={<EditarPerfilEmpresa/>} />
        <Route path='/experiencias/criar'element={<CriarExperiencias/>} />
        <Route path='/projetos/criar'element={<CriarProjetos/>} />
        <Route path='/empresas' element={<CandVagas />} />
        <Route path='/candidatos' element={<ViewCandidatos />} />
        <Route path='/empresa/:id' element={<EmpresasPF />} />
        <Route path='/candidato/:id' element={<CandidatosPF />} />
        <Route path='/EmpresasPF' element={<EmpresasPF />} />
        <Route path='/CandidatosPF' element={<CandidatosPF />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
