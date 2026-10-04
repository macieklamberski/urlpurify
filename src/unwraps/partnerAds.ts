import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const clickPathRegex = /^\/(?:dk\/klikbanner\.php)?$/

const extractTarget = createParamExtractor({
  hosts: /\.partner-ads\.com$/,
  params: ['htmlurl'],
})

// partner-ads.com Danish affiliate network (partner-ads.com/dk/klikbanner.php?htmlurl=<target>,
// also on the root).
export const unwrapPartnerAds: UrlUnwrapper = (url) => {
  if (!clickPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
