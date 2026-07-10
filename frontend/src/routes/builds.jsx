import SavedBuilds from '../Pages/SavedBuilds';
import { AuthRoute } from '../Contexts/AuthContext';
import { langFromParams } from '../lib/localePath';
import { pagesSeo, seoMeta } from '../lib/seoMeta';

export default function BuildsRoute() {
  return (
    <AuthRoute>
      <SavedBuilds />
    </AuthRoute>
  );
}

export const meta = ({ params }) => {
  const lang = langFromParams(params);
  return seoMeta({ lang, path: '/builds', ...pagesSeo(lang, 'savedBuilds'), noindex: true });
};
