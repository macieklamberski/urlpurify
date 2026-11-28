import { resolvePathTarget } from '../pathTarget.js'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const domains = ['partner-ads.com']
const clickPathRegex = /^\/(?:dk\/klikbanner\.php)?$/i
// Optional u1 and u2 segments hold the partner's own sub ids.
const deepLinkPathRegex = /^\/dk\/c\/p\/\d+\/b\/\d+\/(?:u\d\/[^/]+\/)*(https?:\/\/.+)$/i

const extractTarget = createQueryUnwrapper({
  domains,
  params: ['htmlurl'],
})

// partner-ads.com Danish affiliate network (partner-ads.com/dk/klikbanner.php?htmlurl=<target>,
// also on the root), and its deep link with the target in the path
// (partner-ads.com/dk/c/p/<partner>/b/<banner>/<target>).
export const unwrapPartnerAds = createUnwrapper({
  domains,
  unwrap: (url) => {
    const deepLinkMatch = url.pathname.match(deepLinkPathRegex)

    if (deepLinkMatch) {
      return resolvePathTarget(url, deepLinkMatch[1])
    }

    if (!clickPathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
