import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Loader () {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('lastPage', location.pathname);

        const timer = setTimeout(() => {
            navigate('/timeout');
        }, 30*1000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-professional-dark to-gray-900 flex flex-col items-center justify-center">
            <div className="relative">
                {/* Spinner com gradiente */}
                <div className="animate-spin rounded-full h-24 w-24 border-4 border-transparent border-t-professional-accent border-r-professional-light/30 mx-auto mb-6"></div>
                
                {/* Brilho externo */}
                <div className="absolute inset-0 animate-ping rounded-full h-24 w-24 border-2 border-professional-accent/20"></div>
            </div>
            
            <div className="text-center">
                <h2 className="text-xl font-medium text-professional-light mb-2">
                    Carregando
                    <span className="dot-animation">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </span>
                </h2>
                <p className="text-professional-text/70 text-sm">
                    Isso pode levar alguns instantes
                </p>
            </div>
        </div>
    );
}