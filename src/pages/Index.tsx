import HeaderInit from '../components/HeaderInit'
import ThemeTogle from '../components/ThemeTogle'
import teste from '../assets/imgs/BIGSlogo.png'
import { useEffect } from "react";
import { animate } from 'animejs';
import '../ts/indexFunctions'
import '../App.css'
import '../css/index.css'
import '../../index.css'
import { interacaoUI } from "../ts/indexFunctions";
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import JoaoAzevedoPrime from '../assets/members/JoaoAzevedoPrime.jpeg';
import CarolinaKaippert from '../assets/members/CarolinaKaippert.jpeg';
import JoaoSouza from '../assets/members/JoaoSouza.jpeg';
import MateusRicardo from '../assets/members/MateusRicardo.jpeg';
import AlecVinicius from '../assets/members/AlecVinicius.jpeg';
// import JoaoAzevedo from '../assets/members/JoaoAzevedo.jpeg';


export default function Index(){
    interacaoUI();
    useEffect(() => {
        animate('#hero-content', {
          opacity: [0, 1],
          translateY: [40, 0],
          duration: 1000,
          easing: "easeOutExpo",
        });
    
    
        animate('#hero-image', {
          opacity: [0, 1],
          translateY: [40, 0],
          duration: 1000,
          delay: 300,
          easing: "easeOutExpo",
        });
    
        animate('#hero-title span', {
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 800,
          delay: 500,
          easing: "easeOutExpo",
        });
    
        const servicesObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                animate('#services-header', {
                  opacity: [0, 1],
                  translateY: [40, 0],
                  duration: 800,
                  easing: "easeOutExpo",
                });
    
                animate('#timeline-container', {
                  opacity: [0, 1],
                  duration: 800,
                  delay: 300,
                  easing: "easeOutExpo",
                });
    
                animate('.timeline-item', {
                  opacity: [0, 1],
                  translateX: (_el, i) => (i % 2 === 0 ? [-50, 0] : [50, 0]),
                  duration: 800,
                  delay: (_el, i) => 500 + i * 200,
                  easing: "easeOutExpo",
                });
    
                servicesObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.2 }
        );
    
        servicesObserver.observe(document.querySelector("#servicos"));
    
        const profilesObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                animate('#profiles-header', {
                  opacity: [0, 1],
                  translateY: [40, 0],
                  duration: 800,
                  easing: "easeOutExpo",
                });
    
                animate('.profile-card', {
                  opacity: [0, 1],
                  translateY: [40, 0],
                  duration: 800,
                  delay: (_el) => parseInt(_el.dataset.delay),
                  easing: "easeOutExpo",
                });
    
                animate('#profiles-cta', {
                  opacity: [0, 1],
                  translateY: [40, 0],
                  duration: 800,
                  delay: 1000,
                  easing: "easeOutExpo",
                });
    
                profilesObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.1 }
        );
    
        profilesObserver.observe(document.querySelector("#biografias"));
      }, []); 

    return (
        <>
            <HeaderInit />
            <section id="home" className="min-h-screen flex items-center pt-20 bg-grid-pattern-light dark:bg-grid-pattern relative overflow-hidden bg-white dark:bg-dark-900 transition-colors duration-300">

            {/* <!-- particulas de fundo --> */}
            {/* <div id="particles-js" className="fixed inset-0 z-0"></div> */}
            

            {/* <!-- particulas flutuando --> */}
            {/* <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary-500 opacity-20 dark:opacity-10 animate-float"></div>
            <div className="absolute bottom-40 right-32 w-40 h-40 rounded-full bg-primary-600 opacity-20 dark:opacity-10 animate-float"
                style={{ animationDelay: "2s" }}></div> */}

            <div className="container mx-auto px-6 py-20">
                <div className="flex flex-col lg:flex-row items-center">
                    <div className="lg:w-11/2 mb-12 lg:mb-0 opacity-0" id="hero-content">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-dark-900 dark:text-primary-100 leading-tight mb-6 " id="hero-title">
                            Encontre seu <span className="text-gradient">emprego</span> dos sonhos
                        </h1>
                        <p className="text-xl md:text-2xl text-dark-900 dark:text-primary-100 mb-8" id="hero-subtitle">
                            A plataforma mais inovadora para conectar talentos a oportunidades incríveis no mercado de
                            trabalho brasileiro.
                        </p>

                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link to="/login"
                               className="flex items-center justify-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-lg font-semibold transition-colors duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary-500/30">
                                <i className='bx bx-rocket mr-2'></i> Começar Agora
                            </Link>
                            <Link to="/sobre"
                               className="flex items-center justify-center px-8 py-4 border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white rounded-xl text-lg font-semibold transition-colors duration-300 transform hover:scale-105">
                                <i className='bx bx-info-circle mr-2'></i> Saiba Mais
                            </Link>
                        </div>

                        <div className="mt-12">
                            <p className="text-gray-500 dark:text-gray-500 mb-4">Conecte-se conosco</p>
                            <div className="flex space-x-4">
                                <a href="https://x.com/Oficial_EmpreGo" target='_blank'
                                    className="w-8 h-8 rounded-full bg-light-300 hover:bg-light-400 dark:bg-gray-900 dark:hover:bg-gray-800 flex items-center justify-center transition-colors duration-300 transform hover:scale-110">
                                    <i className='bx bxl-twitter text-xl text-primary-500 dark:text-primary-400'></i>
                                </a>
                                <a href="https://www.tiktok.com/@oficial_emprego" target='_blank'
                                    className="w-8 h-8 rounded-full bg-light-300 hover:bg-light-400 dark:bg-gray-900 dark:hover:bg-gray-800 flex items-center justify-center transition-colors duration-300 transform hover:scale-110">
                                    <i className='bx bxl-tiktok text-xl text-primary-500 dark:text-primary-400'></i>
                                </a>
                                <a href="https://www.instagram.com/oficial_emprego" target='_blank'
                                    className="w-8 h-8 rounded-full bg-light-300 hover:bg-light-400 dark:bg-gray-900 dark:hover:bg-gray-800 flex items-center justify-center transition-colors duration-300 transform hover:scale-110">
                                    <i className='bx bxl-instagram text-xl text-primary-500 dark:text-primary-400'></i>
                                </a>
                                <a href="https://www.youtube.com/@Oficial_EmpreGo" target='_blank'
                                    className="w-8 h-8 rounded-full bg-light-300 hover:bg-light-400 dark:bg-gray-900 dark:hover:bg-gray-800 flex items-center justify-center transition-colors duration-300 transform hover:scale-110">
                                    <i className='bx bxl-youtube text-xl text-primary-500 dark:text-primary-400'></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* <!-- IMAGEM FLUTUANTE --> */}
                    <div className="lg:w-1/2 flex justify-center opacity-0" id="hero-image">
                        <div className="relative">
                            <img src={teste} alt="Logo do site" width={200} 
                                className="w-full max-w-lg animate-float"/>
                            <div
                                className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary-500 rounded-full opacity-20 dark:opacity-20 blur-xl">
                            </div>
                            <div
                                className="absolute -top-10 -right-10 w-40 h-40 bg-primary-600 rounded-full opacity-20 dark:opacity-20 blur-xl">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* <!-- Serviços --> */}
        <section id="servicos" className="scroll-mt-24 min-h-screen flex items-center justify-center bg-light-200 dark:bg-dark-900 relative overflow-hidden transition-colors duration-300">

            <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-grid-pattern-light dark:bg-grid-pattern"></div>



            
            {/* <!-- particulas flutuando --> */}
            {/* <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary-500 opacity-20 dark:opacity-10 animate-float"></div>
            <div className="absolute bottom-40 right-32 w-40 h-40 rounded-full bg-primary-600 opacity-20 dark:opacity-10 animate-float"
                style={{animationDelay: "2s"}}></div> */}

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16 opacity-0" id="services-header">
                    <h2 className="text-4xl md:text-5xl font-bold text-dark-900 dark:text-primary-100 mb-4">
                        Nossos <span className="text-gradient">Serviços</span>
                    </h2>
                    <p className="text-xl max-w-3xl text-dark-900 dark:text-primary-100 mx-auto">
                        Oferecemos soluções completas para candidatos e empresas alcançarem seus objetivos profissionais.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="relative opacity-0" id="timeline-container">
                        <div
                            className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary-500 to-transparent">
                        </div>

                        {/* <!-- linha de historia 1 --> */}
                        <div className="mb-12 flex items-center justify-between">
                            <div className="w-5/12 pr-8 text-right opacity-0 timeline-item">
                                <h3 className="text-2xl font-bold text-primary-500 dark:text-primary-400 mb-2 text-center" >Introdução Básica</h3>
                                <p className=" text-dark-900 dark:text-primary-100 text-center">
                                    Este website é dedicado a garantir uma rápida e accessível maneira de se filtrar entre
                                    possiveis candidatos em busca de vagas de emprego.
                                </p>
                            </div>
                            <div className="w-2/12 flex justify-center">
                                <div
                                    className="timeline-dot w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-white"></div>
                                </div>
                            </div>
                            <div className="w-5/12"></div>
                        </div>

                        {/* <!-- linha de historia 2 --> */}
                        <div className="mb-12 flex items-center justify-between">
                            <div className="w-5/12"></div>
                            <div className="w-2/12 flex justify-center">
                                <div
                                    className="timeline-dot w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-white"></div>
                                </div>
                            </div>
                            <div className="w-5/12 pl-8 opacity-0 timeline-item">
                                <h3 className="text-2xl font-bold text-primary-500 dark:text-primary-400 mb-2 text-center" >Quem Está Por Trás</h3>
                                <p className=" text-dark-900 dark:text-primary-100 text-center">
                                    O site foi desenvolvido por um grupo de 5 estudantes da escola técnica "SENAI", os quais
                                    participam da turma de "Desenvolvimento de Sistemas", no Terceiro Ano do curso.
                                </p>
                            </div>
                        </div>

                        {/* <!-- linha de historia 3 --> */}
                        <div className="flex items-center justify-between">
                            <div className="w-5/12 pr-5 text-right opacity-0 timeline-item">
                                <h3 className="text-2xl font-bold text-primary-500 dark:text-primary-400 mb-2 text-center" >Info Extra</h3>
                                <a href="mailto:emprego.contato22@gmail.com?subject=Contato&body=Olá,%20gostaria%20de%20mais%20informações"
                                    className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                                    <p className=" text-dark-900 dark:text-primary-100 text-center">
                                        Caso ocorra algum problema ou seja encontrado um erro, não hesite em enviar um
                                        e-mail para "emprego.contato22@gmail.com",
                                        seu feedback é de extrema importância para nós! Cheque
                                        também o suporte para mais informações.
                                    </p>
                                </a>
                            </div>
                            <div className="w-2/12 flex justify-center">
                                <div
                                    className="timeline-dot w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-white"></div>
                                </div>
                            </div>
                            <div className="w-5/12"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* <!-- Perfis --> */}
        <section id="biografias" className="py-20 bg-light-200 dark:bg-dark-900 relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-grid-pattern-light dark:bg-grid-pattern"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16 opacity-0" id="profiles-header">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                        Nossos <span className="text-gradient">Talentos</span>
                    </h2>
                    <p className="text-xl text-dark-900 dark:text-primary-100 max-w-3xl mx-auto">
                        Equipe de desenvolvedores
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* <!-- Perfil 1 --> */}
                    <div className="bg-white dark:bg-dark-900 rounded-xl p-6 shadow-lg card-hover opacity-0 profile-card" data-delay="0">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <img src={AlecVinicius} alt="Perfil"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-primary-500"/>
                                <div
                                    className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                                    <i className='bx bx-check text-white text-xl'></i>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">Alec Vinícius</h3>
                        <p className="text-primary-500 dark:text-primary-400 text-center mb-4 ">Front-end</p>
                        <p className="text-gray-600 dark:text-gray-400 text-center">
                            Alec Vinícius é um desenvolvedor front-end, tendo a obrigação de criar interfaces intuitivas e
                            responsivas. Com experiência em HTML, CSS, tailwindcss, anime.js e JavaScript.
                        </p>
                    </div>

                    {/* <!-- Perfil 2 --> */}
                    <div className="bg-white dark:bg-dark-900 rounded-xl p-6 shadow-lg card-hover opacity-0 profile-card" data-delay="100">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <img src={JoaoAzevedoPrime} alt="Perfil"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-primary-500"/>
                                <div
                                    className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                                    <i className='bx bx-check text-white text-xl'></i>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">João Azevedo</h3>
                        <p className="text-primary-500 dark:text-primary-400 text-center mb-4">Back-end</p>
                        <p className="text-gray-600 dark:text-gray-400 text-center">
                            João Azevedo é um desenvolvedor back-end, responsável por criar a lógica do servidor e gerenciar
                            bancos de dados. Ele é proficiente em postegreSQL, Axios e Node.js.
                        </p>
                    </div>

                    {/* <!-- Perfil 3 --> */}
                    <div className="bg-white dark:bg-dark-900 rounded-xl p-6 shadow-lg card-hover opacity-0 profile-card" data-delay="200">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <img src={MateusRicardo} alt="Perfil"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-primary-500"/>
                                <div
                                    className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                                    <i className='bx bx-check text-white text-xl'></i>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">Mateus Ricardo</h3>
                        <p className="text-primary-500 dark:text-primary-400 text-center mb-4">Design</p>
                        <p className="text-gray-600 dark:text-gray-400 text-center">
                            Mateus Ricardo é um designer gráfico, especializado em criar visuais atraentes e funcionais.
                            Focado em desenvolver interfaces de usuário.
                        </p>
                    </div>

                    {/* <!-- Perfil 4 --> */}
                    <div className="bg-white dark:bg-dark-900 rounded-xl p-6 shadow-lg card-hover opacity-0 profile-card" data-delay="300">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <img src={JoaoSouza} alt="Perfil"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-primary-500"/>
                                <div
                                    className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                                    <i className='bx bx-check text-white text-xl'></i>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">João Souza</h3>
                        <p className="text-primary-500 dark:text-primary-400 text-center mb-4">Tester</p>
                        <p className="text-gray-600 dark:text-gray-400 text-center">
                            João Souza é um tester de software, responsável por garantir a qualidade do produto final. Ele
                            realiza testes funcionais e de usabilidade para identificar bugs e melhorar a experiência do
                            usuário.
                        </p>
                    </div>

                    {/* <!-- Perfil 5 --> */}
                    <div className="bg-white dark:bg-dark-900 rounded-xl p-6 shadow-lg card-hover opacity-0 profile-card" data-delay="400">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <img src={CarolinaKaippert} alt="Perfil"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-primary-500"/>
                                <div
                                    className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                                    <i className='bx bx-check text-white text-xl'></i>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">Carolina Kaippert</h3>
                        <p className="text-primary-500 dark:text-primary-400 text-center mb-4">Back-end</p>
                        <p className="text-gray-600 dark:text-gray-400 text-center">
                            Carolina Kaippert é uma desenvolvedora back-end, responsável pela manutenção do site e rotas do servidor.
                            Ela é proficiente em JavaScript, Tailwind, Prisma, Node.Js.
                        </p>
                    </div>

                    {/* <!-- Perfil 6 --> */}
                    <div className="bg-white dark:bg-dark-900 rounded-xl p-6 shadow-lg card-hover opacity-0 profile-card" data-delay="500">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <img src={teste} alt="Perfil"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-primary-500"/>
                                <div
                                    className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                                    <i className='bx bx-check text-white text-xl'></i>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">Athon Fernandes</h3>
                        <p className="text-primary-500 dark:text-primary-400 text-center mb-4">Influencer</p>
                        <p className="text-gray-600 dark:text-gray-400 text-center">
                            Athon Fernandes é um criador de conteúdo digital, responsável pela produção e gestão de materiais para TikTok,
                            YouTube, Instagram e X. 
                            </p>
                    </div>
                </div>
                <div className="text-center mt-12 opacity-100" id="profiles-footer">
                    <p className="text-gray-500 dark:text-gray-500">
                        Conheça mais sobre nossa equipe e veja como podemos ajudar sua empresa a encontrar os melhores
                        talentos.
                    </p>
                    <Link to="/sobre"
                        className="mt-4 inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                        Saiba Mais Sobre Nós
                    </Link>
                </div>
            </div>
        </section>
            <Footer />
            <ThemeTogle />
        </>
    )
}
