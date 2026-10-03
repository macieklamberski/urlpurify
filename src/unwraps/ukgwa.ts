import { isHostOrSubdomainOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// The snapshot is a 14-digit timestamp with an optional replay modifier, or `+` for the latest.
const pathRegex = /^(?:\/ukgwa)?\/(?:\d{14}(?:(?:id|if|mp|fw|oe)_)?|\+)\/(.+)$/

// Some snapshot links carry the target as `http:/host`, with the double slash collapsed.
const collapsedSchemeRegex = /^(https?:)\/(?!\/)/

// UK Government Web Archive snapshot
// (webarchive.nationalarchives.gov.uk/ukgwa/<timestamp>/<target>, also without `/ukgwa` and with
// `+` for the latest snapshot).
// Not included in defaultUnwrappers: an archive URL is a snapshot at a point in time, and
// unwrapping returns the live page, which may have changed or be gone.
export const unwrapUkgwa: UrlUnwrapper = (url) => {
  if (!isHostOrSubdomainOf(url, 'webarchive.nationalarchives.gov.uk')) {
    return
  }

  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  // An unencoded target's query and fragment land in the snapshot URL's own `search` and `hash`.
  const target = `${match[1].replace(collapsedSchemeRegex, '$1//')}${url.search}${url.hash}`

  if (isHttpUrl(target)) {
    return target
  }
}
