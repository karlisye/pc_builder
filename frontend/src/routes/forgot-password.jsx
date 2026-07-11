import ForgotPassword from '../Pages/Auth/ForgotPassword';
import { GuestRoute } from '../Contexts/AuthContext';
import { langFromParams } from '../lib/localePath';
import { pagesSeo, seoMeta } from '../lib/seoMeta';

export default function ForgotPasswordRoute() {
  return (
    <GuestRoute>
      <ForgotPassword />
    </GuestRoute>
  );
}

export const meta = ({ params }) => {
  const lang = langFromParams(params);
  return seoMeta({ lang, path: '/forgot-password', ...pagesSeo(lang, 'forgotPassword'), noindex: true });
};
