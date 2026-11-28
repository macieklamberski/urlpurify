import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, decodeEncodedScheme, readParamTarget } from '../utils.js'

const feedPathRegex =
  /^\/i\/(?:subscription|discover\/sources\/search)\/feed(?:\/|%2F)(?<target>.+)$/i
const encodedTargetRegex = /^https?(?:%3a|:)%2f/i
const feedFragmentRegex = /^#subscription(?:\/|%2F)feed(?:\/|%2F)(?<target>.+)$/i

const hosts = ['feedly.com', 'www.feedly.com', 'cloud.feedly.com']
const paramPath = '/i/subscription/feed'
const fragmentPaths = ['/', '/index.html', '/home']

// Feedly subscribe links (feedly.com/i/subscription/feed/<feed>, /i/subscription/feed?url=<feed>,
// /i/discover/sources/search/feed/<feed>, /#subscription/feed/<feed> also after /index.html or
// /home, the slash after `feed`, and before it in the fragment, also as %2F). Opt-in: the link adds
// the feed, it never redirects.
export const unwrapFeedly: UrlUnwrapper = createUnwrapper({
  hosts,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (isAnyOf(url.pathname, paramPath)) {
      return readParamTarget(url, 'url')
    }

    const pathMatch = url.pathname.match(feedPathRegex)

    if (pathMatch?.groups) {
      const target = decodeEncodedScheme(pathMatch.groups.target)

      // An encoded feed ends where its encoding ends, so the link's fragment is Feedly's own.
      if (encodedTargetRegex.test(pathMatch.groups.target)) {
        return `${target}${url.search}`
      }

      return `${target}${url.search}${url.hash}`
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
  },
})
