import { createParamExtractor } from '../utils.js'

// LianDi community outbound link redirect (ld246.com/forward?goto=<target>), also on link.ld246.com.
export const unwrapLd246 = createParamExtractor({
  hosts: ['ld246.com', 'link.ld246.com'],
  path: '/forward',
  params: ['goto'],
})
