import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useConsent } from '../../../Contexts/ConsentContext';
import { initAnalytics, disableAnalytics, trackPageview } from '../../../lib/analytics';

const AnalyticsTracker = () => {
  const { consent } = useConsent();
  const location = useLocation();
  const granted = consent?.analytics === true;

  // consent stays undefined during SSR/hydration, so neither branch runs
  // until the client-only localStorage check resolves.
  useEffect(() => {
    if (consent === undefined) return;
    if (granted) {
      initAnalytics();
    } else {
      disableAnalytics();
    }
  }, [consent, granted]);

  useEffect(() => {
    if (!granted) return;
    trackPageview(location.pathname + location.search, document.title);
  }, [granted, location.pathname, location.search]);

  return null;
};

export default AnalyticsTracker;
