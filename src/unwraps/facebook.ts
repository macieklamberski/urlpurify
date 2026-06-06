import { createParamExtractor } from '../utils.js'

// Facebook link shim (l.facebook.com/l.php?u=<target>).
export const unwrapFacebookShim = createParamExtractor({
  hosts: ['l.facebook.com', 'lm.facebook.com'],
  path: '/l.php',
  params: ['u'],
})
