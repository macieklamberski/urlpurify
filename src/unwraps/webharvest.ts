import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// The collection, an end-of-term harvest such as peth04 or a congressional one such as
// congress117th, then a 14-digit timestamp.
const pathRegex = /^\/(?:peth\d{2}|congress\d+th)\/\d{14}\/(.+)$/

// NARA web harvest snapshot (webharvest.gov/<collection>/<timestamp>/<target>). Opt-in: unwrapping
// returns the live page, which may have changed or be gone.
export const unwrapWebharvest: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'webharvest.gov')) {
    return
  }

  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  // An unencoded target's query and fragment land in the snapshot URL's own `search` and `hash`.
  const target = `${match[1]}${url.search}${url.hash}`

  if (isHttpUrl(target)) {
    return target
  }
}
