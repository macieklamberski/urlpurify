import { createParamExtractor } from '../utils.js'

// Embedly embed frame around the provider's iframe
// (cdn.embedly.com/widgets/media.html?src=<target>).
export const unwrapEmbedly = createParamExtractor({
  hosts: 'cdn.embedly.com',
  path: '/widgets/media.html',
  params: ['src'],
})
