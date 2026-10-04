import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const pathRegex = /^\/c\/\d+\/\d+\/\d+$/
const encodedSchemeRegex = /^https?%3A/i

// Impact click tracker on any host
// (<vanity host>/c/<publisher id>/<ad id>/<campaign id>?u=<target>).
// Opt-in: unwrapping removes the publisher's commission. Merchants run it on their own hosts.
export const unwrapImpact: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  let target = url.searchParams.get('u')

  // A target encoded twice still holds an encoded scheme after one decode.
  if (target && encodedSchemeRegex.test(target)) {
    try {
      target = decodeURIComponent(target)
    } catch {}
  }

  if (target && isHttpUrl(target)) {
    return target
  }
}
