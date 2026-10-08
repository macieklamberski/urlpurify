import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const hostRegex = /(?:^|\.)partner-ads\.com$/
const clickPathRegex = /^\/(?:dk\/klikbanner\.php)?$/
// Optional u1 and u2 segments hold the partner's own sub ids.
const deepLinkPathRegex = /^\/dk\/c\/p\/\d+\/b\/\d+\/(?:u\d\/[^/]+\/)*(https?:\/\/.+)$/

const extractTarget = createParamExtractor({
  hosts: hostRegex,
  params: ['htmlurl'],
})

// partner-ads.com Danish affiliate network (partner-ads.com/dk/klikbanner.php?htmlurl=<target>,
// also on the root), and its deep link with the target in the path
// (partner-ads.com/dk/c/p/<partner>/b/<banner>/<target>).
export const unwrapPartnerAds: UrlUnwrapper = (url) => {
  const deepLinkMatch = url.pathname.match(deepLinkPathRegex)

  if (deepLinkMatch && hostRegex.test(url.hostname)) {
    return `${deepLinkMatch[1]}${url.search}${url.hash}`
  }

  if (!clickPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
