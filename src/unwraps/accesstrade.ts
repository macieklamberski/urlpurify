import { isHostOrSubdomainOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const domains = ['accesstrade.net', 'accesstrade.vn', 'accesstrade.com.vn', 'accesstrade.in.th']
const pathRegex = /^\/(?:sp\/cc|at\/c\.html|adv\.php|deep_link\/\d+(?:\/\d+)?)$/

// Accesstrade affiliate redirect (h.accesstrade.net/sp/cc?url=<target>, www.accesstrade.net/at/c.html,
// click.accesstrade.vn/adv.php and fast.accesstrade.com.vn/deep_link/<id>).
// Opt-in: unwrapping removes the publisher's commission.
export const unwrapAccesstrade: UrlUnwrapper = (url) => {
  if (!isHostOrSubdomainOf(url, domains) || !pathRegex.test(url.pathname)) {
    return
  }

  return url.searchParams.get('url') || undefined
}
