import { createParamExtractor } from '../utils.js'

// Bluesky outbound link redirect (go.bsky.app/redirect?u=<target>).
export const unwrapBlueskyRedirect = createParamExtractor({
  hosts: 'go.bsky.app',
  path: '/redirect',
  params: ['u'],
})
