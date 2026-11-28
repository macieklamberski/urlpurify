import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const deepLinkPathRegex = /^\/deep_link\/\d+(?:\/\d+)?$/i

const extractDeepLink = createQueryUnwrapper({
  hosts: 'go.isclix.com',
  params: ['url'],
})

const extractAffiliateLink = createQueryUnwrapper({
  hosts: ['invol.co', 'www.invol.co'],
  path: '/aff_m',
  params: ['url'],
})

// Involve Asia affiliate deep link (go.isclix.com/deep_link/<id>[/<id>]?url=<target>, and
// invol.co/aff_m?offer_id=<id>&aff_id=<id>&url=<target>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapInvolveAsia = createUnwrapper({
  hosts: ['go.isclix.com', 'invol.co', 'www.invol.co'],
  unwrap: (url) => {
    if (deepLinkPathRegex.test(url.pathname)) {
      return extractDeepLink(url)
    }

    return extractAffiliateLink(url)
  },
})
