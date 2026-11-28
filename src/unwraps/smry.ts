import { createQueryUnwrapper } from '../utils.js'

// smry.ai paywall and summary proxy (smry.ai/proxy?url=<target>).
// Opt-in: unwrapping returns the live page, not the copy. The proxy serves a page the reader may
// not otherwise see.
export const unwrapSmry = createQueryUnwrapper({
  hosts: ['smry.ai', 'www.smry.ai'],
  path: '/proxy',
  params: ['url'],
})
