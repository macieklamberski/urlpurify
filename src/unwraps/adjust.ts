import { isHostOrSubdomainOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const domains = ['adjust.com', 'adjust.io']
const pathRegex = /^\/[^/]+$/

// Adjust deep-link tracker (app.adjust.com/<token>?redirect=<target>, also on adjust.io), on each
// domain and every subdomain. The `redirect` param sometimes contains a custom-scheme URI
// (e.g. `myapp://...`) that's only meaningful inside the target app; only forward http(s) values.
export const unwrapAdjust: UrlUnwrapper = (url) => {
  if (!isHostOrSubdomainOf(url, domains) || !pathRegex.test(url.pathname)) {
    return
  }

  const target = url.searchParams.get('redirect')
  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
