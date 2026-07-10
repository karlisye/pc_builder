import Guide from '../Pages/Guide';
import { langFromParams } from '../lib/localePath';
import { pagesSeo, seoMeta } from '../lib/seoMeta';

export default function GuideRoute() {
  return <Guide section="builder" />;
}

export const meta = ({ params }) => {
  const lang = langFromParams(params);
  return seoMeta({ lang, path: '/guide', ...pagesSeo(lang, 'guide') });
};
