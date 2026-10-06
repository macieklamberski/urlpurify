import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const trackPathRegex = /^\/tt\/[\da-f]{40}\/[\da-f]{32}\/[\da-f]{32}\/(.+)$/
const linkPathRegex = /^\/tl\/[\da-f]{40}\/[\da-f]{32}\/[\da-f]{32}$/

const extractLinkTarget = createParamExtractor({
  hosts: 't.yesware.com',
  params: ['ytl'],
})

// Yesware email click tracker (t.yesware.com/tt/<ids>/<target>, with the target's scheme dropped,
// also t.yesware.com/tl/<ids>?ytl=<target>).
// Not included in defaultUnwrappers: unwrapping removes the sender's click stats.
export const unwrapYesware: UrlUnwrapper = (url) => {
  if (linkPathRegex.test(url.pathname)) {
    return extractLinkTarget(url)
  }

  if (!isHostOf(url, 't.yesware.com')) {
    return
  }

  const match = trackPathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  // Yesware keeps the scheme server-side, http on most archived links, and an https site
  // redirects from http.
  const target = `http://${match[1]}${url.search}${url.hash}`

  if (isHttpUrl(target)) {
    return target
  }
}
