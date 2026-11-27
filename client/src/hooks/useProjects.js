import { useEffect, useState } from 'react';
import fallbackProjects from '../data/projects.js';
import { IS_STATIC } from '../config.js';

// Busca os projetos na API. Se a API ou o banco estiverem fora (ou demorarem
// mais de 4s), usa os dados locais para o site nunca ficar vazio.
export function useProjects() {
  // No GitHub Pages não existe API: começa direto com os dados locais
  const [state, setState] = useState(() =>
    IS_STATIC
      ? { projects: fallbackProjects, loading: false, source: 'static' }
      : { projects: [], loading: true, source: null }
  );

  useEffect(() => {
    if (IS_STATIC) return undefined;
    let cancelled = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    fetch('/api/projects', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) throw new Error('sem projetos');
        if (!cancelled) setState({ projects: data, loading: false, source: 'api' });
      })
      .catch(() => {
        if (!cancelled) setState({ projects: fallbackProjects, loading: false, source: 'fallback' });
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return state;
}
