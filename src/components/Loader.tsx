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
        <div className="min-h-screen bg-professional-dark flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-professional-accent mx-auto mb-4"></div>
                <p className="text-professional-text text-lg">Carregando...</p>
            </div>
        </div>
    )
}