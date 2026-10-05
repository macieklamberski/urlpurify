import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// A 14-digit timestamp after the web archive prefix.
const pathRegex = /^\/webarchive\/\d{14}\/(.+)$/

// National Library of New Zealand web archive snapshot
// (ndhadeliver.natlib.govt.nz/webarchive/<timestamp>/<target>). Opt-in: unwrapping returns the live
// page, which may have changed or be gone.
export const unwrapNatlibNz: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'ndhadeliver.natlib.govt.nz')) {
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
