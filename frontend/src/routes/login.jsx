import Login from '../Pages/Auth/Login';
import { GuestRoute } from '../Contexts/AuthContext';
import { langFromParams } from '../lib/localePath';
import { pagesSeo, seoMeta } from '../lib/seoMeta';

export default function LoginRoute() {
  return (
    <GuestRoute>
      <Login />
    </GuestRoute>
  );
}

export const meta = ({ params }) => {
  const lang = langFromParams(params);
  return seoMeta({ lang, path: '/login', ...pagesSeo(lang, 'login'), noindex: true });
};
