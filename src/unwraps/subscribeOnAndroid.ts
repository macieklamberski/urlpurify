import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

// The feed follows the host, so the first segment has to look like a host, or a scheme some
// publishers leave on the feed. The site's own pages, such as /help/ and /favicon.ico, do not.
const feedPrefixRegex = /^\/(?=(?:https?:\/*)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?::\d+)?\/)/i

const hosts = ['subscribeonandroid.com', 'www.subscribeonandroid.com']

// Subscribe on Android subscribe button (subscribeonandroid.com/<feed>), where the feed drops its
// scheme. The page reads the feed as https.
// Not included in defaultUnwrappers: unwrapping returns the feed, not the page that subscribes
// to it.
export const unwrapSubscribeOnAndroid: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts)) {
    return
  }

  return getPathTarget(url, feedPrefixRegex)
}
