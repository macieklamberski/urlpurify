import { isAnyOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeBase64Url, getParamTarget } from '../utils.js'

export const bingHosts = [
  'bing.com',
  'www.bing.com',
  'www4.bing.com',
  'cn.bing.com',
  'ssl.bing.com',
  'global.bing.com',
  'www.bing.de',
]
const bingPrefixRegex = /^a\d/

// Bing redirects, in two shapes:
// - search result (www.bing.com/ck/a?u=a1<base64url>). The `u` parameter is a base64url-encoded
//   URL prefixed by a two-byte version marker (`a1`, `a2`, ...).
// - news click (www.bing.com/news/apiclick.aspx?url=<target>), the item link in Bing News RSS.
export const unwrapBing: UrlUnwrapper = (url) => {
  if (!isAnyOf(url.hostname, bingHosts)) {
    return
  }

  if (url.pathname === '/news/apiclick.aspx') {
    const target = getParamTarget(url, 'url')

    if (!target || !isHttpUrl(target)) {
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
