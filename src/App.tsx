import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Index from './pages/Index'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import ConfirmEmail from './pages/ConfirmEmail'
import Chats from './pages/Chats'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/login' element={<Login />} />
        <Route path='/confirmar' element={<ConfirmEmail/>} />
        <Route path='*' element={<NotFound />} />
        <Route path='/chats' element={<Chats/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
