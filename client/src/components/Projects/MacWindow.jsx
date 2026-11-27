import { useEffect, useRef, useState } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { localize } from '../../utils/localize.js';
import './MacWindow.css';
import { asset } from '../../config.js';

// Janela no estilo macOS com um carrossel de imagens (e vídeos) dentro.
// ratio: proporção da área de imagem, ex. '16 / 10' ou '1 / 1'
export default function MacWindow({ title, url, images, priority = false, ratio }) {
  const { t, lang } = useLanguage();
  const [index, setIndex] = useState(0);
  const startX = useRef(null);
  const trackRef = useRef(null);
  const count = images.length;

  // Pausa qualquer vídeo que saiu da tela ao trocar de slide
  useEffect(() => {
    trackRef.current?.querySelectorAll('video').forEach((video) => {
      if (Number(video.dataset.index) !== index) video.pause();
    });
  }, [index]);
  const p = t.projects;

  const go = (next) => setIndex((next + count) % count);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(index - 1);
    }
  };

  // Swipe no touch (e arrastar com o mouse)
  const onPointerDown = (e) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e) => {
    if (startX.current == null) return;
    const delta = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(delta) > 48) go(delta < 0 ? index + 1 : index - 1);
  };

  return (
    <div className="mac" style={ratio ? { '--ratio': ratio } : undefined}>
      <div className="mac__bar">
        <span className="mac__lights" aria-hidden="true">
          <span className="mac__light mac__light--red" />
          <span className="mac__light mac__light--yellow" />
          <span className="mac__light mac__light--green" />
        </span>
        <span className="mac__url">{url || title}</span>
        <span className="mac__count" aria-hidden="true">
          {index + 1}/{count}
        </span>
      </div>

      <div
        className="mac__viewport"
        role="region"
        aria-roledescription="carousel"
        aria-label={`${p.gallery}: ${title}`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (startX.current = null)}
      >
        <div ref={trackRef} className="mac__track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {images.map((img, i) => (
            <figure
              className="mac__slide"
              key={img.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} ${p.of} ${count}`}
              aria-hidden={i !== index}
            >
              {img.type === 'video' ? (
                <video
                  className="mac__video"
                  src={asset(img.src)}
                  data-index={i}
                  aria-label={localize(img.alt, lang)}
                  controls
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  tabIndex={i === index ? 0 : -1}
                />
              ) : (
                <img
                  src={asset(img.src)}
                  alt={localize(img.alt, lang)}
                  width="1600"
                  height="1000"
                  loading={priority && i === 0 ? 'eager' : 'lazy'}
                  draggable="false"
                />
              )}
            </figure>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              className="mac__arrow mac__arrow--prev"
              onClick={() => go(index - 1)}
              aria-label={p.prev}
            >
              <CaretLeft size={20} weight="bold" />
            </button>
            <button
              type="button"
              className="mac__arrow mac__arrow--next"
              onClick={() => go(index + 1)}
              aria-label={p.next}
            >
              <CaretRight size={20} weight="bold" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mac__dots">
          {images.map((img, i) => (
            <button
              type="button"
              key={img.src}
              className={`mac__dot${i === index ? ' is-active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`${p.goTo} ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
