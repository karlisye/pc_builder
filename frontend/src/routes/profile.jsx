import AccountSettings from '../Pages/Components/Profile/AccountSettings';
import { AuthRoute } from '../Contexts/AuthContext';
import enProfile from '../locales/en/profile.json';
import lvProfile from '../locales/lv/profile.json';
import { langFromParams } from '../lib/localePath';
import { seoMeta } from '../lib/seoMeta';

export default function ProfileRoute() {
  return (
    <AuthRoute>
      <AccountSettings />
    </AuthRoute>
  );
}

export const meta = ({ params }) => {
  const lang = langFromParams(params);
  const profile = lang === 'en' ? enProfile : lvProfile;
  return seoMeta({
    lang,
    path: '/profile',
    title: profile.accountSettings.heading,
    noindex: true,
  });
};
