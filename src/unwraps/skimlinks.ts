import { createParamExtractor } from '../utils.js'

// Skimlinks affiliate redirect (go.skimresources.com/?url=<target>, go.skimlinks.com/?url=<target>).
// Both domains match with every subdomain.
export const unwrapSkimlinks = createParamExtractor({
  domains: ['skimresources.com', 'skimlinks.com'],
  path: '/',
  params: ['url'],
})
