import React from 'react';
import { useTranslation } from 'react-i18next';

const Privacy = () => {
  const { t } = useTranslation('legal');
  const sections = t('privacy.sections', { returnObjects: true });

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-semibold mb-1 text-text">{t('privacy.title')}</h1>
      <p className="text-muted text-sm mb-8">{t('privacy.lastUpdated')}</p>

      <p className="text-text mb-8">{t('privacy.intro')}</p>

      <div className="space-y-8">
        {sections.map((section, i) => (
          <div key={i}>
            <h2 className="text-2xl font-semibold text-text mb-2">{section.heading}</h2>
            {section.body && <p className="text-text mb-2">{section.body}</p>}
            {section.list && (
              <ul className="list-disc pl-6 space-y-1 text-text">
                {section.list.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Privacy;
