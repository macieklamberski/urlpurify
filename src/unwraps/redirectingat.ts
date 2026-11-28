import { createQueryUnwrapper } from '../utils.js'

// Skimlinks family affiliate redirect (go.redirectingat.com/?url=<target>, also on
// redirectingat.com and wordpress.redirectingat.com).
// Opt-in: unwrapping removes the publisher's commission.
export const unwrapRedirectingat = createQueryUnwrapper({
  hosts: [
    'redirectingat.com',
    'www.redirectingat.com',
    'go.redirectingat.com',
    'wordpress.redirectingat.com',
  ],
  path: '/',
  params: ['url'],
})
