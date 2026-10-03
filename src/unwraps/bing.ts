import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeBase64Url } from '../utils.js'

const bingHostRegex = /^(?:(?:www|www4|cn|ssl|global)\.)?bing\.com$/
const bingPrefixRegex = /^a\d/

// Bing redirects, in two shapes:
// - search result (www.bing.com/ck/a?u=a1<base64url>). The `u` parameter is a base64url-encoded
//   URL prefixed by a two-byte version marker (`a1`, `a2`, ...).
// - news click (www.bing.com/news/apiclick.aspx?url=<target>), the item link in Bing News RSS.
export const unwrapBing: UrlUnwrapper = (url) => {
  if (!bingHostRegex.test(url.hostname)) {
    return
  }

  if (url.pathname === '/news/apiclick.aspx') {
    const target = url.searchParams.get('url')

    // A target percent-encoded in a legacy charset decodes to U+FFFD, a broken url.
    if (!target || target.includes('\uFFFD') || !isHttpUrl(target)) {
      return
    }

    return target
  }

  if (url.pathname !== '/ck/a') {
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
