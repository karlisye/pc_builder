import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import LegalDocument from './Components/Common/LegalDocument';
import SidePanel from './Components/Common/SidePanel';
import { useLocalePath } from '../lib/localePath';

const docIds = ['privacy', 'terms'];

const Legal = ({ doc = 'privacy' }) => {
  const { t } = useTranslation('legal');
  const lp = useLocalePath();

  return (
    <div className="h-full flex">
      <SidePanel title={t('sidePanelTitle')}>
        {docIds.map((id) => (
          <Link
            key={id}
            to={lp(`/${id}`)}
            className={`block p-4 border border-secondary w-full text-white text-left transition-all cursor-pointer mb-2 hover:bg-secondary ${
              doc === id ? 'border-l-10' : ''
            }`}
          >
            {t(`${id}.title`)}
          </Link>
        ))}
      </SidePanel>

      <div className="flex-1 overflow-y-auto">
        <LegalDocument docKey={doc} />
      </div>
    </div>
  );
};

export default Legal;
