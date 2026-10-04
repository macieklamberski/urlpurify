import { createParamExtractor } from '../utils.js'

// Meta link shim (l.facebook.com/l.php?u=<target>, also lm., www., upload., m., web., pt-br.,
// free., business., 0. and bare facebook.com, and l.messenger.com).
export const unwrapFacebookShim = createParamExtractor({
  hosts: [
    'l.facebook.com',
    'lm.facebook.com',
    'www.facebook.com',
    'upload.facebook.com',
    'm.facebook.com',
    'web.facebook.com',
    'pt-br.facebook.com',
    'free.facebook.com',
    'business.facebook.com',
    '0.facebook.com',
    'facebook.com',
    'l.messenger.com',
  ],
  path: '/l.php',
  params: ['u'],
})
