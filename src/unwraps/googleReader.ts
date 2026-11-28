import { isAnyOf, isHostOf } from 'trousse'
import { decodePathTarget } from '../pathTarget.js'
import { appendLinkFragment, createUnwrapper, httpSchemeRegex, readParamTarget } from '../utils.js'
import { googleHostRegex } from './google.js'

const feedPathRegex = /^\/reader\/(?:view|m\/view|lite|preview\/\*)\/feed\/(?<target>.+)$/i
const addPathRegex = /^\/ig\/(?:add|addtoreader)$/i

const hosts = ['fusion.google.com']

// Google Reader, iGoogle and Fusion subscribe links (google.<TLD>/reader/view/feed/<feed>, also
// /reader/m/view/feed/, /reader/lite/feed/ and /reader/preview/*/feed/,
// google.<TLD>/ig/add?feedurl=<feed> and /ig/addtoreader, fusion.google.com/add?feedurl=<feed>).
// Opt-in: unwrapping returns the feed, not the reader's or app's page that adds or plays it.
export const unwrapGoogleReader = createUnwrapper({
  brands: 'google',
  match: googleHostRegex,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    const match = feedPathRegex.exec(url.pathname)

    // The query after a Reader feed path is Reader's own, such as `?hl=en`, and the feed's own
    // query sits encoded inside the path. A raw feed's fragment lands in the link's own `hash`.
    if (match?.groups) {
      const target = decodePathTarget(match.groups.target)

      if (!httpSchemeRegex.test(match.groups.target)) {
        return target
      }

      return appendLinkFragment(url, target)
    }

    const isAddPath =
      isAnyOf(url.pathname, addPathRegex) || (isHostOf(url, hosts) && isAnyOf(url.pathname, '/add'))

    if (!isAddPath) {
      return
    }

    return readParamTarget(url, 'feedurl')
  },
})
