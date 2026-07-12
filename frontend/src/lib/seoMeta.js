import enPages from '../locales/en/pages.json';
import lvPages from '../locales/lv/pages.json';
import { localePath } from './localePath';

const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://datorbuve.lv';

export const pagesSeo = (lang, key) => (lang === 'en' ? enPages : lvPages).seo[key] ?? {};

// Standard meta descriptor set for a route. `path` is the locale-less pathname
// ('/builder/components/cpu'); canonical/hrefLang URLs are derived from it.
export function seoMeta({ lang, path, title, description, noindex = false, image }) {
  const url = `${SITE_URL}${localePath(lang, path)}`;

  const tags = [
    { title },
    ...(description ? [{ name: 'description', content: description }] : []),
    { property: 'og:title', content: title },
    ...(description ? [{ property: 'og:description', content: description }] : []),
  ];

  if (noindex) {
    tags.push({ name: 'robots', content: 'noindex, nofollow' });
    return tags;
  }

  tags.push(
    { tagName: 'link', rel: 'canonical', href: url },
    { tagName: 'link', rel: 'alternate', hrefLang: 'lv', href: `${SITE_URL}${path}` },
    {
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'en',
      href: `${SITE_URL}${localePath('en', path)}`,
    },
    { tagName: 'link', rel: 'alternate', hrefLang: 'x-default', href: `${SITE_URL}${path}` },
    { property: 'og:url', content: url },
  );

  if (image) tags.push({ property: 'og:image', content: image });

  return tags;
}
