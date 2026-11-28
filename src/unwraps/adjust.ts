import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const pathRegex = /^\/[^/]+$/

// The order a Windows desktop browser gets; a macOS-only carrier sends it elsewhere.
const extractTracker = createQueryUnwrapper({
  hosts: ['app.adjust.com', 'app.adjust.net.in'],
  path: pathRegex,
  params: ['redirect_windows', 'redirect', 'fallback'],
})

// The path is the app's own deep-link path, so any path is claimed on these hosts.
const extractUniversalLink = createQueryUnwrapper({
  subdomains: 'adj.st',
  match: /^[a-z0-9]{4}(?:\.tr)?\.adj\.st$/,
  params: ['adj_redirect_windows', 'adj_redirect', 'adjust_fallback', 'adj_fallback'],
})

// Adjust deep-link tracker (app.adjust.com/<token>?redirect=<target>, also redirect_windows and
// fallback, on app.adjust.net.in too). A param can hold the app's own scheme, `myapp://`, which
// only the app opens, so the next param holds the web target. Also Adjust universal links
// (<id>.adj.st/<path>?adj_fallback=<target>, also on <id>.tr.adj.st), whose web destination is in
// adj_redirect_windows, adj_redirect, the older adjust_fallback or adj_fallback.
// Opt-in: unwrapping removes the advertiser's click and install attribution.
export const unwrapAdjust = createUnwrapper({
  subdomains: ['adj.st', 'adjust.com', 'adjust.net.in'],
  unwrap: (url) => {
    return extractTracker(url) ?? extractUniversalLink(url)
  },
})
