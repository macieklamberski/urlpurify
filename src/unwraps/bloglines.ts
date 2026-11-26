import { decodePercent, isAnyOf, isHostOf, isHttpUrl } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, decodeEncodedScheme, readParamTarget } from '../utils.js'

const formPathRegex = /^\/sub\/?$/i
const rawFeedPrefixRegex = /^\/sub\/(?=https?:)/i
const encodedFeedPathRegex = /^\/sub\/(?<target>https?%.+)$/i

const hosts = ['bloglines.com', 'www.bloglines.com']

// Bloglines subscribe button (www.bloglines.com/sub/<feed>, the feed raw or percent-encoded, also
// www.bloglines.com/sub/?url=<feed>). Not in defaultUnwrappers: the link adds the feed to a
// Bloglines account, it does not redirect to it.
export const unwrapBloglines: UrlUnwrapper = createUnwrapper(hosts, isHostOf, (url) => {
  if (isAnyOf(url.pathname, formPathRegex)) {
    return readParamTarget(url, 'url')
  }

  const match = url.pathname.match(encodedFeedPathRegex)

  // An encoded feed holds its own query inside the path, so the link's query is Bloglines' own.
  if (match?.groups) {
    const target = decodeEncodedScheme(decodePercent(match.groups.target))

    if (!isHttpUrl(target)) {
      return
    }

    return target
  }

  // A raw feed's query and fragment land in the link's own `search` and `hash`.
  return getPathTarget(url, rawFeedPrefixRegex)
})
