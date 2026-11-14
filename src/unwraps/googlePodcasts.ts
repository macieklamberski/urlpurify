import { decodePercent, isAnyOf, isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeBase64Url, getParamValues } from '../utils.js'

const showPathRegex = /^\/(?:u\/\d+\/)?feed\/([\w%=-]+)\/?$/i

const appHosts = ['podcasts.google.com']
const appPaths = ['/', '/subscribe-by-rss-feed']
const searchHosts = ['google.com', 'www.google.com']

const getEncodedFeed = (url: URL): string | undefined => {
  if (isHostOf(url, appHosts)) {
    const showMatch = url.pathname.match(showPathRegex)

    if (showMatch) {
      return decodePercent(showMatch[1])
    }
  }

  const isApp = isHostOf(url, appHosts) && isAnyOf(url.pathname, appPaths)
  const isSearch = isHostOf(url, searchHosts) && isAnyOf(url.pathname, '/podcasts')

  if (!isApp && !isSearch) {
    return
  }

  // An episode link carries its episode in `episode=`, which the feed alone does not reach.
  if (getParamValues(url, 'episode').length > 0) {
    return
  }

  return getParamValues(url, 'feed').at(0)
}

// Google Podcasts show and app pages (podcasts.google.com/feed/<base64 feed>, also under /u/<n>/,
// and ?feed=<base64 feed> on /, /subscribe-by-rss-feed and www.google.com/podcasts). Not included
// in defaultUnwrappers: the link opens the app's page, not the feed it carries.
export const unwrapGooglePodcasts: UrlUnwrapper = (url) => {
  const encoded = getEncodedFeed(url)

  if (!encoded) {
    return
  }

  const decoded = decodeBase64Url(encoded)

  if (decoded && isHttpUrl(decoded)) {
    return decoded
  }
}
