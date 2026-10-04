import { createParamExtractor } from '../utils.js'

// bol.com partner program click (partner.bol.com/click/click?t=url&url=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapBolPartner = createParamExtractor({
  hosts: /(^|\.)bol\.com$/,
  path: '/click/click',
  params: ['url'],
})
