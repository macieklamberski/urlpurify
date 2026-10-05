import { addMissingProtocol, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const pathRegex = /^\/~\/t\/0\/[0_]\/[^/]+(?:\/full)?\/~(.+)$/

// FeedBlitz feed item click tracker (feeds.feedblitz.com/~/t/0/0/<feed>/~<target>, also /0/_/ and
// /full/). The target runs to the end of the url. FeedBlitz answers a target without a scheme
// with a redirect to its https url, so one is added. Opt-in: unwrapping removes the publisher's
// click count.
export const unwrapFeedblitz: UrlUnwrapper = (url) => {
  if (url.hostname !== 'feeds.feedblitz.com') {
    return
  }

  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  const target = addMissingProtocol(`${match[1]}${url.search}${url.hash}`)

  if (isHttpUrl(target)) {
    return target
  }
}
