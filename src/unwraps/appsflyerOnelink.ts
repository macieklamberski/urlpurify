import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// A OneLink is /<template id> or /<template id>/<short link id>.
const pathRegex = /^\/[A-Za-z0-9]+(?:\/[A-Za-z0-9]+)?$/

// Each AppsFlyer customer picks its own subdomain of onelink.me, one label of letters, digits and
// hyphens, and every one serves the same link.
const extractWebDeepLink = createParamExtractor({
  hosts: /^[a-z0-9-]+\.onelink\.me$/,
  params: ['af_web_dp'],
})

// AppsFlyer OneLink (<brand>.onelink.me/<template id>?af_web_dp=<target>), where `af_web_dp` is
// the page a desktop click lands on. Not in defaultUnwrappers: unwrapping skips the app and its
// click attribution.
export const unwrapAppsflyerOnelink: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractWebDeepLink(url)
}
