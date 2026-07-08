import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enLayout from './locales/en/layout.json';
import enAuth from './locales/en/auth.json';
import enBuilder from './locales/en/builder.json';
import enProfile from './locales/en/profile.json';
import enPages from './locales/en/pages.json';

import lvCommon from './locales/lv/common.json';
import lvLayout from './locales/lv/layout.json';
import lvAuth from './locales/lv/auth.json';
import lvBuilder from './locales/lv/builder.json';
import lvProfile from './locales/lv/profile.json';
import lvPages from './locales/lv/pages.json';

const resources = {
  en: {
    common: enCommon,
    layout: enLayout,
    auth: enAuth,
    builder: enBuilder,
    profile: enProfile,
    pages: enPages,
  },
  lv: {
    common: lvCommon,
    layout: lvLayout,
    auth: lvAuth,
    builder: lvBuilder,
    profile: lvProfile,
    pages: lvPages,
  },
};

// One instance per request on the server, one per page load on the client.
// The locale comes from the URL (/en prefix) — no detector, no localStorage.
export function createI18n(lng) {
  const i18n = createInstance();
  i18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: 'lv',
    supportedLngs: ['en', 'lv'],
    defaultNS: 'common',
    ns: ['common', 'layout', 'auth', 'builder', 'profile', 'pages'],
    interpolation: {
      escapeValue: false,
    },
  });
  return i18n;
}
