import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const pathRegex = /^\/dynclick\/[^/]+\/$/

// Eulerian click redirect on any host
// (<advertiser host>/dynclick/<site>/?ept-publisher=<name>&eurl=<target>).
// Opt-in: unwrapping removes the click attribution. Advertisers run it on their own subdomains.
export const unwrapEulerian: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  const target = getParamTarget(url, 'eurl')

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
