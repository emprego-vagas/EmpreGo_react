import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Index from './pages/Index'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import ConfirmEmail from './pages/ConfirmEmail'
import Teste from './pages/teste'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/login' element={<Login />} />
        <Route path='/confirmar' element={<ConfirmEmail/>} />
        <Route path='/teste' element={<Teste/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
