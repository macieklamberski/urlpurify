import { decodeBase64Url, decodePercent } from 'trousse'
import { createQueryUnwrapper } from '../utils.js'
import { hosts as bingHosts } from './bing.js'

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
export const unwrapBingAds = createQueryUnwrapper({
  hosts: bingHosts,
  path: ['/aclk', '/aclick'],
  params: ['u'],
  decode: decodeTarget,
})
