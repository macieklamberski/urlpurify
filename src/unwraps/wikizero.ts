import { decodeBase64Url } from 'trousse'
import { createQueryUnwrapper } from '../utils.js'

// WikiZero Wikipedia mirror proxy (www.wikizero.biz/index.php?q=<base64url>). The q param is a
// base64url-encoded Wikipedia URL without padding. Opt-in: the mirror serves Wikipedia where the
// reader may not reach it directly.
export const unwrapWikizero = createQueryUnwrapper({
  hosts: [
    'www.wikizero.biz',
    'wikizero.biz',
    'www.wikizero.net',
    'wikizero.net',
    'www.wikizeroo.com',
    'wikizeroo.com',
    'www.wikizeroo.net',
    'wikizeroo.net',
    'www.wikizeroo.org',
    'wikizeroo.org',
  ],
  path: '/index.php',
  params: ['q'],
  decode: decodeBase64Url,
})
