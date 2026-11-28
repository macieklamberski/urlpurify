import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const pathRegex = /^\/(?:[^/]+\/)*scripts\/click\.php$/i

// Post Affiliate Pro click script, run by each merchant on its own host under any install folder
// (<host>/<folder>/scripts/click.php?a_aid=<affiliate>&a_bid=<banner>&desturl=<target>). The
// affiliate id also comes as `ref_id`, `blpid`, `bid` or `k_id`. Other scripts also answer on
// `scripts/click.php`, so the path and an http `desturl` are the guard, not the host. Opt-in:
// unwrapping drops the publisher's commission.
export const unwrapPostAffiliatePro: UrlUnwrapper = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    const target = readParamTarget(url, 'desturl')

    if (target && isHttpUrl(target)) {
      return target
    }
  },
})
