import { isHostOrSubdomainOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const pathRegex = /^\/([cv])\/(s\/)?(.+)$/
const viewerParams = ['amp_gsa', 'amp_js_v', 'usqp']

// AMP cache (cdn.ampproject.org/{c,v}/[s/]<hostname>/<path>), `/c/` serving the document alone
// and `/v/` inside the AMP viewer. The `s/` segment marks an https target. The optional
// publisher subdomain is a hint; the path always carries the canonical hostname. The viewer's
// own query params are dropped, and on `/v/` so is the fragment, which holds the viewer's init
// params rather than the target's.
export const unwrapAmpCache: UrlUnwrapper = (url) => {
  if (!isHostOrSubdomainOf(url, 'cdn.ampproject.org')) {
    return
  }

  const match = url.pathname.match(pathRegex)

  if (!match) {
    return
  }

  const [, type, secure, target] = match
  const scheme = secure ? 'https' : 'http'
  const params = url.search
    .slice(1)
    .split('&')
    .filter((pair) => pair && !viewerParams.includes(pair.split('=')[0]))
  const search = params.length ? `?${params.join('&')}` : ''
  const hash = type === 'v' ? '' : url.hash

  return `${scheme}://${target}${search}${hash}`
}
