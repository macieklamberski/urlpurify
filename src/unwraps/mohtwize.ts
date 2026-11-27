import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, decodeEncodedScheme } from '../utils.js'

const carrierPrefixRegex = /^\?fileURL=\//i
const schemeRegex = /^https?:/i

// Mohtwize download measurement prefix (stats.mohtwize.net/redirect.mp3?fileURL=/<target>), where
// the target often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapMohtwize: UrlUnwrapper = createUnwrapper({
  hosts: 'stats.mohtwize.net',
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/redirect.mp3')) {
      return
    }

    const prefix = url.search.match(carrierPrefixRegex)

    if (!prefix) {
      return
    }

    // The target's own query follows unencoded, and the service forwarded to all of it.
    // An encoded target, as in `https%3A%2F%2F…`, which the service decoded before forwarding.
    const target = decodeEncodedScheme(`${url.search.slice(prefix[0].length)}${url.hash}`)

    if (!target) {
      return
    }

    if (schemeRegex.test(target)) {
      return target
    }

    return `https://${target}`
  },
})
