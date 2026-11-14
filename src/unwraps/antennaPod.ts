import { getPathSegments, isAnyOf, isHostOf, isLocaleSegment } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const hosts = ['antennapod.org', 'www.antennapod.org']

// AntennaPod subscribe deep link (antennapod.org/deeplink/subscribe?url=<feed>&title=<title>, also
// under a locale such as /fr/). Not included in defaultUnwrappers: unwrapping returns the feed, not
// the page that subscribes to it.
export const unwrapAntennaPod: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts)) {
    return
  }

  const segments = getPathSegments(url)
  const [locale] = segments
  // A locale copy of the page, such as /fr/ or /pt-br/, runs the same script.
  const pageSegments = locale && isLocaleSegment(locale) ? segments.slice(1) : segments
  const [route, action, ...rest] = pageSegments

  if (!isAnyOf(route, 'deeplink') || !isAnyOf(action, 'subscribe') || rest.length > 0) {
    return
  }

  return getParamTarget(url, 'url')
}
