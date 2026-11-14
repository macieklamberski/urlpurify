import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeEncodedScheme } from '../utils.js'

const feedPathRegex =
  /^\/i\/(?:subscription|discover\/sources\/search)\/feed(?:\/|%2F)(?<target>.+)$/i
const feedFragmentRegex = /^#subscription(?:\/|%2F)feed(?:\/|%2F)(?<target>.+)$/i

const hosts = ['feedly.com', 'www.feedly.com', 'cloud.feedly.com']
const fragmentPaths = ['/', '/index.html', '/home']

// Feedly subscribe links (feedly.com/i/subscription/feed/<feed>, /i/discover/sources/search/feed/
// <feed>, /#subscription/feed/<feed> also after /index.html or /home, the slash after `feed`, and
// before it in the fragment, also as %2F). Opt-in: the link adds the feed, it never redirects.
export const unwrapFeedly: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts)) {
    return
  }

  const pathMatch = url.pathname.match(feedPathRegex)

  if (pathMatch?.groups) {
    return `${decodeEncodedScheme(pathMatch.groups.target)}${url.search}${url.hash}`
  }

  if (!isAnyOf(url.pathname, fragmentPaths)) {
    return
  }

  // The feed's own query sits inside the fragment, after Feedly's route.
  const fragmentMatch = url.hash.match(feedFragmentRegex)

  if (!fragmentMatch?.groups) {
    return
  }

  return decodeEncodedScheme(fragmentMatch.groups.target)
}
