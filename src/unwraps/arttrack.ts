import { createPathUnwrapper } from '../pathTarget.js'

const campaignPrefixRegex = /^\/p\/[A-Z0-9]{5}\//i

// Arttrack download measurement prefix (arttrk.com/p/<campaign id>/<target>), where the target
// drops its scheme.
// Opt-in: unwrapping removes the publisher's download counts.
export const unwrapArttrack = createPathUnwrapper({
  hosts: ['arttrk.com', 'www.arttrk.com'],
  prefix: campaignPrefixRegex,
})
