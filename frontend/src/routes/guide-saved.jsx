import Guide from '../Pages/Guide';
import enPages from '../locales/en/pages.json';
import lvPages from '../locales/lv/pages.json';
import { langFromParams } from '../lib/localePath';
import { pagesSeo, seoMeta } from '../lib/seoMeta';

export default function GuideSavedRoute() {
  return <Guide section="saved" />;
}

export const meta = ({ params }) => {
  const lang = langFromParams(params);
  const label = (lang === 'en' ? enPages : lvPages).guide.sections.saved;
  return seoMeta({
    lang,
    path: '/guide/saved',
    title: `${label} — DatorBuve`,
    description: pagesSeo(lang, 'guide').description,
  });
};
