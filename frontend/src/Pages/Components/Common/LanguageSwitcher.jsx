import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'lv', label: 'LV' },
];

const LanguageSwitcher = ({ className = '' }) => {
  const { i18n } = useTranslation();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          className={`px-2 py-1 text-xs font-semibold transition cursor-pointer ${
            i18n.resolvedLanguage === code ? 'bg-primary text-white' : 'text-text hover:bg-surface'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
