import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const pathRegex = /^\/\d+\/(?:banner\/|int\/)?(.+)$/
const schemeRegex = /^https?:/i
// A scheme-less target starts with a dotted host, which tells it from a custom alias.
const hostRegex = /^[\da-z-]+(?:\.[\da-z-]+)+(?:[/:]|$)/i

// Adfly ad interstitial (adf.ly/<user id>/<target>, also adf.ly/<user id>/banner/<target> and
// adf.ly/<user id>/int/<target>), with or without the target's scheme. adf.ly now redirects to
// Linkvertise, so a wrapped link no longer reaches its target.
// Not included in defaultUnwrappers: unwrapping removes the link owner's ad earnings.
export const unwrapAdfly: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'adf.ly')) {
    return
  }

  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  const hasScheme = schemeRegex.test(match[1])

  if (!hasScheme && !hostRegex.test(match[1])) {
    return
  }

  // Adfly forwarded a scheme-less target over http.
  const target = hasScheme ? match[1] : `http://${match[1]}`

  // An unencoded target's query and fragment land in the wrapper's own `search` and `hash`.
  const unwrapped = `${target}${url.search}${url.hash}`

  if (isHttpUrl(unwrapped)) {
    return unwrapped
  }
}
