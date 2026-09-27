import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeBase64Url } from '../utils.js'

const bingHostRegex = /^(?:www\.|cn\.)?bing\.com$/
const bingPrefixRegex = /^a\d/

// Bing search-result redirect (www.bing.com/ck/a?u=a1<base64url>). The `u`
// parameter is a base64url-encoded URL prefixed by a two-byte version marker
// (`a1`, `a2`, ...).
export const unwrapBing: UrlUnwrapper = (url) => {
  if (!bingHostRegex.test(url.hostname) || url.pathname !== '/ck/a') {
    return
  }

  const value = url.searchParams.get('u')
  if (!value || !bingPrefixRegex.test(value)) {
    return
  }

  const decoded = decodeBase64Url(value.slice(2))

  if (!decoded || !isHttpUrl(decoded)) {
    return
  }

  return decoded
}
