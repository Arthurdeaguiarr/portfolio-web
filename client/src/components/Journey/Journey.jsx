import { MapPin } from '@phosphor-icons/react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { useReveal } from '../../hooks/useReveal.js';
import MacWindow from '../Projects/MacWindow.jsx';
import './Journey.css';

export default function Journey() {
  const { t, lang } = useLanguage();
  const ref = useReveal([lang]);
  const j = t.journey;

  return (
    <section id="journey" className="section journey" aria-labelledby="journey-title" ref={ref}>
      <div className="container">
        <h2 id="journey-title" className="section-title reveal">
          {j.title}
          <span className="dot">.</span>
        </h2>

        <ol className="timeline">
          {j.items.map((item, i) => (
            <li className="timeline__item reveal" style={{ '--i': i + 1 }} key={item.title}>
              <p className="timeline__date">{item.date}</p>
              <div className="timeline__body">
                <h3 className="timeline__title">{item.title}</h3>
                <p className="timeline__place">{item.place}</p>
                <p className="timeline__desc">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="events" aria-labelledby="events-title">
          <div className="events__head reveal">
            <h3 id="events-title" className="events__title">
              {j.events}
              <span className="dot">.</span>
            </h3>
            <p className="events__text">{j.eventsText}</p>
          </div>

          <div className="events__grid">
            {j.eventsList.map((event, i) => (
              <article className="event reveal" style={{ '--i': i + 1 }} key={event.name}>
                <MacWindow title={event.name} url={event.name} images={event.images} ratio="4 / 5" />
                <div className="event__caption">
                  <h4 className="event__name">{event.name}</h4>
                  <p className="event__place">
                    <MapPin size={16} weight="fill" aria-hidden="true" />
                    {event.place}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
