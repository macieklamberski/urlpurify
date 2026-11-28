import { decodePathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const hosts = ['inoreader.com', 'www.inoreader.com', 'jp.inoreader.com']

const feedPathRegex = /^\/feed\/(?<target>.+)$/i
const rawFeedPathRegex = /^\/feed\/https?:/i

const extractAddFeed = createQueryUnwrapper({
  hosts,
  path: '/',
  params: ['add_feed'],
  ignoreLinkFragment: true,
})

// The query after a feed path is Inoreader's own: the feed's own query sits encoded inside the
// path.
const readFeedPath: UrlUnwrapper = (url) => {
  const match = url.pathname.match(feedPathRegex)

  if (!match?.groups) {
    return
  }

  return decodePathTarget(match.groups.target)
}

// A raw feed's fragment lands in the link's own `hash`.
const unwrapRawFeedPath = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!rawFeedPathRegex.test(url.pathname)) {
      return
    }

    return readFeedPath(url)
  },
})

// Inoreader subscribe and feed preview links (www.inoreader.com/?add_feed=<feed>,
// www.inoreader.com/feed/<feed>, also on inoreader.com and jp.inoreader.com). Not in
// defaultUnwrappers: the link adds the feed to a reader or previews it there, it never redirects
// to it.
export const unwrapInoreader: UrlUnwrapper = createUnwrapper({
  hosts,
  ignoreLinkFragment: true, // A raw feed takes it through `unwrapRawFeedPath`
  unwrap: (url) => {
    return unwrapRawFeedPath(url) ?? readFeedPath(url) ?? extractAddFeed(url)
  },
})
