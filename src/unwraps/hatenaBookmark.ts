import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, decodeEncodedScheme, readParamTarget } from '../utils.js'

const formPathRegex = /^\/(?:entry|add|entry\/panel)\/?$/i
const schemePathRegex = /^\/entry\/(?<target>https?(?::|%3a).+)$/i
const hostPathRegex = /^\/entry\/(?<secure>s\/)?(?<target>[^/.]+(?:\.[^/.]+)+(?:\/.*)?)$/i

const hosts = ['b.hatena.ne.jp']

const unwrapEntry = createUnwrapper({
  hosts,
  unwrap: (url) => {
    const schemeTarget = url.pathname.match(schemePathRegex)?.groups?.target
    let target = schemeTarget && decodeEncodedScheme(schemeTarget)

    if (!target) {
      const match = url.pathname.match(hostPathRegex)

      if (!match?.groups) {
        return
      }

      target = `${match.groups.secure ? 'https' : 'http'}://${match.groups.target}`
    }

    // Hatena reads an escaped `%23` in the path or query as the start of the page's fragment.
    return `${target}${url.search}`.replace('%23', '#')
  },
})

// Hatena Bookmark entry page (b.hatena.ne.jp/entry/<page>, with the scheme, percent-encoded, or
// without it as /entry/s/<host>/<path> for https and /entry/<host>/<path> for http), and the
// bookmark form at /entry?url=, /add?url= and /entry/panel/?url=. Opt-in: unwrapping returns the
// bookmarked page, not the Hatena page that bookmarks it.
export const unwrapHatenaBookmark: UrlUnwrapper = createUnwrapper({
  hosts,
  ignoreLinkFragment: true, // An entry page takes it through `unwrapEntry`
  unwrap: (url) => {
    if (isAnyOf(url.pathname, formPathRegex)) {
      return readParamTarget(url, 'url')
    }

    return unwrapEntry(url)
  },
})
