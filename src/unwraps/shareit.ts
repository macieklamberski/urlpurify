import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const extractAffiliate = createQueryUnwrapper({
  hosts: ['shareit.com', 'www.shareit.com', 'esd.element5.com'],
  path: '/affiliate.html',
  params: ['target'],
})

const extractSecureAffiliate = createQueryUnwrapper({
  hosts: 'secure.shareit.com',
  path: '/shareit/affiliate.html',
  params: ['target'],
})

// MyCommerce Share-it affiliate link (www.shareit.com/affiliate.html?affiliateid=<id>&target=
// <target>, also on esd.element5.com and secure.shareit.com/shareit/affiliate.html).
// Opt-in: unwrapping drops the publisher's affiliate commission.
export const unwrapShareit = createUnwrapper({
  hosts: ['shareit.com', 'www.shareit.com', 'esd.element5.com', 'secure.shareit.com'],
  unwrap: (url) => {
    return extractAffiliate(url) ?? extractSecureAffiliate(url)
  },
})
