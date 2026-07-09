import Guide from '../Pages/Guide';
import enPages from '../locales/en/pages.json';
import lvPages from '../locales/lv/pages.json';
import { langFromParams } from '../lib/localePath';
import { pagesSeo, seoMeta } from '../lib/seoMeta';

export default function GuideAutoRoute() {
  return <Guide section="auto" />;
}

export const meta = ({ params }) => {
  const lang = langFromParams(params);
  const label = (lang === 'en' ? enPages : lvPages).guide.sections.auto;
  return seoMeta({
    lang,
    path: '/guide/auto',
    title: `${label} — PC Builder`,
    description: pagesSeo(lang, 'guide').description,
  });
};
