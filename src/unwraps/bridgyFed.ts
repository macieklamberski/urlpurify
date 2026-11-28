import { resolvePathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

const hosts = ['fed.brid.gy', 'bsky.brid.gy', 'web.brid.gy']

const pathRegex = /^\/r\/(?<target>https?(?::|%(?:25)?3a).+)$/i

// Bridgy Fed redirect for a bridged post or profile (fed.brid.gy/r/<target>, also bsky.brid.gy
// and web.brid.gy). A browser gets a 301 to the target.
export const unwrapBridgyFed = createUnwrapper({
  hosts,
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.groups?.target) {
      return
    }

    return resolvePathTarget(url, match.groups.target)
  },
})
