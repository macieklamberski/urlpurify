import { createQueryUnwrapper } from '../utils.js'

// DuckDuckGo image proxy (external-content.duckduckgo.com/iu/?u=<source>).
// Opt-in: unwrapping swaps the proxied copy for the original image.
export const unwrapDuckduckgoImage = createQueryUnwrapper({
  hosts: ['external-content.duckduckgo.com', 'images.duckduckgo.com', 'proxy.duckduckgo.com'],
  path: '/iu/',
  params: ['u'],
  ignoreLinkFragment: true,
})
