import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

// Iframely embed frame around the provider's player (cdn.iframe.ly/api/iframe?url=<page>).
// The short-id frame, cdn.iframe.ly/<id>, holds no target and stays wrapped.
// Not included in defaultUnwrappers: unwrapping swaps the site's frame for the provider's page.
export const unwrapIframely: UrlUnwrapper = createQueryUnwrapper({
  hosts: ['cdn.iframe.ly', 'iframely.net', 'www.iframely.net'],
  path: '/api/iframe',
  params: ['url'],
})
