import { resolvePathTarget } from '../pathTarget.js'
import { createUnwrapper, httpSchemeRegex } from '../utils.js'

const pathRegex = /^\/\d+\/(?:banner\/|int\/)?(?<target>.+)$/i
// A scheme-less target starts with a dotted host, which tells it from a custom alias.
const hostRegex = /^[\da-z-]+(?:\.[\da-z-]+)+(?:[/:]|$)/i

// Adfly ad interstitial (adf.ly/<user id>/<target>, also adf.ly/<user id>/banner/<target> and
// adf.ly/<user id>/int/<target>, and the same on its q.gs domain), with or without the target's
// scheme. Both now redirect to Linkvertise, so a wrapped link no longer reaches its target.
// Opt-in: unwrapping drops the publisher's commission. Unwrapping removes the link owner's ad
// earnings.
export const unwrapAdfly = createUnwrapper({
  hosts: ['adf.ly', 'www.adf.ly', 'q.gs', 'www.q.gs'],
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.groups?.target) {
      return
    }

    const hasScheme = httpSchemeRegex.test(match.groups.target)

    if (!hasScheme && !hostRegex.test(match.groups.target)) {
      return
    }

    // Adfly forwarded a scheme-less target over http.
    return resolvePathTarget(url, match.groups.target, 'http')
  },
})
