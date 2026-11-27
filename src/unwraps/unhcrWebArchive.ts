import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

// A 14-digit timestamp at the root.
const pathRegex = /^\/\d{14}\/(.+)$/

// UNHCR web archive snapshot, which holds the retired Refworld site
// (webarchive.archive.unhcr.org/<timestamp>/<target>). Opt-in: unwrapping returns the live page,
// which may have changed or be gone.
export const unwrapUnhcrWebArchive: UrlUnwrapper = createUnwrapper({
  hosts: 'webarchive.archive.unhcr.org',
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
