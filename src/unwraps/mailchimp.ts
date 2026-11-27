import { createQueryUnwrapper } from '../utils.js'

const clicksPathRegex = /^\/mctx\/clicks?$/i

// Mailchimp click tracker (us<n>.mailchimp.com/mctx/clicks?url=<target>, also /mctx/click).
export const unwrapMailchimp = createQueryUnwrapper({
  subdomains: 'mailchimp.com',
  match: /^us\d+\.mailchimp\.com$/,
  path: clicksPathRegex,
  params: ['url'],
})
