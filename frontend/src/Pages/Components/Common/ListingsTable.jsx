import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../../lib/componentPrice';
import { formatDate } from '../../../lib/formatDate';
import { useLang } from '../../../lib/localePath';
import { trackEvent } from '../../../lib/analytics';

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const GRID_CLASSES = {
  sm: 'grid-cols-2 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]',
  xl: 'grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto]',
};

const LINK_CLASSES = {
  sm: 'col-span-2 sm:col-span-1 sm:py-2',
  xl: 'col-span-2 xl:col-span-1 xl:py-2',
};

const ListingsTable = ({ listings, breakpoint = 'sm', onVisit }) => {
  const { t } = useTranslation('builder');
  const lang = useLang();

  const stockLabel = (listing) => {
    if (listing.stock_status === 'in_stock')
      return listing.stock_quantity != null
        ? t('componentCard.inStockWithQty', { count: listing.stock_quantity })
        : t('componentCard.inStock');
    if (listing.stock_status === 'orderable')
      return listing.stock_quantity != null
        ? t('componentCard.orderableWithQty', { count: listing.stock_quantity })
        : t('componentCard.orderable');
    return t('componentCard.outOfStock');
  };

  return (
    <div className="flex flex-col gap-2">
      {listings.map((listing) => (
        <div
          key={listing.source}
          className={`grid ${GRID_CLASSES[breakpoint]} items-center gap-2 border border-border bg-surface p-3 transition`}
        >
          <span className="text-text font-medium">{capitalize(listing.source)}</span>
          <span className="text-muted">€{formatPrice(listing.price)}</span>
          <span className="text-muted">{stockLabel(listing)}</span>
          <span className="text-muted text-sm">
            {listing.scraped_at
              ? t('componentCard.lastScraped', {
                  date: formatDate(listing.scraped_at, lang),
                })
              : t('componentCard.neverScraped')}
          </span>
          <a
            href={listing.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              trackEvent('store_link_click', { store: listing.source });
              onVisit?.(e, listing);
            }}
            className={`px-4 py-4 bg-primary text-white text-sm hover:bg-primary-light transition cursor-pointer text-center ${LINK_CLASSES[breakpoint]}`}
          >
            {t('componentCard.seeInStore')}
          </a>
        </div>
      ))}
    </div>
  );
};

export default ListingsTable;
