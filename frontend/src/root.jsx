import { useState } from 'react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useParams,
  useRouteError,
} from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './Contexts/AuthContext';
import { ToastProvider } from './Contexts/ToastContext';
import { ConsentProvider } from './Contexts/ConsentContext';
import ToastContainer from './Pages/Components/Common/ToastContainer';
import ConsentBanner from './Pages/Components/Common/ConsentBanner';
import AnalyticsTracker from './Pages/Components/Common/AnalyticsTracker';
import NotFound from './Pages/NotFound';
import { langFromParams } from './lib/localePath';

export const links = () => [{ rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }];

export function Layout({ children }) {
  const params = useParams();
  return (
    <html lang={langFromParams(params)}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="app">{children}</div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  // Per-render client so SSR requests never share cache/state.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <ToastContainer />
          <ConsentProvider>
            <ConsentBanner />
            <AnalyticsTracker />
            <Outlet />
          </ConsentProvider>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFound />;
  }

  return (
    <div className="bg-primary h-full min-h-screen flex items-center justify-center">
      <p className="text-white text-xl">Something went wrong.</p>
    </div>
  );
}
