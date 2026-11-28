import { createPathUnwrapper } from '../pathTarget.js'

const showPrefixRegex = /^\/p\/[^/]+\//i

// SoundOn download measurement prefix (sw.soundon.fm/p/<show id>/<target>), where the target
// often drops its scheme.
// Opt-in: unwrapping removes the podcaster's download counts.
export const unwrapSoundOn = createPathUnwrapper({
  hosts: 'sw.soundon.fm',
  prefix: showPrefixRegex,
})
