import './bootstrap';
import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import { I18nextProvider } from 'react-i18next';
import { createI18n } from './i18n';
import { langFromPathname } from './lib/localePath';

const i18n = createI18n(langFromPathname(window.location.pathname));

startTransition(() => {
  hydrateRoot(
    document,
    <I18nextProvider i18n={i18n}>
      <HydratedRouter />
    </I18nextProvider>,
  );
});
