import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const clicksPathRegex = /^\/mctx\/clicks?$/

const extractTarget = createParamExtractor({
  domains: 'mailchimp.com',
  params: ['url'],
})

// Mailchimp click tracker (<list>.mailchimp.com/mctx/clicks?url=<target>, also /mctx/click), on
// mailchimp.com and every subdomain.
export const unwrapMailchimp: UrlUnwrapper = (url) => {
  if (!clicksPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
