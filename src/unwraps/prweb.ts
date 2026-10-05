import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor, decodeBase64 } from '../utils.js'

const baseExtractor = createParamExtractor({
  hosts: 'www.prweb.net',
  path: '/Redirect.aspx',
  params: ['id'],
})

// PRWeb release click tracker (www.prweb.net/Redirect.aspx?id=<base64>). The id param is a
// base64-encoded target URL.
export const unwrapPrweb: UrlUnwrapper = (url) => {
  const raw = baseExtractor(url)

  if (!raw) {
    return
  }

  const decoded = decodeBase64(raw)

  if (decoded && isHttpUrl(decoded)) {
    return decoded
  }
}
