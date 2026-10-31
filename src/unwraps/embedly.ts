import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// Embedly embed frame around the provider's player
// (cdn.embedly.com/widgets/media.html?src=<player>&url=<page>). The player in `src` comes first,
// and the provider's page in `url` stands in when the frame names no player.
// Not included in defaultUnwrappers: unwrapping swaps the site's frame for the provider's embed.
export const unwrapEmbedly: UrlUnwrapper = createParamExtractor({
  hosts: ['cdn.embedly.com', 'www.embedly.com'],
  path: '/widgets/media.html',
  params: ['src', 'url'],
})
