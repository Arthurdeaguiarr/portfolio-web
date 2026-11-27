import { useState } from 'react';
import { ArrowDownRight, ArrowRight } from '@phosphor-icons/react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './Hero.css';
import { asset } from '../../config.js';

// Coloque sua foto em client/public/images/arthur.jpg (proporção 4:5, mínimo 900x1125)
const PHOTO_SRC = asset('/images/arthur.jpg');

export default function Hero() {
  const { t } = useLanguage();
  const [photoFailed, setPhotoFailed] = useState(false);
  const h = t.hero;

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true" />

      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="hero__status">
            <span className="hero__status-dot" aria-hidden="true" />
            {h.status}
          </p>

          <h1 id="hero-title" className="hero__title">
            <span className="hero__name">
              {h.name}
              <span className="dot">.</span>
            </span>
            <span className="hero__role">
              {h.role && <>{h.role} </>}
              <span className="accent">{h.roleAccent}</span>
              {h.roleAfter && <> {h.roleAfter}</>}
            </span>
          </h1>

          <p className="hero__sub">{h.sub}</p>

          <div className="hero__ctas">
            <a href="#projects" className="btn btn--primary">
              {h.ctaProjects}
              <ArrowDownRight size={18} weight="bold" aria-hidden="true" />
            </a>
            <a href="#contact" className="btn btn--ghost">
              {h.ctaContact}
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__photo">
            {photoFailed ? (
              // Placeholder enquanto a foto não existe
              <div className="hero__monogram" role="img" aria-label={h.photoAlt}>
                <span>
                  A<span className="dot">.</span>
                </span>
              </div>
            ) : (
              <img
                src={PHOTO_SRC}
                alt={h.photoAlt}
                width="900"
                height="1125"
                fetchpriority="high"
                onError={() => setPhotoFailed(true)}
              />
            )}
          </div>
          <span className="hero__square hero__square--1" aria-hidden="true" />
          <span className="hero__square hero__square--2" aria-hidden="true" />
          <span className="hero__square hero__square--3" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
