import { createQueryUnwrapper } from '../utils.js'

// Calendly outbound link (calendly.com/url?q=<target>).
export const unwrapCalendly = createQueryUnwrapper({
  hosts: ['calendly.com', 'www.calendly.com'],
  path: '/url',
  params: ['q'],
})
