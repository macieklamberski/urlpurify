import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// The counting hosts are numbered, vg00 to vg08, with an ssl- variant.
const hostRegex = /^(?:ssl-)?vg\d+\.met\.vgwort\.de$/

// The counter id.
const pathRegex = /^\/na\/[0-9a-f]+$/

const extractTarget = createParamExtractor({
  hosts: hostRegex,
  params: ['l'],
})

// VG Wort count-and-forward link for downloads (vg01.met.vgwort.de/na/<counter id>?l=<target>).
// Opt-in: the count pays the author's VG Wort royalty, so unwrapping drops it.
export const unwrapVgWort: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
