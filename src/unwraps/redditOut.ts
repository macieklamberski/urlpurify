import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const outPathRegex = /^\/(?:t\d_[a-z0-9]+)?$/

const extractTarget = createParamExtractor({
  hosts: 'out.reddit.com',
  params: ['url'],
})

// Reddit outbound click tracker (out.reddit.com/t3_<id>?url=<target>, also out.reddit.com/?url=).
export const unwrapRedditOut: UrlUnwrapper = (url) => {
  if (!outPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
