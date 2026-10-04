import { createParamExtractor } from '../utils.js'

// Bluesky outbound link redirect (go.bsky.app/redirect?u=<target>), on bsky.app and its subdomains.
export const unwrapBlueskyRedirect = createParamExtractor({
  domains: 'bsky.app',
  path: '/redirect',
  params: ['u'],
})
