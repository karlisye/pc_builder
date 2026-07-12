import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowIcon } from '../Common/Icons';
import ComponentGeneratorForm from './ComponentGeneratorForm';

const ComponentGenerator = () => {
  const { t } = useTranslation('builder');
  const [open, setOpen] = useState(false);

  return (
    <div className="pt-4 border-t mt-4 border-secondary">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex justify-between items-center text-secondary-light hover:text-surface transition cursor-pointer"
      >
        <span className="text-sm">{t('componentGenerator.title')}</span>
        <ArrowIcon active={open} />
      </button>

      <div
        className={`grid transition-all overflow-hidden ${open ? 'grid-rows-[1fr] mt-3' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <ComponentGeneratorForm />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ComponentGenerator);
