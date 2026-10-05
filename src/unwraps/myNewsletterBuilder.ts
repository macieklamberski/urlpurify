import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// My Newsletter Builder click tracker (report.mnb.email/t.js?s=<id>&u=<id>&key=<key>&url=<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapMyNewsletterBuilder: UrlUnwrapper = createParamExtractor({
  hosts: 'report.mnb.email',
  path: '/t.js',
  params: ['url'],
})
