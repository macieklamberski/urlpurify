import { createPathUnwrapper } from '../pathTarget.js'

// The snapshot is its capture time, `YYYY-MMDD-HHMM-SS`.
const prefixRegex = /^\/\d{4}-\d{4}-\d{4}-\d{2}\//

// Megalodon archive snapshot (megalodon.jp/<YYYY-MMDD-HHMM-SS>/<target>, also on the numbered hosts
// s01 to s04.megalodon.jp).
// Opt-in: unwrapping returns the live page, which may have changed or be gone.
export const unwrapMegalodon = createPathUnwrapper({
  domains: 'megalodon.jp',
  // The main host, its www. pair and its numbered snapshot hosts, such as `s01.megalodon.jp`.
  match: /^(?:s\d{2}\.|www\.)?megalodon\.jp$/,
  prefix: prefixRegex,
  scheme: 'http', // An http target is stored with no scheme, an https one with its scheme and `:443`
})
