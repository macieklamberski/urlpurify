import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// Legacy replay on wayback.vefsafn.is: a 14-digit timestamp after the wayback prefix.
const waybackPathRegex = /^\/wayback\/\d{14}\/(.+)$/

// Current replay on vefsafn.is: a 14-digit timestamp with an optional mp_ modifier after the
// language prefix.
const currentPathRegex = /^\/is\/\d{14}(?:mp_)?\/(.+)$/

// Icelandic web archive snapshot, run by the National and University Library of Iceland
// (wayback.vefsafn.is/wayback/<timestamp>/<target> and vefsafn.is/is/<timestamp>[mp_]/<target>).
// Opt-in: unwrapping returns the live page, which may have changed or be gone.
export const unwrapVefsafn: UrlUnwrapper = (url) => {
  let match: RegExpExecArray | null = null

  if (isHostOf(url, 'wayback.vefsafn.is')) {
    match = waybackPathRegex.exec(url.pathname)
  }

  if (isHostOf(url, 'vefsafn.is')) {
    match = currentPathRegex.exec(url.pathname)
  }

  if (!match?.[1]) {
    return
  }

  // An unencoded target's query and fragment land in the snapshot URL's own `search` and `hash`.
  const target = `${match[1]}${url.search}${url.hash}`

  if (isHttpUrl(target)) {
    return target
  }
}
