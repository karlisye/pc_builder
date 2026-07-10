import React from 'react';
import { useTranslation } from 'react-i18next';
import ComponentInfo from './ComponentInfo';
import ListingsTable from './ListingsTable';
import { CloseIcon } from './Icons';
import { getCheapestPrice, formatPrice } from '../../../lib/componentPrice';

const ComponentDetail = ({ component, title, onClose, actions }) => {
  const { t } = useTranslation(['builder', 'common']);

  return (
    <div className="border border-border w-full hover:bg-background transition p-4 mb-auto bg-background">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl text-muted">{title}</h3>
          <h2 className="text-text font-semibold text-3xl">{component.name}</h2>
          <span className="text-muted text-sm">
            {t('componentCard.startingFrom', { price: formatPrice(getCheapestPrice(component)) })}
          </span>
        </div>
        {onClose && (
          <button
            className="w-10 h-10 text-muted hover:cursor-pointer bg-surface hover:bg-secondary-light transition p-2"
            onClick={onClose}
            aria-label={t('common:close')}
          >
            <CloseIcon />
          </button>
        )}
      </div>

      {actions && <div className="flex gap-2 mt-4">{actions}</div>}

      <div className="mt-4 flex flex-col xl:flex-row gap-4">
        <div className="w-full xl:w-80 h-80 bg-surface shrink-0 flex items-center justify-center overflow-hidden">
          {component.image_url && (
            <img
              src={component.image_url}
              alt={component.name}
              loading="lazy"
              className="w-full h-full object-contain"
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <ComponentInfo component={component} />
        </div>
      </div>

      {component.listings?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-text mb-2">
            {t('componentCard.availabilityTitle')}
          </h3>
          <ListingsTable listings={component.listings} breakpoint="sm" />
        </div>
      )}
    </div>
  );
};

export default ComponentDetail;
