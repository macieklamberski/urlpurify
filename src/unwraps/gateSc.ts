import { createQueryUnwrapper } from '../utils.js'

// gate.sc URL-shortener-style redirect (gate.sc/?url=<target>).
// Opt-in: unwrapping removes the advertiser's click count.
export const unwrapGateSc = createQueryUnwrapper({
  hosts: ['gate.sc', 'www.gate.sc'],
  path: '/',
  params: ['url'],
})
