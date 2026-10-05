import { createParamExtractor } from '../utils.js'

// Canva outbound link in published designs (www.canva.com/link?target=<target>).
export const unwrapCanva = createParamExtractor({
  hosts: 'www.canva.com',
  path: '/link',
  params: ['target'],
})
