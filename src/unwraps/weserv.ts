import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

const hosts = ['images.weserv.nl', 'wsrv.nl']

// weserv image proxy (wsrv.nl/?url=<source>). weserv reads a raw `+` in the source literally.
// Not included in defaultUnwrappers: unwrapping swaps the resized copy for the original image.
export const unwrapWeserv: UrlUnwrapper = createQueryUnwrapper({
  hosts,
  path: '/',
  params: ['url'],
  index: -1,
  plus: 'keep',
  ignoreLinkFragment: true,
})
