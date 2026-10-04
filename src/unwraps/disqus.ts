import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const paths = ['/', '/url']

const extractTarget = createParamExtractor({
  domains: 'disq.us',
  params: ['url'],
})

// Disqus outbound link redirect (disq.us/url?url=<target> and disq.us/?url=<target>), on the domain
// and every subdomain.
export const unwrapDisqus: UrlUnwrapper = (url) => {
  if (!paths.includes(url.pathname)) {
    return
  }

  return extractTarget(url)
}
