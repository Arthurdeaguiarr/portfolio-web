import { useCallback, useEffect, useState } from 'react';

// O tema inicial já foi aplicado no index.html; aqui só lemos e alternamos
export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#0f0f11' : '#fafaf9');
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('theme', next);
      } catch {
        /* ignora */
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
