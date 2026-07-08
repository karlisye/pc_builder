import { langFromParams } from '../lib/localePath';
import { pagesSeo, seoMeta } from '../lib/seoMeta';

export { default } from '../Pages/Guide';

export const meta = ({ params }) => {
  const lang = langFromParams(params);
  return seoMeta({ lang, path: '/guide', ...pagesSeo(lang, 'guide') });
};
