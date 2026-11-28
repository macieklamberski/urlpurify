import { createQueryUnwrapper } from '../utils.js'

// Yahoo Mail image proxy (ecp.yusercontent.com/mail?url=<source>).
// Opt-in: unwrapping swaps the resized or optimized copy for the original image.
export const unwrapYahooMailImage = createQueryUnwrapper({
  hosts: 'ecp.yusercontent.com',
  path: '/mail',
  params: ['url'],
  index: -1,
  plus: 'keep',
  ignoreLinkFragment: true,
})
