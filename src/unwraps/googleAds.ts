import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'
import { googleHostRegex } from './google.js'

const extractors = [
  createParamExtractor({ hosts: googleHostRegex, path: '/aclk', params: ['adurl'] }),
  createParamExtractor({ hosts: 'syndicatedsearch.goog', path: '/aclk', params: ['adurl'] }),
  createParamExtractor({
    hosts: 'www.googleadservices.com',
    path: '/pagead/aclk',
    params: ['adurl'],
  }),
  createParamExtractor({
    hosts: ['adclick.g.doubleclick.net', 'googleads.g.doubleclick.net'],
    path: '/aclk',
    params: ['adurl'],
  }),
  createParamExtractor({
    hosts: ['ad.doubleclick.net', 'adclick.g.doubleclick.net', 'googleads.g.doubleclick.net'],
    path: '/pcs/click',
    params: ['adurl'],
  }),
]

// Google Ads click redirect (google.<TLD>/aclk?adurl=<target>,
// syndicatedsearch.goog/aclk?adurl=<target>,
// www.googleadservices.com/pagead/aclk?adurl=<target>,
// {adclick,googleads}.g.doubleclick.net/aclk?adurl=<target>,
// {ad,adclick.g,googleads.g}.doubleclick.net/pcs/click?adurl=<target>).
// Not included in defaultUnwrappers: an ad click pays the publisher who showed the ad, and
// unwrapping removes that payment, the same cost as an affiliate wrapper.
export const unwrapGoogleAds: UrlUnwrapper = (url) => {
  for (const extract of extractors) {
    const target = extract(url)

    if (target) {
      return target
    }
  }
}
