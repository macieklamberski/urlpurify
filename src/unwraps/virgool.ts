import { createQueryUnwrapper } from '../utils.js'

// Virgool outbound link redirect (l.vrgl.ir/r?l=<target>&u=<user>&st=post&si=<post>&k=<sig>).
export const unwrapVirgool = createQueryUnwrapper({
  hosts: 'l.vrgl.ir',
  path: '/r',
  params: ['l'],
})
