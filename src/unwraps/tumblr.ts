import { createQueryUnwrapper } from '../utils.js'

// Tumblr outbound redirect (t.umblr.com/redirect?z=<target>).
export const unwrapTumblr = createQueryUnwrapper({
  hosts: 't.umblr.com',
  path: '/redirect',
  params: ['z'],
})
