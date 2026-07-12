import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConsent } from '../../../Contexts/ConsentContext';
import { CloseIcon } from './Icons';

const ConsentBanner = () => {
  const { t } = useTranslation('common');
  const { consent, open, acceptAll, rejectNonEssential, savePreferences, closeSettings } =
    useConsent();
  const [customizing, setCustomizing] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(!!consent?.analytics);

  if (!open) return null;

  // A decision already exists (banner was reopened via "Cookie Settings"),
  // so allow closing without forcing a re-decision.
  const canDismiss = !!consent;

  const handleSave = () => {
    savePreferences({ analytics: analyticsEnabled });
    setCustomizing(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary border-t border-secondary p-4 sm:p-6">
      <div className="max-w-347 mx-auto">
        {canDismiss && (
          <button
            onClick={closeSettings}
            className="float-right text-muted hover:text-text transition cursor-pointer"
            aria-label={t('cookieConsent.close')}
          >
            <CloseIcon size={20} />
          </button>
        )}

        <h2 className="text-white font-semibold text-lg mb-1">{t('cookieConsent.title')}</h2>
        <p className="text-background text-sm max-w-3xl mb-4">{t('cookieConsent.description')}</p>

        {customizing && (
          <div className="flex flex-col gap-3 mb-4 max-w-2xl">
            <div className="flex items-start justify-between gap-4 border border-secondary-light p-3">
              <div>
                <p className="text-white font-medium">{t('cookieConsent.necessaryLabel')}</p>
                <p className="text-background text-sm">{t('cookieConsent.necessaryDescription')}</p>
              </div>
              <input type="checkbox" checked disabled className="mt-1 shrink-0" />
            </div>

            <div className="flex items-start justify-between gap-4 border border-secondary-light p-3">
              <div>
                <p className="text-white font-medium">{t('cookieConsent.analyticsLabel')}</p>
                <p className="text-background text-sm">{t('cookieConsent.analyticsDescription')}</p>
              </div>
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                className="mt-1 shrink-0 cursor-pointer"
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 items-center">
          {customizing ? (
            <button
              onClick={handleSave}
              className="bg-secondary-light hover:bg-secondary-light/50 transition cursor-pointer text-text py-2 px-6"
            >
              {t('cookieConsent.savePreferences')}
            </button>
          ) : (
            <>
              <button
                onClick={acceptAll}
                className="bg-secondary-light hover:bg-secondary-light/50 transition cursor-pointer text-text py-2 px-6"
              >
                {t('cookieConsent.acceptAll')}
              </button>
              <button
                onClick={rejectNonEssential}
                className="hover:bg-secondary-light/20 border border-secondary-light transition cursor-pointer text-white py-2 px-6"
              >
                {t('cookieConsent.rejectNonEssential')}
              </button>
              <button
                onClick={() => setCustomizing(true)}
                className="text-info underline hover:no-underline transition cursor-pointer py-2 px-2"
              >
                {t('cookieConsent.customize')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
