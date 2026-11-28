import { createQueryUnwrapper } from '../utils.js'

// Threads outbound link shim (l.threads.com or l.threads.net with ?u=<target>).
export const unwrapThreads = createQueryUnwrapper({
  hosts: ['l.threads.com', 'l.threads.net'],
  path: '/',
  params: ['u'],
})

/** @deprecated Use `unwrapThreads` instead. */
export const unwrapThreadsShim = unwrapThreads
