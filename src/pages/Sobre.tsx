import { useEffect } from "react";
import Footer from "../components/Footer";
import HeaderInit from "../components/HeaderInit";
import ThemeToggle from "../components/ThemeTogle";
import "../css/sobre.css";

export default function Sobre() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
        <HeaderInit />
        <main className="pt-32 pb-20 bg-grid-pattern min-h-screen bg-dark-50 dark:bg-dark-900">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto" id="about-content">
                    {/* <!-- Historia --> */}
                    <div className="mb-20">
                        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-dark-900 dark:text-dark-50">
                            Sobre <span className="text-gradient">Nós</span> 
                        </h1>

                        <div className="card-hover bg-dark-50 dark:bg-dark-900 rounded-xl p-8 shadow-lg border border-gray-800 hover:border-primary-500 mb-12">
                            <p className="text-dark-900 dark:text-dark-50 mb-6">
                                O EmpreGo nasceu dentro das salas de aula do SENAI/SE, a partir da união de amigos de turma que decidiram transformar um simples trabalho 
                                de conclusão de curso em um projeto com propósito real: aproximar empresas e candidatos de maneira inovadora e humana.
                            </p>

                            <p className="text-dark-900 dark:text-dark-50 mb-6">
                                Durante a nossa jornada, enfrentamos muitos desafios técnicos e pessoais. Tivemos contato com novas tecnologias e frameworks que, até então,
                                eram pouco explorados por nós, como Prisma, Node.js, CSS, HTML e JavaScript. Cada linha de código representou não apenas aprendizado técnico,
                                mas também a consolidação de valores como perseverança, trabalho em equipe, resiliência e profissionalismo. Aprendemos que inovar exige coragem, 
                                disciplina e, acima de tudo, colaboração.
                            </p>

                            <p className="text-dark-900 dark:text-dark-50  mb-6">
                                O EmpreGo foi pensado para ser mais do que uma simples plataforma de vagas: queremos construir um espaço onde empresas e profissionais
                                encontrem não apenas oportunidades, mas também a realização de seus sonhos. Para isso, desenvolvemos um sistema com filtros inteligentes,
                                ferramentas de compatibilidade e até mesmo um fórum colaborativo, onde usuários poderão compartilhar experiências, trocar ideias e se apoiar 
                                mutuamente na busca pelo crescimento.
                            </p>

                            <p className="text-dark-900 dark:text-dark-50  mb-6">
                                Nosso compromisso é entregar um site que una inovação tecnológica com impacto social, oferecendo soluções modernas e funcionais, mas sempre 
                                colocando as pessoas no centro da experiência. Acreditamos que cada vaga publicada e cada perfil cadastrado carregam histórias, expectativas e 
                                futuros possíveis — e o EmpreGo está aqui para ser a ponte entre esses caminhos.
                            </p>

                            <p className="text-dark-900 dark:text-dark-50">
                                Esse projeto é, ao mesmo tempo, um reflexo da nossa trajetória acadêmica e um símbolo do que acreditamos: que com dedicação, criatividade e
                                espírito de equipe, é possível transformar desafios em oportunidades e construir algo que realmente faça a diferença.
                            </p>
                        </div>

                        <h2 className="text-3xl font-bold mb-8 text-center text-dark-900 dark:text-dark-50">
                            Nossa <span className="text-gradient">Equipe</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* <!-- membro 1 --> */}
                            <div
                                className="card-hover bg-dark-50 dark:bg-dark-900 rounded-xl p-6 border border-gray-800  hover:border-primary-500 transition-colors">
                                <h3 className="text-2xl font-bold text-primary-500 mb-2">Alec Vinícius</h3>
                                <p className="text-dark-900 dark:text-dark-50 mb-4">Desenvolvedor Front-end</p>
                                <div className="flex items-center text-dark-900 dark:text-dark-50">
                                    <i className='bx bx-code-alt mr-2'></i>
                                    <span>HTML, CSS, tailwindcss, anime.js, JavaScript</span>
                                </div>
                            </div>

                            {/* <!-- membro 2 --> */}
                            <div
                                className="card-hover bg-dark-50 dark:bg-dark-900 rounded-xl p-6 border border-gray-800  hover:border-primary-500 transition-colors">
                                <h3 className="text-2xl font-bold text-primary-500 mb-2">João Pedro Azevedo</h3>
                                <p className="text-dark-900 dark:text-dark-50 mb-4">Desenvolvedor Back-end</p>
                                <div className="flex items-center text-dark-900 dark:text-dark-50">
                                    <i className='bx bx-server mr-2'></i>
                                    <span>Node.js, Axios, PostegreSQL, Prisma, Tailwind, React, JavaScript, TypeScript</span>
                                </div>
                            </div>

                            {/* <!-- Membro 3 --> */}
                            <div
                                className="card-hover bg-dark-50 dark:bg-dark-900 rounded-xl p-6 border border-gray-800  hover:border-primary-500 transition-colors">
                                <h3 className="text-2xl font-bold text-primary-500 mb-2">Mateus Ricardo</h3>
                                <p className="text-dark-900 dark:text-dark-50 mb-4">Designer</p>
                                <div className="flex items-center text-dark-900 dark:text-dark-50">
                                    <i className='bx bx-palette mr-2'></i>
                                    <span>Krita, HTML, CSS, Node.js, Prisma, Tailwind, JavaScript</span>
                                </div>
                            </div>

                            {/* <!-- Membro 4 --> */}
                            <div
                                className="card-hover bg-dark-50 dark:bg-dark-900 rounded-xl p-6 border border-gray-800 hover:border-primary-500 transition-colors">
                                <h3 className="text-2xl font-bold text-primary-500 mb-2">João Souza</h3>
                                <p className="text-dark-900 dark:text-dark-50 mb-4">Tester</p>
                                <div className="flex items-center text-dark-900 dark:text-dark-50">
                                    <i className='bx bx-clipboard mr-2'></i>
                                    <span>Testes, Documentação, HTML, CSS</span>
                                </div>
                            </div>

                            {/* <!-- membro 5 --> */}
                            <div
                                className="card-hover bg-dark-50 dark:bg-dark-900 rounded-xl p-6 border border-gray-800 hover:border-primary-500 transition-colors">
                                <h3 className="text-2xl font-bold text-primary-500 mb-2">Carolina Kaippert</h3>
                                <p className="text-dark-900 dark:text-dark-50 mb-4">Desenvolvedora Back-end</p>
                                <div className="flex items-center text-dark-900 dark:text-dark-50">
                                    <i className='bx bx-code-curly mr-2'></i>
                                    <span>JavaScript, Tailwind, Prisma, Node.js</span>
                                </div>
                            </div>

                            {/* <!-- membro 6 --> */}
                            <div
                                className="card-hover bg-dark-50 dark:bg-dark-900 rounded-xl p-6 border border-gray-800 hover:border-primary-500  transition-colors">
                                <h3 className="text-2xl font-bold text-primary-500 mb-2">Athon Fernandes</h3>
                                <p className="text-dark-900 dark:text-dark-50 mb-4">Influencer</p>
                                <div className="flex items-center text-dark-900 dark:text-dark-50">
                                    <i className='bx bx-palette mr-2'></i>
                                    <span>Tiktok, Youtube, Instagram, X</span>
                                </div>
                            </div>
                        </div>


                        {/* <!-- Mentor --> */}
                        <div className="card-hover bg-dark-50 dark:bg-dark-900 rounded-xl pb-8 pt-8 border border-gray-800 hover:border-primary-500 mt-5 ">
                            <h2 className="text-3xl font-bold mb-6 text-center text-dark-900 dark:text-dark-50">
                                Nossos <span className="text-gradient">Mentores</span>
                            </h2>

                            <div className="flex flex-col items-center">
                                <div
                                    className="w-24 h-24 rounded-full bg-primary-500 bg-opacity-20 flex items-center justify-center mb-6">
                                    <i className='bx bx-user text-4xl text-primary-500'></i>
                                </div>

                                <h3 className="text-2xl font-bold text-primary-500 mb-2">Wallace Oliveira dos Santos</h3>
                                <p className="text-dark-900 dark:text-dark-50 mb-6">Educador e Orientador</p>

                                <p className="text-dark-900 dark:text-dark-50 text-center max-w-2xl">
                                    Tudo graças a supervisão do educador "Wallace Oliveira dos Santos" que nos guiou e
                                    apoiou durante todo o desenvolvimento deste projeto.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <Footer />
        <ThemeToggle />
        </>
    )
}