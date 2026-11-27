import { createQueryUnwrapper } from '../utils.js'

// Marketwire release click tracker (ctt.marketwire.com/?release=<id>&id=<id>&type=1&url=<target>).
export const unwrapMarketwire = createQueryUnwrapper({
  hosts: 'ctt.marketwire.com',
  path: '/',
  params: ['url'],
})
