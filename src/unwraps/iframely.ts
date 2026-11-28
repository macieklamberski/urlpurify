import { createQueryUnwrapper } from '../utils.js'

// Iframely embed frame around the provider's player (cdn.iframe.ly/api/iframe?url=<page>).
// The short-id frame, cdn.iframe.ly/<id>, holds no target and stays wrapped.
// Opt-in: unwrapping swaps the site's frame for the provider's page.
export const unwrapIframely = createQueryUnwrapper({
  hosts: ['cdn.iframe.ly', 'iframely.net', 'www.iframely.net'],
  path: '/api/iframe',
  params: ['url'],
})
