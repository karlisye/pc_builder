import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useLocalePath } from '../../../lib/localePath';

const LegalDocument = ({ docKey }) => {
  const { t } = useTranslation('legal');
  const lp = useLocalePath();
  const sections = t(`${docKey}.sections`, { returnObjects: true, defaultValue: [] });
  const lastUpdated = t(`${docKey}.lastUpdated`, { defaultValue: '' });
  const intro = t(`${docKey}.intro`);
  const emailRegex = /[\w.+-]+@[\w-]+\.[\w-]+(?:\.[\w-]+)*/g;
  const introParts = intro.split(emailRegex);
  const introEmails = intro.match(emailRegex) || [];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-semibold mb-1 text-text">{t(`${docKey}.title`)}</h1>
      {lastUpdated && <p className="text-muted text-sm mb-8">{lastUpdated}</p>}

      <p className="text-text mb-8">
        {introParts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {introEmails[i] && (
              <a href={`mailto:${introEmails[i]}`} className="text-info underline">
                {introEmails[i]}
              </a>
            )}
          </React.Fragment>
        ))}
      </p>

      <div className="space-y-8">
        {sections.map((section, i) => (
          <div key={i}>
            <h2 className="text-2xl font-semibold text-text mb-2">{section.heading}</h2>
            {section.body &&
              section.body
                .split('\n')
                .map((paragraph, j) => (
                  <p key={j} className="text-text mb-2">
                    {paragraph}
                  </p>
                ))}
            {section.list && (
              <ul className="list-disc pl-6 space-y-1 text-text">
                {section.list.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            )}
            {section.link && (
              <Link to={lp(section.link.to)} className="text-info underline">
                {section.link.text}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LegalDocument;
