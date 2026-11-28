import { createQueryUnwrapper } from '../utils.js'

// Federated Media ad click (r1.fmpub.net/?k1=<id>&k2=<id>&r=<target>).
// Opt-in: unwrapping removes the click attribution.
export const unwrapFederatedMedia = createQueryUnwrapper({
  hosts: 'r1.fmpub.net',
  path: '/',
  params: ['r'],
})
