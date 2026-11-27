import { decodePercent, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper, createUnwrapper, decodeEncodedScheme } from '../utils.js'

const hosts = ['inoreader.com', 'www.inoreader.com', 'jp.inoreader.com']

const feedPathRegex = /^\/feed\/(?<target>.+)$/i

const extractAddFeed = createQueryUnwrapper({
  hosts,
  path: '/',
  params: ['add_feed'],
  ignoreLinkFragment: true,
})

// Inoreader subscribe and feed preview links (www.inoreader.com/?add_feed=<feed>,
// www.inoreader.com/feed/<feed>, also on inoreader.com and jp.inoreader.com). Not in
// defaultUnwrappers: the link adds the feed to a reader or previews it there, it never redirects
// to it.
export const unwrapInoreader: UrlUnwrapper = createUnwrapper({
  hosts,
  unwrap: (url) => {
    const match = url.pathname.match(feedPathRegex)

    if (!match?.groups) {
      return extractAddFeed(url)
    }

    // The query and fragment after a feed path are Inoreader's own: the feed's own query sits
    // encoded inside the path.
    const target = decodeEncodedScheme(decodePercent(match.groups.target))

    if (isHttpUrl(target)) {
      return target
    }
  },
})
