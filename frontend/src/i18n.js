import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enLayout from './locales/en/layout.json';
import enAuth from './locales/en/auth.json';
import enBuilder from './locales/en/builder.json';
import enProfile from './locales/en/profile.json';
import enAdmin from './locales/en/admin.json';
import enPages from './locales/en/pages.json';

import lvCommon from './locales/lv/common.json';
import lvLayout from './locales/lv/layout.json';
import lvAuth from './locales/lv/auth.json';
import lvBuilder from './locales/lv/builder.json';
import lvProfile from './locales/lv/profile.json';
import lvAdmin from './locales/lv/admin.json';
import lvPages from './locales/lv/pages.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        layout: enLayout,
        auth: enAuth,
        builder: enBuilder,
        profile: enProfile,
        admin: enAdmin,
        pages: enPages,
      },
      lv: {
        common: lvCommon,
        layout: lvLayout,
        auth: lvAuth,
        builder: lvBuilder,
        profile: lvProfile,
        admin: lvAdmin,
        pages: lvPages,
      },
    },
    fallbackLng: 'lv',
    supportedLngs: ['en', 'lv'],
    defaultNS: 'common',
    ns: ['common', 'layout', 'auth', 'builder', 'profile', 'admin', 'pages'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language',
    },
  });

export default i18n;
