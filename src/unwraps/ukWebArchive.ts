import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// The snapshot is a 14-digit timestamp with an optional replay modifier.
const pathRegex = /^\/wayback\/(?:en\/)?archive\/\d{14}(?:mp_)?\/(.+)$/

// UK Web Archive snapshot (www.webarchive.org.uk/wayback/[en/]archive/<timestamp>[mp_]/<target>).
// Opt-in: unwrapping returns the live page, which may have changed or be gone.
export const unwrapUkWebArchive: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'www.webarchive.org.uk')) {
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
