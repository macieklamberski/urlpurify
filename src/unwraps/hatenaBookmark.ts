import { decodePercent, isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const formPathRegex = /^\/(?:entry|add|entry\/panel)\/?$/i
const schemePathRegex = /^\/entry\/(?:s\/)?(?<target>https?(?::|%3a).+)$/i
const hostPathRegex = /^\/entry\/(?<secure>s\/)?(?<target>[^/.]+(?:\.[^/.]+)+(?:\/.*)?)$/i
const encodedSchemeRegex = /^https?%3a/i

const hosts = ['b.hatena.ne.jp']

// Hatena Bookmark entry page (b.hatena.ne.jp/entry/<page>, with the scheme, percent-encoded, or
// without it as /entry/s/<host>/<path> for https and /entry/<host>/<path> for http), and the
// bookmark form at /entry?url=, /add?url= and /entry/panel/?url=. Opt-in: unwrapping returns the
// bookmarked page, not the Hatena page that bookmarks it.
export const unwrapHatenaBookmark: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts)) {
    return
  }

  if (isAnyOf(url.pathname, formPathRegex)) {
    return getParamTarget(url, 'url')
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

  // Hatena reads an escaped `%23` in the path as the start of the page's fragment.
  return `${target.replace('%23', '#')}${url.search}${url.hash}`
}
