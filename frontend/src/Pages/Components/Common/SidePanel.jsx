import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowIcon, CloseIcon } from './Icons';

const SidePanel = ({
  children,
  title = null,
  width = 'lg:w-120.5',
  headerRight = null,
  expanded: expandedProp,
  onExpandedChange,
}) => {
  const { t } = useTranslation('pages');
  const [internalExpanded, setInternalExpanded] = useState(false);
  const expanded = expandedProp ?? internalExpanded;
  const setExpanded = onExpandedChange ?? setInternalExpanded;

  return (
    <>
      <div className="lg:hidden fixed left-0 top-1/2 -translate-y-1/2 transition-transform -translate-x-4 hover:translate-x-0 z-10">
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="bg-primary text-white w-15 px-2 py-8 flex justify-end cursor-pointer hover:bg-primary-light transition"
        >
          <span className="rotate-270">
            <ArrowIcon size={32} />
          </span>
        </button>
      </div>

      <div
        id="side-panel-scroll"
        className={`bg-primary flex flex-col fixed left-0 right-0 bottom-0 top-14 transition-transform lg:static ${width} lg:translate-x-0 overflow-y-auto z-10 pb-6
          ${expanded ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {(title || headerRight) && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 pt-6 px-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {title && (
                <h1 className="flex-1 min-w-0 text-4xl font-semibold text-white wrap-break-word">
                  {title}
                </h1>
              )}

              <button
                className="w-10 h-10 shrink-0 lg:hidden text-secondary-light hover:cursor-pointer bg-primary hover:bg-primary-light transition p-2"
                onClick={() => setExpanded(false)}
              >
                <CloseIcon />
              </button>
            </div>

            {headerRight && (
              <div className="w-full sm:w-auto sm:ml-auto flex items-center gap-2">
                {headerRight}
              </div>
            )}
          </div>
        )}

        <div className="mt-4 px-4 flex flex-col flex-1">{children}</div>

        <div className="mt-auto pt-6 lg:hidden">
          <div className="p-4 border-t border-primary-light flex">
            <h2 className="text-6xl p-2 font-bold text-surface border border-secondary-light">
              {t('components.sidePanel.brand')}
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidePanel;
