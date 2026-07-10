import Privacy from '../Pages/Privacy';
import { langFromParams } from '../lib/localePath';
import { pagesSeo, seoMeta } from '../lib/seoMeta';

export default function PrivacyRoute() {
  return <Privacy />;
}

export const meta = ({ params }) => {
  const lang = langFromParams(params);
  return seoMeta({ lang, path: '/privacy', ...pagesSeo(lang, 'privacy') });
};
