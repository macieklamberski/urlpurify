import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

// A 14-digit timestamp after the web prefix.
const pathRegex = /^\/web\/\d{14}\/(.+)$/i

// UNESCO web archive snapshot (webarchive.unesco.org/web/<timestamp>/<target>). Opt-in: unwrapping
// returns the live page, which may have changed or be gone.
export const unwrapUnescoWebArchive: UrlUnwrapper = createUnwrapper({
  hosts: 'webarchive.unesco.org',
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
