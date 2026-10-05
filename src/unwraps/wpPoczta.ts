import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor, decodeBase64 } from '../utils.js'

const baseExtractor = createParamExtractor({
  hosts: 'zasobygwp.pl',
  path: '/redirect',
  params: ['url'],
})

// WP Poczta and o2 webmail dereferrer (zasobygwp.pl/redirect?sig=<sig>&url=<base64>). The url
// param is a base64-encoded target URL.
export const unwrapWpPoczta: UrlUnwrapper = (url) => {
  const raw = baseExtractor(url)

  if (!raw) {
    return
  }

  const decoded = decodeBase64(raw)

  if (decoded && isHttpUrl(decoded)) {
    return decoded
  }
}
