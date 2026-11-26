import { decodePercent, isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const formPathRegex = /^\/(?:entry|add|entry\/panel)\/?$/i
const schemePathRegex = /^\/entry\/(?<target>https?(?::|%3a).+)$/i
const hostPathRegex = /^\/entry\/(?<secure>s\/)?(?<target>[^/.]+(?:\.[^/.]+)+(?:\/.*)?)$/i
const encodedSchemeRegex = /^https?%3a/i

const hosts = ['b.hatena.ne.jp']

// Hatena Bookmark entry page (b.hatena.ne.jp/entry/<page>, with the scheme, percent-encoded, or
// without it as /entry/s/<host>/<path> for https and /entry/<host>/<path> for http), and the
// bookmark form at /entry?url=, /add?url= and /entry/panel/?url=. Opt-in: unwrapping returns the
// bookmarked page, not the Hatena page that bookmarks it.
export const unwrapHatenaBookmark: UrlUnwrapper = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (isAnyOf(url.pathname, formPathRegex)) {
      return readParamTarget(url, 'url')
    }

    let target = url.pathname.match(schemePathRegex)?.groups?.target

    if (target && encodedSchemeRegex.test(target)) {
      target = decodePercent(target)
    }

    if (!target) {
      const match = url.pathname.match(hostPathRegex)

      if (!match?.groups) {
        return
      }

      target = `${match.groups.secure ? 'https' : 'http'}://${match.groups.target}`
    }

    // Hatena reads an escaped `%23` in the path or query as the start of the page's fragment.
    return `${`${target}${url.search}`.replace('%23', '#')}${url.hash}`
  },
})
