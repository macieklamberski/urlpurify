import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

// The collection name, then a 14-digit timestamp.
const pathRegex = /^\/(?:all|legacy|congressional-record)\/\d{14}\/(.+)$/i

// Library of Congress Web Archives snapshot (webarchive.loc.gov/<collection>/<timestamp>/<target>,
// in the all, legacy and congressional-record collections). Opt-in: unwrapping returns the live
// page, which may have changed or be gone.
export const unwrapLocWebArchive: UrlUnwrapper = createUnwrapper({
  hosts: 'webarchive.loc.gov',
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.[1]) {
      return
    }

    // An unencoded target's query lands in the snapshot URL's own `search`.
    const target = `${match[1]}${url.search}`

    if (isHttpUrl(target)) {
      return target
    }
  },
})
