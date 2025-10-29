import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Index from './pages/Index'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import ConfirmEmail from './pages/ConfirmEmail'
<<<<<<< HEAD
import Teste from './pages/teste'
=======
import Chats from './pages/Chats'
>>>>>>> 5ca6b7a80fa62e5412c310160cf406f577bafea4

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/login' element={<Login />} />
        <Route path='/confirmar' element={<ConfirmEmail/>} />
<<<<<<< HEAD
        <Route path='/teste' element={<Teste/>} />
        <Route path="*" element={<NotFound />} />
=======
        <Route path='*' element={<NotFound />} />
        <Route path='/chats' element={<Chats/>} />
>>>>>>> 5ca6b7a80fa62e5412c310160cf406f577bafea4
      </Routes>
    </BrowserRouter>
  )
}

export default App
