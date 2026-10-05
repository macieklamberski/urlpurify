import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const unwrapLinkPhp = createParamExtractor({
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
    'l.workplace.com',
  ],
  path: '/l.php',
  params: ['u'],
})

const unwrapRoot = createParamExtractor({
  hosts: 'l.facebook.com',
  path: '/',
  params: ['u'],
})

const unwrapLsr = createParamExtractor({
  hosts: 'l.facebook.com',
  path: '/lsr.php',
  params: ['u'],
})

// Meta link shim (l.facebook.com/l.php?u=<target>, also lm., www., upload., m., web., pt-br.,
// free., business., 0. and bare facebook.com, l.messenger.com and l.workplace.com), and the same
// shim on the root path (l.facebook.com/?u=<target>) and on /lsr.php
// (l.facebook.com/lsr.php?u=<target>), both only on l.facebook.com.
export const unwrapFacebookShim: UrlUnwrapper = (url) => {
  return unwrapLinkPhp(url) ?? unwrapRoot(url) ?? unwrapLsr(url)
}
