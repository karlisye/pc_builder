import { useEffect, useRef } from 'react';

let scriptPromise;

const loadTurnstile = () => {
  scriptPromise ??= new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve(window.turnstile);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = () => reject(new Error('Failed to load Turnstile'));
    document.head.appendChild(script);
  });
  return scriptPromise;
};

// Renders nothing if VITE_TURNSTILE_SITE_KEY isn't set, so local dev works
// without provisioning real keys.
const Turnstile = ({ onToken, onExpire }) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;

    loadTurnstile().then((turnstile) => {
      if (cancelled || !containerRef.current) return;
      widgetIdRef.current = turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: 'light',
        callback: onToken,
        'expired-callback': onExpire,
      });
    });

    return () => {
      cancelled = true;
      if (widgetIdRef.current != null) {
        window.turnstile?.remove(widgetIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  if (!siteKey) return null;

  return <div ref={containerRef} />;
};

export default Turnstile;
