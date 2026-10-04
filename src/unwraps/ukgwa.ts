import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// The snapshot is a 14-digit timestamp with an optional replay modifier, or `+` for the latest.
const pathRegex = /^(?:\/ukgwa)?\/(?:\d{14}(?:mp_)?|\+)\/(.+)$/

// UK Government Web Archive snapshot (webarchive.nationalarchives.gov.uk/[ukgwa/]<timestamp>[mp_]/
// <target>, or `+` for the latest). Opt-in: unwrapping returns the live page, which may have
// changed or be gone.
export const unwrapUkgwa: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'webarchive.nationalarchives.gov.uk')) {
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
