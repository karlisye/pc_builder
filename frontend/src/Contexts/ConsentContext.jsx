import { createContext, useContext, useEffect, useState } from 'react';
import { getStoredConsent, storeConsent } from '../lib/consentPreferences';

const ConsentContext = createContext(null);

export const ConsentProvider = ({ children }) => {
  // undefined until the client-only localStorage check runs, so the banner
  // never flashes/mismatches during SSR hydration.
  const [consent, setConsent] = useState(undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    setConsent(stored);
    setOpen(!stored);
  }, []);

  const decide = (categories) => {
    setConsent(storeConsent(categories));
    setOpen(false);
  };

  return (
    <ConsentContext.Provider
      value={{
        consent,
        open,
        acceptAll: () => decide({ analytics: true }),
        rejectNonEssential: () => decide({ analytics: false }),
        savePreferences: (categories) => decide(categories),
        openSettings: () => setOpen(true),
        closeSettings: () => setOpen(false),
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
};

export const useConsent = () => useContext(ConsentContext);
