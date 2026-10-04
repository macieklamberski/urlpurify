import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const trackPathRegex = /^\/(?:(?:(?:trace\/)?link|l)\/[^/]+)?$/

const extractTarget = createParamExtractor({
  domains: 'mailtrack.io',
  params: ['url'],
})

// Mailtrack email click tracker (mailtrack.io/{trace/link,link,l}/<id>?url=<target>, also
// mailtrack.io/?url=<target>), on mailtrack.io and its subdomains.
export const unwrapMailtrack: UrlUnwrapper = (url) => {
  if (!trackPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
