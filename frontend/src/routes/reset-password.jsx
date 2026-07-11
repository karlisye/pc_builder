import ResetPassword from '../Pages/Auth/ResetPassword';
import { GuestRoute } from '../Contexts/AuthContext';
import { langFromParams } from '../lib/localePath';
import { pagesSeo, seoMeta } from '../lib/seoMeta';

export default function ResetPasswordRoute() {
  return (
    <GuestRoute>
      <ResetPassword />
    </GuestRoute>
  );
}

export const meta = ({ params }) => {
  const lang = langFromParams(params);
  return seoMeta({ lang, path: '/reset-password', ...pagesSeo(lang, 'resetPassword'), noindex: true });
};
