import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// Klook affiliate redirect (affiliate.klook.com/redirect?k_site=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapKlook: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'affiliate.klook.com') || url.pathname !== '/redirect') {
    return
  }

  // A link pasted into another one leaves a second `k_site`, and the last holds the clean target.
  const target = url.searchParams.getAll('k_site').at(-1)

  if (target && isHttpUrl(target)) {
    return target
  }
}
