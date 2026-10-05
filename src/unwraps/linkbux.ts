import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const pathRegex = /^\/track\/[\w-]+$/

const extractTarget = createParamExtractor({
  hosts: 'www.linkbux.com',
  params: ['url'],
})

// Linkbux affiliate click (www.linkbux.com/track/<token>?url=<target>). Not included in
// defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapLinkbux: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
