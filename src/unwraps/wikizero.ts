import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor, decodeBase64Url } from '../utils.js'

const baseExtractor = createParamExtractor({
  hosts: [
    'www.wikizero.biz',
    'www.wikizero.net',
    'www.wikizeroo.com',
    'www.wikizeroo.net',
    'www.wikizeroo.org',
  ],
  path: '/index.php',
  params: ['q'],
})

// WikiZero Wikipedia mirror proxy (www.wikizero.biz/index.php?q=<base64url>). The q param is a
// base64url-encoded Wikipedia URL without padding. Opt-in: the mirror serves Wikipedia where the
// reader may not reach it directly.
export const unwrapWikizero: UrlUnwrapper = (url) => {
  const raw = baseExtractor(url)

  if (!raw) {
    return
  }

  const decoded = decodeBase64Url(raw)

  if (decoded && isHttpUrl(decoded)) {
    return decoded
  }
}
