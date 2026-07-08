import Register from '../Pages/Auth/Register';
import { GuestRoute } from '../Contexts/AuthContext';
import { langFromParams } from '../lib/localePath';
import { pagesSeo, seoMeta } from '../lib/seoMeta';

export default function RegisterRoute() {
  return (
    <GuestRoute>
      <Register />
    </GuestRoute>
  );
}

export const meta = ({ params }) => {
  const lang = langFromParams(params);
  return seoMeta({ lang, path: '/register', ...pagesSeo(lang, 'register'), noindex: true });
};
