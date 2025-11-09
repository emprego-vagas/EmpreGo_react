import { useNavigate } from "react-router-dom";

export default function TimeOut() {
    const navigate = useNavigate();

    const handleRetry = () => {
        const lastPage = localStorage.getItem('lastPage') || '/';
        navigate(lastPage); // volta pra página anterior
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-black via-gray-900 to-purple-950 text-white text-center px-6 relative overflow-hidden">
            {/* Glows de fundo */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-3xl animate-pulse top-[-150px] left-[-150px]" />
                <div className="absolute w-[400px] h-[400px] bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse bottom-[-100px] right-[-100px]" />
            </div>

            {/* Conteúdo principal */}
            <div className="relative z-10">
                <h1 className="text-[7rem] font-extrabold tracking-tight bg-linear-to-r from-purple-400 via-fuchsia-500 to-purple-600 text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                Tempo Esgotado
                </h1>
                <p className="text-2xl mt-4 text-gray-300">
                A página demorou demais para carregar
                </p>
                <p className="text-gray-400 mt-2">
                Verifique sua conexão com a internet ou tente novamente mais tarde.
                </p>

                <button
                onClick={handleRetry}
                className="mt-8 px-8 py-3 bg-linear-to-r from-purple-600 to-fuchsia-600 hover:from-fuchsia-600 hover:to-purple-600 transition-all rounded-xl font-medium text-white shadow-lg shadow-purple-600/40 hover:shadow-fuchsia-500/40 cursor-pointer"
                >
                Tentar novamente
                </button>
            </div>
        </div>
    );
}
