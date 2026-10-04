import { createParamExtractor } from '../utils.js'

// Flipboard outbound redirect (flipboard.com/redirect?url=<target>), on flipboard.com and every
// subdomain.
export const unwrapFlipboard = createParamExtractor({
  domains: 'flipboard.com',
  path: '/redirect',
  params: ['url'],
})
