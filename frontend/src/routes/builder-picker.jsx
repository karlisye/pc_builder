import { data } from 'react-router';
import AddComponent from '../Pages/Components/Builder/AddComponent';
import { apiFetch } from '../lib/api.server';
import { EMPTY_SLOTS } from '../lib/buildSlots';
import { langFromParams } from '../lib/localePath';
import { pagesSeo, seoMeta } from '../lib/seoMeta';

const RESERVED_PARAMS = new Set(['page', 'sort', 'search', 'build', 'shared']);

// SSR-only data: the list (with nothing selected) and the filter metadata.
// After hydration TanStack Query owns all fetching, so client-side
// navigations skip the loader entirely.
export async function loader({ params, request }) {
  if (!(params.type in EMPTY_SLOTS)) throw data(null, { status: 404 });

  const lang = langFromParams(params);
  const url = new URL(request.url);

  const query = new URLSearchParams();
  query.set('selected', '{}');
  const filters = {};
  for (const [key, value] of url.searchParams.entries()) {
    if (key === 'build' || key === 'shared') continue;
    query.set(key, value);
    if (!RESERVED_PARAMS.has(key)) filters[key] = value;
  }

  const [list, filterOptions] = await Promise.all([
    apiFetch(`/api/components/${params.type}?${query}`, { lang }),
    apiFetch(`/api/components/${params.type}/filters`, { lang }),
  ]);

  return {
    list,
    filterOptions,
    type: params.type,
    // Mirrors AddComponent's query key so the seed only applies to the exact
    // URL that was server-rendered.
    seedKey: JSON.stringify([
      'components',
      params.type,
      '{}',
      url.searchParams.get('search') ?? '',
      url.searchParams.get('sort') ?? '',
      JSON.stringify(filters),
      Number(url.searchParams.get('page') ?? 1),
    ]),
  };
}

export function clientLoader() {
  return null;
}

export const shouldRevalidate = () => false;

export default AddComponent;

export const meta = ({ params }) => {
  const lang = langFromParams(params);
  const seo = pagesSeo(lang, 'picker')[params.type] ?? pagesSeo(lang, 'builder');
  // Canonical intentionally ignores query params (page/sort/filters) so filter
  // permutations don't index as duplicates.
  return seoMeta({ lang, path: `/builder/components/${params.type}`, ...seo });
};
