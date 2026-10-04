import { createParamExtractor } from '../utils.js'

// Calendly outbound link (calendly.com/url?q=<target>).
export const unwrapCalendly = createParamExtractor({
  hosts: /(^|\.)calendly\.com$/,
  path: '/url',
  params: ['q'],
})
