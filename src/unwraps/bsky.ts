import { createQueryUnwrapper } from '../utils.js'

// Bluesky outbound link redirect (go.bsky.app/redirect?u=<target>).
export const unwrapBlueskyRedirect = createQueryUnwrapper({
  hosts: 'go.bsky.app',
  path: '/redirect',
  params: ['u'],
})
