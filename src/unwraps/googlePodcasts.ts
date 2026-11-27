import {
  decodeBase64Url,
  decodeBase64UrlBinary,
  decodePercent,
  isAnyOf,
  isHostOf,
  isHttpUrl,
  isUtf8Binary,
} from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, getParamValues } from '../utils.js'

const showPathRegex = /^\/(?:u\/\d+\/)?feed\/([\w%=-]+)(?:\/episode\/[\w%=-]+)?\/?$/i

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

  return getParamValues(url, 'feed').at(0)
}

// Google Podcasts show, episode and app pages (podcasts.google.com/feed/<base64 feed>, with
// /episode/<id> or under /u/<n>/, and ?feed=<base64 feed> on /, /subscribe-by-rss-feed and
// google.com/podcasts with or without www). Not included in defaultUnwrappers: the link opens
// the app's page.
export const unwrapGooglePodcasts: UrlUnwrapper = createUnwrapper({
  hosts: [...appHosts, ...searchHosts],
  ignoreLinkFragment: true,
  unwrap: (url) => {
    const encoded = getEncodedFeed(url)

    if (!encoded) {
      return
    }

    const binary = decodeBase64UrlBinary(encoded)

    // A feed url is UTF-8 text, so bytes that are not valid UTF-8 come from text glued after the
    // base64 value, such as `…ZmVlZA--`, and the decoded url would be broken.
    if (binary === undefined || !isUtf8Binary(binary)) {
      return
    }

    const decoded = decodeBase64Url(encoded)

    if (decoded && isHttpUrl(decoded)) {
      return decoded
    }
  },
})
