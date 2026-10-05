import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const deepLinkPathRegex = /^\/deep_link\/\d+(?:\/\d+)?$/

const extractDeepLink = createParamExtractor({
  hosts: 'go.isclix.com',
  params: ['url'],
})

const extractAffiliateLink = createParamExtractor({
  hosts: 'invol.co',
  path: '/aff_m',
  params: ['url'],
})

// Involve Asia affiliate deep link (go.isclix.com/deep_link/<id>[/<id>]?url=<target>, and
// invol.co/aff_m?offer_id=<id>&aff_id=<id>&url=<target>). Not included in defaultUnwrappers:
// unwrapping drops the publisher's commission.
export const unwrapInvolveAsia: UrlUnwrapper = (url) => {
  if (deepLinkPathRegex.test(url.pathname)) {
    return extractDeepLink(url)
  }

  return extractAffiliateLink(url)
}
