import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// Google+ share (plus.google.com/share?url=<target>). The service closed in 2019 and the link now
// redirects to a shutdown notice. Opt-in: unwrapping returns the shared page, not the share form.
export const unwrapGooglePlusShare: UrlUnwrapper = createParamExtractor({
  hosts: 'plus.google.com',
  path: '/share',
  params: ['url'],
})
