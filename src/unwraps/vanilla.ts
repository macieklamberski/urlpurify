import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

// A locale or subcommunity prefix, such as /en/ or /en/madden-nfl/.
const pathRegex = /^(?:\/[^/]+){0,2}\/home\/leaving$/

// Vanilla Forums leaving page (<forum host>/home/leaving?target=<target>). Each forum runs on its
// own host, so the exact path and an http `target` are the guard, not the host.
export const unwrapVanilla: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  // Older Vanilla versions spell the carrier `Target`.
  const target = getParamTarget(url, 'target') ?? getParamTarget(url, 'Target')

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
