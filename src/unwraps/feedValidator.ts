import { isHostOf } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

const hosts = ['feedvalidator.org', 'www.feedvalidator.org']

// The validator's own rewrite serves `check` as `check.cgi`, on every copy of it.
const pathRegex = /^\/check(?:\.cgi)?$/i
const atomEnabledPathRegex = /^\/feedvalidator\/check(?:\.cgi)?$/i
const archivePathRegex = /^\/validator\/check(?:\.cgi)?$/i

// FeedValidator.org result page (feedvalidator.org/check.cgi?url=<feed>, also /check and on www.),
// and its copies on www.atomenabled.org/feedvalidator/ and feeds.archive.org/validator/.
// Opt-in: unwrapping returns the feed the tool was given, not the tool's view of it.
export const unwrapFeedValidator = createUnwrapper({
  hosts: [...hosts, 'atomenabled.org', 'www.atomenabled.org', 'feeds.archive.org'],
  ignoreLinkFragment: true,
  unwrap: (url) => {
    const isCheckPath =
      (isHostOf(url, hosts) && pathRegex.test(url.pathname)) ||
      (isHostOf(url, ['atomenabled.org', 'www.atomenabled.org']) &&
        atomEnabledPathRegex.test(url.pathname)) ||
      (isHostOf(url, 'feeds.archive.org') && archivePathRegex.test(url.pathname))

    if (!isCheckPath) {
      return
    }

    return readParamTarget(url, 'url')
  },
})
