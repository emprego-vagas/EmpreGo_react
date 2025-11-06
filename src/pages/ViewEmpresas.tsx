import { useNavigate } from "react-router-dom"

export default function ViewEmpresas () {
    const navigate = useNavigate();

    return (
        <div id="content">
  
            <header
                className="fixed top-0 left-0 right-0 h-16 bg-twitch-gray flex items-center z-50 border-b border-gray-800 shadow-md">
                <div className="container mx-auto px-5 flex items-center w-full gap-4 justify-center">
                {/* <!-- menu --> */}
                <button
                    className='bx bx-menu text-2xl text-white cursor-pointer bg-transparent border-none rounded-full w-9 h-9 flex items-center justify-center transition-colors hover:bg-white/20 absolute left-1'
                    id="menu-toggle" aria-label="abrir menu"></button>

                {/* <!-- Logo --> */}
                <div id="logo" className="flex items-center gap-3 text-white font-black cursor-pointer transition-all">
                    <a href="/">
                    <img src="/assets/imgs/BIGSlogo.png" alt="Logo EmpreGo" className="h-10 w-auto" />
                    </a>
                    <a href="/" className="text-2xl text-white no-underline transition-colors px-3 py-1 rounded text-shadow-lg"
                    style={{textShadow: '0 0 25px #9146FF'}}>Empre<span className="text-twitch-purple">Go</span></a>
                </div>

                {/* <!-- Barra de pesquisa --> */}
                <div
                    className="search-bar flex items-center w-160 max-w-5xl bg-twitch-gray rounded-full overflow-hidden mr-4 ml-auto transition-all duration-300 border border-gray-700 focus-within:ring-2 focus-within:ring-twitch-purple focus-within:border-twitch-purple"
                    role="search" aria-label="Barra de pesquisa de vagas">

                    {/* <!-- Campo de texto --> */}
                    <input type="text" placeholder="Pesquisar empresas..." id="inputPesquisa"
                    className="flex-1 border-none px-4 py-3 bg-transparent text-white text-sm outline-none placeholder:text-gray-500" />

                    {/* <!-- Botão de filtro --> */}
                    <button
                    className="filter-btn bg-twitch-purple border-none text-white p-2 cursor-pointer mx-1 rounded-full flex items-center justify-center transition-colors hover:bg-twitch-lightpurple"
                    id="filter-toggle" aria-label="Abrir filtros" aria-expanded="false" aria-controls="filter-chips-container">
                    <img src="/assets/imgs/filtro.png" alt="Filtrar" height="20" width="20"
                        style={{filter: 'brightness(0) invert(1)'}} />
                    <span className="filter-label text-white text-sm ml-1 select-none hidden lg:block">Filtragem</span>
                    </button>

                    {/* <!-- Botão de pesquisa --> */}
                    <button
                    className="search-btn bg-twitch-purple border-none text-white p-2 cursor-pointer mx-1 rounded-full flex items-center justify-center transition-colors hover:bg-twitch-lightpurple"
                    id="buttonPesquisar"
                    aria-label="Pesquisar">
                    <img src="/assets/imgs/lupa.png" alt="Pesquisar" height="20" width="20"
                        style={{filter: 'brightness(0) invert(1)'}} />
                    </button>
                </div>

                {/* <!-- filtragem --> */}
                <div className="filters relative -right-10 ml-auto mr-4">
                    <div
                    className="filter-chips-container absolute top-14 right-0 bg-twitch-gray rounded-lg shadow-xl p-3 min-w-80 z-50"
                    id="filter-chips-container">
                    {/* <!-- Grupo: Setor --> */}
                    <div className="filter-category">
                        <div className="filter-category-header" data-category="setor">
                        <span className="text-dark-300 text-sm font-medium">Setor</span>
                        <i className='bx bx-chevron-down text-sm'></i>
                        </div>
                        <div className="filter-category-content" id="category-setor">
                        <div className="filter-category-chips" data-value="setor">
                            <button type="button"
                            className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none"
                            data-value="Alimentício" aria-pressed="false" title="Nível Júnior">Alimentício</button>
                            <button type="button"
                            className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none"
                            data-value="Varejo" aria-pressed="false">Varejo</button>
                            <button type="button"
                            className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none"
                            data-value="Turismo" aria-pressed="false">Turismo</button>
                            <button type="button"
                            className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none"
                            data-value="Energia" aria-pressed="false">Energia</button>
                            <button type="button"
                            className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none"
                            data-value="Agronegócio" aria-pressed="false">Agronegócio</button>
                            <button type="button"
                            className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none"
                            data-value="Saúde" aria-pressed="false">Saúde</button>
                        </div>
                        </div>
                    </div>

                    {/* <!-- Grupo: Estado --> */}
                    <div className="filter-category">
                        <div className="filter-category-header" data-category="estado">
                        <span className="text-dark-300 text-sm font-medium">Estado</span>
                        <i className='bx bx-chevron-down text-sm'></i>
                        </div>
                        <div className="filter-category-content" id="category-estado">
                        <div className="filter-category-chips" data-value="estado">
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="AC" aria-pressed="false">Acre</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="AL" aria-pressed="false">Alagoas</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="AP" aria-pressed="false">Amapá</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="AM" aria-pressed="false">Amazonas</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="BA" aria-pressed="false">Bahia</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="CE" aria-pressed="false">Ceará</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="DF" aria-pressed="false">Distrito Federal</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="ES" aria-pressed="false">Espírito Santo</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="GO" aria-pressed="false">Goiás</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="MA" aria-pressed="false">Maranhão</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="MT" aria-pressed="false">Mato Grosso</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="MS" aria-pressed="false">Mato Grosso do Sul</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="MG" aria-pressed="false">Minas Gerais</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="PA" aria-pressed="false">Pará</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="PB" aria-pressed="false">Paraíba</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="PR" aria-pressed="false">Paraná</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="PE" aria-pressed="false">Pernambuco</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="PI" aria-pressed="false">Piauí</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="RJ" aria-pressed="false">Rio de Janeiro</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="RN" aria-pressed="false">Rio Grande do Norte</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="RS" aria-pressed="false">Rio Grande do Sul</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="RO" aria-pressed="false">Rondônia</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="RR" aria-pressed="false">Roraima</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="SC" aria-pressed="false">Santa Catarina</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="SP" aria-pressed="false">São Paulo</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="SE" aria-pressed="false">Sergipe</button>
                            <button type="button" className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none" data-value="TO" aria-pressed="false">Tocantins</button>

                        </div>
                        </div>
                    </div>

                    {/* <!-- Grupo: Porte --> */}
                    <div className="filter-category">
                        <div className="filter-category-header" data-category="porte">
                        <span className="text-dark-300 text-sm font-medium">Porte</span>
                        <i className='bx bx-chevron-down text-sm'></i>
                        </div>
                        <div className="filter-category-content" id="category-porte">
                        <div className="filter-category-chips" data-value="porte">
                            <button type="button"
                            className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none"
                            data-value="Pequeno" aria-pressed="false" title="Nível Júnior">Pequeno</button>
                            <button type="button"
                            className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none"
                            data-value="Médio" aria-pressed="false">Médio</button>
                            <button type="button"
                            className="filter-chip text-white px-2.5 py-1 rounded-full text-xs cursor-pointer border-none transition-colors select-none"
                            data-value="Grande" aria-pressed="false">Grande</button>
                        </div>
                        </div>
                    </div>

                    {/* <!-- Grupo: Nível --> */}
                    

                    {/* <!-- Grupo: Tipo --> */}
                    

                    {/* <!-- Grupo: Jornada --> */}
                    

                    {/* <!-- Grupo: Salário --> */}
                    

                    {/* <!-- Grupo: Área --> */}
                    

                    <div className="filter-actions flex justify-between gap-2 mt-3">
                        <button type="button"
                        className="filter-confirm bg-twitch-purple btn-primary text-white px-2.5 py-1.5 text-xs border-none rounded cursor-pointer transition-colors flex-1 hover:bg-twitch-lightpurple"
                        aria-label="Aplicar filtros selecionados">Confirmar filtros</button>
                        <button type="button"
                        className="filter-clear bg-twitch-purple btn-primary text-white px-2.5 py-1.5 text-xs border-none rounded cursor-pointer transition-colors flex-1 hover:bg-twitch-lightpurple"
                        aria-label="Limpar todos os filtros">Limpar filtros</button>
                    </div>
                    </div>
                </div>

                {/* <!-- Perfil no header --> */}
                <div
                    className="header-profile flex items-center gap-3 bg-transparent px-1 py-1 rounded-full cursor-pointer transition-colors hover:bg-gray-700"
                    id="profile-toggle">
                    <div
                    className="user-avatar bg-twitch-purple text-white font-bold text-base w-9 h-9 rounded-full flex justify-center items-center select-none shadow-x1">
                    <img src="/assets/imgs/genPfp.png" alt="Foto de perfil do usuário" id="FotoDePerfil" className="w-full h-full object-cover rounded-full"/>
                    </div>
                    
                    <div
                    className="profile-dropdown fixed top-16 right-4 bg-twitch-gray text-white w-60 rounded-lg shadow-xl flex flex-col p-2 z-50 hidden"
                    id="profile-dropdown">
                    <div className="profile-info p-3">
                        <p className="profile-name font-bold m-0">nome VISIVEL</p>
                        {/* <!-- <p className="profile-username text-sm m-0 text-gray-400">nome do perfil</p> --> */}
                        <a href="/perfil/candidato" className="text-twitch-purple text-sm no-underline">Acessar perfil</a>
                    </div>
                    <hr className="border-t border-gray-700 my-1" />
                    <button
                        className="bg-transparent border-none text-white text-left p-2 text-sm cursor-pointer hover:bg-gray-700" onClick={()=>navigate('/perfil/candidato/editar')}>Editar
                        perfil</button>
                    <button
                        className="bg-transparent border-none text-white text-left p-2 text-sm cursor-pointer hover:bg-gray-700" id="logoutButton">Sair</button>
                    <hr className="border-t border-gray-700 my-1" />
                    <button
                        className="bg-transparent border-none text-white text-left p-2 text-sm cursor-pointer hover:bg-gray-700">Notificações</button>
                    <button
                        className="bg-transparent border-none text-white text-left p-2 text-sm cursor-pointer hover:bg-gray-700" onClick={()=>navigate('/chats')}>Chats</button>
                    <hr className="border-t border-gray-700 my-1" />
                    <button
                        className="bg-transparent border-none text-white text-left p-2 text-sm cursor-pointer hover:bg-gray-700">Configurações</button>
                    <button
                        className="bg-transparent border-none text-white text-left p-2 text-sm cursor-pointer hover:bg-gray-700">Modo: Escuro
                    </button>
                    <button
                        className="bg-transparent border-none text-white text-left p-2 text-sm cursor-pointer hover:bg-gray-700" onClick={()=>navigate('/suporte')}>Ajuda</button>
                    </div>
                </div>
                </div>
            </header>

            <aside
                className="w-72 bg-twitch-gray border-r border-gray-700 flex flex-col justify-between transition-transform -translate-x-full z-40 fixed left-0 top-0 h-screen shadow-xl pt-5"
                id="sidebar">
                <div className="sidebar-right px-6 py-4">
                {/* <!-- menu --> */}
                <nav className="mt-10">
                    <ul className="list-none pl-0 m-0">
                        <li className="mb-1">
                            <a href="#"
                            className="flex items-center gap-3 px-4 py-2 text-sm rounded-xl bg-gray-700 text-gray-300 hover:bg-purple-700 hover:text-white transition-colors">
                            <i className='bx bx-calendar-event text-lg'></i>
                            Inicio
                            </a>
                        </li>

                        <hr className="border-t border-gray-700 my-2" />

                        {/* <!-- Botões adicionais --> */}
                        <li className="mb-2">
                            <a href="/chats"
                            className="flex items-center gap-3 px-4 py-2 text-sm rounded-xl bg-gray-700 text-gray-300 hover:bg-purple-700 hover:text-white transition-colors">
                            <i className='bx bx-message-rounded text-lg'></i>
                            <span>Chat Geral</span>
                            </a>
                        </li>

                        <li className="mb-2">
                            <a href="#"
                            className="flex items-center gap-3 px-4 py-2 text-sm rounded-xl bg-gray-700 text-gray-300 hover:bg-purple-700 hover:text-white transition-colors">
                            <i className='bx bx-group text-lg'></i>
                            <span>Fórum</span>
                            </a>
                        </li>

                        <hr className="border-t border-gray-700 my-2" />

                        <li className="mb-1">
                            <div
                            className="favoritos-header flex items-center gap-3 px-4 py-2 bg-gray-700 text-gray-300 no-underline text-sm rounded-xl hover:bg-purple-700 hover:text-white transition-colors cursor-pointer"
                            id="favoritos-toggle">
                            <i className='bx bx-star text-lg'></i>Favoritos
                            <i className='bx bx-chevron-down ml-auto'></i>
                            </div>

                            {/* <!-- Seção de favoritos--> */}
                            <div className="favoritos-container hidden" id="favoritos-container">
                            {/* <!-- Item de favorito 1 --> */}
                            

                            {/* <!-- Item de favorito 2 --> */}
                            

                            {/* <!-- Item de favorito 3 --> */}
                            

                            {/* <!-- Item de favorito 4 --> */}
                            

                            {/* <!-- Item de favorito 5 --> */}
                            

                            {/* <!-- Item de favorito 6 --> */}
                            
                            
                            </div>
                        </li>
                    </ul>
                </nav>
                </div>
            </aside>

            <main className="grow overflow-y-auto flex flex-col items-center w-full max-w-6xl mx-auto mt-16">
                {/* <!-- Slider de Recomendações com Swiper --> */}
                <section className="recomendacoes-swiper swiper w-full max-w-6xl mx-auto my-8 px-4 relative rounded-xl"
                aria-label="Recomendações de clientes">
                <div className="swiper-wrapper">

                    {/* <!-- Slide 1 --> */}
                    <div className="swiper-slide">
                    <div className="slide-content">
                        <span className="slide-empresa">TechSolutions Inc.</span>
                        <h3 className="slide-titulo">Parceria Excepcional</h3>
                        <blockquote className="slide-texto">
                        "Trabalhar com esta equipe foi uma experiência transformadora para nosso negócio. A qualidade do serviço
                        superou todas as expectativas e os resultados foram visíveis já no primeiro mês de colaboração."
                        </blockquote>
                        <div className="slide-meta">
                        <span className="slide-autor">Carlos Mendes</span>
                        <span className="slide-data">15 de Março, 2023</span>
                        </div>
                    </div>
                    </div>

                    {/* <!-- Slide 2 --> */}
                    <div className="swiper-slide">
                    <div className="slide-content">
                        <span className="slide-empresa">Global Innovations</span>
                        <h3 className="slide-titulo">Profissionalismo Notável</h3>
                        <blockquote className="slide-texto">
                        "Recomendo fortemente os serviços prestados. A equipe demonstrou um nível de profissionalismo raro no
                        mercado, with atenção aos detalhes and prazos rigorosamente cumpridos. Uma parceria que certamente
                        continuaremos no futuro."
                        </blockquote>
                        <div className="slide-meta">
                        <span className="slide-autor">Ana Beatriz Silva</span>
                        <span className="slide-data">2 de Abril, 2023</span>
                        </div>
                    </div>
                    </div>

                    {/* <!-- Slide 3 --> */}
                    <div className="swiper-slide">
                    <div className="slide-content">
                        <span className="slide-empresa">Digital Ventures</span>
                        <h3 className="slide-titulo">Resultados Exponenciais</h3>
                        <blockquote className="slide-texto">
                        "Em menos de 6 meses, nossa presença online cresceu 300% graças ao trabalho meticuloso desta equipe. A
                        abordagem estratégica e a capacidade de adaptação às necessidades do nosso setor foram impressionantes."
                        </blockquote>
                        <div className="slide-meta">
                        <span className="slide-autor">Ricardo Almeida</span>
                        <span className="slide-data">22 de Maio, 2023</span>
                        </div>
                    </div>
                    </div>

                    {/* <!-- Slide 4 --> */}
                    <div className="swiper-slide">
                    <div className="slide-content">
                        <span className="slide-empresa">Future Labs</span>
                        <h3 className="slide-titulo">Inovação Contínua</h3>
                        <blockquote className="slide-texto">
                        "O que mais impressiona is the capacidade de inovar constantly, trazendo soluções que não apenas
                        resolvem problemas imediatos, mas preparam nossa empresa para os desafios futuros. Uma relação de
                        confiança construída ao longo de anos."
                        </blockquote>
                        <div className="slide-meta">
                        <span className="slide-autor">Fernanda Oliveira</span>
                        <span className="slide-data">10 de Junho, 2023</span>
                        </div>
                    </div>
                    </div>
                </div>

                {/* <!-- Navegação --> */}
                <div className="swiper-button-prev"></div>
                <div className="swiper-button-next"></div>

                {/* <!-- Paginação (dots) --> */}
                <div className="swiper-pagination"></div>
                </section>
                <h2
                id="h2EmpresasFiltradas"
                className="section-title text-2xl font-bold mb-8 text-white text-center relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-14 after:h-1 after:bg-twitch-purple after:rounded-full"
                style={{display: 'none'}}
                >
                Empresas Filtradas</h2>
                <section id="tipoEmpresasSection" className="empresas-section w-full px-5 py-6 mt-8">
                <div className="flex justify-center items-center mb-8">
                    <label htmlFor="tipoEmpresas" className="sr-only">Tipo de empresas</label>
                    <select
                    id="tipoEmpresas"
                    className="bg-twitch-gray border border-twitch-purple text-white text-xl font-bold rounded-full px-6 py-2 focus:outline-none focus:ring-2 focus:ring-twitch-purple transition-all"
                    style={{textAlignLast: 'center', minWidth: '220px'}}
                    >
                    <option value="recent">Empresas Recentes</option>
                    <option value="main">Empresas Principais</option>
                    <option value="recommended">Empresas Recomendadas</option>
                    </select>
                </div>
                <div id="empresas-loading" className="w-full flex justify-center items-center py-8" style={{display: 'none'}}>
                    <span className="text-twitch-purple text-2xl font-semibold animate-pulse">Carregando...</span>
                </div>
                <div id="divEmpresas" className="empresas-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {/* <!-- Cartão 1 --> */}
                    

                    {/* <!-- Cartão 2 --> */}
                    
                </div>
                <div className="ver-todas text-center mt-8 w-full">
                    <a id="ver-pagina-btn" className="ver-todas-btn btn-outline-primary text-white inline-block px-8 py-3 rounded-full text-base font-medium cursor-pointer transition-all no-underline">Ver mais</a>
                </div>
                </section>
            </main>
        </div>
    )
}