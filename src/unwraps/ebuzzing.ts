import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const hosts = [
  'www.ebuzzing.com',
  'ebuzzing.com',
  'www.ebuzzing.fr',
  'social.ebuzzing.fr',
  'www.ebuzzing.it',
  'www.ebuzzing.es',
  'www.ebuzzing.co.uk',
]

// Campaign and placement ids joined by underscores, then the target with no scheme. The first
// segment of the target must be a host: a dot, no colon.
const pathRegex = /^\/rd\/[\d_]+\/([^/:]*\.[^/:]*(?:\/.*)?)$/

// Ebuzzing sponsored post click tracker (www.ebuzzing.com/rd/<ids>/<target>, also on its French,
// Italian, Spanish and British domains), which answered 301 to the http target. Not included in
// defaultUnwrappers: unwrapping removes the advertiser's click count.
export const unwrapEbuzzing: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts)) {
    return
  }

  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  // An unencoded target's query and fragment land in the tracker URL's own `search` and `hash`.
  return `http://${match[1]}${url.search}${url.hash}`
}
