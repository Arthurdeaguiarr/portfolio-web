import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import pt from './pt.js';
import en from './en.js';

const dictionaries = { pt, en };
const LanguageContext = createContext(null);

function getInitialLang() {
  try {
    const saved = localStorage.getItem('lang');
    if (saved === 'pt' || saved === 'en') return saved;
  } catch {
    /* localStorage indisponível */
  }
  return 'pt';
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    const dict = dictionaries[lang];
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.title = dict.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', dict.meta.description);
    try {
      localStorage.setItem('lang', lang);
    } catch {
      /* ignora */
    }
  }, [lang]);

  const toggleLang = useCallback(() => setLang((l) => (l === 'pt' ? 'en' : 'pt')), []);

  const value = useMemo(() => ({ lang, t: dictionaries[lang], toggleLang }), [lang, toggleLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage precisa estar dentro de <LanguageProvider>');
  return ctx;
}
