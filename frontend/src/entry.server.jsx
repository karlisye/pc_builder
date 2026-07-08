import { PassThrough } from 'node:stream';
import { createReadableStreamFromReadable } from '@react-router/node';
import { ServerRouter } from 'react-router';
import { renderToPipeableStream } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import { isbot } from 'isbot';
import { createI18n } from './i18n';
import { langFromPathname } from './lib/localePath';

export const streamTimeout = 5_000;

export default function handleRequest(request, responseStatusCode, responseHeaders, routerContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get('user-agent');
    // Bots get the fully rendered document; users get the shell early.
    const readyOption = userAgent && isbot(userAgent) ? 'onAllReady' : 'onShellReady';

    const lang = langFromPathname(new URL(request.url).pathname);
    const i18n = createI18n(lang);

    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={i18n}>
        <ServerRouter context={routerContext} url={request.url} />
      </I18nextProvider>,
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    setTimeout(abort, streamTimeout + 1_000);
  });
}
