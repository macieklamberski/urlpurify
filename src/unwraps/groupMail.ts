import { resolvePathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const pathRegex = /^\/[A-Za-z0-9]+\/e=[^/]*\/(https?:(?:\/|%2f).*)$/i

// GroupMail email click tracker (lnk.ie/<code>/e=<recipient email>/<target>). The target's own
// query and fragment are the url's. Opt-in: unwrapping removes the sender's click count.
export const unwrapGroupMail: UrlUnwrapper = createUnwrapper({
  hosts: ['lnk.ie', 'www.lnk.ie'],
  unwrap: (url) => {
    const match = url.pathname.match(pathRegex)

    if (!match) {
      return
    }

    return resolvePathTarget(url, match[1])
  },
})
