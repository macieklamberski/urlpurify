import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const linkPathRegex = /^\/m?link$/i

const hosts = ['tracking.vocus.io']

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['url'],
})

// Vocus.io email click tracker (tracking.vocus.io/link?id=<id>&url=<target>, also /mlink).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapVocus = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!linkPathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
