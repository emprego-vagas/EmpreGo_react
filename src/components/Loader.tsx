export default function Loader () {
    return (
        <div className="min-h-screen bg-professional-dark flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-professional-accent mx-auto mb-4"></div>
                <p className="text-professional-text text-lg">Carregando...</p>
            </div>
        </div>
    )
}