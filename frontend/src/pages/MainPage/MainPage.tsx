import type React from "react"
import { Book, CheckCircle, MessageCircle, BarChart } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import Img from "../../assets/unesco-recomenda-que-celulares-fiquem-longe-da-sala-de-aula-portal-lunetas.webp"
import "./MainPage.css"

const App: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <Features />
        <WhyJoin />
        <GetStarted />
      </main>
      <Footer />
    </div>
  )
}

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <Book size={32} className="logo-icon" />
          <span className="logo-text">ClassHub</span>
        </Link>
        <nav>
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <a href="#features">Recursos</a>
            </li>
            <li>
              <a href="#contact">Contato</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="container">
        <h1>Simplifique sua jornada educacional com ClassHub</h1>
        <p>
          A plataforma que conecta alunos, professores e responsáveis para uma experiência de aprendizado mais eficiente
          e colaborativa.
        </p>
        <button onClick={() => navigate('/Escolas')} className="cta-button">
          Comece agora
        </button>
      </div>
    </section>
  )
}

const Features: React.FC = () => {
  const features = [
    {
      Icon: CheckCircle,
      title: "Gestão de tarefas",
      description: "Organize e acompanhe tarefas e projetos facilmente.",
    },
    {
      Icon: MessageCircle,
      title: "Comunicação integrada",
      description: "Mantenha todos informados com nossa plataforma de mensagens.",
    },
    {
      Icon: BarChart,
      title: "Análise de desempenho",
      description: "Acompanhe o progresso com relatórios detalhados e insights.",
    },
  ]

  return (
    <section id="features" className="features">
      <div className="container">
        <h2>Recursos principais</h2>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <feature.Icon size={48} className="feature-icon" />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const WhyJoin: React.FC = () => {
  const reasons = [
    "Economize tempo com ferramentas educacionais integradas",
    "Melhore a colaboração entre alunos, professores e responsáveis",
    "Acesse informações importantes de qualquer lugar, a qualquer hora",
    "Acompanhe o progresso acadêmico em tempo real",
  ]

  return (
    <section id="why-join" className="why-join">
      <div className="container">
        <h2>Por que se juntar ao ClassHub?</h2>
        <div className="content">
          <div className="reasons">
            {reasons.map((reason, index) => (
              <p key={index} className="reason">
                <CheckCircle className="reason-icon" size={24} />
                {reason}
              </p>
            ))}
          </div>
          <div className="image-placeholder">
            <img src={Img} alt="Benefícios do ClassHub" />
          </div>
        </div>
      </div>
    </section>
  )
}

const GetStarted: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="get-started" className="get-started">
      <div className="container">
        <h2>Pronto para transformar sua experiência educacional?</h2>
        <p>
          Junte-se a milhares de alunos, professores e responsáveis que já estão aproveitando os benefícios do ClassHub.
        </p>
        <button onClick={() => navigate('/Escolas')} className="cta-button">
          Registre sua Escola
        </button>
      </div>
    </section>
  )
}

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <Book size={24} className="logo-icon" />
            <span className="logo-text">ClassHub</span>
          </div>
          <nav className="footer-nav">
            <ul>
              <li>
                <a href="#">Sobre nós</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Suporte</a>
              </li>
              <li>
                <a href="#">Termos de uso</a>
              </li>
              <li>
                <a href="#">Privacidade</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="copyright">© {new Date().getFullYear()} ClassHub. Todos os direitos reservados.</div>
      </div>
    </footer>
  )
}

export default App