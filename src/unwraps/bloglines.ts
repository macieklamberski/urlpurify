import { isAnyOf } from 'trousse'
import { createPathUnwrapper, decodePathTarget, isEncodedPathTarget } from '../pathTarget.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const formPathRegex = /^\/sub\/?$/i
const rawFeedPrefixRegex = /^\/sub\/(?=https?(?::|%3a))/i
const encodedFeedPathRegex = /^\/sub\/(?<target>https?%.+)$/i

const hosts = ['bloglines.com', 'www.bloglines.com']

// A raw feed's query and fragment land in the link's own `search` and `hash`.
const extractRawFeed = createPathUnwrapper({ hosts, prefix: rawFeedPrefixRegex })

// Bloglines subscribe button (www.bloglines.com/sub/<feed>, the feed raw or percent-encoded, also
// www.bloglines.com/sub/?url=<feed>).
// Opt-in: unwrapping returns the feed, not the reader's or app's page that adds or plays it.
export const unwrapBloglines = createUnwrapper({
  hosts,
  ignoreLinkFragment: true, // A raw feed takes it through `extractRawFeed`
  unwrap: (url) => {
    if (isAnyOf(url.pathname, formPathRegex)) {
      return readParamTarget(url, 'url')
    }

    const match = encodedFeedPathRegex.exec(url.pathname)

    // An encoded feed holds its own query inside the path, so the link's query is Bloglines' own.
    if (match?.groups && isEncodedPathTarget(match.groups.target)) {
      return decodePathTarget(match.groups.target)
    }

    return extractRawFeed(url)
  },
})
