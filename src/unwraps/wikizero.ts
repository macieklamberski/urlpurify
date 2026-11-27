import { decodeBase64Url, isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, getBase64Target } from '../utils.js'

const hosts = [
  'www.wikizero.biz',
  'www.wikizero.net',
  'www.wikizeroo.com',
  'www.wikizeroo.net',
  'www.wikizeroo.org',
]

// WikiZero Wikipedia mirror proxy (www.wikizero.biz/index.php?q=<base64url>). The q param is a
// base64url-encoded Wikipedia URL without padding. Opt-in: the mirror serves Wikipedia where the
// reader may not reach it directly.
export const unwrapWikizero: UrlUnwrapper = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/index.php')) {
      return
    }

    return getBase64Target(url, 'q', decodeBase64Url)
  },
})
