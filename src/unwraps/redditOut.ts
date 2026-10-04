import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const outPathRegex = /^\/(?:t\d_[a-z0-9]+)?$/

const extractTarget = createParamExtractor({
  domains: 'reddit.com',
  params: ['url'],
})

// Reddit outbound click tracker (out.reddit.com/t3_<id>?url=<target>, also out.reddit.com/?url=),
// on reddit.com and its subdomains.
export const unwrapRedditOut: UrlUnwrapper = (url) => {
  if (!outPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
