import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const encodedSchemeRegex = /^https?%3A/i

// 2Checkout affiliate redirect (secure.2checkout.com/affiliate.php?ACCOUNT=<merchant>&AFFILIATE=<id>
// &PATH=<target>), also on the former secure.avangate.com and on merchants' own store hosts, such as
// store.<merchant>.com. Each merchant runs it on its own domain, so the exact path, both ids and an
// http `PATH` are the guard, not the host. Opt-in: unwrapping drops the affiliate's commission.
export const unwrapTwoCheckout: UrlUnwrapper = (url) => {
  if (url.pathname !== '/affiliate.php') {
    return
  }

  if (!url.searchParams.get('ACCOUNT') || !url.searchParams.get('AFFILIATE')) {
    return
  }

  let target = url.searchParams.get('PATH')

  // A carrier that encoded its target twice still holds an encoded scheme after one decode.
  if (target && encodedSchemeRegex.test(target)) {
    try {
      target = decodeURIComponent(target)
    } catch {}
  }

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
