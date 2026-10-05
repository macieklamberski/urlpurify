import { createParamExtractor } from '../utils.js'

// Topsec email link scanner (scanner.topsec.com/?d=<n>&r=<mode>&u=<target>&t=<signature>).
// Not included in defaultUnwrappers: the gateway checks the target when the link is clicked,
// so unwrapping skips the check the recipient's organization put in place.
export const unwrapTopsec = createParamExtractor({
  hosts: 'scanner.topsec.com',
  path: '/',
  params: ['u'],
})
