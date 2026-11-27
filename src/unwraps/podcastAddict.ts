import { decodePercent, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, decodeEncodedScheme } from '../utils.js'

const feedPrefixRegex = /^\/feed\//i

const hosts = ['podcastaddict.com']

// Podcast Addict subscribe link (podcastaddict.com/feed/<feed>), the feed percent-encoded or raw.
// Its ?id=<episode>&podcastId=<id> and /episode/<episode> links carry an episode, not a feed.
// Not included in defaultUnwrappers: unwrapping returns the feed, not the app's podcast page.
export const unwrapPodcastAddict: UrlUnwrapper = createUnwrapper({
  hosts,
  unwrap: (url) => {
    const match = url.pathname.match(feedPrefixRegex)

    if (!match) {
      return
    }

    const feed = decodeEncodedScheme(decodePercent(url.pathname.slice(match[0].length)))

    if (!isHttpUrl(feed)) {
      return
    }

    return `${feed}${url.search}`
  },
})
