import { decodeBase64Url } from 'trousse'
import { createQueryUnwrapper } from '../utils.js'
import { hosts as bingHosts } from './bing.js'

// Bing Ads click redirect (www.bing.com/{aclk,aclick}?u=<base64 of the percent-encoded target>).
// Opt-in: an ad click pays the publisher who showed the ad, and unwrapping removes that payment,
// the same cost as an affiliate wrapper.
export const unwrapBingAds = createQueryUnwrapper({
  hosts: bingHosts,
  path: ['/aclk', '/aclick'],
  params: ['u'],
  decode: decodeBase64Url,
})
