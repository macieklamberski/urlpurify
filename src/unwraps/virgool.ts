import { createParamExtractor } from '../utils.js'

// Virgool outbound link redirect (l.vrgl.ir/r?l=<target>&u=<user>&st=post&si=<post>&k=<sig>).
export const unwrapVirgool = createParamExtractor({
  hosts: 'l.vrgl.ir',
  path: '/r',
  params: ['l'],
})
