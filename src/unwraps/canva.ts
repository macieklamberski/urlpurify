import { createQueryUnwrapper } from '../utils.js'

// Canva outbound link in published designs (www.canva.com/link?target=<target>).
export const unwrapCanva = createQueryUnwrapper({
  hosts: ['canva.com', 'www.canva.com'],
  path: '/link',
  params: ['target'],
})
