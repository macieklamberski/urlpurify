import { createParamExtractor } from '../utils.js'

// Idealo German shopping affiliate (www.idealo-partner.com/?trg=<target>), on every subdomain of
// idealo-partner.com.
export const unwrapIdealoPartner = createParamExtractor({
  hosts: /\.idealo-partner\.com$/,
  path: '/',
  params: ['trg'],
})
