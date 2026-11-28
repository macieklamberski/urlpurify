import { isAnyOf } from 'trousse'
import { resolvePathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const formPathRegex = /^\/(?:entry|add|entry\/panel)\/?$/i
const schemePathRegex = /^\/entry\/(?<target>https?(?::|%3a).+)$/i
const hostPathRegex = /^\/entry\/(?<secure>s\/)?(?<target>[^/.]+(?:\.[^/.]+)+(?:\/.*)?)$/i
const encodedPathRegex = /^\/entry\/(?<target>https?(?:%3a|:)%2f.*)$/i

const hosts = ['b.hatena.ne.jp']

const readEntry: UrlUnwrapper = (url) => {
  const schemeTarget = schemePathRegex.exec(url.pathname)?.groups?.target

  // Hatena reads an escaped `%23` in the path or query as the start of the page's fragment.
  if (schemeTarget) {
    return resolvePathTarget(url, schemeTarget).replace('%23', '#')
  }

  const match = hostPathRegex.exec(url.pathname)

  if (!match?.groups) {
    return
  }

  const scheme = match.groups.secure ? 'https' : 'http'

  return resolvePathTarget(url, match.groups.target, scheme).replace('%23', '#')
}

// A page written raw in the path ends where the link's fragment starts, so it takes the fragment.
const extractEntry = createUnwrapper({ hosts, unwrap: readEntry })

// Hatena Bookmark entry page (b.hatena.ne.jp/entry/<page>, with the scheme, percent-encoded, or
// without it as /entry/s/<host>/<path> for https and /entry/<host>/<path> for http), and the
// bookmark form at /entry?url=, /add?url= and /entry/panel/?url=.
// Opt-in: unwrapping returns the shared page, not the form that shares it.
export const unwrapHatenaBookmark = createUnwrapper({
  hosts,
  ignoreLinkFragment: true, // An entry page takes it through `extractEntry`
  unwrap: (url) => {
    if (isAnyOf(url.pathname, formPathRegex)) {
      return readParamTarget(url, 'url')
    }

    const encodedTarget = encodedPathRegex.exec(url.pathname)?.groups?.target

    // An encoded page holds its own query and fragment, so the link's are Hatena's own.
    if (encodedTarget) {
      return resolvePathTarget(url, encodedTarget)
    }

    return extractEntry(url)
  },
})
