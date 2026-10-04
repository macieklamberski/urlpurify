import { createParamExtractor } from '../utils.js'

// Meta link shim (l.facebook.com/l.php?u=<target>, also lm., www., upload. and l.messenger.com),
// on facebook.com, messenger.com and every subdomain.
export const unwrapFacebookShim = createParamExtractor({
  domains: ['facebook.com', 'messenger.com'],
  path: '/l.php',
  params: ['u'],
})
