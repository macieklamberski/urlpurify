import { createParamExtractor } from '../utils.js'

// Idealo German shopping affiliate (www.idealo-partner.com/?trg=<target>), on idealo-partner.com
// and every subdomain.
export const unwrapIdealoPartner = createParamExtractor({
  domains: 'idealo-partner.com',
  path: '/',
  params: ['trg'],
})
