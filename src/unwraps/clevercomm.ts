import { createParamExtractor } from '../utils.js'

// CleverComm newsletter click tracker (editor.clevercomm.com/y.z?l=<target>&j=<n>&e=<n>&t=h).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapClevercomm = createParamExtractor({
  hosts: 'editor.clevercomm.com',
  path: '/y.z',
  params: ['l'],
})
