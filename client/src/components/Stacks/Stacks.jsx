import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { useReveal } from '../../hooks/useReveal.js';
import './Stacks.css';
import { asset } from '../../config.js';

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

// Posição (x, y em %) e rotação de cada card no aglomerado (desktop)
const CARDS = [
  { name: 'React', logo: `${DEVICON}/react/react-original.svg`, x: 34, y: 2, r: -8 },
  { name: 'JavaScript', logo: `${DEVICON}/javascript/javascript-original.svg`, x: 62, y: 6, r: 12 },
  { name: 'HTML5', logo: `${DEVICON}/html5/html5-original.svg`, x: 8, y: 18, r: -14 },
  { name: 'Express', logo: `${DEVICON}/express/express-original.svg`, x: 40, y: 27, r: 6 },
  { name: 'CSS3', logo: `${DEVICON}/css3/css3-original.svg`, x: 70, y: 34, r: -6 },
  { name: 'MySQL', logo: `${DEVICON}/mysql/mysql-original.svg`, x: 14, y: 46, r: 9 },
  { name: 'TypeScript', logo: `${DEVICON}/typescript/typescript-original.svg`, x: 46, y: 54, r: -12 },
  { name: 'VS Code', logo: `${DEVICON}/vscode/vscode-original.svg`, x: 74, y: 62, r: 14 },
  { name: 'Google Cloud', logo: `${DEVICON}/googlecloud/googlecloud-original.svg`, x: 22, y: 74, r: -4 },
  { name: 'Miro', logo: 'https://cdn.simpleicons.org/miro', x: 52, y: 80, r: 10 },
];

// Quadradinhos laranja decorativos
const SQUARES = [
  { x: 30, y: 0, s: 10, r: 15 },
  { x: 90, y: 4, s: 12, r: -20 },
  { x: 94, y: 10, s: 8, r: 30 },
  { x: 3, y: 40, s: 10, r: 10 },
  { x: 2, y: 46, s: 7, r: -25 },
  { x: 88, y: 88, s: 10, r: 20 },
];

function TagGroup({ title, items, className = '', muted = false }) {
  return (
    <div className={`stacks__group ${className}`}>
      <h3 className="stacks__subtitle">
        {title}
        <span className="dot">.</span>
      </h3>
      <ul className="tag-list">
        {items.map((item) => (
          <li className={`tag${muted ? ' tag--muted tag--small' : ''}`} key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Stacks() {
  const { t, lang } = useLanguage();
  const ref = useReveal([lang]);
  const s = t.stacks;

  return (
    <section id="stacks" className="section stacks" aria-labelledby="stacks-title" ref={ref}>
      <div className="container stacks__grid">
        <div className="stacks__image reveal">
          <img
            src={asset('/images/setup-macbook.png')}
            alt={s.imageAlt}
            width="1200"
            height="1011"
            loading="lazy"
          />
        </div>

        <div className="stacks__title-wrap reveal">
          <h2 id="stacks-title" className="stacks__title">
            {s.titleA} <span className="accent">{s.titleB}</span>
            <span className="dot">.</span>
          </h2>
          <p className="stacks__role">{s.role}</p>
        </div>

        <TagGroup title={s.tech} items={s.techList} className="stacks__tech reveal" />

        <div className="stacks__cluster reveal" role="list" aria-label={s.tech}>
          {SQUARES.map((sq, i) => (
            <span
              key={`sq-${i}`}
              className="stacks__square"
              aria-hidden="true"
              style={{ left: `${sq.x}%`, top: `${sq.y}%`, width: sq.s, height: sq.s, '--r': `${sq.r}deg` }}
            />
          ))}
          {CARDS.map((card, i) => (
            <div
              role="listitem"
              className="stack-card"
              key={card.name}
              style={{ '--x': `${card.x}%`, '--y': `${card.y}%`, '--rot': `${card.r}deg`, '--i': i }}
            >
              <img src={card.logo} alt="" width="48" height="48" loading="lazy" />
              <span className="stack-card__name">
                {card.name}
                <span className="dot">.</span>
              </span>
            </div>
          ))}
        </div>

        <TagGroup title={s.soft} items={s.softList} className="stacks__soft reveal" />

        <TagGroup title={s.tools} items={s.toolsList} className="stacks__tools reveal" muted />
      </div>
    </section>
  );
}
