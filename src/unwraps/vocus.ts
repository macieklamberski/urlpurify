import { createQueryUnwrapper } from '../utils.js'

const linkPathRegex = /^\/m?link$/i

// Vocus.io email click tracker (tracking.vocus.io/link?id=<id>&url=<target>, also /mlink).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapVocus = createQueryUnwrapper({
  hosts: 'tracking.vocus.io',
  path: linkPathRegex,
  params: ['url'],
})
