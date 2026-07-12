import Legal from '../Pages/Legal';
import { langFromParams } from '../lib/localePath';
import { pagesSeo, seoMeta } from '../lib/seoMeta';

export default function TermsRoute() {
  return <Legal doc="terms" />;
}

export const meta = ({ params }) => {
  const lang = langFromParams(params);
  return seoMeta({ lang, path: '/terms', ...pagesSeo(lang, 'terms') });
};
