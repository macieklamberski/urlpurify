import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

// A 14-digit timestamp after the web archive prefix.
const pathRegex = /^\/webarchive\/\d{14}\/(.+)$/i

// National Library of New Zealand web archive snapshot
// (ndhadeliver.natlib.govt.nz/webarchive/<timestamp>/<target>). Opt-in: unwrapping returns the live
// page, which may have changed or be gone.
export const unwrapNatlibNz: UrlUnwrapper = createUnwrapper({
  hosts: 'ndhadeliver.natlib.govt.nz',
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
