import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

// A locale copy of the page, such as /fr/ or /pt-br/, runs the same script.
const subscribePathRegex = /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?deeplink\/subscribe\/?$/i

const hosts = ['antennapod.org', 'www.antennapod.org']

// AntennaPod subscribe deep link (antennapod.org/deeplink/subscribe?url=<feed>&title=<title>, also
// under a locale such as /fr/). Not included in defaultUnwrappers: unwrapping returns the feed, not
// the page that subscribes to it.
export const unwrapAntennaPod: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !subscribePathRegex.test(url.pathname)) {
    return
  }

  return getParamTarget(url, 'url')
}
