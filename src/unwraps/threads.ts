import { createParamExtractor } from '../utils.js'

// Threads outbound link shim (l.threads.com or l.threads.net with ?u=<target>). Both domains
// match with every subdomain.
export const unwrapThreadsShim = createParamExtractor({
  domains: ['threads.com', 'threads.net'],
  path: '/',
  params: ['u'],
})
