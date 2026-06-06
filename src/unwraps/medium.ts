import { createParamExtractor } from '../utils.js'

// Medium outbound link redirect (medium.com/r/?url=<target>).
export const unwrapMedium = createParamExtractor({
  hosts: 'medium.com',
  path: '/r/',
  params: ['url'],
})
