import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBuilder } from '../../../Contexts/BuilderContext';
import { AddIcon, CloseIcon, InfoIcon } from '../Common/Icons';
import ComponentPopup from './ComponentPopup';
import { formatPrice } from '../../../lib/componentPrice';

const ComponentCard = ({ component, name }) => {
  const { t } = useTranslation(['builder', 'common']);
  const {
    setCurrentCompToAdd,
    setFilters,
    setSearch,
    setSort,
    setSelectedComponents,
    buildIssues,
    setViewingComponent,
  } = useBuilder();
  const [popup, setPopup] = useState(null);

  const handleAddComponent = () => {
    setCurrentCompToAdd(name);
    setFilters({});
    setSearch('');
    setSort('price_asc');
  };

  const handleRemove = () => {
    setSelectedComponents((prev) => ({
      ...prev,
      [name.toLowerCase()]: null,
    }));
    setCurrentCompToAdd(null);
  };

  const handlePopup = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPopup({ component: name, x: rect.left, y: rect.bottom });
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const hasIssues = buildIssues[name.toLowerCase()]?.length > 0;
  const displayName = t(`common:components.${name.toLowerCase()}`);

  const listings = component?.listings?.length
    ? component.listings
    : component
      ? [
          {
            source: component.selected_source,
            price: component.price,
            stock_status: component.stock_status,
            stock_quantity: component.stock_quantity,
            url: component.url,
          },
        ]
      : [];

  return (
    <div className="w-full xl:w-80 h-100 border flex flex-col border-border shadow hover:bg-background transition relative">
      <>
        {component ? (
          <>
            <div className="relative group p-2">
              <h3 className="text-xl text-muted">{displayName}</h3>
              <h2 className="text-text font-semibold text-3xl line-clamp-1">{component.name}</h2>
              <div className="absolute left-0 mb-1 hidden group-hover:block bg-primary text-white text-xs p-1 whitespace-nowrap z-10">
                {component.name}
              </div>
            </div>

            <div className="p-2 flex flex-col gap-1 overflow-y-auto max-h-32">
              {listings.map((listing, i) => (
                <a
                  key={listing.source ?? i}
                  href={listing.url}
                  target="_blank"
                  className="grid grid-cols-3 gap-1 text-sm border border-border bg-surface p-1 hover:bg-secondary-light transition cursor-pointer"
                >
                  <span className="text-text font-medium truncate">
                    {listing.source ? capitalize(listing.source) : '-'}
                  </span>
                  <span className="text-muted">€{formatPrice(listing.price)}</span>
                  <span className="text-muted truncate">
                    {listing.stock_status === 'in_stock' || listing.stock_status === 'orderable'
                      ? t('componentCard.inStock')
                      : t('componentCard.outOfStock')}
                  </span>
                </a>
              ))}
            </div>

            <div className="bg-primary mt-auto flex">
              <button
                className="text-white py-4 px-8 hover:bg-primary-light transition cursor-pointer flex-1"
                onClick={() => setViewingComponent({ component, name })}
              >
                {t('componentCard.more')}
              </button>

              <button
                className="text-white p-4 hover:bg-danger/50 cursor-pointer transition"
                onClick={handleRemove}
              >
                <CloseIcon size={20} />
              </button>
            </div>

            {hasIssues && (
              <div className="bg-danger/10 absolute w-full h-full pointer-events-none border-2 border-danger/20"></div>
            )}
          </>
        ) : (
          <>
            <div className="h-full flex flex-col items-center justify-center gap-4 relative">
              <span className="text-3xl font-semibold text-muted">{displayName}</span>
              <button
                className="bg-surface p-2 text-muted hover:bg-secondary-light transition cursor-pointer"
                onClick={handleAddComponent}
              >
                <AddIcon />
              </button>
            </div>
          </>
        )}

        <div
          className="absolute top-0 right-0 m-2 text-border hover:text-muted transition"
          onMouseEnter={handlePopup}
          onMouseLeave={() => setPopup(null)}
        >
          <InfoIcon />
        </div>
        {popup && <ComponentPopup {...popup} />}
      </>
    </div>
  );
};

export default ComponentCard;
