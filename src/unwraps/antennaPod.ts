import { getPathSegments, isAnyOf, isLocale } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

// AntennaPod subscribe deep link (antennapod.org/deeplink/subscribe?url=<feed>&title=<title>, also
// under a locale such as /fr/).
// Opt-in: unwrapping returns the feed, not the reader's or app's page that adds or plays it.
export const unwrapAntennaPod = createUnwrapper({
  hosts: ['antennapod.org', 'www.antennapod.org'],
  ignoreLinkFragment: true,
  unwrap: (url) => {
    const segments = getPathSegments(url)
    const [locale] = segments
    // A locale copy of the page, such as /fr/ or /pt-br/, runs the same script.
    const pageSegments = locale && isLocale(locale) ? segments.slice(1) : segments
    const [route, action, ...rest] = pageSegments

    if (!isAnyOf(route, 'deeplink') || !isAnyOf(action, 'subscribe') || rest.length > 0) {
      return
    }

    return readParamTarget(url, 'url')
  },
})
