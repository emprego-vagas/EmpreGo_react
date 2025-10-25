import './App.css'
import Header1 from './components/Header1'

function App() {

  return (
    <>
      <Header1 />
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-tr from-purple-500 via-pink-400 to-yellow-300 flex flex-col items-center justify-center p-6 text-white font-bold">
        <h1 className="text-4xl text-center text-lg text-blue-600">Funcionando!</h1>
      </div>
    </>
  )
}

export default App
