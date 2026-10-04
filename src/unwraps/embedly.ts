import { createParamExtractor } from '../utils.js'

// Embedly oEmbed widget proxy (cdn.embedly.com/widgets/media.html?src=<target>), on embedly.com,
// embed.ly and every subdomain.
export const unwrapEmbedly = createParamExtractor({
  domains: ['embedly.com', 'embed.ly'],
  path: '/widgets/media.html',
  params: ['src'],
})
