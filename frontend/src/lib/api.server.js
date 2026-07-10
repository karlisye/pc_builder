import { data } from 'react-router';

// Server-side Laravel access; relative /api URLs only work in the browser.
// No cookies are forwarded — everything SSR'd here is public by design.
const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:8000';

export async function apiFetch(path, { lang = 'lv' } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'X-Locale': lang,
      Accept: 'application/json',
    },
  });

  if (!res.ok) throw data(null, { status: res.status });

  return res.json();
}
