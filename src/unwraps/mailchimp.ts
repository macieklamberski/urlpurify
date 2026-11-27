import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

const clicksPathRegex = /^\/mctx\/clicks?$/i

const extractTarget = createQueryUnwrapper({
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
