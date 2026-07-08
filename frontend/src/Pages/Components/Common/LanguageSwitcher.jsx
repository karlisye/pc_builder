import { useLocation, useNavigate } from 'react-router';
import { langFromPathname, localePath, stripLocale } from '../../../lib/localePath';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'lv', label: 'LV' },
];

// Switching language = navigating to the same URL under the other locale
// prefix; routes/locale.jsx syncs i18next to the URL.
const LanguageSwitcher = ({ className = '' }) => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const current = langFromPathname(pathname);

  const switchTo = (code) => {
    if (code === current) return;
    navigate(localePath(code, stripLocale(pathname)) + search);
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchTo(code)}
          className={`px-2 py-1 text-xs font-semibold transition cursor-pointer ${
            current === code ? 'bg-primary text-white' : 'text-text hover:bg-surface'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
