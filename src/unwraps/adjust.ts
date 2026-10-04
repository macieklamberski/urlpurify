import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const hosts = ['app.adjust.com', 'app.adjust.net.in']
const pathRegex = /^\/[^/]+$/

// Adjust deep-link tracker (app.adjust.com/<token>?redirect=<target>, also on app.adjust.net.in).
// The `redirect` param sometimes contains a custom-scheme URI (e.g. `myapp://...`) that's only
// meaningful inside the target app; only forward http(s) values.
export const unwrapAdjust: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !pathRegex.test(url.pathname)) {
    return
  }

  const target = url.searchParams.get('redirect')
  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
