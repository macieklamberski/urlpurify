import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// A locale or subcommunity prefix, such as /en/ or /en/madden-nfl/.
const pathRegex = /^(?:\/[^/]+){0,2}\/home\/leaving$/

// Vanilla Forums leaving page (<forum host>/home/leaving?target=<target>). Each forum runs on its
// own host, so the exact path and an http `target` are the guard, not the host.
export const unwrapVanilla: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  // Older Vanilla versions spell the carrier `Target`.
  const target = url.searchParams.get('target') ?? url.searchParams.get('Target')

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
