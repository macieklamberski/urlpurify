import { createQueryUnwrapper } from '../utils.js'

// Chitika contextual ad click (linx.chitika.net/track?target=<target>). Chitika closed in 2019, and
// captures from 2009 show the click forwarding to the target.
// Opt-in: unwrapping removes the click attribution.
export const unwrapChitika = createQueryUnwrapper({
  hosts: 'linx.chitika.net',
  path: '/track',
  params: ['target'],
})
