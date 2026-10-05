import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const linkPathRegex = /^\/m?link$/

const extractTarget = createParamExtractor({
  hosts: 'tracking.vocus.io',
  params: ['url'],
})

// Vocus.io email click tracker (tracking.vocus.io/link?id=<id>&url=<target>, also /mlink).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapVocus: UrlUnwrapper = (url) => {
  if (!linkPathRegex.test(url.pathname)) {
    return
  }

  const target = extractTarget(url)

  if (!target) {
    return
  }

  // An unencoded target's fragment lands in the wrapper's own `hash`.
  return `${target}${url.hash}`
}
