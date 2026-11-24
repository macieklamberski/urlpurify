import { createQueryUnwrapper } from '../utils.js'

// gate.sc URL-shortener-style redirect (gate.sc/?url=<target>).
export const unwrapGateSc = createQueryUnwrapper({
  hosts: 'gate.sc',
  path: '/',
  params: ['url'],
})
