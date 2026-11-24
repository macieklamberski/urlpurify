import { createQueryUnwrapper } from '../utils.js'

// LianDi community outbound link redirect (ld246.com/forward?goto=<target>), also on link.ld246.com
// and the old hacpai.com and link.hacpai.com.
export const unwrapLd246 = createQueryUnwrapper({
  hosts: ['hacpai.com', 'ld246.com', 'link.hacpai.com', 'link.ld246.com'],
  path: '/forward',
  params: ['goto'],
})
