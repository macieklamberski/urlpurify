import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const pathRegex = /^\/~\/t\/0\/[0_]\/[^/]+(?:\/full)?\/~(.+)$/i

// FeedBlitz feed item click tracker (feeds.feedblitz.com/~/t/0/0/<feed>/~<target>, also /0/_/ and
// /full/). The target runs to the end of the url.
export const unwrapFeedblitz: UrlUnwrapper = createUnwrapper({
  hosts: 'feeds.feedblitz.com',
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.[1]) {
      return
    }

    return `${match[1]}${url.search}${url.hash}`
  },
})
