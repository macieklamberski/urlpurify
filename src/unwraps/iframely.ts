import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// Iframely embed frame around the provider's player (cdn.iframe.ly/api/iframe?url=<page>).
// The short-id frame, cdn.iframe.ly/<id>, holds no target and stays wrapped.
// Not included in defaultUnwrappers: unwrapping swaps the site's frame for the provider's page.
export const unwrapIframely: UrlUnwrapper = createParamExtractor({
  hosts: ['cdn.iframe.ly', 'iframely.net'],
  path: '/api/iframe',
  params: ['url'],
})
