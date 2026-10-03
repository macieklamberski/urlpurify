import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const extractTarget = createParamExtractor({
  hosts: ['c212.net', 'edge.prnewswire.com'],
  path: '/c/link/',
  params: ['u'],
})

const encodedSchemeRegex = /^https?%3A/i

// PR Newswire release click tracker (c212.net / edge.prnewswire.com /c/link/?u=<target>).
export const unwrapPrNewswire: UrlUnwrapper = (url) => {
  let target = extractTarget(url)

  if (!target) {
    return
  }

  // Some releases encode the target twice.
  if (encodedSchemeRegex.test(target)) {
    try {
      target = decodeURIComponent(target)
    } catch {
      return
    }
  }

  if (isHttpUrl(target)) {
    return target
  }
}
