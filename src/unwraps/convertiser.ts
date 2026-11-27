import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const pathRegex = /^\/click\/[0-9a-f]{8}-[0-9a-f]{8}-[0-9a-f]{8}\/$/i

const hosts = ['converti.se']

const extractDeepLink = createQueryUnwrapper({
  hosts,
  params: ['deep_link'],
})

// Convertiser affiliate click (converti.se/click/<id>-<id>-<id>/?deep_link=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapConvertiser = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    return extractDeepLink(url)
  },
})
