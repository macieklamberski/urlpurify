import { createParamExtractor } from '../utils.js'

// smry.ai paywall and summary proxy (smry.ai/proxy?url=<target>).
// Opt-in: the proxy serves a page the reader may not otherwise see.
export const unwrapSmry = createParamExtractor({
  hosts: ['smry.ai', 'www.smry.ai'],
  path: '/proxy',
  params: ['url'],
})
