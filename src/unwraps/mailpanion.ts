import { createParamExtractor } from '../utils.js'

// Mailpanion email click tracker (mailpanion.com/?destination=<target>), on mailpanion.com and its
// subdomains.
export const unwrapMailpanion = createParamExtractor({
  domains: 'mailpanion.com',
  path: '/',
  params: ['destination'],
})
