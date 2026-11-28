import { createPathUnwrapper } from '../pathTarget.js'

const accountPrefixRegex = /^\/[a-z0-9]{6}\//

// SoundStack download measurement prefix (enrichment.soundstack.com/<account id>/<target>), where
// the target drops its scheme.
// Opt-in: unwrapping removes the publisher's download counts.
export const unwrapSoundstack = createPathUnwrapper({
  hosts: 'enrichment.soundstack.com',
  prefix: accountPrefixRegex,
})
