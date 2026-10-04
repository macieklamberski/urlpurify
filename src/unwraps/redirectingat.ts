import { createParamExtractor } from '../utils.js'

// Skimlinks family affiliate redirect (go.redirectingat.com/?url=<target>, also on
// redirectingat.com, wordpress.redirectingat.com and every other redirectingat.com subdomain).
export const unwrapRedirectingat = createParamExtractor({
  domains: 'redirectingat.com',
  path: '/',
  params: ['url'],
})
