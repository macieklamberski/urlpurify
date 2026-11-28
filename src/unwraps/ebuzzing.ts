import { resolvePathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

const hosts = [
  'ebuzzing.com',
  'www.ebuzzing.com',
  'ebuzzing.fr',
  'www.ebuzzing.fr',
  'social.ebuzzing.fr',
  'ebuzzing.it',
  'www.ebuzzing.it',
  'ebuzzing.es',
  'www.ebuzzing.es',
  'ebuzzing.co.uk',
  'www.ebuzzing.co.uk',
]

// Campaign and placement ids joined by underscores, then the target with no scheme. The first
// segment of the target must be a host: a dot, no colon.
const pathRegex = /^\/rd\/[\d_]+\/(?<target>[^/:]*\.[^/:]*(?:\/.*)?)$/i

// Ebuzzing sponsored post click tracker (www.ebuzzing.com/rd/<ids>/<target>, also on its French,
// Italian, Spanish and British domains), which answered 301 to the http target.
// Opt-in: unwrapping removes the advertiser's click count.
export const unwrapEbuzzing = createUnwrapper({
  hosts,
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.groups?.target) {
      return
    }

    return resolvePathTarget(url, match.groups.target, 'http')
  },
})
