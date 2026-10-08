import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const hosts = [
  'h.accesstrade.net',
  'www.accesstrade.net',
  'click.accesstrade.vn',
  'fast.accesstrade.com.vn',
  'pub.accesstrade.vn',
  'click.accesstrade.in.th',
]
const pathRegex = /^\/(?:sp\/cc|at\/c\.html|adv\.php|deep_link\/\d+(?:\/\d+)?)$/

// Accesstrade affiliate redirect (h.accesstrade.net/sp/cc?url=<target>, /at/c.html, /adv.php and
// /deep_link/<id>, on the Japanese, Vietnamese and Thai hosts).
// Opt-in: unwrapping removes the publisher's commission.
export const unwrapAccesstrade: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !pathRegex.test(url.pathname)) {
    return
  }

  return getParamTarget(url, 'url')
}
