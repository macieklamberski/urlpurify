import { createQueryUnwrapper } from '../utils.js'

// Topsec email link scanner (scanner.topsec.com/?d=<n>&r=<mode>&u=<target>&t=<signature>).
// Opt-in: unwrapping skips the gateway's click-time check of the target.
export const unwrapTopsec = createQueryUnwrapper({
  hosts: 'scanner.topsec.com',
  path: '/',
  params: ['u'],
})
