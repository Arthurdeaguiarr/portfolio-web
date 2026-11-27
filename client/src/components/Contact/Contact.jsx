import { useRef, useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle,
  CircleNotch,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  PaperPlaneTilt,
  WarningCircle,
} from '@phosphor-icons/react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { IS_STATIC, WEB3FORMS_KEY } from '../../config.js';
import { useReveal } from '../../hooks/useReveal.js';
import './Contact.css';

const EMAIL = 'arthurdeaguiarr@gmail.com';
const LINKS = [
  { label: EMAIL, href: `mailto:${EMAIL}`, Icon: EnvelopeSimple },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/arthur-de-aguiar-santos/', Icon: LinkedinLogo },
  { label: 'GitHub', href: 'https://github.com/Arthurdeaguiarr', Icon: GithubLogo },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Envia a mensagem: pela API Express ou, no GitHub Pages, pelo Web3Forms.
// Devolve sempre algo com { ok, status } para o formulário tratar igual.
async function sendMessage(values) {
  if (!IS_STATIC) {
    return fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
  }
  if (!WEB3FORMS_KEY) throw new Error('WEB3FORMS_KEY não configurada');
  // Honeypot: robô preencheu o campo escondido, finge sucesso sem enviar
  if (values.website) return { ok: true, status: 200 };
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: `Nova mensagem do portfólio: ${values.name.trim().slice(0, 80)}`,
      from_name: 'Portfólio',
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
      botcheck: '',
    }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok && data.success === true, status: res.status };
}

function validateField(name, value) {
  const v = value.trim();
  if (name === 'name') return v.length >= 2 ? '' : 'errName';
  if (name === 'email') return EMAIL_RE.test(v) ? '' : 'errEmail';
  if (name === 'message') return v.length >= 10 ? '' : 'errMessage';
  return '';
}

export default function Contact() {
  const { t, lang } = useLanguage();
  const ref = useReveal([lang]);
  const c = t.contact;

  const [values, setValues] = useState({ name: '', email: '', message: '', website: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error | rate
  const fieldRefs = { name: useRef(null), email: useRef(null), message: useRef(null) };

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    // Se o campo já tinha erro, revalida enquanto a pessoa corrige
    if (errors[name]) setErrors((er) => ({ ...er, [name]: validateField(name, value) }));
  };

  const onBlur = (e) => {
    const { name, value } = e.target;
    if (name in fieldRefs) setErrors((er) => ({ ...er, [name]: validateField(name, value) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {
      name: validateField('name', values.name),
      email: validateField('email', values.email),
      message: validateField('message', values.message),
    };
    setErrors(next);
    const firstError = Object.keys(next).find((k) => next[k]);
    if (firstError) {
      fieldRefs[firstError].current?.focus();
      return;
    }

    setStatus('sending');
    try {
      const res = await sendMessage(values);
      if (res.status === 429) {
        setStatus('rate');
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('success');
      setValues({ name: '', email: '', message: '', website: '' });
      setErrors({});
    } catch {
      // Mantém o que a pessoa digitou para ela tentar de novo
      setStatus('error');
    }
  };

  const field = (name, type = 'text') => {
    const id = `contact-${name}`;
    const errorKey = errors[name];
    const Tag = type === 'textarea' ? 'textarea' : 'input';
    return (
      <div className={`field${errorKey ? ' has-error' : ''}`}>
        <label htmlFor={id}>{c[name]}</label>
        <Tag
          ref={fieldRefs[name]}
          id={id}
          name={name}
          type={type === 'textarea' ? undefined : type}
          rows={type === 'textarea' ? 5 : undefined}
          value={values[name]}
          placeholder={c[`${name}Ph`]}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={name === 'message' ? 'off' : name}
          aria-invalid={errorKey ? 'true' : 'false'}
          aria-describedby={errorKey ? `${id}-error` : undefined}
          required
        />
        {errorKey && (
          <p id={`${id}-error`} className="field__error">
            <WarningCircle size={16} weight="fill" aria-hidden="true" />
            {c[errorKey]}
          </p>
        )}
      </div>
    );
  };

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title" ref={ref}>
      <div className="container contact__grid">
        <div className="contact__intro">
          <h2 id="contact-title" className="contact__title reveal">
            {c.title}
            <span className="dot">.</span>
          </h2>
          <p className="contact__text reveal" style={{ '--i': 1 }}>
            {c.text}
          </p>

          <div className="contact__direct reveal" style={{ '--i': 2 }}>
            <p className="contact__direct-label">{c.direct}</p>
            <ul className="contact__links">
              {LINKS.map(({ label, href, Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="contact__link"
                    {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    <Icon size={22} weight="bold" aria-hidden="true" />
                    <span>{label}</span>
                    <ArrowUpRight className="contact__link-arrow" size={18} weight="bold" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            {/* TODO: descomentar quando o arquivo client/public/cv-arthur.pdf existir
            <a href={asset('/cv-arthur.pdf')} className="btn btn--ghost" download>
              {c.cv}
            </a>
            */}
          </div>
        </div>

        <form className="contact__form reveal" style={{ '--i': 2 }} onSubmit={onSubmit} noValidate>
          {field('name')}
          {field('email', 'email')}
          {field('message', 'textarea')}

          {/* Honeypot: escondido de pessoas, robôs costumam preencher */}
          <div className="visually-hidden" aria-hidden="true">
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={onChange}
            />
          </div>

          <button type="submit" className="btn btn--primary contact__submit" disabled={status === 'sending'}>
            {status === 'sending' ? (
              <>
                <CircleNotch className="spin" size={18} weight="bold" aria-hidden="true" />
                {c.sending}
              </>
            ) : (
              <>
                {c.send}
                <PaperPlaneTilt size={18} weight="bold" aria-hidden="true" />
              </>
            )}
          </button>

          <div className="contact__status" role="status" aria-live="polite">
            {status === 'success' && (
              <p className="notice notice--success">
                <CheckCircle size={20} weight="fill" aria-hidden="true" />
                {c.success}
              </p>
            )}
            {(status === 'error' || status === 'rate') && (
              <p className="notice notice--error">
                <WarningCircle size={20} weight="fill" aria-hidden="true" />
                {status === 'rate' ? c.rateLimited : c.error}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
