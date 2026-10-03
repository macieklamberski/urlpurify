import { createParamExtractor } from '../utils.js'

// Skimlinks affiliate redirect (go.skimresources.com/?url=<target>,
// go.skimlinks.com/?url=<target>).
export const unwrapSkimlinks = createParamExtractor({
  hosts: ['go.skimresources.com', 'go.skimlinks.com'],
  params: ['url'],
})
