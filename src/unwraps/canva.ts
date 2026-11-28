import { createQueryUnwrapper } from '../utils.js'

// Canva outbound link in published designs (www.canva.com/link?target=<target>).
export const unwrapCanva = createQueryUnwrapper({
  hosts: ['www.canva.com', 'canva.com'],
  path: '/link',
  params: ['target'],
})
