import { createParamExtractor } from '../utils.js'

// Skimlinks affiliate redirect (go.skimresources.com/?url=<target>,
// go.skimlinks.com/?url=<target>), also on the publisher host go.nypost.com.
export const unwrapSkimlinks = createParamExtractor({
  hosts: ['go.skimresources.com', 'go.skimlinks.com', 'go.nypost.com'],
  path: '/',
  params: ['url'],
})
