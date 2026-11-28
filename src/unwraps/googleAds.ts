import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'
import { googleHostRegex } from './google.js'

const extractors = [
  createQueryUnwrapper({ hosts: googleHostRegex, path: '/aclk', params: ['adurl'] }),
  createQueryUnwrapper({ hosts: googleHostRegex, path: '/pagead/iclk', params: ['adurl'] }),
  createQueryUnwrapper({ hosts: 'syndicatedsearch.goog', path: '/aclk', params: ['adurl'] }),
  createQueryUnwrapper({
    hosts: ['www.googleadservices.com', 'googleadservices.com'],
    path: '/pagead/aclk',
    params: ['adurl'],
  }),
  createQueryUnwrapper({
    hosts: ['adclick.g.doubleclick.net', 'googleads.g.doubleclick.net'],
    path: '/aclk',
    params: ['adurl'],
  }),
  createQueryUnwrapper({
    hosts: ['googleads.g.doubleclick.net', 'pagead2.googlesyndication.com'],
    path: '/pagead/iclk',
    params: ['adurl'],
  }),
  createQueryUnwrapper({
    hosts: ['ad.doubleclick.net', 'adclick.g.doubleclick.net', 'googleads.g.doubleclick.net'],
    path: '/pcs/click',
    params: ['adurl'],
  }),
]

// Google Ads click redirect (google.<TLD>/aclk?adurl=<target>,
// {google.<TLD>,googleads.g.doubleclick.net}/pagead/iclk?adurl=<target>,
// pagead2.googlesyndication.com/pagead/iclk?adurl=<target>,
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
