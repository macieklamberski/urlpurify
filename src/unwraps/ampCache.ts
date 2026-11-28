import { isAnyOf, startsWithAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const pathRegex = /^\/[cv]\/(?<secure>s\/)?(?<target>.+)$/i

const viewerParams = ['amp_gsa', 'amp_js_v', 'usqp']

const domains = ['cdn.ampproject.org']

const readTarget: UrlUnwrapper = (url) => {
  const match = pathRegex.exec(url.pathname)

  if (!match?.groups) {
    return
  }

  const { secure, target } = match.groups
  const scheme = secure ? 'https' : 'http'
  const params = url.search
    .slice(1)
    .split('&')
    .filter((pair) => pair && !isAnyOf(pair.split('=')[0], viewerParams))
  const search = params.length ? `?${params.join('&')}` : ''

  return `${scheme}://${target}${search}`
}

const extractDocument = createUnwrapper({
  domains,
  unwrap: (url) => {
    if (!startsWithAnyOf(url.pathname, '/c/')) {
      return
    }

    return readTarget(url)
  },
})

// AMP cache (cdn.ampproject.org/{c,v}/[s/]<hostname>/<path>), `/c/` serving the document alone
// and `/v/` inside the AMP viewer. The `s/` segment marks an https target. The optional
// publisher subdomain is a hint; the path always carries the canonical hostname. The viewer's
// own query params are dropped, and on `/v/` so is the fragment, which holds the viewer's init
// params rather than the target's.
export const unwrapAmpCache = createUnwrapper({
  domains,
  ignoreLinkFragment: true, // The `/c/` document takes it through `extractDocument`
  unwrap: (url) => {
    return extractDocument(url) ?? readTarget(url)
  },
})
