import { ArrowUp } from '@phosphor-icons/react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          © 2026 Arthur<span className="dot">.</span> {t.footer.made}
        </p>
        <a href="#home" className="footer__top">
          {t.footer.top}
          <ArrowUp size={16} weight="bold" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
