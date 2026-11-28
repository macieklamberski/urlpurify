import { resolvePathTarget } from '../pathTarget.js'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const domains = ['partner-ads.com']
const clickPathRegex = /^\/(?:dk\/klikbanner\.php)?$/i
// Optional u1 and u2 segments hold the partner's own sub ids.
const deepLinkPathRegex = /^\/dk\/c\/p\/\d+\/b\/\d+\/(?:u\d\/[^/]+\/)*(?<target>https?:\/\/.+)$/i

const extractTarget = createQueryUnwrapper({
  domains,
  params: ['htmlurl'],
})

// partner-ads.com Danish affiliate network (partner-ads.com/dk/klikbanner.php?htmlurl=<target>,
// also on the root), and its deep link with the target in the path
// (partner-ads.com/dk/c/p/<partner>/b/<banner>/<target>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapPartnerAds = createUnwrapper({
  domains,
  unwrap: (url) => {
    const deepLinkMatch = deepLinkPathRegex.exec(url.pathname)

    if (deepLinkMatch?.groups) {
      return resolvePathTarget(url, deepLinkMatch.groups.target)
    }

    if (!clickPathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
