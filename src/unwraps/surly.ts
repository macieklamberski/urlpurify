import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// The partner's toolbar id, `AA` and six digits, may follow the target.
const pathRegex = /^\/o\/([^/].*?)(?:\/AA\d{6})?$/
const schemeRegex = /^https?:\/\//i

// Sur.ly link toolbar (sur.ly/o/<target>/<partner id>, also on www.sur.ly), with the target's
// scheme usually dropped and the rest of it percent-encoded once.
// Not included in defaultUnwrappers: unwrapping removes the partner's toolbar earnings.
export const unwrapSurly: UrlUnwrapper = (url) => {
  if (!isHostOf(url, ['sur.ly', 'www.sur.ly'])) {
    return
  }

  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  let path: string

  try {
    path = decodeURIComponent(match[1])
  } catch {
    return
  }

  // Sur.ly forwards every target over https, an http-only site too, as of 2026-10-06.
  const target = `https://${path.replace(schemeRegex, '')}`

  if (isHttpUrl(target)) {
    return target
  }
}
