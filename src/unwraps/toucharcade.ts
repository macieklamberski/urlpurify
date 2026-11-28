import { createPathUnwrapper } from '../pathTarget.js'

const prefixRegex = /^\/link\//i

// TouchArcade outbound link (toucharcade.com/link/<target>).
// Opt-in: unwrapping drops the publisher's commission. The redirect goes through TouchArcade's
// Georiot affiliate link.
export const unwrapToucharcade = createPathUnwrapper({
  hosts: ['toucharcade.com', 'www.toucharcade.com'],
  prefix: prefixRegex,
})
