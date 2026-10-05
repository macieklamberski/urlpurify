import { createParamExtractor } from '../utils.js'

// Webgains affiliate click (track.webgains.com/click.html?wgtarget=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapWebgains = createParamExtractor({
  hosts: 'track.webgains.com',
  path: '/click.html',
  params: ['wgtarget'],
})
