import { decodePercent, isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const carrierPrefixRegex = /^\?fileURL=\//i
const schemeRegex = /^https?:/i
const encodedSchemeRegex = /^https?%3A/i

// Mohtwize download measurement prefix (stats.mohtwize.net/redirect.mp3?fileURL=/<target>), where
// the target often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapMohtwize: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'stats.mohtwize.net') || !isAnyOf(url.pathname, '/redirect.mp3')) {
    return
  }

  const prefix = url.search.match(carrierPrefixRegex)

  if (!prefix) {
    return
  }

  // The target's own query follows unencoded, and the service forwarded to all of it.
  let target = `${url.search.slice(prefix[0].length)}${url.hash}`

  // An encoded target, as in `https%3A%2F%2F…`, which the service decoded before forwarding.
  if (encodedSchemeRegex.test(target)) {
    target = decodePercent(target)
  }

  if (!target) {
    return
  }

  if (schemeRegex.test(target)) {
    return target
  }

  return `https://${target}`
}
