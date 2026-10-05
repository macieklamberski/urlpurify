import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const pathRegex = /^\/dynclick\/[^/]+\/$/

// Eulerian click redirect on any host
// (<advertiser host>/dynclick/<site>/?ept-publisher=<name>&eurl=<target>).
// Opt-in: unwrapping removes the advertiser's click attribution. Advertisers run it on their own
// subdomains.
export const unwrapEulerian: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  const target = url.searchParams.get('eurl')

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
