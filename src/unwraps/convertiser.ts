import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/click\/[0-9a-f]{8}-[0-9a-f]{8}-[0-9a-f]{8}\/$/i

const extractDeepLink = createQueryUnwrapper({
  hosts: 'converti.se',
  params: ['deep_link'],
})

// Convertiser affiliate click (converti.se/click/<id>-<id>-<id>/?deep_link=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapConvertiser: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractDeepLink(url)
}
