import { MapPin } from '@phosphor-icons/react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { useReveal } from '../../hooks/useReveal.js';
import './About.css';

// Destaca a frase-chave dentro do parágrafo
function withHighlight(text, highlight) {
  const index = text.indexOf(highlight);
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark className="about__mark">{highlight}</mark>
      {text.slice(index + highlight.length)}
    </>
  );
}

export default function About() {
  const { t, lang } = useLanguage();
  const ref = useReveal([lang]);
  const a = t.about;

  return (
    <section id="about" className="section about" aria-labelledby="about-title" ref={ref}>
      <div className="container about__grid">
        <div className="about__main">
          <h2 id="about-title" className="section-title reveal">
            {a.title}
            <span className="dot">.</span>
          </h2>
          <p className="about__text reveal" style={{ '--i': 1 }}>
            {withHighlight(a.text, a.highlight)}
          </p>
        </div>

        <aside className="about__side">
          <dl className="about__stats">
            {a.stats.map((stat, i) => (
              <div className="about__stat reveal" style={{ '--i': i + 2 }} key={stat.label}>
                <dt className="visually-hidden">{stat.label}</dt>
                <dd className="about__value" aria-hidden="true">
                  {stat.value}
                </dd>
                <dd className="about__label">
                  <span className="visually-hidden">{stat.value} </span>
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
          <p className="about__location reveal" style={{ '--i': 5 }}>
            <MapPin size={18} weight="fill" aria-hidden="true" />
            {a.location}
          </p>
        </aside>
      </div>
    </section>
  );
}
