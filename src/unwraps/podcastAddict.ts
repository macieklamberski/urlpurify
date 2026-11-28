import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const feedPrefixRegex = /^\/feed\//i
const encodedFeedPathRegex = /^\/feed\/https?(?:%(?:25)?3a|:)%(?:25)?2f/i

const hosts = ['podcastaddict.com', 'www.podcastaddict.com']

const readFeed: UrlUnwrapper = (url) => {
  return getPathTarget(url, feedPrefixRegex)
}

// A raw feed's fragment lands in the link's own `hash`.
const unwrapRawFeed = createUnwrapper({ hosts, unwrap: readFeed })

// Podcast Addict subscribe link (podcastaddict.com/feed/<feed>), the feed percent-encoded or raw.
// Its ?id=<episode>&podcastId=<id> and /episode/<episode> links carry an episode, not a feed.
// Not included in defaultUnwrappers: unwrapping returns the feed, not the app's podcast page.
export const unwrapPodcastAddict: UrlUnwrapper = createUnwrapper({
  hosts,
  ignoreLinkFragment: true, // A raw feed takes it through `unwrapRawFeed`
  unwrap: (url) => {
    // An encoded feed holds its own query and fragment, so the link's are Podcast Addict's own.
    if (encodedFeedPathRegex.test(url.pathname)) {
      return readFeed(url)
    }

    return unwrapRawFeed(url)
  },
})
