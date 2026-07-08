import { useParams } from 'react-router';

export const langFromParams = (params) => (params.lang === 'en' ? 'en' : 'lv');

export const langFromPathname = (pathname) =>
  pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'lv';

export const localePath = (lang, path) => {
  if (lang !== 'en') return path;
  return path === '/' ? '/en' : `/en${path}`;
};

export const stripLocale = (pathname) => {
  if (pathname === '/en') return '/';
  return pathname.startsWith('/en/') ? pathname.slice(3) : pathname;
};

export function useLocalePath() {
  const params = useParams();
  const lang = langFromParams(params);
  return (path) => localePath(lang, path);
}
