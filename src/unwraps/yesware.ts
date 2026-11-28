import { resolvePathTarget } from '../pathTarget.js'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const trackPathRegex = /^\/tt\/[\da-f]{40}\/[\da-f]{32}\/[\da-f]{32}\/(.+)$/i
const linkPathRegex = /^\/tl\/[\da-f]{40}\/[\da-f]{32}\/[\da-f]{32}$/i

const hosts = ['t.yesware.com']

const extractLinkTarget = createQueryUnwrapper({
  hosts,
  params: ['ytl'],
})

// Yesware email click tracker (t.yesware.com/tt/<ids>/<target>, with the target's scheme dropped,
// also t.yesware.com/tl/<ids>?ytl=<target>).
// Not included in defaultUnwrappers: unwrapping removes the sender's click stats.
export const unwrapYesware = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (linkPathRegex.test(url.pathname)) {
      return extractLinkTarget(url)
    }

    const match = trackPathRegex.exec(url.pathname)

    if (!match?.[1]) {
      return
    }

    // Yesware keeps the scheme server-side: http on links archived before 2019, https on nearly
    // all since. The prefix also lets the url repair drop a `%20` before the target host.
    return resolvePathTarget(url, match[1], 'https')
  },
})
