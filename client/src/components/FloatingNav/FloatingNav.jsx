import { useEffect, useRef, useState } from 'react';
import { List, X, Sun, Moon } from '@phosphor-icons/react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { useTheme } from '../../hooks/useTheme.js';
import { useActiveSection } from '../../hooks/useActiveSection.js';
import './FloatingNav.css';

const SECTIONS = ['about', 'projects', 'stacks', 'journey', 'contact'];
const OBSERVED = ['home', ...SECTIONS];

export default function FloatingNav() {
  const { t, lang, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const active = useActiveSection(OBSERVED);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef(null);

  // Fecha o menu mobile com Esc e devolve o foco ao botão
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const links = SECTIONS.map((id) => (
    <li key={id}>
      <a
        href={`#${id}`}
        className={`nav__link${active === id ? ' is-active' : ''}`}
        aria-current={active === id ? 'true' : undefined}
        onClick={() => setOpen(false)}
      >
        {t.nav[id]}
      </a>
    </li>
  ));

  return (
    <header className="nav-wrap">
      <nav className={`nav${open ? ' is-open' : ''}`} aria-label="Principal">
        <div className="nav__bar">
          <a href="#home" className="nav__logo" aria-label={t.nav.home} onClick={() => setOpen(false)}>
            A<span className="dot">.</span>
          </a>

          <ul className="nav__links nav__links--desktop">{links}</ul>

          <div className="nav__actions">
            <button
              type="button"
              className="nav__icon-btn nav__lang"
              onClick={toggleLang}
              aria-label={t.nav.switchLang}
            >
              <span className={lang === 'pt' ? 'is-on' : ''}>PT</span>
              <span aria-hidden="true">/</span>
              <span className={lang === 'en' ? 'is-on' : ''}>EN</span>
            </button>
            <button
              type="button"
              className="nav__icon-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t.nav.toLight : t.nav.toDark}
            >
              {theme === 'dark' ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
            </button>
            <button
              ref={menuButtonRef}
              type="button"
              className="nav__icon-btn nav__menu-btn"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.nav.close : t.nav.menu}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
            </button>
          </div>
        </div>

        <div id="mobile-menu" className="nav__panel" hidden={!open}>
          <ul className="nav__links nav__links--mobile">{links}</ul>
        </div>
      </nav>
    </header>
  );
}
