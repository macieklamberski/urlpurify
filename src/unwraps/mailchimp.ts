import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const clicksPathRegex = /^\/mctx\/clicks?$/

const extractTarget = createParamExtractor({
  hosts: /^us\d+\.mailchimp\.com$/,
  params: ['url'],
})

// Mailchimp click tracker (us<n>.mailchimp.com/mctx/clicks?url=<target>, also /mctx/click).
export const unwrapMailchimp: UrlUnwrapper = (url) => {
  if (!clicksPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
