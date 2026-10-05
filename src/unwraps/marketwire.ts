import { createParamExtractor } from '../utils.js'

// Marketwire release click tracker (ctt.marketwire.com/?release=<id>&id=<id>&type=1&url=<target>).
export const unwrapMarketwire = createParamExtractor({
  hosts: 'ctt.marketwire.com',
  path: '/',
  params: ['url'],
})
