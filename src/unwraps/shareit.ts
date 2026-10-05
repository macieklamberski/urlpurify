import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// MyCommerce Share-it affiliate link
// (www.shareit.com/affiliate.html?affiliateid=<id>&publisherid=<id>&target=<target>), which went
// through esales.element5.com to the target in captures from 2013. Not included in
// defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapShareit: UrlUnwrapper = createParamExtractor({
  hosts: 'www.shareit.com',
  path: '/affiliate.html',
  params: ['target'],
})
