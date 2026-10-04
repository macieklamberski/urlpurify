import { createParamExtractor } from '../utils.js'

// Embedly oEmbed widget proxy (cdn.embedly.com/widgets/media.html?src=<target>, also on embed.ly).
export const unwrapEmbedly = createParamExtractor({
  hosts: ['cdn.embedly.com', 'embed.ly'],
  path: '/widgets/media.html',
  params: ['src'],
})
