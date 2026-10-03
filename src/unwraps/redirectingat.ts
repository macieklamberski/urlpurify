import { createParamExtractor } from '../utils.js'

// Skimlinks family affiliate redirect (go.redirectingat.com/?url=<target>, also on the
// wordpress. subdomain).
export const unwrapRedirectingat = createParamExtractor({
  hosts: ['redirectingat.com', 'go.redirectingat.com', 'wordpress.redirectingat.com'],
  params: ['url'],
})
