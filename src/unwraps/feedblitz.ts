import { resolvePathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

const pathRegex = /^\/~\/t\/0\/[0_]\/[^/]+(?:\/full)?\/~(?<target>.+)$/i

// FeedBlitz feed item click tracker (feeds.feedblitz.com/~/t/0/0/<feed>/~<target>, also /0/_/ and
// /full/). The target runs to the end of the url.
// Opt-in: unwrapping removes the site's count of which links get clicked.
export const unwrapFeedblitz = createUnwrapper({
  hosts: 'feeds.feedblitz.com',
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.groups?.target) {
      return
    }

    return resolvePathTarget(url, match.groups.target)
  },
})
