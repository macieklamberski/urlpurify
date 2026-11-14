import { decodePercent, isAnyOf, isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeEncodedScheme, getParamTarget } from '../utils.js'
import { googleHostRegex } from './google.js'

const feedPathRegex = /^\/reader\/(?:view|preview\/\*)\/feed\/(?<target>.+)$/i
const addPathRegex = /^\/ig\/(?:add|adde|addtoreader)$/i

const hosts = ['fusion.google.com']

// Google Reader, iGoogle and Fusion subscribe links (google.<TLD>/reader/view/feed/<feed>,
// google.<TLD>/reader/preview/*/feed/<feed>, google.<TLD>/ig/add?feedurl=<feed>, /ig/adde and
// /ig/addtoreader, fusion.google.com/add?feedurl=<feed>), feedurl before moduleurl. Not included
// in defaultUnwrappers: the link adds the feed to a reader, it does not redirect to it.
export const unwrapGoogleReader: UrlUnwrapper = (url) => {
  if (!isAnyOf(url.hostname, googleHostRegex)) {
    return
  }

  const match = url.pathname.match(feedPathRegex)

  // The query and fragment after a Reader feed path are Reader's own, such as `?hl=en`, and the
  // feed's own query sits encoded inside the path.
  if (match?.groups) {
    const target = decodeEncodedScheme(decodePercent(match.groups.target))

    if (!isHttpUrl(target)) {
      return
    }

    return target
  }

  const isAddPath =
    isAnyOf(url.pathname, addPathRegex) || (isHostOf(url, hosts) && isAnyOf(url.pathname, '/add'))

  if (!isAddPath) {
    return
  }

  return getParamTarget(url, 'feedurl') ?? getParamTarget(url, 'moduleurl')
}
