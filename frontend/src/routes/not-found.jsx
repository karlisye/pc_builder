import { data } from 'react-router';
import NotFound from '../Pages/NotFound';
import { langFromPathname } from '../lib/localePath';
import { pagesSeo, seoMeta } from '../lib/seoMeta';

// Throwing gives crawlers a real 404 status instead of a soft 200; the
// locale route's ErrorBoundary renders NotFound inside the Layout chrome.
export function loader() {
  throw data(null, { status: 404 });
}

export default NotFound;

export const meta = ({ location }) => {
  const lang = langFromPathname(location.pathname);
  return seoMeta({ lang, path: location.pathname, ...pagesSeo(lang, 'notFound'), noindex: true });
};
