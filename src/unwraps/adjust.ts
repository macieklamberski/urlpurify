import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const hosts = ['app.adjust.com', 'app.adjust.net.in']
const pathRegex = /^\/[^/]+$/

// The path is the app's own deep-link path, so any path is claimed on these hosts.
const unwrapUniversalLink = createParamExtractor({
  hosts: /^[a-z0-9]{4}(?:\.tr)?\.adj\.st$/,
  params: ['adj_redirect', 'adj_fallback', 'adj_redirect_macos', 'adjust_fallback'],
})

const unwrapTracker: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !pathRegex.test(url.pathname)) {
    return
  }

  const target = url.searchParams.get('redirect')
  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}

// Adjust deep-link tracker (app.adjust.com/<token>?redirect=<target>, also on app.adjust.net.in).
// The `redirect` param sometimes contains a custom-scheme URI (e.g. `myapp://...`) that's only
// meaningful inside the target app; only forward http(s) values. Also Adjust universal links
// (<id>.adj.st/<path>?adj_fallback=<target>, also on <id>.tr.adj.st), whose web destination is in
// adj_redirect, adj_fallback, adj_redirect_macos or the older adjust_fallback.
export const unwrapAdjust: UrlUnwrapper = (url) => {
  return unwrapTracker(url) ?? unwrapUniversalLink(url)
}
