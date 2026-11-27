import { createQueryUnwrapper } from '../utils.js'

// Twitter email notification click redirect (t.co/redirect?url=<target>&sig=<sig>).
export const unwrapTwitterRedirect = createQueryUnwrapper({
  hosts: 't.co',
  path: '/redirect',
  params: ['url'],
})
