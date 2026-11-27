import { decodeBase64Url, isAnyOf, isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getBase64Target, getParamTarget } from '../utils.js'

export const hosts = [
  'bing.com',
  'www.bing.com',
  'www4.bing.com',
  'cn.bing.com',
  'ssl.bing.com',
  'global.bing.com',
  'www.bing.de',
]

const bingPrefixRegex = /^a\d/

const decodeClickValue = (value: string): string | undefined => {
  if (!bingPrefixRegex.test(value)) {
    return
  }

  return decodeBase64Url(value.slice(2))
}

// Bing redirects, in two shapes:
// - search result (www.bing.com/ck/a?u=a1<base64url>). The `u` parameter is a base64url-encoded
//   URL prefixed by a two-byte version marker (`a1`, `a2`, ...).
// - news click (www.bing.com/news/apiclick.aspx?url=<target>), the item link in Bing News RSS.
export const unwrapBing: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts)) {
    return
  }

  if (isAnyOf(url.pathname, '/news/apiclick.aspx')) {
    const target = getParamTarget(url, 'url')

    if (!target || !isHttpUrl(target)) {
      return
    }

    return target
  }

  if (!isAnyOf(url.pathname, '/ck/a')) {
    return
  }

  return getBase64Target(url, 'u', decodeClickValue)
}
