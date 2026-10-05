import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// A collection, then a 14-digit timestamp with an optional replay modifier.
const pathRegex = /^\/(?:awa|gov|wayback)\/\d{14}(?:mp_)?\/(.+)$/

// National Library of Australia web archive snapshot (webarchive.nla.gov.au/awa/<timestamp>/
// <target>, also /gov/ and /wayback/, and web.archive.org.au/awa/<timestamp>[mp_]/<target>).
// Not included in defaultUnwrappers: unwrapping returns the live page, which may have changed or
// be gone.
export const unwrapNlaWebarchive: UrlUnwrapper = (url) => {
  if (!isHostOf(url, ['webarchive.nla.gov.au', 'web.archive.org.au'])) {
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
