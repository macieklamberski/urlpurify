import { isAnyOf, isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeBase64Url, getParamValues } from '../utils.js'

const appHosts = ['podcasts.google.com']
const appPaths = ['/', '/subscribe-by-rss-feed']
const searchHosts = ['google.com', 'www.google.com']

// Google Podcasts app page (podcasts.google.com/?feed=<base64 feed>, also on /subscribe-by-rss-feed
// and www.google.com/podcasts). Not included in defaultUnwrappers: the link opens the app's page,
// not the feed it carries.
export const unwrapGooglePodcasts: UrlUnwrapper = (url) => {
  const isApp = isHostOf(url, appHosts) && isAnyOf(url.pathname, appPaths)
  const isSearch = isHostOf(url, searchHosts) && isAnyOf(url.pathname, '/podcasts')

  if (!isApp && !isSearch) {
    return
  }

  const encoded = getParamValues(url, 'feed').at(0)

  if (!encoded) {
    return
  }

  const decoded = decodeBase64Url(encoded)

  if (decoded && isHttpUrl(decoded)) {
    return decoded
  }
}
