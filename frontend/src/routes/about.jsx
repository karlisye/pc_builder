import Legal from '../Pages/Legal';
import { langFromParams } from '../lib/localePath';
import { pagesSeo, seoMeta } from '../lib/seoMeta';

export default function AboutRoute() {
  return <Legal doc="about" />;
}

export const meta = ({ params }) => {
  const lang = langFromParams(params);
  return seoMeta({ lang, path: '/about', ...pagesSeo(lang, 'about') });
};
