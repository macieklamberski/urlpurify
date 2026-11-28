import { createQueryUnwrapper } from '../utils.js'

// Instagram outbound link shim (l.instagram.com/?u=<target>, also lm.instagram.com).
export const unwrapInstagram = createQueryUnwrapper({
  hosts: ['l.instagram.com', 'lm.instagram.com'],
  path: '/',
  params: ['u'],
})
