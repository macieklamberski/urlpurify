import { decodeBase64Url, isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, getBase64Target } from '../utils.js'

// WP Poczta and o2 webmail dereferrer (zasobygwp.pl/redirect?sig=<sig>&url=<base64>). The url
// param is a base64url-encoded target URL.
export const unwrapWpPoczta: UrlUnwrapper = createUnwrapper({
  hosts: 'zasobygwp.pl',
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/redirect')) {
      return
    }

    return getBase64Target(url, 'url', decodeBase64Url)
  },
})
