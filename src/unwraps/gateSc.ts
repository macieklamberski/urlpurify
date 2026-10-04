import { createParamExtractor } from '../utils.js'

// gate.sc URL-shortener-style redirect (gate.sc/?url=<target>).
export const unwrapGateSc = createParamExtractor({
  hosts: 'gate.sc',
  path: '/',
  params: ['url'],
})
