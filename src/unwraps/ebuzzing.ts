import { resolvePathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const hosts = [
  'www.ebuzzing.com',
  'ebuzzing.com',
  'www.ebuzzing.fr',
  'ebuzzing.fr',
  'social.ebuzzing.fr',
  'www.ebuzzing.it',
  'ebuzzing.it',
  'www.ebuzzing.es',
  'ebuzzing.es',
  'www.ebuzzing.co.uk',
  'ebuzzing.co.uk',
]

// Campaign and placement ids joined by underscores, then the target with no scheme. The first
// segment of the target must be a host: a dot, no colon.
const pathRegex = /^\/rd\/[\d_]+\/([^/:]*\.[^/:]*(?:\/.*)?)$/i

// Ebuzzing sponsored post click tracker (www.ebuzzing.com/rd/<ids>/<target>, also on its French,
// Italian, Spanish and British domains), which answered 301 to the http target. Not included in
// defaultUnwrappers: unwrapping removes the advertiser's click count.
export const unwrapEbuzzing: UrlUnwrapper = createUnwrapper({
  hosts,
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.[1]) {
      return
    }

    return resolvePathTarget(url, match[1], 'http:')
  },
})
