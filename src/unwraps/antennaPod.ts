import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

// The site's locale copies of the page, each running the same script.
const subscribePathRegex = /^\/(?:(?:da|de|es|fa|fr|it|ja|ko|nl)\/)?deeplink\/subscribe\/?$/i

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
