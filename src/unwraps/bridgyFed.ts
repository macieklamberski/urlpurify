import { resolvePathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const hosts = ['fed.brid.gy', 'bsky.brid.gy', 'web.brid.gy']

const pathRegex = /^\/r\/(https?:\/\/.+)$/i

// Bridgy Fed redirect for a bridged post or profile (fed.brid.gy/r/<target>, also bsky.brid.gy
// and web.brid.gy). A browser gets a 301 to the target.
export const unwrapBridgyFed: UrlUnwrapper = createUnwrapper({
  hosts,
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.[1]) {
      return
    }

    return resolvePathTarget(url, match[1])
  },
})
