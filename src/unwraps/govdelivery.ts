import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, decodeEncodedScheme } from '../utils.js'

// The target is written unencoded after the first marker, so its own query, and any later `&&&`,
// belong to it. Without type=click the same path serves the open-tracking pixel.
const clickQueryRegex = /^\?type=click&enid=[^&]+&&&\d+&&&(.+)$/i

// GovDelivery legacy click tracker
// (links.govdelivery.com/track?type=click&enid=<id>&&&<n>&&&<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapGovdelivery: UrlUnwrapper = createUnwrapper({
  hosts: 'links.govdelivery.com',
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/track')) {
      return
    }

    const target = clickQueryRegex.exec(url.search)?.[1]

    if (!target) {
      return
    }

    return decodeEncodedScheme(target)
  },
})
