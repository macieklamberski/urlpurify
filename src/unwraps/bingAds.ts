import { decodeBase64Url, decodePercent, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getBase64Target } from '../utils.js'
import { hosts as bingHosts } from './bing.js'

const adPaths = ['/aclk', '/aclick']

const decodeTarget = (value: string): string | undefined => {
  const decoded = decodeBase64Url(value)

  if (!decoded) {
    return
  }

  return decodePercent(decoded)
}

// Bing Ads click redirect (www.bing.com/{aclk,aclick}?u=<base64 of the percent-encoded target>).
// Not included in defaultUnwrappers: an ad click pays the publisher who showed the ad, and
// unwrapping removes that payment, the same cost as an affiliate wrapper.
export const unwrapBingAds: UrlUnwrapper = (url) => {
  if (!isHostOf(url, bingHosts) || !adPaths.includes(url.pathname)) {
    return
  }

  return getBase64Target(url, 'u', decodeTarget)
}
