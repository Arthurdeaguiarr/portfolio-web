import { useId, useState } from 'react';
import { ArrowUpRight, GithubLogo, Plus, Minus } from '@phosphor-icons/react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { useProjects } from '../../hooks/useProjects.js';
import { useReveal } from '../../hooks/useReveal.js';
import { localize } from '../../utils/localize.js';
import { safeUrl } from '../../utils/safeUrl.js';
import MacWindow from './MacWindow.jsx';
import './Projects.css';

function ProjectSkeleton() {
  return (
    <div className="project project--featured project--skeleton" aria-hidden="true">
      <div className="skeleton skeleton--window" />
      <div className="project__info">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line skeleton--short" />
      </div>
    </div>
  );
}

function Project({ project, index }) {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const caseId = useId();
  const p = t.projects;
  const c = project.content?.[lang] || project.content?.pt || {};
  const demoUrl = safeUrl(project.demoUrl);
  const repoUrl = safeUrl(project.repoUrl);
  const title = c.title || project.title;
  const layout = index === 0 ? 'featured' : index % 2 === 1 ? 'split' : 'split-reverse';

  return (
    <article className={`project project--${layout} reveal`} aria-labelledby={`${caseId}-title`}>
      <MacWindow title={title} url={project.displayUrl} images={project.images || []} priority={index === 0} />

      <div className="project__info">
        <div className="project__head">
          <span className={`project__status project__status--${project.status}`}>
            {p.status[project.status] || project.status}
          </span>
          <h3 id={`${caseId}-title`} className="project__title">
            {title}
            <span className="dot">.</span>
          </h3>
          <p className="project__summary">{c.summary}</p>
        </div>

        <div className="project__meta">
          <ul className="tag-list" aria-label="Stack">
            {(project.stack || []).map((item) => {
              const label = localize(item, lang);
              return (
                <li className="tag tag--small" key={label}>
                  {label}
                </li>
              );
            })}
          </ul>

          <div className="project__links">
            {demoUrl ? (
              <a className="btn btn--primary" href={demoUrl} target="_blank" rel="noopener noreferrer">
                {p.demo}
                <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
              </a>
            ) : (
              project.status === 'in_progress' && (
                <span className="btn btn--ghost" aria-disabled="true">
                  {p.demoSoon}
                </span>
              )
            )}
            {repoUrl && (
              <a className="btn btn--ghost" href={repoUrl} target="_blank" rel="noopener noreferrer">
                <GithubLogo size={18} weight="bold" aria-hidden="true" />
                {p.repo}
              </a>
            )}
            <button
              type="button"
              className="project__case-btn"
              aria-expanded={open}
              aria-controls={`${caseId}-case`}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? p.closeCase : p.openCase}
              {open ? (
                <Minus size={16} weight="bold" aria-hidden="true" />
              ) : (
                <Plus size={16} weight="bold" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <div id={`${caseId}-case`} className={`project__case${open ? ' is-open' : ''}`} hidden={!open}>
          {['problem', 'role', 'solution', 'result'].map((key) => (
            <div className="project__case-block" key={key}>
              <h4>{p[key]}</h4>
              <p>{c[key]}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const { t, lang } = useLanguage();
  const { projects, loading } = useProjects();
  const ref = useReveal([loading, lang]);

  return (
    <section id="projects" className="section projects" aria-labelledby="projects-title" ref={ref}>
      <div className="container">
        <h2 id="projects-title" className="section-title reveal">
          {t.projects.title}
          <span className="dot">.</span>
        </h2>

        <div className="projects__list" aria-busy={loading}>
          {loading ? (
            <>
              <span className="visually-hidden">{t.projects.loading}</span>
              <ProjectSkeleton />
            </>
          ) : (
            projects.map((project, i) => <Project key={project.slug} project={project} index={i} />)
          )}
        </div>
      </div>
    </section>
  );
}
