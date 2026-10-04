import { createParamExtractor } from '../utils.js'

// Calendly outbound link (calendly.com/url?q=<target>), on the domain and every subdomain.
export const unwrapCalendly = createParamExtractor({
  domains: 'calendly.com',
  path: '/url',
  params: ['q'],
})
