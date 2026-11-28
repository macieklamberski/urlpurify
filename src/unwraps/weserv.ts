import { createQueryUnwrapper } from '../utils.js'

// weserv image proxy (wsrv.nl/?url=<source>). weserv reads a raw `+` in the source literally.
// Opt-in: unwrapping swaps the resized or optimized copy for the original image.
export const unwrapWeserv = createQueryUnwrapper({
  hosts: ['images.weserv.nl', 'wsrv.nl', 'www.wsrv.nl'],
  path: '/',
  params: ['url'],
  index: -1,
  plus: 'keep',
  ignoreLinkFragment: true,
})
