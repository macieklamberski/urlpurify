import { createPathUnwrapper } from '../pathTarget.js'

const campaignPrefixRegex = /^\/[\w-]{22}\//

// ZayAds download measurement prefix (track.zayads.ru/<campaign id>/<target>), where the
// campaign id is 22 base64url characters and the target keeps its scheme.
// Opt-in: unwrapping removes the podcaster's download counts.
export const unwrapZayads = createPathUnwrapper({
  hosts: 'track.zayads.ru',
  prefix: campaignPrefixRegex,
})
