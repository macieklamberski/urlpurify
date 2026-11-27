import { createPathUnwrapper } from '../pathTarget.js'

const campaignPrefixRegex = /^\/p\/[A-Z0-9]{5}\//i

// Arttrack download measurement prefix (arttrk.com/p/<campaign id>/<target>), where the target
// drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapArttrack = createPathUnwrapper({
  hosts: 'arttrk.com',
  prefix: campaignPrefixRegex,
})
