import { createParamExtractor } from '../utils.js'

// gate.sc URL-shortener-style redirect (gate.sc/?url=<target>), on gate.sc and every subdomain.
export const unwrapGateSc = createParamExtractor({
  domains: 'gate.sc',
  path: '/',
  params: ['url'],
})
