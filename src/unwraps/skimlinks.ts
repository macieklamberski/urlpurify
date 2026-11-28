import { createQueryUnwrapper } from '../utils.js'

// Skimlinks affiliate redirect (go.skimresources.com/?url=<target>,
// go.skimlinks.com/?url=<target>), also on the publisher host go.nypost.com.
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapSkimlinks = createQueryUnwrapper({
  hosts: ['go.skimresources.com', 'go.skimlinks.com', 'go.nypost.com'],
  path: '/',
  params: ['url'],
})
