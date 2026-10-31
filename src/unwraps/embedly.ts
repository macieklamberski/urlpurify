import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// Embedly embed frame around the provider's player
// (cdn.embedly.com/widgets/media.html?src=<player>&url=<page>). The provider's page in `url` comes
// first, and the player in `src` stands in when the frame names no page.
// Not included in defaultUnwrappers: unwrapping swaps the site's frame for the provider's page.
export const unwrapEmbedly: UrlUnwrapper = createParamExtractor({
  hosts: ['cdn.embedly.com', 'www.embedly.com'],
  path: '/widgets/media.html',
  params: ['url', 'src'],
})
