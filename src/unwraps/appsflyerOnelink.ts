import { createQueryUnwrapper } from '../utils.js'

// A OneLink is /<template id> or /<template id>/<short link id>.
const pathRegex = /^\/[A-Za-z0-9]+(?:\/[A-Za-z0-9]+)?$/

// AppsFlyer OneLink (<brand>.onelink.me/<template id>?af_web_dp=<target>), where `af_web_dp` is the
// page a desktop click lands on.
// Opt-in: unwrapping removes the click attribution.
export const unwrapAppsflyerOnelink = createQueryUnwrapper({
  subdomains: 'onelink.me',
  // Each AppsFlyer customer picks its own subdomain of onelink.me, one label of letters, digits
  // and hyphens, and every one serves the same link.
  match: /^[a-z0-9-]+\.onelink\.me$/,
  path: pathRegex,
  params: ['af_web_dp'],
})
