import { useLanguage } from './i18n/LanguageContext.jsx';
import FloatingNav from './components/FloatingNav/FloatingNav.jsx';
import Hero from './components/Hero/Hero.jsx';
import About from './components/About/About.jsx';
import Projects from './components/Projects/Projects.jsx';
import Stacks from './components/Stacks/Stacks.jsx';
import Journey from './components/Journey/Journey.jsx';
import Contact from './components/Contact/Contact.jsx';
import Footer from './components/Footer/Footer.jsx';

export default function App() {
  const { t } = useLanguage();

  return (
    <>
      <a className="skip-link" href="#main">
        {t.nav.skip}
      </a>
      <FloatingNav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Projects />
        <Stacks />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
