import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor, getParamTarget } from '../utils.js'

const hosts = ['app.adjust.com', 'app.adjust.net.in']
const pathRegex = /^\/[^/]+$/
// The order a Windows desktop browser gets; a macOS-only carrier sends it elsewhere.
const trackerParams = ['redirect_windows', 'redirect', 'fallback']

// The path is the app's own deep-link path, so any path is claimed on these hosts.
const unwrapUniversalLink = createParamExtractor({
  hosts: /^[a-z0-9]{4}(?:\.tr)?\.adj\.st$/,
  params: ['adj_redirect_windows', 'adj_redirect', 'adjust_fallback', 'adj_fallback'],
})

const unwrapTracker: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !pathRegex.test(url.pathname)) {
    return
  }

  for (const param of trackerParams) {
    const target = getParamTarget(url, param)

    if (target && isHttpUrl(target)) {
      return target
    }
  }
}

// Adjust deep-link tracker (app.adjust.com/<token>?redirect=<target>, also redirect_windows and
// fallback, on app.adjust.net.in too). These params sometimes contain a custom-scheme URI
// (e.g. `myapp://...`) that's only meaningful inside the target app; only forward http(s)
// values. Also Adjust universal links
// (<id>.adj.st/<path>?adj_fallback=<target>, also on <id>.tr.adj.st), whose web destination is in
// adj_redirect_windows, adj_redirect, the older adjust_fallback or adj_fallback.
export const unwrapAdjust: UrlUnwrapper = (url) => {
  return unwrapTracker(url) ?? unwrapUniversalLink(url)
}
