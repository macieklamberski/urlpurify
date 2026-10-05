import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const pathRegex = /^\/\d+\/cookie$/

// Cleverbridge affiliate cookie redirect on any host
// (<store host>/<client id>/cookie?affiliate=<id>&redirectto=<target>).
// Opt-in: unwrapping removes the publisher's commission. Merchants run it on their own store hosts.
export const unwrapCleverbridge: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname) || !url.searchParams.has('affiliate')) {
    return
  }

  const target = url.searchParams.get('redirectto')

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
