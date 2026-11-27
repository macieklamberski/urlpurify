import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const hosts = ['feedvalidator.org', 'www.feedvalidator.org']

// The validator's own rewrite serves `check` as `check.cgi`, on every copy of it.
const pathRegex = /^\/check(?:\.cgi)?$/i
const atomEnabledPathRegex = /^\/feedvalidator\/check(?:\.cgi)?$/i
const archivePathRegex = /^\/validator\/check(?:\.cgi)?$/i

// FeedValidator.org result page (feedvalidator.org/check.cgi?url=<feed>, also /check and on www.),
// and its copies on www.atomenabled.org/feedvalidator/ and feeds.archive.org/validator/.
// Not in defaultUnwrappers: the link opens the validator's report on the feed, not the feed.
export const unwrapFeedValidator: UrlUnwrapper = createUnwrapper({
  hosts: [...hosts, 'www.atomenabled.org', 'feeds.archive.org'],
  unwrap: (url) => {
    const isCheckPath =
      (isHostOf(url, hosts) && pathRegex.test(url.pathname)) ||
      (isHostOf(url, 'www.atomenabled.org') && atomEnabledPathRegex.test(url.pathname)) ||
      (isHostOf(url, 'feeds.archive.org') && archivePathRegex.test(url.pathname))

    if (!isCheckPath) {
      return
    }

    return readParamTarget(url, 'url')
  },
})
