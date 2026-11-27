import { createQueryUnwrapper } from '../utils.js'

// The counter id.
const pathRegex = /^\/na\/[0-9a-f]+$/i

// VG Wort count-and-forward link for downloads (vg01.met.vgwort.de/na/<counter id>?l=<target>).
// Opt-in: the count pays the author's VG Wort royalty, so unwrapping drops it.
export const unwrapVgWort = createQueryUnwrapper({
  subdomains: 'met.vgwort.de',
  // The counting hosts are numbered, vg00 to vg08, with an ssl- variant.
  match: /^(?:ssl-)?vg\d+\.met\.vgwort\.de$/,
  path: pathRegex,
  params: ['l'],
})
