import Legal from '../Pages/Legal';
import { langFromParams } from '../lib/localePath';
import { pagesSeo, seoMeta } from '../lib/seoMeta';

export default function ContactRoute() {
  return <Legal doc="contact" />;
}

export const meta = ({ params }) => {
  const lang = langFromParams(params);
  return seoMeta({ lang, path: '/contact', ...pagesSeo(lang, 'contact') });
};
