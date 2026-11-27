import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, getBase64Target } from '../utils.js'

// PRWeb release click tracker (www.prweb.net/Redirect.aspx?id=<base64>). The id param is a
// base64-encoded target URL.
export const unwrapPrweb: UrlUnwrapper = createUnwrapper({
  hosts: 'www.prweb.net',
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/Redirect.aspx')) {
      return
    }

    return getBase64Target(url, 'id')
  },
})
