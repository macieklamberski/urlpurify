import { createQueryUnwrapper } from '../utils.js'

// Embedly embed frame around the provider's player
// (cdn.embedly.com/widgets/media.html?src=<player>&url=<page>). The player in `src` comes first,
// and the provider's page in `url` stands in when the frame names no player.
// Opt-in: unwrapping swaps the site's frame for the provider's embed.
export const unwrapEmbedly = createQueryUnwrapper({
  hosts: ['cdn.embedly.com', 'embedly.com', 'www.embedly.com'],
  path: '/widgets/media.html',
  params: ['src', 'url'],
})
