import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// The collection name, then a 14-digit timestamp.
const pathRegex = /^\/(?:all|legacy|congressional-record)\/\d{14}\/(.+)$/

// Library of Congress Web Archives snapshot (webarchive.loc.gov/<collection>/<timestamp>/<target>,
// in the all, legacy and congressional-record collections). Opt-in: unwrapping returns the live
// page, which may have changed or be gone.
export const unwrapLocWebArchive: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'webarchive.loc.gov')) {
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
