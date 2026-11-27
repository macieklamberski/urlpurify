import { getQueryParam, isAnyOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

// 2Checkout affiliate redirect on secure.2checkout.com, secure.avangate.com and merchants' hosts:
// /affiliate.php?ACCOUNT=<merchant>&AFFILIATE=<id>&PATH=<target>. The path, both ids and an http
// `PATH` are the guard, not the host. Opt-in: unwrapping drops the affiliate's commission.
export const unwrapTwoCheckout: UrlUnwrapper = (url) => {
  if (!isAnyOf(url.pathname, '/affiliate.php')) {
    return
  }

  if (!getQueryParam(url, 'ACCOUNT') || !getQueryParam(url, 'AFFILIATE')) {
    return
  }

  const target = getParamTarget(url, 'PATH')

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
