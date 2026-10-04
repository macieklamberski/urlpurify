import { createParamExtractor } from '../utils.js'

// Travelpayouts affiliate redirect (tp.media/r?u=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapTravelpayouts = createParamExtractor({
  hosts: /(^|\.)tp\.media$/,
  path: '/r',
  params: ['u'],
})
