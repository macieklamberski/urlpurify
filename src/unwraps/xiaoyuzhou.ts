import { createPathUnwrapper } from '../pathTarget.js'

// The prefix forwards only to media.xyzcdn.net and answers 404 for any other target.
const prefixRegex = /^\/track\/[0-9a-f]{24}\/[0-9a-f]{24}\/(?=media\.xyzcdn\.net\/)/i

// Xiaoyuzhou download measurement prefix
// (dts-api.xiaoyuzhoufm.com/track/<show>/<episode>/<target>), where the target drops its scheme.
// Opt-in: unwrapping removes the podcaster's download counts.
export const unwrapXiaoyuzhou = createPathUnwrapper({
  hosts: 'dts-api.xiaoyuzhoufm.com',
  prefix: prefixRegex,
})
