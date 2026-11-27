import { createQueryUnwrapper } from '../utils.js'

const clickPathRegex = /^\/h\/(?:i\/[A-Za-z0-9]+\/)?[A-Za-z0-9]+$/i

// Bananatag email click tracker (s.bl-1.com/h/<id>?url=<target>, also /h/i/<id>/<id>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapBananatag = createQueryUnwrapper({
  hosts: ['s.bl-1.com', 's2.bl-1.com', 'microsoft.bl-1.com'],
  path: clickPathRegex,
  params: ['url'],
})
