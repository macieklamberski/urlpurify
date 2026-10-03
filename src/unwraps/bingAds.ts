import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeBase64Url } from '../utils.js'

const bingHostRegex = /(?:^|\.)bing\.(?:com|[a-z]{2,3}(?:\.[a-z]{2,3})?)$/
const adPaths = ['/aclk', '/aclick']

// Bing Ads click redirect (www.bing.com/{aclk,aclick}?u=<base64 of the percent-encoded target>).
// Not included in defaultUnwrappers: an ad click pays the publisher who showed the ad, and
// unwrapping removes that payment, the same cost as an affiliate wrapper.
export const unwrapBingAds: UrlUnwrapper = (url) => {
  if (!bingHostRegex.test(url.hostname) || !adPaths.includes(url.pathname)) {
    return
  }

  const value = url.searchParams.get('u')

  if (!value) {
    return
  }

  const decoded = decodeBase64Url(value) ?? ''

  try {
    const target = decodeURIComponent(decoded)

    if (isHttpUrl(target)) {
      return target
    }
  } catch {}
}
