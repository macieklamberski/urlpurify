import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const pathRegex = /^\/c\/\d+\/\d+\/\d+$/

// Impact click tracker on any host (<vanity host>/c/<publisher id>/<ad id>/<campaign id>?u=<target>).
// Opt-in: unwrapping removes the publisher's commission. Merchants run it on their own hosts.
export const unwrapImpact: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  const target = url.searchParams.get('u')

  if (target && isHttpUrl(target)) {
    return target
  }
}
