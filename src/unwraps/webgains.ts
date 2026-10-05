import { createParamExtractor } from '../utils.js'

// Webgains affiliate click (track.webgains.com/click.html?wgtarget=<target>), also served from
// the Webgains-owned assets.ikhnaie.link and assets.ikhnaie.me.
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapWebgains = createParamExtractor({
  hosts: ['track.webgains.com', 'assets.ikhnaie.link', 'assets.ikhnaie.me'],
  path: '/click.html',
  params: ['wgtarget'],
})
