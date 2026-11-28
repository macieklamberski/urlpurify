import { isAnyOf } from 'trousse'
import { createUnwrapper, decodeEncodedScheme } from '../utils.js'

// The target is written unencoded after the first marker, so its own query, and any later `&&&`,
// belong to it. Without type=click the same path serves the open-tracking pixel.
const clickQueryRegex = /^\?type=click&enid=[^&]+&&&\d+&&&(?<target>.+)$/i

// GovDelivery legacy click tracker
// (links.govdelivery.com/track?type=click&enid=<id>&&&<n>&&&<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapGovdelivery = createUnwrapper({
  hosts: 'links.govdelivery.com',
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/track')) {
      return
    }

    const target = clickQueryRegex.exec(url.search)?.groups?.target

    if (!target) {
      return
    }

    return decodeEncodedScheme(target)
  },
})
