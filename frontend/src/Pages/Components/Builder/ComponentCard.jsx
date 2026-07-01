import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBuilder } from '../../../Contexts/BuilderContext';
import { AddIcon, CloseIcon, InfoIcon } from '../Common/Icons';
import ComponentPopup from './ComponentPopup';
import { formatPrice, getCheapestPrice } from '../../../lib/componentPrice';

const ComponentCard = ({ component, name }) => {
  const { t } = useTranslation(['builder', 'common']);
  const {
    setCurrentCompToAdd,
    setFilters,
    setSearch,
    setSort,
    setSelectedComponents,
    selectedComponents,
    buildIssues,
    setViewingComponent,
  } = useBuilder();

  const resolveOptional = () => {
    const key = name.toLowerCase();
    if (['cpu', 'motherboard', 'ram', 'ssd', 'case'].includes(key)) return false;
    if (['hdd', 'fan'].includes(key)) return true;
    if (key === 'gpu') return !!selectedComponents.cpu?.integrated_graphics;
    if (key === 'cooler') return !!selectedComponents.cpu?.cooler_included;
    if (key === 'psu') return !!selectedComponents.case?.psu_included;
    return false;
  };
  const isOptional = resolveOptional();
  const includedInCase = name.toLowerCase() === 'psu' && !!selectedComponents.case?.psu_included;
  const [popup, setPopup] = useState(null);

  const handleAddComponent = () => {
    setCurrentCompToAdd(name);
    setFilters({});
    setSearch('');
    setSort('');
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
    <div className="w-full xl:w-80 max-h-120 xl:h-120 h-80 border flex flex-col border-border shadow hover:bg-background transition relative">
      <>
        {component ? (
          <>
            <div className="flex flex-row xl:flex-col gap-2 p-2">
              <div className="w-40 h-40 xl:w-full xl:h-40 bg-surface shrink-0 xl:my-1 flex items-center justify-center overflow-hidden">
                {component.image_url && (
                  <img
                    src={component.image_url}
                    alt={component.name}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              <div className="relative group min-w-0">
                <h3 className="text-xl text-muted">{displayName}</h3>
                <h2 className="text-text font-semibold text-3xl xl:line-clamp-2 line-clamp-3">
                  {component.name}
                </h2>
                <span className="text-muted text-sm">
                  {t('componentCard.startingFrom', {
                    price: formatPrice(getCheapestPrice(component)),
                  })}
                </span>
                <div className="absolute left-0 mb-1 hidden group-hover:block bg-primary text-white text-xs p-1 whitespace-nowrap z-10">
                  {component.name}
                </div>
              </div>
            </div>

            <span className="text-muted text-sm font-medium pt-2 px-2">
              {t('componentCard.stores')}
            </span>
            <div className="pb-2 px-2 flex flex-col gap-1">
              {(() => {
                const sorted = [...listings].sort(
                  (a, b) => parseFloat(a.price ?? Infinity) - parseFloat(b.price ?? Infinity),
                );
                const cheapest = sorted[0];
                const remaining = sorted.length - 1;

                if (!cheapest) return null;

                return (
                  <>
                    <a
                      href={cheapest.url}
                      target="_blank"
                      className="grid grid-cols-3 gap-1 text-sm border border-border bg-surface p-1 hover:bg-secondary-light transition cursor-pointer"
                    >
                      <span className="text-text font-medium truncate">
                        {cheapest.source ? capitalize(cheapest.source) : '-'}
                      </span>
                      <span className="text-muted">€{formatPrice(cheapest.price)}</span>
                      <span className="text-muted truncate">
                        {cheapest.stock_status === 'in_stock' ||
                        cheapest.stock_status === 'orderable'
                          ? t('componentCard.inStock')
                          : t('componentCard.outOfStock')}
                      </span>
                    </a>

                    {remaining > 0 && (
                      <button
                        onClick={() => setViewingComponent({ component, name })}
                        className="text-info text-sm text-left hover:underline cursor-pointer"
                      >
                        {t('componentCard.moreStores', { count: remaining })}
                      </button>
                    )}
                  </>
                );
              })()}
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
              {includedInCase && (
                <div className="bg-muted/10 absolute w-full h-full pointer-events-none border border-muted/20"></div>
              )}
              {includedInCase ? (
                <span className="absolute top-2 left-2 text-xs text-muted">
                  {t('addComponent.includedInCase')}
                </span>
              ) : (
                !isOptional && (
                  <span className="absolute top-2 left-2 text-danger text-lg leading-none">*</span>
                )
              )}
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
          className="absolute top-0 right-0 m-2 text-muted hover:text-text transition"
          onMouseEnter={handlePopup}
          onMouseLeave={() => setPopup(null)}
        >
          <InfoIcon />
        </div>
        {popup && <ComponentPopup {...popup} isOptional={isOptional} />}
      </>
    </div>
  );
};

export default ComponentCard;
