import { useEffect } from 'react';
import { data, Outlet, redirect, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { langFromParams } from '../lib/localePath';

// LV is the unprefixed default; /lv/* permanently redirects to it and any
// other prefix that isn't a known child route 404s here.
export function loader({ params, request }) {
  const { lang } = params;
  if (lang === 'lv') {
    const url = new URL(request.url);
    throw redirect((url.pathname.replace(/^\/lv(?=\/|$)/, '') || '/') + url.search, 301);
  }
  if (lang !== undefined && lang !== 'en') throw data(null, { status: 404 });
  return null;
}

export default function Locale() {
  const params = useParams();
  const lang = langFromParams(params);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== lang) i18n.changeLanguage(lang);
  }, [lang, i18n]);

  return <Outlet />;
}
