import React from 'react';
import { useTranslation } from 'react-i18next';
import ComponentInfo from '../Common/ComponentInfo';
import { CloseIcon } from '../Common/Icons';

const DetailPanel = ({ component, slot, setExpandedSlot }) => {
  const { t } = useTranslation(['pages', 'common']);
  const slotKey = slot === 'pc_case' ? 'case' : slot;
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="border border-border bg-background p-4 relative">
      <div className="mb-6 mr-14">
        <span className="text-muted block">
          {t(`common:components.${slotKey}`, { defaultValue: slot })}
        </span>
        <span className="text-text font-semibold text-xl block">{component.name}</span>
      </div>

      <div className="flex flex-col xl:flex-row gap-4">
        <div className="min-w-0 flex-1">
          <ComponentInfo component={component} />
        </div>

        {component.listings?.length > 0 && (
          <div className="w-full xl:w-64 xl:shrink-0 border-t xl:border-t-0 xl:border-l pt-4 xl:pt-0 xl:pl-4 border-border">
            <span className="text-muted text-sm">
              {t('components.saved.detailPanel.availability')}
            </span>
            <div className="flex flex-col gap-2 mt-2">
              {component.listings.map((listing) => (
                <a
                  key={listing.source}
                  href={listing.url}
                  target="_blank"
                  className="bg-surface p-3 hover:bg-success/50 transition cursor-pointer text-sm flex justify-between items-center gap-4"
                >
                  <span className="text-muted truncate">{capitalize(listing.source)}</span>
                  <span className="text-text font-semibold whitespace-nowrap">
                    €{listing.price} ({listing.stock_quantity})
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setExpandedSlot(null)}
        className="w-10 h-10 text-muted hover:cursor-pointer bg-surface hover:bg-secondary-light transition p-2 absolute top-4 right-4"
      >
        <CloseIcon />
      </button>
    </div>
  );
};

export default DetailPanel;
