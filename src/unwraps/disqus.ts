import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const paths = ['/', '/url']

const extractTarget = createParamExtractor({
  hosts: 'disq.us',
  params: ['url'],
})

// Disqus outbound link redirect (disq.us/url?url=<target> and disq.us/?url=<target>).
export const unwrapDisqus: UrlUnwrapper = (url) => {
  if (!paths.includes(url.pathname)) {
    return
  }

  return extractTarget(url)
}
