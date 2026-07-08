import { createParamExtractor } from '../utils.js'

// Threads outbound link shim (l.threads.com or l.threads.net with ?u=<target>).
export const unwrapThreadsShim = createParamExtractor({
  hosts: ['l.threads.com', 'l.threads.net'],
  params: ['u'],
})
