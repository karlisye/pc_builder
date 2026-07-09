import { index, layout, route } from '@react-router/dev/routes';

export default [
  route(':lang?', 'routes/locale.jsx', [
    layout('routes/layout.jsx', [
      index('routes/home.jsx'),
      route('guide', 'routes/guide.jsx'),
      route('email-verified', 'routes/email-verified.jsx'),
      route('login', 'routes/login.jsx'),
      route('register', 'routes/register.jsx'),
      route('builds', 'routes/builds.jsx'),
      route('profile', 'routes/profile.jsx'),
      route('builder', 'routes/builder.jsx', [
        index('routes/builder-index.jsx'),
        route('components/:type', 'routes/builder-picker.jsx'),
        route('components/:type/:code', 'routes/builder-detail.jsx'),
      ]),
      route('*', 'routes/not-found.jsx'),
    ]),
  ]),
];
