import { decodeBase64Url, decodePercent, isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamValues } from '../utils.js'
import { hosts as bingHosts } from './bing.js'

const adPaths = ['/aclk', '/aclick']

// Bing Ads click redirect (www.bing.com/{aclk,aclick}?u=<base64 of the percent-encoded target>).
// Not included in defaultUnwrappers: an ad click pays the publisher who showed the ad, and
// unwrapping removes that payment, the same cost as an affiliate wrapper.
export const unwrapBingAds: UrlUnwrapper = (url) => {
  if (!isHostOf(url, bingHosts) || !adPaths.includes(url.pathname)) {
    return
  }

  const value = getParamValues(url, 'u').at(0)

  if (!value) {
    return
  }

  const decoded = decodeBase64Url(value) ?? ''

  const target = decodePercent(decoded)

  if (isHttpUrl(target)) {
    return target
  }
}
