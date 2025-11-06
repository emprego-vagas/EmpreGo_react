import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Index from './pages/Index'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import ConfirmEmail from './pages/ConfirmEmail'
import Teste from './pages/teste'
import Chats from './pages/Chats'
import PerfilCandidato from './pages/PerfilCandidato'
import CriarExperiencias from './pages/CriarExperiencias'
import CriarProjetos from './pages/CriarProjetos'
import EditarPerfilCandidato from './pages/EditarPerfilCandidato'
// import { DadosUsuario } from './utils/globalFunctions'
// import ViewEmpresas from './pages/ViewEmpresas'

function App() {
  // const usuario = DadosUsuario.getUsuario();
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<NotFound />} />
        {/* <Route path='/' element={usuario && usuario.tipo==='candidato' ? <ViewEmpresas /> : <Index />} /> */}
        <Route path='/' element={<Index />} />
        <Route path='/login' element={<Login />} />
        <Route path='/confirmar' element={<ConfirmEmail/>} />
        <Route path='/teste' element={<Teste/>} />
        <Route path='/chats' element={<Chats/>} />
        <Route path='/perfil/candidato' element={<PerfilCandidato/>} />
        <Route path='/perfil/candidato/editar' element={<EditarPerfilCandidato/>} />
        <Route path='/experiencias/criar'element={<CriarExperiencias/>} />
        <Route path='/projetos/criar'element={<CriarProjetos/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
