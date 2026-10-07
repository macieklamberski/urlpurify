import { createParamExtractor } from '../utils.js'

// Twitter email notification click redirect (t.co/redirect?url=<target>&sig=<sig>).
export const unwrapTwitterRedirect = createParamExtractor({
  hosts: 't.co',
  path: '/redirect',
  params: ['url'],
})
