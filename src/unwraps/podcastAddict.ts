import { readPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const feedPrefixRegex = /^\/feed\//i
const encodedFeedPathRegex = /^\/feed\/https?(?:%(?:25)?3a|:)%(?:25)?2f/i

const hosts = ['podcastaddict.com', 'www.podcastaddict.com']

const readFeed: UrlUnwrapper = (url) => {
  return readPathTarget(url, feedPrefixRegex)
}

// A raw feed's fragment lands in the link's own `hash`.
const extractRawFeed = createUnwrapper({ hosts, unwrap: readFeed })

// Podcast Addict subscribe link (podcastaddict.com/feed/<feed>), the feed percent-encoded or raw.
// Its ?id=<episode>&podcastId=<id> and /episode/<episode> links carry an episode, not a feed.
// Opt-in: unwrapping returns the feed, not the reader's or app's page that adds or plays it.
export const unwrapPodcastAddict = createUnwrapper({
  hosts,
  ignoreLinkFragment: true, // A raw feed takes it through `extractRawFeed`
  unwrap: (url) => {
    // An encoded feed holds its own query and fragment, so the link's are Podcast Addict's own.
    if (encodedFeedPathRegex.test(url.pathname)) {
      return readFeed(url)
    }

    return extractRawFeed(url)
  },
})
