import { createPathUnwrapper } from '../pathTarget.js'

const flexPrefixRegex = /^\/s\/[^/]+\/u\//i

// Acast prefix for shows hosted elsewhere (flex2.acast.com/s/<show>/u/<target>), where the target
// drops its scheme. Acast measures downloads and inserts ads through it.
// Opt-in: unwrapping removes the podcaster's download counts.
export const unwrapAcast = createPathUnwrapper({
  hosts: 'flex2.acast.com',
  prefix: flexPrefixRegex,
  scheme: 'inherit',
})
