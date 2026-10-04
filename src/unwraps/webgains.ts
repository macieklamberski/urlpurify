import { createParamExtractor } from '../utils.js'

// Webgains affiliate click (track.webgains.com/click.html?wgtarget=<target>), on every subdomain.
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapWebgains = createParamExtractor({
  domains: 'webgains.com',
  path: '/click.html',
  params: ['wgtarget'],
})
