import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const unwrapRedirect = createParamExtractor({
  hosts: 'tp.media',
  path: '/r',
  params: ['u'],
})

const unwrapClick = createParamExtractor({
  hosts: /^c\d+\.travelpayouts\.com$/,
  path: '/click',
  params: ['custom_url'],
})

// Travelpayouts affiliate redirect (tp.media/r?u=<target>) and its older custom link
// (c<n>.travelpayouts.com/click?custom_url=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapTravelpayouts: UrlUnwrapper = (url) => {
  return unwrapRedirect(url) ?? unwrapClick(url)
}
