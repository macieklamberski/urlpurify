import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const extractAffiliate = createParamExtractor({
  hosts: ['www.shareit.com', 'esd.element5.com'],
  path: '/affiliate.html',
  params: ['target'],
})

const extractSecureAffiliate = createParamExtractor({
  hosts: 'secure.shareit.com',
  path: '/shareit/affiliate.html',
  params: ['target'],
})

// MyCommerce Share-it affiliate link (www.shareit.com/affiliate.html?affiliateid=<id>&target=
// <target>, also on esd.element5.com and secure.shareit.com/shareit/affiliate.html). Opt-in:
// unwrapping drops the publisher's affiliate commission.
export const unwrapShareit: UrlUnwrapper = (url) => {
  return extractAffiliate(url) ?? extractSecureAffiliate(url)
}
