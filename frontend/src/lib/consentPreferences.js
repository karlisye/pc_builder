const STORAGE_KEY = 'site-preferences-v1';

export const getStoredConsent = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const storeConsent = (categories) => {
  const value = { necessary: true, ...categories, decidedAt: new Date().toISOString() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  return value;
};

// For gating third-party scripts once they exist, e.g.:
//   if (hasConsent('analytics')) loadGoogleAnalytics();
export const hasConsent = (category) => {
  if (category === 'necessary') return true;
  return !!getStoredConsent()?.[category];
};
