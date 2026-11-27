import { createPathUnwrapper } from '../pathTarget.js'

const tunisPrefixRegex = /^\/tunis\//i

// Hong Kong government Simplified Chinese converter (sc.isd.gov.hk/TuniS/<target host>/<path>,
// often with a doubled slash or the target's scheme kept), which serves a government page
// converted from Traditional Chinese.
// Not included in defaultUnwrappers: unwrapping returns the original page, not the converted copy.
export const unwrapHongKongTunis = createPathUnwrapper({
  hosts: 'sc.isd.gov.hk',
  prefix: tunisPrefixRegex,
})
