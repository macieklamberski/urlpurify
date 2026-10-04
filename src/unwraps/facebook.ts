import { createParamExtractor } from '../utils.js'

// Meta link shim (l.facebook.com, lm.facebook.com, www.facebook.com, upload.facebook.com and
// l.messenger.com /l.php?u=<target>).
export const unwrapFacebookShim = createParamExtractor({
  hosts: [
    'l.facebook.com',
    'lm.facebook.com',
    'www.facebook.com',
    'upload.facebook.com',
    'l.messenger.com',
  ],
  path: '/l.php',
  params: ['u'],
})
