import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const pathRegex = /^\/~\/t\/0\/[0_]\/[^/]+(?:\/full)?\/~(.+)$/

// FeedBlitz feed item click tracker (feeds.feedblitz.com/~/t/0/0/<feed>/~<target>, also /0/_/ and
// /full/). The target runs to the end of the url.
export const unwrapFeedblitz: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'feeds.feedblitz.com')) {
    return
  }

  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  return `${match[1]}${url.search}${url.hash}`
}
