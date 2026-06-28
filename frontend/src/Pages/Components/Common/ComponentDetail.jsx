import React from 'react';
import { useTranslation } from 'react-i18next';
import ComponentInfo from './ComponentInfo';
import { CloseIcon } from './Icons';
import { getCheapestPrice, formatPrice } from '../../../lib/componentPrice';

const ComponentDetail = ({ component, title, onClose, actions }) => {
  const { t } = useTranslation(['builder', 'common']);
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

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
          <div className="flex flex-col gap-2">
            {component.listings.map((listing) => (
              <div
                key={listing.source}
                className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] items-center gap-2 border border-border bg-surface p-3 transition"
              >
                <span className="text-text font-medium">{capitalize(listing.source)}</span>
                <span className="text-muted">€{formatPrice(listing.price)}</span>
                <span className="text-muted">
                  {listing.stock_status === 'in_stock'
                    ? t('componentCard.inStockWithQty', {
                        count: listing.stock_quantity,
                      })
                    : listing.stock_status === 'orderable'
                      ? t('componentCard.orderableWithQty', {
                          count: listing.stock_quantity,
                        })
                      : t('componentCard.outOfStock')}
                </span>
                <span className="text-muted text-sm">
                  {listing.scraped_at
                    ? t('componentCard.lastScraped', {
                        date: new Date(listing.scraped_at).toLocaleDateString(),
                      })
                    : t('componentCard.neverScraped')}
                </span>
                <a
                  href={listing.url}
                  target="_blank"
                  className="px-4 py-4 bg-primary text-white text-sm hover:bg-primary-light transition cursor-pointer text-center col-span-2 sm:col-span-1 sm:py-2"
                >
                  {t('componentCard.seeInStore')}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentDetail;
