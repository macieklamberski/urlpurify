import { createPathUnwrapper } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const prefixRegex = /^\/link\//i

// TouchArcade outbound link (toucharcade.com/link/<target>). Opt-in: the redirect goes
// through TouchArcade's Georiot affiliate link.
export const unwrapToucharcade: UrlUnwrapper = createPathUnwrapper({
  hosts: ['toucharcade.com', 'www.toucharcade.com'],
  prefix: prefixRegex,
})
