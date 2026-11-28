import { isAnyOf } from 'trousse'
import { resolvePathTarget } from '../pathTarget.js'
import { createUnwrapper, decodeEncodedScheme, readParamTarget } from '../utils.js'

const feedPathRegex =
  /^\/i\/(?:subscription|discover\/sources\/search)\/feed(?:\/|%2F)(?<target>.+)$/i
const feedFragmentRegex = /^#subscription(?:\/|%2F)feed(?:\/|%2F)(?<target>.+)$/i

const hosts = ['feedly.com', 'www.feedly.com', 'cloud.feedly.com']
const paramPath = '/i/subscription/feed'
const fragmentPaths = ['/', '/index.html', '/home']

// Feedly subscribe links (feedly.com/i/subscription/feed/<feed>, /i/subscription/feed?url=<feed>,
// /i/discover/sources/search/feed/<feed>, /#subscription/feed/<feed> also after /index.html or
// /home, the slash after `feed`, and before it in the fragment, also as %2F).
// Opt-in: the link adds the feed, it never redirects.
export const unwrapFeedly = createUnwrapper({
  hosts,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (isAnyOf(url.pathname, paramPath)) {
      return readParamTarget(url, 'url')
    }

    const pathMatch = feedPathRegex.exec(url.pathname)

    // An encoded feed holds its own query and fragment, so the link's are Feedly's own. A raw feed
    // takes both.
    if (pathMatch?.groups) {
      return resolvePathTarget(url, pathMatch.groups.target, undefined, `${url.search}${url.hash}`)
    }

    if (!isAnyOf(url.pathname, fragmentPaths)) {
      return
    }

    // The feed's own query sits inside the fragment, after Feedly's route.
    const fragmentMatch = feedFragmentRegex.exec(url.hash)

    if (!fragmentMatch?.groups) {
      return
    }

    return decodeEncodedScheme(fragmentMatch.groups.target)
  },
})
