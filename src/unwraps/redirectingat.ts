import { createQueryUnwrapper } from '../utils.js'

// Skimlinks family affiliate redirect (go.redirectingat.com/?url=<target>, also on
// redirectingat.com and wordpress.redirectingat.com).
export const unwrapRedirectingat = createQueryUnwrapper({
  hosts: ['redirectingat.com', 'go.redirectingat.com', 'wordpress.redirectingat.com'],
  path: '/',
  params: ['url'],
})
