const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let loaded = false;

// gtag.js only recognizes commands pushed as an `arguments` object, not a
// plain array — keep the canonical function form.
function gtag() {
  window.dataLayer.push(arguments);
}

// Only called after the user grants analytics consent — the script, cookies,
// and any hits must not exist before that (see ConsentContext/AnalyticsTracker).
export const initAnalytics = () => {
  if (!GA_ID) return;
  // clear before the loaded check so re-granting consent mid-session re-enables
  window[`ga-disable-${GA_ID}`] = false;
  if (loaded) return;
  loaded = true;

  window.dataLayer = window.dataLayer || [];
  gtag('js', new Date());
  // Pageviews are sent manually per route change (SPA), not on config.
  gtag('config', GA_ID, { send_page_view: false });

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);
};

export const disableAnalytics = () => {
  if (!GA_ID) return;
  window[`ga-disable-${GA_ID}`] = true;
  document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((name) => name === '_ga' || name.startsWith('_ga_'))
    .forEach((name) => {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${window.location.hostname}`;
      document.cookie = `${name}=; Max-Age=0; path=/`;
    });
};

export const trackPageview = (path, title) => {
  if (!loaded || window[`ga-disable-${GA_ID}`]) return;
  gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: title,
  });
};

export const trackEvent = (name, params = {}) => {
  if (!loaded || window[`ga-disable-${GA_ID}`]) return;
  gtag('event', name, params);
};
