import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const extractRedirect = createQueryUnwrapper({
  hosts: ['tp.media', 'www.tp.media'],
  path: '/r',
  params: ['u'],
})

const extractClick = createQueryUnwrapper({
  subdomains: 'travelpayouts.com',
  match: /^c\d+\.travelpayouts\.com$/,
  path: '/click',
  params: ['custom_url'],
})

// Travelpayouts affiliate redirect (tp.media/r?u=<target>) and its older custom link
// (c<n>.travelpayouts.com/click?custom_url=<target>).
// Opt-in: unwrapping drops the publisher's affiliate commission.
export const unwrapTravelpayouts = createUnwrapper({
  domains: ['tp.media', 'travelpayouts.com'],
  unwrap: (url) => {
    return extractRedirect(url) ?? extractClick(url)
  },
})
