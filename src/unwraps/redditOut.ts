import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const outPathRegex = /^\/(?:t\d_[a-z0-9]+)?$/i

const hosts = ['out.reddit.com']

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['url'],
})

// Reddit outbound click tracker (out.reddit.com/t3_<id>?url=<target>, also out.reddit.com/?url=).
export const unwrapRedditOut = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!outPathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
