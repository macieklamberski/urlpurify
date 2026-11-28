import {
  decodeBase64Url,
  decodeBase64UrlBinary,
  decodePercent,
  isAnyOf,
  isHostOf,
  isUtf8Binary,
} from 'trousse'
import { createUnwrapper, readDecodedParamTarget } from '../utils.js'

const showPathRegex = /^\/(?:u\/\d+\/)?feed\/(?<feed>[\w%=-]+)(?:\/episode\/[\w%=-]+)?\/?$/i

const appHosts = ['podcasts.google.com']
const appPaths = ['/', '/subscribe-by-rss-feed']
const searchHosts = ['google.com', 'www.google.com']

// A feed url is UTF-8 text, so bytes that are not valid UTF-8 come from text glued after the
// base64 value, such as `…ZmVlZA--`, and the decoded url would be broken.
const decodeFeed = (encoded: string): string | undefined => {
  const binary = decodeBase64UrlBinary(encoded)

  if (binary === undefined || !isUtf8Binary(binary)) {
    return
  }

  return decodeBase64Url(encoded)
}

// Google Podcasts show, episode and app pages (podcasts.google.com/feed/<base64 feed>, with
// /episode/<id> or under /u/<n>/, and ?feed=<base64 feed> on /, /subscribe-by-rss-feed and
// google.com/podcasts with or without www).
// Opt-in: unwrapping returns the feed, not the reader's or app's page that adds or plays it.
export const unwrapGooglePodcasts = createUnwrapper({
  hosts: [...appHosts, ...searchHosts],
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (isHostOf(url, appHosts)) {
      const showMatch = showPathRegex.exec(url.pathname)

      if (showMatch?.groups) {
        return decodeFeed(decodePercent(showMatch.groups.feed))
      }
    }

    const isApp = isHostOf(url, appHosts) && isAnyOf(url.pathname, appPaths)
    const isSearch = isHostOf(url, searchHosts) && isAnyOf(url.pathname, '/podcasts')

    if (!isApp && !isSearch) {
      return
    }

    return readDecodedParamTarget(url, 'feed', decodeFeed)
  },
})
