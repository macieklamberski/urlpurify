import { createPathUnwrapper } from '../pathTarget.js'

const redirectPrefixRegex = /^\/r\//i

// Zencastr download measurement prefix (r.zencastr.com/r/<target> and r.zen.ai/r/<target>), where
// the target drops its scheme. Zencastr forwards to https.
// Opt-in: unwrapping removes the podcaster's download counts.
export const unwrapZencastr = createPathUnwrapper({
  hosts: ['r.zencastr.com', 'r.zen.ai'],
  prefix: redirectPrefixRegex,
})
