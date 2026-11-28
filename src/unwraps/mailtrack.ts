import { createQueryUnwrapper } from '../utils.js'

const trackPathRegex = /^\/(?:(?:(?:trace\/)?link|l)\/[^/]+)?$/i

// Mailtrack email click tracker (mailtrack.io/{trace/link,link,l}/<id>?url=<target>, also
// mailtrack.io/?url=<target>).
export const unwrapMailtrack = createQueryUnwrapper({
  hosts: ['mailtrack.io', 'www.mailtrack.io'],
  path: trackPathRegex,
  params: ['url'],
})
