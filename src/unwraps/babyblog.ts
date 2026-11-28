import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

// Babyblog outbound link shim (www.babyblog.ru/redirect.php?v=1&l=<target>). The platform closed,
// and captures up to 2012 show the shim forwarding to the target.
export const unwrapBabyblog: UrlUnwrapper = createQueryUnwrapper({
  hosts: ['www.babyblog.ru', 'babyblog.ru'],
  path: '/redirect.php',
  params: ['l'],
})
