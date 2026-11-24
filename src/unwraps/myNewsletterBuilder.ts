import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

// My Newsletter Builder click tracker (report.mnb.email/t.js?s=<id>&u=<id>&key=<key>&url=<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapMyNewsletterBuilder: UrlUnwrapper = createQueryUnwrapper({
  hosts: 'report.mnb.email',
  path: '/t.js',
  params: ['url'],
})
