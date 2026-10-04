import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'
import { googleHostRegex } from './google.js'

const extractors = [
  createParamExtractor({ hosts: googleHostRegex, path: '/aclk', params: ['adurl'] }),
  createParamExtractor({ hosts: googleHostRegex, path: '/pagead/iclk', params: ['adurl'] }),
  createParamExtractor({
    domains: ['syndicatedsearch.goog', 'doubleclick.net'],
    path: '/aclk',
    params: ['adurl'],
  }),
  createParamExtractor({
    domains: 'googleadservices.com',
    path: '/pagead/aclk',
    params: ['adurl'],
  }),
  createParamExtractor({
    domains: ['doubleclick.net', 'googlesyndication.com'],
    path: '/pagead/iclk',
    params: ['adurl'],
  }),
  createParamExtractor({ domains: 'doubleclick.net', path: '/pcs/click', params: ['adurl'] }),
]

// Google Ads click redirect (adurl=<target> on /aclk, /pagead/iclk, /pagead/aclk and /pcs/click) of
// google.<TLD>, syndicatedsearch.goog, googleadservices.com, doubleclick.net and
// googlesyndication.com, each with every subdomain.
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
