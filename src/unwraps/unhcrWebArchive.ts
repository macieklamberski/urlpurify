import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// A 14-digit timestamp at the root.
const pathRegex = /^\/\d{14}\/(.+)$/

// UNHCR web archive snapshot, which holds the retired Refworld site
// (webarchive.archive.unhcr.org/<timestamp>/<target>). Opt-in: unwrapping returns the live page,
// which may have changed or be gone.
export const unwrapUnhcrWebArchive: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'webarchive.archive.unhcr.org')) {
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
