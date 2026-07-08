import enCommon from '../locales/en/common.json';
import lvCommon from '../locales/lv/common.json';
import { langFromParams } from '../lib/localePath';
import { seoMeta } from '../lib/seoMeta';

export { default } from '../Pages/EmailVerified';

export const meta = ({ params }) => {
  const lang = langFromParams(params);
  const common = lang === 'en' ? enCommon : lvCommon;
  return seoMeta({
    lang,
    path: '/email-verified',
    title: common.verifyEmail.verifiedTitle,
    noindex: true,
  });
};
