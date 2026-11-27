import { createPathUnwrapper } from '../pathTarget.js'

const accountPrefixRegex = /^\/[a-z0-9]{6}\//

// SoundStack download measurement prefix (enrichment.soundstack.com/<account id>/<target>), where
// the target drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapSoundstack = createPathUnwrapper({
  hosts: 'enrichment.soundstack.com',
  prefix: accountPrefixRegex,
})
